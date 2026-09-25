"""Run product eval on seed gold set (no fake metrics)."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from pathlib import Path
import json
from care_pathway.eval.metrics import evaluate_gold

if __name__ == "__main__":
    gold = Path("care_pathway/data/gold.jsonl")
    res = evaluate_gold(gold)
    print(json.dumps({k: v for k, v in res.items() if k != "rows"}, indent=2))
    print(f"rows={len(res['rows'])}")
