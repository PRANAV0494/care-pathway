"""cdsco_lookup — dated NSQ snapshot lookup. Not-in-list is NEVER safe."""
from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path

from ..schemas import CDSLookupOutput
from .base import ToolSpec, register

DATA = Path(__file__).resolve().parents[1] / "data" / "cdsco_nsq_seed.csv"


@lru_cache(maxsize=1)
def _rows() -> list[dict]:
    if not DATA.exists():
        return []
    with DATA.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def cdsco_lookup_fn(batch: str = "", product: str = "") -> CDSLookupOutput:
    b, p = (batch or "").strip().upper(), (product or "").strip().lower()
    month = ""
    hit = False
    for r in _rows():
        if b and b == r.get("batch_no", "").upper():
            hit, month = True, r.get("snapshot_month", "")
            break
        if p and p and p in r.get("product", "").lower():
            hit, month = True, r.get("snapshot_month", "")
            break
    if not _rows():
        month = ""
    return CDSLookupOutput(
        query=batch or product, match=hit, snapshot_month=month or "seed",
        note="Not in list is not safe.", source="CDSCO-NSQ-seed",
    )


register(ToolSpec(name="cdsco_lookup", kind="lookup", description="CDSCO NSQ batch match on dated snapshot.", fn=cdsco_lookup_fn))
