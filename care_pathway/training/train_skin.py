"""Train T2 skin baseline (EfficientNet-class on HAM10000/ISIC, lesion-id split)."""
from __future__ import annotations

import argparse


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--smoke", action="store_true")
    ap.add_argument("--data", default="")
    ap.add_argument("--out", default="t2_skin.pt")
    args = ap.parse_args()
    if args.smoke or not args.data:
        print("T2 smoke: no HAM10000 data in checkout; interface check only. No metrics claimed.")
        return
    print(f"T2 training stub: data={args.data} out={args.out}; split by lesion_id; report accuracy/macro-F1 honestly.")


if __name__ == "__main__":
    main()
