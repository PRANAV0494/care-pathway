"""Train T3 document KIE (Donut/LayoutLMv3/PaddleOCR on synthetic + self-collected packs)."""
from __future__ import annotations

import argparse


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--smoke", action="store_true")
    ap.add_argument("--data", default="")
    ap.add_argument("--out", default="t3_doc/")
    args = ap.parse_args()
    if args.smoke or not args.data:
        print("T3 smoke: no pack/lab set in checkout; interface check only. No metrics claimed.")
        return
    print(f"T3 training stub: data={args.data} out={args.out}; report field-F1 / exact batch match.")


if __name__ == "__main__":
    main()
