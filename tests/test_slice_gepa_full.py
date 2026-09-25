from care_pathway.slice_gepa_full.runner import smoke


def test_slice_gepa_full_smoke():
    assert smoke() == {"gepa": "offline-only", "weights": "untouched"}
