from care_pathway.slice_ablations.matrix import matrix, smoke


def test_slice_ablations_smoke():
    assert smoke()["plot"] == "coverage-vs-ungrounded"


def test_four_axes_present():
    assert len(matrix()["axes"]) == 4
