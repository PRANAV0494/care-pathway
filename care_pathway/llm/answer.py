"""Answer LLM role — one sentence entailed by spans + tool JSON, else empty."""
from __future__ import annotations

from ..schemas import STWSpan


def _norm(s: str) -> str:
    return " ".join((s or "").lower().split())


def draft_answer(question: str, tool: str, tool_json: dict, spans: list[STWSpan],
                 nlem: dict | None = None, cdsco: dict | None = None,
                 prompt_version: str = "v1") -> tuple[str, list[STWSpan]]:
    """Deterministic span-constrained writer (CPU baseline).

    Real local LLM (Qwen-class) replaces the wording engine only — contract
    stays: return (sentence, cited_spans) where sentence tokens overlap the
    cited span, else ("", []).
    """
    _ = (question, prompt_version)
    if tool == "out_of_scope" or not spans:
        return "", []
    # document_tool: prefer NLEM/CDSCO-grounded sentence when available.
    if tool == "document_tool":
        if nlem and nlem.get("in_list"):
            for s in spans:
                if "nlem" in _norm(s.text) or "list" in _norm(s.text) or "verify" in _norm(s.text):
                    q = (nlem.get("generic") or nlem.get("query") or "").strip()
                    sent = f"Listed entry found ({q}); verified against the list row cited [{s.page_id}/{s.box_id}]."
                    return sent, [s]
        if cdsco and cdsco.get("match"):
            for s in spans:
                if "nsq" in _norm(s.text) or "snapshot" in _norm(s.text) or "not in" in _norm(s.text):
                    sent = f"Batch matches the dated NSQ snapshot row cited [{s.page_id}/{s.box_id}]; not-in-list is never safe."
                    return sent, [s]
        # Fallback: quote first span's box (entailment = near-verbatim).
        s = spans[0]
        return f"Cited workflow box [{s.page_id}/{s.box_id}]: {s.text}", [s]
    # cxr/skin: only speak if tool produced a non-empty signal AND span exists.
    findings = (tool_json or {}).get("findings") or []
    pred = (tool_json or {}).get("pred_class") or ""
    if tool == "cxr_tool" and not findings and not (tool_json or {}).get("scores"):
        return "", []
    if tool == "skin_tool" and not pred:
        return "", []
    # Refuse melanoma-style confirm demands implicitly: writer never says "you have X".
    s = spans[0]
    # Guard: never emit disease name from score unless span wording contains it.
    span_norm = _norm(s.text)
    cand_words = [w for w in _norm(" ".join(findings) + " " + pred).split() if len(w) > 3]
    if cand_words and not any(w in span_norm for w in cand_words):
        # Still allowed to quote the WORKFLOW sentence (not the label).
        return f"Cited workflow box [{s.page_id}/{s.box_id}]: {s.text}", [s]
    return f"Cited workflow box [{s.page_id}/{s.box_id}]: {s.text}", [s]
