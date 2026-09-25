import json

from care_pathway.slice_stw_visual.stw_ingest import smoke, validate_box_file


def test_slice_stw_smoke():
    assert smoke()["colpali"] == "gpu-later"


def test_validate_box_file(tmp_path):
    good = {"page_id": "p1", "boxes": [{"box_id": "p1#B1", "text": "refer"}]}
    bad = {"page_id": "p2", "boxes": [{"box_id": "p2#B1"}]}
    f = tmp_path / "boxes.jsonl"
    f.write_text(json.dumps(good) + "\n" + json.dumps(bad) + "\n", encoding="utf-8")
    res = validate_box_file(f)
    assert res["pages"] == 2
    assert res["invalid"] == ["p2"]
    empty = tmp_path / "empty.jsonl"
    empty.write_text("", encoding="utf-8")
    assert validate_box_file(empty) == {"pages": 0, "invalid": [], "note": "box ids annotated by us"}
