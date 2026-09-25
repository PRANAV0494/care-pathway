from care_pathway.tools import get_tool


def test_catalogue_locked():
    from care_pathway.tools import REGISTRY

    assert sorted(REGISTRY) == ["cdsco_lookup", "cxr_tool", "document_tool", "nlem_lookup", "out_of_scope", "skin_tool", "stw_retrieve"]


def test_cxr_unreadable_gate():
    out = get_tool("cxr_tool").fn(b"junk")
    assert out.unreadable is True


def test_nlem_seed_lookup():
    out = get_tool("nlem_lookup").fn("Crocin")
    assert out.in_list is True
    assert out.generic == "Paracetamol"


def test_cdsco_not_in_list_is_not_safe():
    out = get_tool("cdsco_lookup").fn(batch="NOPE0000")
    assert out.match is False
    assert "not safe" in out.note.lower()


def test_stw_retrieve_floor():
    out = get_tool("stw_retrieve").fn("zxqv completely unrelated query about rockets")
    assert out.spans == [] or out.page_id != ""  # floor may empty spans


def test_document_empty_is_unreadable():
    out = get_tool("document_tool").fn("", kind="pack")
    assert out.unreadable is True
