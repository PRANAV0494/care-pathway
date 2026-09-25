from care_pathway.schemas import STWSpan
from care_pathway.verifier import verify


def test_oos_clinical_sentence_fails():
    s, r, _ = verify("out_of_scope", "Take 2 tablets daily", [], {}, "fever?")
    assert s == "out_of_scope" and r == ""


def test_unreadable_becomes_insufficient():
    s, _, _ = verify("cxr_tool", "something", [STWSpan(page_id="p", box_id="b", text="CXR triage")], {"unreadable": True})
    assert s == "insufficient"


def test_grounded_quote_passes():
    spans = [STWSpan(page_id="stw-pulmo-cough-01", box_id="stw-pulmo-cough-01#B1", text="Cough more than 2 weeks obtain chest X-ray")]
    s, r, _ = verify("cxr_tool", "Cited workflow box [stw-pulmo-cough-01/stw-pulmo-cough-01#B1]: Cough more than 2 weeks obtain chest X-ray",
                     spans, {"findings": ["Consolidation"], "scores": [0.9]})
    assert s == "grounded" and r != ""


def test_invented_drug_rejected():
    spans = [STWSpan(page_id="p", box_id="b", text="Verify brand batch against list")]
    s, _, _ = verify("document_tool", "Take miracle-cure 500mg now", spans, {"brand": "x", "match": "extracted"})
    assert s == "insufficient"
