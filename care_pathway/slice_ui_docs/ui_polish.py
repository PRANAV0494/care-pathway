"""S12 — Chat UI polish + Hinglish + final viva checklist.

Card: status colour (grounded/insufficient/out_of_scope), quoted STW/NLEM/
CDSCO line with page/box id, tool scores folded, watermark NOT A DIAGNOSIS
top+bottom. Hinglish questions vs English spans supported. Small human check
(~20 cards): non-prescriptive, readable Hindi/English — Likert secondary.
Viva: 2-minute pitch + likely-Q&A live in synopsis/Project_Explain_Hinglish.md.
"""
from __future__ import annotations

STATUSES = ("grounded", "insufficient", "out_of_scope")
WATERMARK = "NOT A DIAGNOSIS. Not a substitute for a registered medical practitioner."


def card_shape(status: str) -> dict:
    assert status in STATUSES
    return {"status": status, "watermark": WATERMARK, "human_check_n": 20}


def smoke() -> dict:
    return {"statuses": list(STATUSES), "pitch": "2-minute", "numbers": "not-claimed"}
