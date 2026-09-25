"""FastAPI gateway — auth (demo login), job queue (inline), hashed traces.

No patient identity store. Every card carries the NOT A DIAGNOSIS watermark.
"""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .. import TOOL_CATALOGUE, WATERMARK
from ..pipeline import answer_question
from ..tools import catalogue as tool_catalogue

app = FastAPI(title="Care Pathway (educational prototype — not a diagnosis)")

UI_DIR = Path(__file__).resolve().parents[1] / "ui"
DEMO_TOKEN = os.getenv("CARE_PATHWAY_TOKEN", "demo-token")


@app.get("/health")
def health():
    return {"ok": True, "watermark": WATERMARK, "tools": TOOL_CATALOGUE}


@app.get("/tools")
def tools():
    return {"catalogue": tool_catalogue()}


@app.post("/login")
def login(username: str = Form("demo")):
    # Demo login only — no passwords, no identity store.
    return {"token": DEMO_TOKEN, "user": username or "demo"}


def _check(token: str | None):
    if token != DEMO_TOKEN:
        raise HTTPException(status_code=401, detail="demo login required")


@app.post("/chat")
async def chat(question: str = Form(...), image_hint: str = Form("none"),
               text_payload: str | None = Form(None), token: str | None = Form(None),
               file: UploadFile | None = File(None)):
    _check(token)
    raw: bytes | None = None
    if file is not None:
        raw = await file.read()
        # 8 MB cap for demo uploads.
        if len(raw) > 8 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="file too large (8 MB cap)")
    card = answer_question(question, image_bytes=raw, image_hint=image_hint,
                           text_payload=text_payload or question)
    return JSONResponse(card.model_dump())


if UI_DIR.exists():
    app.mount("/ui", StaticFiles(directory=str(UI_DIR), html=True), name="ui")

    @app.get("/")
    def root():
        return FileResponse(str(UI_DIR / "index.html"))
