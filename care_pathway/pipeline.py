"""Serve-time pipeline: INPUT -> RETRIEVE -> ROUTER -> TOOL -> ANSWER -> VERIFIER -> CARD.

GEPA is NOT in this figure. Prompts were frozen after offline optimisation.
 ascii: INPUT -> RETRIEVE -> ROUTER LLM -> ANSWER LLM -> VERIFIER
"""
from __future__ import annotations

from . import store
from .llm import answer as answer_llm
from .llm import router as router_llm
from .schemas import AnswerCard, CDSLookupOutput, NLEMLookupOutput
from .tools import get_tool
from .verifier import verify


def _image_kind(image_bytes: bytes | None, image_hint: str = "none") -> str:
    if image_hint in ("cxr", "skin", "pack", "lab"):
        return image_hint
    return "none" if not image_bytes else "cxr"


def answer_question(question: str, image_bytes: bytes | None = None,
                    image_hint: str = "none", text_payload: str | None = None,
                    prompt_version: str = "v1") -> AnswerCard:
    kind = _image_kind(image_bytes, image_hint)
    # 1. Retrieve STW pages (+ gold near-miss handled by router prompt text).
    stw = get_tool("stw_retrieve").fn(question or "", top_k=2)
    spans = list(stw.spans)

    # 2. Router: tool or out_of_scope. OOS skips T1–T3.
    tool = router_llm.route(question or "", kind, prompt_version)

    tool_json: dict = {}
    nlem: NLEMLookupOutput | None = None
    cdsco: CDSLookupOutput | None = None

    if tool == "out_of_scope":
        status, reply, kept = verify(tool, "", [], {}, question or "")
        tr = store.new_trace(question or "", tool, status)
        return AnswerCard(status=status, reply=reply, citations=kept, tool=tool,
                          tool_json={"status": "out_of_scope"}, trace_hash=tr["trace_hash"])

    # 3. Host executes the named function (model never executes code).
    try:
        if tool == "cxr_tool":
            out = get_tool("cxr_tool").fn(image_bytes, dataset="chexpert-small-baseline")
            tool_json = out.model_dump()
        elif tool == "skin_tool":
            out = get_tool("skin_tool").fn(image_bytes, dataset="ham10000-baseline")
            tool_json = out.model_dump()
        elif tool == "document_tool":
            payload = text_payload if text_payload is not None else image_bytes
            doc_kind = "lab" if kind == "lab" else "pack"
            out = get_tool("document_tool").fn(payload, kind=doc_kind)
            tool_json = out.model_dump()
            # Lookups enrich document answers (tables, not CNNs).
            q = f"{out.brand} {out.batch} {out.analyte}".strip()
            try:
                nlem = get_tool("nlem_lookup").fn(out.brand or out.analyte or question or "")
            except Exception:  # noqa: BLE001
                nlem = None
            try:
                cdsco = get_tool("cdsco_lookup").fn(batch=out.batch or "", product=out.brand or "")
            except Exception:  # noqa: BLE001
                cdsco = None
            _ = q
        else:
            tool = "out_of_scope"
            status, reply, kept = verify(tool, "", [], {}, question or "")
            tr = store.new_trace(question or "", tool, status)
            return AnswerCard(status=status, reply=reply, citations=kept, tool=tool,
                              tool_json={"status": "out_of_scope"}, trace_hash=tr["trace_hash"])
    except Exception as e:  # noqa: BLE001 — tool crash becomes insufficient, never a diagnosis
        tool_json = {"error": type(e).__name__, "unreadable": True}

    # 4. Answer LLM drafts from spans + JSON only.
    draft, cited = answer_llm.draft_answer(
        question or "", tool, tool_json, spans,
        nlem.model_dump() if nlem else None, cdsco.model_dump() if cdsco else None,
        prompt_version,
    )

    # 5. Verifier accepts, strips, or refuses. Tool fight -> one retry then insufficient.
    status, reply, kept = verify(tool, draft, cited, tool_json, question or "")
    if status == "insufficient" and tool_json.get("unreadable") is False:
        # One extra look when unsure (spec 6): re-retrieve top-1 and re-draft once.
        stw2 = get_tool("stw_retrieve").fn((question or "") + " refer", top_k=1)
        if stw2.spans:
            draft2, cited2 = answer_llm.draft_answer(
                question or "", tool, tool_json, list(stw2.spans),
                nlem.model_dump() if nlem else None, cdsco.model_dump() if cdsco else None,
                prompt_version,
            )
            s2, r2, k2 = verify(tool, draft2, cited2, tool_json, question or "")
            if s2 == "grounded":
                status, reply, kept = s2, r2, k2

    tr = store.new_trace(question or "", tool, status)
    return AnswerCard(status=status, reply=reply, citations=kept, tool=tool,
                      tool_json=tool_json, nlem=nlem, cdsco=cdsco, trace_hash=tr["trace_hash"])
