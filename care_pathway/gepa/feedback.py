"""GEPA feedback strings — verifier text, not just 0/1 (required)."""
from __future__ import annotations


def feedback_for(tool: str, status: str, draft: str, n_spans: int) -> str:
    if tool == "out_of_scope" and draft:
        return "Answered OOS; should have been out_of_scope"
    if tool == "cxr_tool" and status != "grounded" and n_spans == 0:
        return "No STW span retrieved for CXR; refused"
    if tool == "skin_tool" and status == "grounded" and "melanoma" in draft.lower():
        return "Treated skin score as a diagnosis; melanoma needs specialist path"
    if status == "grounded":
        return "Grounded reply with cited box"
    if not draft:
        return "Correct refuse with silence"
    return "Draft not entailed; invented a drug or answered OOS"
