import json

from care_pathway.slice_gepa_full.runner import run_full, smoke


def test_slice_gepa_full_smoke():
    assert smoke() == {"gepa": "offline-only", "weights": "untouched"}


def test_result_file_is_valid_json(tmp_path):
    out = tmp_path / "gepa"
    run_full(tmp_path / "gold.jsonl", budget=1, out=out)
    assert json.loads((out / "gepa_full_result.json").read_text(encoding="utf-8"))["mode"] == "offline"
