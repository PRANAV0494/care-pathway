"""S2 — T2 HAM10000 training hooks (B200 later; CPU smoke now).

Data: HAM10000, 10,015 dermatoscopic images, 7 classes (Tschandl et al.,
Sci Data 2018, CC BY-NC). Split by lesion_id — same lesion never in train+test.
Europe/Australia tones, not Indian OPD (limitation). No metrics claimed here.
"""
from __future__ import annotations

from pathlib import Path

CLASSES_7 = ["nv", "mel", "bkl", "bcc", "akiec", "vasc", "df"]


def plan_lesion_split(root: Path, out: Path) -> dict:
    out.parent.mkdir(parents=True, exist_ok=True)
    present = root.exists()
    payload = {"by": "lesion_id", "data_present": present, "metrics": "not-measured"}
    out.write_text(str(payload), encoding="utf-8")
    return payload


def smoke() -> dict:
    return plan_lesion_split(Path("data-not-present"), Path("artifacts/slice_t2_split.txt"))
