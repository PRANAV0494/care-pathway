from care_pathway.slice_safety.entailment import entailed


def test_slice_safety_smoke():
    assert entailed("verify brand batch against list", ["verify brand batch against list row"])
    assert not entailed("you have cancer", ["verify brand batch"])
