"""S7 — Gold Q&A expansion protocol (seed -> 400-800, honestly).

Schema: required qid, question, gold_route, gold_status; optional gold_span_id,
gold_reply (validated when present). Rules: split BY QID (50/20/30, sha256
stable); same image must never leak train/test — enforce with an image-aware
check before 400-800 labeling (hash alone cannot guarantee it); dual
annotation + disagreement protocol BEFORE numbers; near-miss refusals are
first-class (not only answered twins); Hinglish subset included.
This slice ships the protocol + validator + generator stub (no fake labels).
"""
from __future__ import annotations

import hashlib

REQUIRED = {"qid", "question", "gold_route", "gold_status"}

# Router-level routes only. nlem_lookup / cdsco_lookup / stw_retrieve are
# sub-lookups executed by the host inside a document_tool turn — they are never
# a router decision, so they are not valid gold_route values.
ROUTER_ROUTES = ("cxr_tool", "skin_tool", "document_tool", "out_of_scope")
STATUSES = ("grounded", "insufficient", "out_of_scope")


def validate_record(rec: dict) -> list[str]:
    errs = [f"missing:{k}" for k in REQUIRED if k not in rec]
    if rec.get("gold_route") not in ROUTER_ROUTES:
        errs.append("bad-route")
    if rec.get("gold_status") not in STATUSES:
        errs.append("bad-status")
    # Optional fields, validated only when present.
    if "gold_span_id" in rec and rec["gold_span_id"] is not None and not isinstance(rec["gold_span_id"], str):
        errs.append("bad-span-id")
    if "gold_reply" in rec and not isinstance(rec["gold_reply"], str):
        errs.append("bad-reply")
    return errs


def _stable_bucket(qid: str) -> int:
    # hashlib, not hash(): PYTHONHASHSEED salts hash() per process, which would
    # reshuffle train/val/test every run. sha256 is stable across processes.
    return int(hashlib.sha256(qid.encode("utf-8")).hexdigest(), 16) % 10


def qid_split(qid: str) -> str:
    m = _stable_bucket(qid)
    return "train" if m < 5 else ("val" if m < 7 else "test")


def smoke() -> dict:
    return {"target": "400-800 dual-annotated", "have": "protocol-only", "metrics": "not-measured"}
