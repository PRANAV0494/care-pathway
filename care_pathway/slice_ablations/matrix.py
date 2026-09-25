"""S10 — Ablation matrix (same test questions, honest table).

Axes: hand prompt vs GEPA vs MIPROv2 (if time); k=0 vs similar-answered vs
near-miss-refuse quota (must); text-chunk STW vs page-image STW; verifier
on/off. Plot coverage vs ungrounded-rate Pareto. If GEPA loses, report that —
no forced positive. No numbers claimed until measured.
"""
from __future__ import annotations

AXES = ["prompt:hand-vs-gepa", "icl:k0-vs-answered-vs-refuse-quota",
        "stw:text-chunk-vs-page-image", "verifier:on-vs-off"]


def matrix() -> dict:
    return {"axes": AXES, "plot": "coverage-vs-ungrounded", "numbers": "not-measured"}


def smoke() -> dict:
    assert len(matrix()["axes"]) == 4
    return matrix()
