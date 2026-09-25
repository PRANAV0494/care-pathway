"""stw_retrieve — STW page retrieval.

Thesis slice: retrieve PAGE IMAGES of ICMR flowcharts (ColPali/ColQwen class),
not only text chunks. CPU baseline: TF-IDF over seed page texts with identical
output contract {page_id, box_ids, spans}. Swapping in a ColPali checkpoint
later changes internals only — box/arrow IDs are annotated by us on the subset
we use (pulmonology/CXR, dermatology/skin), since PDFs ship no box IDs.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from ..schemas import STWRetrieveOutput, STWSpan
from .base import ToolSpec, register

DATA = Path(__file__).resolve().parents[1] / "data" / "stw_pages.jsonl"


@lru_cache(maxsize=1)
def _pages() -> list[dict]:
    if not DATA.exists():
        return []
    out = []
    for line in DATA.read_text(encoding="utf-8").splitlines():
        if line.strip():
            out.append(json.loads(line))
    return out


@lru_cache(maxsize=1)
def _index():
    pages = _pages()
    texts = [p.get("text", "") for p in pages]
    vec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    mat = vec.fit_transform(texts) if texts else None
    return vec, mat


def stw_retrieve_fn(query: str, top_k: int = 2) -> STWRetrieveOutput:
    pages = _pages()
    if not pages:
        return STWRetrieveOutput()
    vec, mat = _index()
    sims = cosine_similarity(vec.transform([query or ""]), mat)[0]
    order = sims.argsort()[::-1][: max(1, top_k)]
    # Fail-closed: similarity floor — weak hit returns empty (forces insufficient).
    if float(sims[order[0]]) < 0.08:
        return STWRetrieveOutput()
    spans: list[STWSpan] = []
    box_ids: list[str] = []
    for i in order:
        if float(sims[i]) < 0.08:
            continue
        p = pages[int(i)]
        for b in p.get("boxes", []):
            spans.append(STWSpan(page_id=p["page_id"], box_id=b["box_id"], text=b["text"]))
            box_ids.append(b["box_id"])
    return STWRetrieveOutput(page_id=pages[int(order[0])]["page_id"], box_ids=box_ids, spans=spans)


register(ToolSpec(name="stw_retrieve", kind="retrieve", description="ICMR STW page/box retrieval.", fn=stw_retrieve_fn))
