"""S7 — Gold Q&A expansion protocol (seed -> 400-800, honestly).

Schema per item: qid, question, image?, gold_route, gold_status, gold_span_id,
gold_reply. Rules: split BY QID (50/20/30); same image never leaks train/test;
dual annotation + disagreement protocol BEFORE numbers; near-miss refusals are
first-class (not only answered twins); Hinglish subset included.
This slice ships the protocol + validator + generator stub (no fake labels).
"""
from __future__ import annotations

REQUIRED = {"qid", "question", "gold_route", "gold_status"}


def validate_record(rec: dict) -> list[str]:
    errs = [f"missing:{k}" for k in REQUIRED if k not in rec]
    if rec.get("gold_route") not in ("cxr_tool", "skin_tool", "document_tool", "out_of_scope"):
        errs.append("bad-route")
    if rec.get("gold_status") not in ("grounded", "insufficient", "out_of_scope"):
        errs.append("bad-status")
    return errs


def qid_split(qid: str) -> str:
    m = hash(qid) % 10
    return "train" if m < 5 else ("val" if m < 7 else "test")


def smoke() -> dict:
    return {"target": "400-800 dual-annotated", "have": "protocol-only", "metrics": "not-measured"}
