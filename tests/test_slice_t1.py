from pathlib import Path

from care_pathway.slice_t1_chexpert.chexpert_loader import COMPETITION_5, plan_split, smoke


def test_slice_t1_smoke():
    assert len(COMPETITION_5) == 5
    res = smoke()
    assert res["metrics"] == "not-measured"


def test_plan_split_uses_tmp_path(tmp_path):
    # No repo-relative artifact side effect; uncounted until real CSV walk.
    plan = plan_split(Path("data-not-present"), tmp_path / "split.txt")
    assert plan.counted is False
    assert "counted=False" in (tmp_path / "split.txt").read_text(encoding="utf-8")
