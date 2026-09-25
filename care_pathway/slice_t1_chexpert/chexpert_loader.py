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
    counted: bool = False  # False until a real CheXpert CSV walk fills counts.


def plan_split(root: Path, out: Path) -> ChexpertSplit:
    """Write a patient-level split plan (no image may leak across splits).

    Stub: counts stay 0 with counted=False until the B200 run walks real
    CheXpert-small CSVs. data_present records whether root existed at all.
    """
    out.parent.mkdir(parents=True, exist_ok=True)
    counts = ChexpertSplit(counted=False)
    out.write_text(
        f"train_patients={counts.train_patients}\nval_patients={counts.val_patients}\n"
        f"test_patients={counts.test_patients}\nu_policy={counts.u_policy}\n"
        f"counted={counts.counted}\ndata_present={root.exists()}\n",
        encoding="utf-8",
    )
    return counts


def smoke() -> dict:
    # No file side effect; plan_split (with tmp_path in tests) covers I/O.
    return {"smoke": True, "u_policy": ChexpertSplit().u_policy, "metrics": "not-measured"}
