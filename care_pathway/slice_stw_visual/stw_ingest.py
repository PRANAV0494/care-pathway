"""S4 — Visual STW ingest: page raster + box/arrow annotation + ColPali-class index.

ICMR STWs are one-page flowcharts (157 pgs, 28 specialties); PDFs ship no
box IDs, so we annotate the 10–30 pages actually used (pulmo/cXR, derm/skin).
CPU hook: raster list + box schema validation + TF-IDF stand-in; ColPali/
ColQwen open checkpoint plugs in on GPU later (never trained from scratch
unless stated). Text is never generated as a source — only retrieved + cited.
"""
from __future__ import annotations

import json
from pathlib import Path

REQUIRED_KEYS = {"page_id", "boxes"}


def _box_ok(box: dict) -> bool:
    return isinstance(box, dict) and isinstance(box.get("box_id"), str) and isinstance(box.get("text"), str)


def validate_box_file(path: Path) -> dict:
    rows = [json.loads(l) for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]
    bad = [
        r.get("page_id", "?") for r in rows
        if not REQUIRED_KEYS.issubset(r) or not isinstance(r.get("boxes"), list)
        or not all(_box_ok(b) for b in r["boxes"])
    ]
    return {"pages": len(rows), "invalid": bad, "note": "box ids annotated by us"}


def smoke() -> dict:
    return {"raster": "stub", "index": "tfidf-stand-in", "colpali": "gpu-later"}
