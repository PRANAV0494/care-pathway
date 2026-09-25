from care_pathway.slice_safety.entailment import entailed


def test_slice_safety_smoke():
    assert entailed("verify brand batch against list", ["verify brand batch against list row"])
    assert not entailed("you have cancer", ["verify brand batch"])


def test_threshold_boundary_and_empty():
    # 1/4 content words overlap -> 0.25 -> entailed; 0 overlap -> not.
    assert entailed("alpha beta gamma refer", ["refer to higher centre"])
    assert not entailed("alpha beta gamma delta", ["refer to higher centre"])
    assert not entailed("", ["refer"])
    assert not entailed("tb or not", ["refer"])  # short words dropped -> fail-closed
