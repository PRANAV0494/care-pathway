from care_pathway.slice_gold.gold_protocol import _stable_bucket, qid_split, validate_record


def test_slice_gold_smoke():
    assert validate_record({"qid": "q1", "question": "?", "gold_route": "out_of_scope", "gold_status": "out_of_scope"}) == []
    assert qid_split("q001") in ("train", "val", "test")


def test_split_is_deterministic_across_processes():
    # sha256 bucket must be stable (hash() would not be); spot-check known value.
    assert _stable_bucket("q001") == int(
        __import__("hashlib").sha256(b"q001").hexdigest(), 16
    ) % 10
    assert qid_split("q001") == qid_split("q001")


def test_optional_fields_validated_when_present():
    ok = {"qid": "q2", "question": "?", "gold_route": "cxr_tool",
          "gold_status": "grounded", "gold_span_id": "stw-x#B1", "gold_reply": "quote"}
    assert validate_record(ok) == []
    bad = dict(ok, gold_span_id=123)
    assert "bad-span-id" in validate_record(bad)
    # Sub-lookups are not router decisions.
    sub = dict(ok, gold_route="nlem_lookup")
    assert "bad-route" in validate_record(sub)
