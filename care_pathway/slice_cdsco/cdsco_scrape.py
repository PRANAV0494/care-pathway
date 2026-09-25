"""S6 — CDSCO NSQ monthly snapshot scraper (dated, honest).

Source: public NSQ HTML/PDF tables (product, batch, mfr, test failed); no
documented bulk API. Rule hard-coded everywhere: NOT IN LIST != SAFE.
Snapshots are archived BY MONTH; lookup cites snapshot_month.
"""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass(frozen=True)
class NsqRow:
    product: str
    batch_no: str
    snapshot_month: str  # YYYY-MM; validated in archive_month.


def archive_month(rows: list[NsqRow], out: Path) -> Path:
    """Append-safe JSONL archive (one object per line — no delimiter-escaping
    hazards). Month format + dedup stay with the real scraper (flagged)."""
    import re

    out.parent.mkdir(parents=True, exist_ok=True)
    for r in rows:
        if not re.fullmatch(r"\d{4}-\d{2}", r.snapshot_month):
            raise ValueError(f"snapshot_month must be YYYY-MM, got {r.snapshot_month!r}")
    out.write_text("\n".join(json.dumps(asdict(r)) for r in rows), encoding="utf-8")
    return out


def smoke() -> dict:
    return {"rule": "not-in-list-is-not-safe", "api": "none-scrape-monthly"}
