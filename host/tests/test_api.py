from fastapi.testclient import TestClient

from care_pathway.api import app

client = TestClient(app)


def test_health_and_catalogue():
    h = client.get("/health")
    assert h.status_code == 200
    assert "NOT A DIAGNOSIS" in h.json()["watermark"]
    c = client.get("/v1/catalogue")
    names = [t["name"] for t in c.json()["tools"]]
    assert "out_of_scope" in names
    assert len(names) == 7


def test_consult_unknown_tool_400():
    r = client.post(
        "/v1/consult",
        json={
            "question": "hi",
            "tool_call": {"name": "invented_tool", "arguments": {}},
        },
    )
    assert r.status_code == 400


def test_consult_grounded_nlem_dummy():
    r = client.post(
        "/v1/consult",
        json={
            "question": "Is paracetamol on NLEM 2022?",
            "tool_call": {"name": "nlem_lookup", "arguments": {"name": "paracetamol"}},
            "draft": "Paracetamol is listed in NLEM 2022.",
            "spans": [
                {
                    "source": "nlem",
                    "id": "nlem-2022-paracetamol",
                    "text": "Paracetamol is listed in NLEM 2022.",
                }
            ],
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["tool_json"]["dummy"] is True
    assert body["card"]["status"] == "grounded"
    assert body["card"]["not_a_diagnosis"] is True
    assert len(body["question_id"]) == 16
