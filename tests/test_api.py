from fastapi.testclient import TestClient

from care_pathway.api.main import app

c = TestClient(app)


def test_health_and_tools():
    assert c.get("/health").status_code == 200
    assert "cxr_tool" in c.get("/health").json()["tools"]
    assert "cxr_tool" in str(c.get("/tools").json())


def test_chat_oos_needs_token():
    r = c.post("/chat", data={"question": "hi", "image_hint": "none", "token": "wrong"})
    assert r.status_code == 401


def test_chat_oos_ok():
    r = c.post("/chat", data={"question": "Brain MRI tumor?", "image_hint": "none", "token": "demo-token"})
    assert r.status_code == 200
    j = r.json()
    assert j["status"] == "out_of_scope"
    assert j["watermark"].startswith("NOT A DIAGNOSIS")
