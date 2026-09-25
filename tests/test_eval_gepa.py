from pathlib import Path

from care_pathway.eval.metrics import evaluate_gold
from care_pathway.gepa.optimizer import run

GOLD = Path(__file__).resolve().parents[1] / "care_pathway" / "data" / "gold.jsonl"


def test_eval_runs_no_fake_numbers():
    res = evaluate_gold(GOLD)
    assert 0.0 <= res["coverage"] <= 1.0
    assert 0.0 <= res["ungrounded_rate"] <= 1.0
    assert 0.0 <= res["correct_refuse"] <= 1.0
    assert "not-measured" in res["specialist_metrics"]


def test_gepa_offline_pareto():
    res = run(GOLD, budget=2)
    assert "best" in res and "pareto" in res and res["train_n"] > 0
