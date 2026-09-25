from care_pathway.slice_ablations.matrix import smoke


def test_slice_ablations_smoke():
    assert smoke()["plot"] == "coverage-vs-ungrounded"
