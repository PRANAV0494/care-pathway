"""Run GEPA-lite offline (train/val split by qid, Pareto freeze)."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import argparse
import json
from pathlib import Path
from care_pathway.gepa.optimizer import run
from care_pathway.eval.pareto import write_pareto

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--budget", type=int, default=4)
    ap.add_argument("--out", default="artifacts/gepa")
    args = ap.parse_args()
    res = run(Path("care_pathway/data/gold.jsonl"), budget=args.budget, out_dir=Path(args.out))
    write_pareto(res, Path(args.out) / "pareto.csv")
    print(json.dumps(res, indent=2))
