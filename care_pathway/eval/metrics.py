"""Product metrics: coverage, ungrounded rate, correct refuse + Pareto table.

Specialist replication metrics (AUROC/F1) are computed ONLY when labels +
scores exist; otherwise reported as not-measured (no fake numbers).
"""
from __future__ import annotations

import json
from pathlib import Path

from .. import pipeline as pipe
from ..schemas import GoldRecord


def load_gold(path: Path) -> list[GoldRecord]:
    return [GoldRecord(**json.loads(l)) for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]


def _img(hint: str):
    if hint in ("cxr", "skin"):
        from PIL import Image
        import io as _io

        img = Image.new("RGB", (64, 64), color=(130, 130, 130))
        b = _io.BytesIO()
        img.save(b, format="PNG")
        return b.getvalue()
    return None


def evaluate_gold(gold_path: Path) -> dict:
    recs = load_gold(gold_path)
    n_in = got = claims = ungrounded = ref_tot = ref_ok = 0
    rows = []
    for r in recs:
        card = pipe.answer_question(r.question, image_bytes=_img(r.image), image_hint=r.image, text_payload=r.question)
        if r.gold_status == "grounded":
            n_in += 1
            if card.status == "grounded":
                got += 1
        if card.status == "grounded":
            claims += 1
            if "[" not in card.reply:
                ungrounded += 1
        if r.gold_status in ("insufficient", "out_of_scope"):
            ref_tot += 1
            if card.status in ("insufficient", "out_of_scope"):
                ref_ok += 1
        rows.append({"qid": r.qid, "gold": r.gold_status, "got": card.status, "tool": card.tool})
    return {
        "n": len(recs),
        "coverage": round(got / n_in, 4) if n_in else 0.0,
        "ungrounded_rate": round(ungrounded / claims, 4) if claims else 0.0,
        "correct_refuse": round(ref_ok / ref_tot, 4) if ref_tot else 0.0,
        "specialist_metrics": "not-measured on seed (no CheXpert/HAM10000 labels in this checkout)",
        "rows": rows,
    }
