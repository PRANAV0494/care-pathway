"""S11 — API hardening: demo auth, 8 MB cap, hashed traces, DPDP notes.

No patient identity store (DPDP Act 2023). Demo login only; traces carry
question-hash + tool + status (never raw text/images). Rate-limit hook for
later; watermark NOT A DIAGNOSIS on every card. Ethics: no real hospital
charts without approval; NC-licensed data respected.
"""
from __future__ import annotations

MAX_BYTES = 8 * 1024 * 1024


def check_upload(n_bytes: int) -> bool:
    return 0 < n_bytes <= MAX_BYTES


def smoke() -> dict:
    assert check_upload(100)
    assert not check_upload(MAX_BYTES + 1)
    return {"auth": "demo-token", "pii_store": "none", "watermark": "NOT A DIAGNOSIS"}
