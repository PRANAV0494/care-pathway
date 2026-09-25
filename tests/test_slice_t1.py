from care_pathway.slice_t1_chexpert.chexpert_loader import COMPETITION_5, smoke


def test_slice_t1_smoke():
    assert len(COMPETITION_5) == 5
    res = smoke()
    assert res["metrics"] == "not-measured"
