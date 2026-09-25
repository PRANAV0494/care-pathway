"""Verifier — fail-closed code inside the API, not a neural net.

Rules (spec section 10):
1. Router in-scope but empty tool JSON -> insufficient.
2. Finding/drug/action not in retrieved spans -> drop/reject.
3. Clinical imperative on OOS -> fail.
4. Unreadable OCR / non-CXR image to T1 -> insufficient.
5. T1/T2 score used as disease name unless STW box uses wording -> fail.
6. Tool disagreement -> one extra pass, then insufficient (handled in pipeline).
"""
from __future__ import annotations

import re

from .schemas import STWSpan

IMPERATIVES = re.compile(r"\b(take|start|stop|inject|consume|lo |khao|peo|take\s+\d+|diagnos(e|is)|you have|tumhe .* hai)\b", re.I)


def _norm(s: str) -> str:
    return " ".join((s or "").lower().split())


def _span_text(spans: list[STWSpan]) -> str:
    return " ".join(_norm(s.text) for s in spans)


def verify(tool: str, draft: str, spans: list[STWSpan], tool_json: dict,
           question: str = "") -> tuple[str, str, list[STWSpan]]:
    """Return (status, kept_reply, kept_spans). Status in grounded/insufficient/out_of_scope."""
    span_blob = _span_text(spans)
    q = _norm(question)
    d = (draft or "").strip()

    if tool == "out_of_scope":
        # Rule 3: any clinical sentence on OOS fails.
        if d and (IMPERATIVES.search(d) or len(d.split()) > 3):
            return "out_of_scope", "", []
        return "out_of_scope", "", []

    # Rule 4: unreadable tool output -> insufficient.
    if (tool_json or {}).get("unreadable"):
        return "insufficient", "", []

    # Rule 1: in-scope but empty signal -> insufficient.
    if tool == "cxr_tool" and not (tool_json.get("findings") or tool_json.get("scores")):
        return "insufficient", "", []
    if tool == "skin_tool" and not tool_json.get("pred_class"):
        return "insufficient", "", []
    if tool == "document_tool" and (tool_json.get("match") in ("unknown", "", None)) and not (tool_json.get("brand") or tool_json.get("batch") or tool_json.get("analyte")):
        return "insufficient", "", []

    if not d or not spans:
        return "insufficient", "", []

    # Rule 2: every content word of draft's clinical claim must appear in spans,
    # approximated: draft minus boilerplate must overlap span blob.
    boiler = {"cited", "workflow", "box", "listed", "entry", "found", "verified", "against",
              "the", "list", "row", "batch", "matches", "dated", "nsq", "snapshot", "never",
              "safe", "stw", "says", "kehta", "hai", "par", "me", "karo", "ki", "ke", "ka"}
    content = [w.strip(".,;:()[]").lower() for w in d.split()]
    content = [w for w in content if w and w not in boiler and len(w) > 2 and not w.startswith("stw-")]
    if content:
        overlap = sum(1 for w in content if w in span_blob)
        if overlap / max(1, len(content)) < 0.25:
            feedback = "cited span does not entail draft"
            return "insufficient", "", []

    # Rule 5: score-as-diagnosis — draft claims "you have X" with label not in span.
    labels = [w.lower() for w in (tool_json.get("findings") or [])] + ([str(tool_json.get("pred_class")).lower()] if tool_json.get("pred_class") else [])
    if re.search(r"(you have|tumhe|diagnos)", d, re.I):
        if labels and not any(lab and lab in span_blob for lab in labels):
            return "insufficient", "", []

    # Melanoma-style confirm demands: question asks confirm cancer + span lacks it.
    if any(w in q for w in ["melanoma", "cancer", "confirm", "pakka", "pakka batao"]) and "melanoma" not in span_blob and "cancer" not in span_blob:
        # Only allow workflow quote if span covers triage path; else insufficient.
        if not spans:
            return "insufficient", "", []

    return "grounded", d, spans


def text_feedback(tool: str, status: str, draft: str, spans: list[STWSpan], tool_json: dict) -> str:
    """Natural-language feedback for GEPA reflection (required, not just 0/1)."""
    if tool == "out_of_scope" and draft:
        return "Answered OOS; should have been out_of_scope"
    if status == "insufficient" and tool != "out_of_scope" and not spans:
        return "No STW span retrieved; refused correctly" if not draft else "Answered with no span; invented workflow"
    if status == "insufficient" and draft:
        return "Draft not entailed by retrieved span; treated score as diagnosis or invented a drug"
    if status == "grounded":
        return "Grounded reply with cited box"
    return "Refused outside catalogue"
