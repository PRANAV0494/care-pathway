"""Hashed traces — no patient identity store (DPDP Act 2023)."""
from __future__ import annotations

import hashlib
import json
import time


def hash_trace(payload: dict) -> str:
    blob = json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(blob).hexdigest()[:16]


def new_trace(question: str, tool: str, status: str) -> dict:
    qh = hashlib.sha256((question or "").encode("utf-8")).hexdigest()[:12]
    return {"ts": int(time.time()), "q_hash": qh, "tool": tool, "status": status,
            "trace_hash": hash_trace({"q": qh, "tool": tool, "status": status, "ts": int(time.time())})}
