"""Pareto plot helper: coverage vs ungrounded rate (hand vs GEPA)."""
from __future__ import annotations

import json
from pathlib import Path


def write_pareto(gepa_result: dict, out: Path) -> Path:
    out.parent.mkdir(parents=True, exist_ok=True)
    lines = ["coverage,ungrounded,name"]
    for c in gepa_result.get("candidates", []):
        lines.append(f"{c['coverage']},{c['ungrounded']},{c['name']}")
    out.write_text("\n".join(lines), encoding="utf-8")
    return out
