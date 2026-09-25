"""S1 — T1 CheXpert training hooks (B200 later; CPU smoke now).

Baseline to replicate: Irvin et al., CheXpert (AAAI 2019), DenseNet-121,
224,316 CXRs / 65,240 patients / 14 obs with uncertain labels; competition-5
subset. No metrics claimed here — honest split scores only when real data runs.
Interface feeds frozen cxr_tool weights; serve contract unchanged.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

COMPETITION_5 = ["Atelectasis", "Cardiomegaly", "Consolidation", "Edema", "Pleural Effusion"]


@dataclass(frozen=True)
class ChexpertSplit:
    train_patients: int = 0
    val_patients: int = 0
    test_patients: int = 0
    u_policy: str = "U-zeros-reported"


def plan_split(root: Path, out: Path) -> ChexpertSplit:
    """Write a patient-level split plan (no image may leak across splits).

    Stub: inspects root if present, else writes a smoke plan with zeros.
    Real run on B200 fills counts from CheXpert-small CSVs.
    """
    out.parent.mkdir(parents=True, exist_ok=True)
    if root.exists():
        counts = ChexpertSplit(train_patients=-1, val_patients=-1, test_patients=-1)
    else:
        counts = ChexpertSplit()
    out.write_text(
        f"train_patients={counts.train_patients}\nval_patients={counts.val_patients}\n"
        f"test_patients={counts.test_patients}\nu_policy={counts.u_policy}\n",
        encoding="utf-8",
    )
    return counts


def smoke() -> dict:
    plan = plan_split(Path("data-not-present"), Path("artifacts/slice_t1_split.txt"))
    return {"smoke": True, "u_policy": plan.u_policy, "metrics": "not-measured"}
