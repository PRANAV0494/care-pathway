from care_pathway import WATERMARK
from care_pathway.verifier import verify


SPAN = {
    "source": "nlem",
    "id": "nlem-2022-paracetamol",
    "text": "Paracetamol is listed in NLEM 2022.",
}


def test_unknown_tool():
    c = verify(tool_name="secret_doctor", tool_json={"x": 1}, draft="hi", spans=[SPAN])
    assert c["status"] == "insufficient"
    assert c["reason"] == "unknown_tool"
    assert c["watermark"] == WATERMARK


def test_oos_strips_clinical_text():
    c = verify(
        tool_name="out_of_scope",
        tool_json={"status": "out_of_scope"},
        draft="You have tuberculosis. Take 500 mg.",
    )
    assert c["status"] == "out_of_scope"
    assert c["sentence"] == ""
    assert c["reason"] == "clinical_text_on_oos"


def test_empty_json_insufficient():
    c = verify(tool_name="cxr_tool", tool_json={}, draft="Chest radiograph may show cardiomegaly.", spans=[SPAN])
    assert c["status"] == "insufficient"
    assert c["reason"] == "empty_tool_json"


def test_unreadable_cxr():
    c = verify(
        tool_name="cxr_tool",
        tool_json={"unreadable": True, "findings": []},
        draft="Chest radiograph may show cardiomegaly.",
        spans=[{"text": "Chest radiograph may show cardiomegaly."}],
    )
    assert c["reason"] == "unreadable_input"


def test_non_cxr_file_to_cxr_tool():
    c = verify(
        tool_name="cxr_tool",
        tool_json={"findings": [{"name": "Cardiomegaly", "score": 0.4}]},
        file_type="skin",
        draft="Chest radiograph may show cardiomegaly.",
        spans=[{"text": "Chest radiograph may show cardiomegaly."}],
    )
    assert c["reason"] == "non_cxr_to_cxr_tool"


def test_score_is_not_a_disease_name():
    c = verify(
        tool_name="cxr_tool",
        tool_json={"findings": [{"name": "Cardiomegaly", "score": 0.9}]},
        draft="Cardiomegaly.",
        spans=[{"text": "Chest radiograph may be useful."}],
    )
    assert c["reason"] == "score_used_as_disease_name"
    assert c["sentence"] == ""


def test_extractive_nlem_grounds():
    c = verify(
        tool_name="nlem_lookup",
        tool_json={"name": "paracetamol", "in_list": True, "nlem_year": 2022},
        draft="Paracetamol is listed in NLEM 2022.",
        spans=[SPAN],
    )
    assert c["status"] == "grounded"
    assert c["sentence"] == "Paracetamol is listed in NLEM 2022."
    assert c["not_a_diagnosis"] is True


def test_paraphrase_is_not_grounded():
    c = verify(
        tool_name="nlem_lookup",
        tool_json={"name": "paracetamol", "in_list": True},
        draft="You should take paracetamol freely.",
        spans=[SPAN],
    )
    assert c["status"] == "insufficient"


def test_disagreement_after_extra_look():
    c = verify(
        tool_name="nlem_lookup",
        tool_json={"in_list": True},
        draft="Paracetamol is listed in NLEM 2022.",
        spans=[SPAN],
        tools_disagree=True,
        extra_look_used=True,
    )
    assert c["reason"] == "tool_disagreement"
