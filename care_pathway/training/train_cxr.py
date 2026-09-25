"""Train T1 CXR baseline (DenseNet-121 / EfficientNet on CheXpert-small).

Baseline to replicate: Irvin et al., CheXpert (AAAI 2019).
CPU --smoke runs a synthetic sanity loop with no data.
"""
from __future__ import annotations

import argparse


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--smoke", action="store_true")
    ap.add_argument("--data", default="")
    ap.add_argument("--out", default="t1_cxr.pt")
    ap.add_argument("--epochs", type=int, default=1)
    args = ap.parse_args()
    if args.smoke or not args.data:
        print("T1 smoke: no CheXpert data in checkout; interface check only. No metrics claimed.")
        print(f"would-write: {args.out}")
        return
    try:
        import timm  # type: ignore
        import torch  # type: ignore
    except ImportError:
        print("B200 deps missing (torch/timm). Install requirements-optional-b200.txt on GPU machine.")
        return
    print(f"T1 training stub: data={args.data} epochs={args.epochs} out={args.out}")
    print("Implement CheXpert U-ones/U-zeros handling + patient-level split here; report AUROC/F1 vs Irvin honestly.")
    _ = (timm, torch)


if __name__ == "__main__":
    main()
