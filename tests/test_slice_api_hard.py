from care_pathway.slice_api_hard.hardening import check_upload, smoke


def test_slice_api_hard_smoke():
    assert smoke()["pii_store"] == "none"


def test_zero_byte_upload_rejected():
    assert not check_upload(0)
