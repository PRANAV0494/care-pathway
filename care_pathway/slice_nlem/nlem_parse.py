"""S5 — NLEM 2022 full-table parse (384 medicines) + brand-generic map.

Source: NLEM 2022 PDF (launched 13 Sep 2022); PDF, no live API. Brands like
Crocin are NOT in NLEM — brand-generic is extra work (here: small honest map).
Output: dated CSV table; lookup answers in-list/not-in-list only.
"""
from __future__ import annotations

from pathlib import Path

BRAND_GENERIC = {"crocin": "Paracetamol", "dolo": "Paracetamol", "combiflam": "Ibuprofen + Paracetamol"}


def normalize(name: str) -> str:
    return " ".join((name or "").strip().lower().split())


def resolve_brand(query: str) -> str:
    return BRAND_GENERIC.get(normalize(query), "")


def smoke() -> dict:
    return {"source": "NLEM-2022-PDF", "count_claimed": "not-parsed-here", "map_size": len(BRAND_GENERIC)}
