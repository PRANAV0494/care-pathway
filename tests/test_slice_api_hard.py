from care_pathway.slice_api_hard.hardening import smoke


def test_slice_api_hard_smoke():
    assert smoke()["pii_store"] == "none"
