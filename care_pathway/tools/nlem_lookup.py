"""nlem_lookup — table lookup, not a CNN. NLEM 2022 (384 medicines, PDF, no live API)."""
from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path

from ..schemas import NLEMLookupOutput
from .base import ToolSpec, register

DATA = Path(__file__).resolve().parents[1] / "data" / "nlem_2022_seed.csv"


@lru_cache(maxsize=1)
def _rows() -> list[dict]:
    if not DATA.exists():
        return []
    with DATA.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def nlem_lookup_fn(query: str) -> NLEMLookupOutput:
    q = (query or "").strip().lower()
    generic = ""
    hit = False
    for r in _rows():
        names = {r.get("generic", "").lower(), r.get("example_brand", "").lower(), r.get("synonym", "").lower()}
        if q and q in names:
            hit, generic = True, r.get("generic", "")
            break
    # Brand→generic map is the honest extra: Crocin→Paracetamol etc.
    brand_map = {"crocin": "Paracetamol", "dolo": "Paracetamol", "combiflam": "Ibuprofen + Paracetamol"}
    if not generic and q in brand_map:
        generic = brand_map[q]
        hit = any(generic.lower() == r.get("generic", "").lower() for r in _rows())
    return NLEMLookupOutput(query=query or "", in_list=hit, generic=generic, source="NLEM-2022-seed")


register(ToolSpec(name="nlem_lookup", kind="lookup", description="NLEM 2022 in-list check.", fn=nlem_lookup_fn))
