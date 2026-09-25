from care_pathway.slice_nlem.nlem_parse import resolve_brand


def test_slice_nlem_smoke():
    assert resolve_brand("Crocin") == "Paracetamol"
    assert resolve_brand("UnknownXYZ123") == ""
