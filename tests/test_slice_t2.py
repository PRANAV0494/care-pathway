import json
from pathlib import Path

from care_pathway.slice_t2_ham.ham10000_loader import CLASSES_7, plan_lesion_split, smoke


def test_slice_t2_smoke():
    assert len(CLASSES_7) == 7
    assert smoke()["metrics"] == "not-measured"


def test_split_file_is_valid_json(tmp_path):
    out = tmp_path / "split.json"
    plan_lesion_split(Path("data-not-present"), out)
    assert json.loads(out.read_text(encoding="utf-8"))["by"] == "lesion_id"
