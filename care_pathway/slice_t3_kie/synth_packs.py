"""S3 — T3 document KIE: synthetic packs + self-collected OTC photos.

Honest gap: no locked public Indian strip/carton set. Methods Donut /
LayoutLMv3 / PaddleOCR. Synthetic packs join real CDSCO batch strings;
no patient prescriptions. Metric: field-F1 / exact batch match (not-measured
until real layouts run). Never returns a safety verdict.
"""
from __future__ import annotations

import random
from pathlib import Path


def synth_pack(batch: str, brand: str, seed: int = 0) -> str:
    rng = random.Random(seed)
    return f"{brand.upper()} | Batch:{batch} | MFG:SeedPharma | ctrl:{rng.randint(1000,9999)}"


def write_synth_batch(n: int, out: Path) -> Path:
    out.parent.mkdir(parents=True, exist_ok=True)
    lines = [synth_pack(f"AB{i:04d}", "Crocin", seed=i) for i in range(n)]
    out.write_text("\n".join(lines), encoding="utf-8")
    return out


def smoke() -> dict:
    return {"synthetic": True, "metrics": "not-measured"}
