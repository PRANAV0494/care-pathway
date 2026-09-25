"""FastAPI gateway. The host executes tools. The LLM does not."""

from __future__ import annotations

import hashlib
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from care_pathway import CATALOGUE, WATERMARK
from care_pathway.catalogue import known, public_catalogue
from care_pathway.tools import run as run_tool
from care_pathway.verifier import verify

STATIC = Path(__file__).resolve().parent.parent / "static"
# Demo-only in-process trace store: single-process list, no lock, no
# persistence. Production would use an external sink; the cap only bounds RAM.
TRACES: list[dict] = []
TRACE_CAP = 500

app = FastAPI(
    title="Care Pathway host v0",
    description="Dummy tools. Real fail-closed verifier. Not a diagnosis.",
    version="0.1.0",
)


class ToolCall(BaseModel):
    name: str
    arguments: dict = Field(default_factory=dict)


class Span(BaseModel):
    source: str = "stw"
    id: str = ""
    text: str = ""


class ConsultIn(BaseModel):
    question: str
    file_type: str | None = None
    tool_call: ToolCall
    draft: str = ""
    spans: list[Span] = Field(default_factory=list)
    extra_look_used: bool = False
    tools_disagree: bool = False


@app.get("/health")
def health():
    return {"ok": True, "watermark": WATERMARK, "catalogue": list(CATALOGUE)}


@app.get("/v1/catalogue")
def catalogue():
    return {"tools": public_catalogue()}


@app.get("/")
def card_page():
    page = STATIC / "card.html"
    if not page.exists():
        raise HTTPException(404, "card.html missing")
    return FileResponse(page)


@app.post("/v1/consult")
def consult(body: ConsultIn):
    name = body.tool_call.name
    if not known(name):
        raise HTTPException(400, f"unknown tool: {name}")

    tool_json = run_tool(name, body.tool_call.arguments)
    spans = [s.model_dump() for s in body.spans]
    card = verify(
        tool_name=name,
        tool_json=tool_json,
        draft=body.draft,
        spans=spans,
        file_type=body.file_type,
        extra_look_used=body.extra_look_used,
        tools_disagree=body.tools_disagree,
    )
    qid = hashlib.sha256(body.question.encode("utf-8")).hexdigest()[:16]
    TRACES.append(
        {
            "question_id": qid,
            "tool": name,
            "status": card["status"],
            "reason": card.get("reason"),
            "dummy": bool(tool_json.get("dummy")),
        }
    )
    # Bound in-memory demo store; hashed question ids only, no raw text/images.
    del TRACES[:-TRACE_CAP]
    return {
        "question_id": qid,
        "tool_json": tool_json,
        "card": card,
    }
