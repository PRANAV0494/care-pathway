from care_pathway.slice_gold.gold_protocol import qid_split, validate_record


def test_slice_gold_smoke():
    assert validate_record({"qid": "q1", "question": "?", "gold_route": "out_of_scope", "gold_status": "out_of_scope"}) == []
    assert qid_split("q001") in ("train", "val", "test")
