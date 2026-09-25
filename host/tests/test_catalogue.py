from care_pathway import CATALOGUE
from care_pathway.catalogue import known, public_catalogue
from care_pathway.tools import run


def test_seven_names():
    assert CATALOGUE == (
        "cxr_tool",
        "skin_tool",
        "document_tool",
        "nlem_lookup",
        "cdsco_lookup",
        "stw_retrieve",
        "out_of_scope",
    )
    assert all(known(n) for n in CATALOGUE)
    assert not known("health_gpt")
    assert len(public_catalogue()) == 7


def test_dummy_nlem_and_nsq_miss_is_not_safe():
    hit = run("nlem_lookup", {"name": "Paracetamol"})
    assert hit["dummy"] is True
    assert hit["in_list"] is True
    miss = run("cdsco_lookup", {"product": "paracetamol", "batch": "X"})
    assert miss["match"] is False
    assert miss["safe_unknown"] is True
