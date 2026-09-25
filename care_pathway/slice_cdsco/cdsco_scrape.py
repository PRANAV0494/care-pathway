"""S6 — CDSCO NSQ monthly snapshot scraper (dated, honest).

Source: public NSQ HTML/PDF tables (product, batch, mfr, test failed); no
documented bulk API. Rule hard-coded everywhere: NOT IN LIST != SAFE.
Snapshots are archived BY MONTH; lookup cites snapshot_month.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class NsqRow:
    product: str
    batch_no: str
    snapshot_month: str


def archive_month(rows: list[NsqRow], out: Path) -> Path:
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(f"{r.product}|{r.batch_no}|{r.snapshot_month}" for r in rows), encoding="utf-8")
    return out


def smoke() -> dict:
    return {"rule": "not-in-list-is-not-safe", "api": "none-scrape-monthly"}
