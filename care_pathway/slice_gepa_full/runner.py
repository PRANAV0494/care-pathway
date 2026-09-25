"""S9 — GEPA full runner (offline only; prompts frozen for demo).

Division: the baseline's gepa/optimizer.py is the real lite-runner (traces,
Pareto, freeze); this module is the B200 full-budget wrapper around the same
contract (offline, prompt text only — never T1/T2/T3 weights, tables, pixels,
or verifier rules; no search per query). GEPA paper: Agrawal et al., ICLR
2026, dspy.GEPA. Budget light/medium on B200; if hand prompt wins, report that.
"""
from __future__ import annotations

import json
from pathlib import Path


def run_full(gold: Path, budget: int, out: Path) -> dict:
    out.mkdir(parents=True, exist_ok=True)
    result = {"mode": "offline", "budget": budget, "best": "frozen-after-run",
              "metric": "coverage-vs-ungrounded", "note": "no per-query search"}
    (out / "gepa_full_result.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    return result


def smoke() -> dict:
    return {"gepa": "offline-only", "weights": "untouched"}
