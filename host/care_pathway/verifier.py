"""Fail-closed code verifier. Not a neural net. Not mutated by GEPA."""

from __future__ import annotations

import json
import re
from typing import Any

from care_pathway import STATUSES, WATERMARK
from care_pathway.catalogue import known

CLINICAL_RE = re.compile(
    r"\b("
    r"diagnos(?:is|e|ed)|prescrib(?:e|ed)|you have|you need|"
    r"take\s+\d|mg\b|tablet|antibiotic|dose|cancer|tuberculosis|"
    r"start this|apply this"
    r")\b",
    re.I,
)


def _norm(text: str) -> str:
    return " ".join((text or "").lower().split())


def _span_text(spans: list[dict]) -> str:
    return _norm(" ".join(str(s.get("text") or "") for s in spans))


def extractive_ok(draft: str, evidence: str) -> bool:
    d = _norm(draft)
    if not d:
        return False
    return d in _norm(evidence)


def card(status: str, sentence: str, extra: dict | None = None) -> dict:
    if status not in STATUSES:
        raise ValueError(status)
    out = {
        "status": status,
        "sentence": sentence or "",
        "watermark": WATERMARK,
        "not_a_diagnosis": True,
    }
    if extra:
        out.update(extra)
    return out


def _finding_names(tool_json: Any) -> list[str]:
    if not isinstance(tool_json, dict):
        return []
    names = []
    for item in tool_json.get("findings") or []:
        n = (item.get("name") or "").strip()
        if n:
            names.append(n)
    cls = (tool_json.get("class") or "").strip()
    if cls:
        names.append(cls)
    return names


def verify(
    *,
    tool_name: str,
    tool_json: Any,
    draft: str = "",
    spans: list[dict] | None = None,
    file_type: str | None = None,
    extra_look_used: bool = False,
    tools_disagree: bool = False,
) -> dict:
    spans = spans or []
    draft = draft or ""

    if not known(tool_name):
        return card("insufficient", "", {"reason": "unknown_tool"})

    if tool_name == "out_of_scope":
        if draft.strip() and CLINICAL_RE.search(draft):
            return card("out_of_scope", "", {"reason": "clinical_text_on_oos"})
        return card("out_of_scope", "", {"reason": "out_of_scope"})

    if file_type and file_type != "cxr" and tool_name == "cxr_tool":
        return card("insufficient", "", {"reason": "non_cxr_to_cxr_tool"})

    if not tool_json:
        return card("insufficient", "", {"reason": "empty_tool_json"})

    if isinstance(tool_json, dict) and tool_json.get("unreadable") is True:
        return card("insufficient", "", {"reason": "unreadable_input"})

    if tools_disagree:
        reason = (
            "tool_disagreement" if extra_look_used else "tool_disagreement_need_extra_look"
        )
        return card("insufficient", "", {"reason": reason})

    span_blob = _span_text(spans)
    d = _norm(draft)
    for n in _finding_names(tool_json):
        nn = _norm(n)
        if nn and nn in d and nn not in span_blob:
            return card("insufficient", "", {"reason": "score_used_as_disease_name"})

    if not d:
        return card("insufficient", "", {"reason": "no_sentence"})

    if not span_blob:
        return card("insufficient", "", {"reason": "no_span"})

    if not extractive_ok(draft, span_blob):
        return card("insufficient", "", {"reason": "not_entailed_by_span"})

    return card("grounded", draft.strip(), {"reason": "extractive_span"})
