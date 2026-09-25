from care_pathway.slice_t2_ham.ham10000_loader import CLASSES_7, smoke


def test_slice_t2_smoke():
    assert len(CLASSES_7) == 7
    assert smoke()["metrics"] == "not-measured"
