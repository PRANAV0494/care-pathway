from care_pathway.slice_stw_visual.stw_ingest import smoke


def test_slice_stw_smoke():
    assert smoke()["colpali"] == "gpu-later"
