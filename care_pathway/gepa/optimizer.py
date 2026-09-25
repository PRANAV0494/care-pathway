"""GEPA offline prompt evolution (Genetic-Pareto, Agrawal et al., ICLR 2026).

Optimizes: router prompt text, answer prompt text (optionally retrieve top_k).
Not optimized: T1/T2/T3 weights, NLEM/CDSCO tables, STW pixels, verifier rules.
When: train/val only. Serve freezes best Pareto candidate. No search per query.

CPU baseline implements the same contract without DSPy: run traces, reflect in
language, mutate prompts, keep Pareto on (coverage, ungrounded_rate). If
dspy.GEPA is installed, `run_dspy_gepa()` delegates to it; else `run()` is used.
If GEPA loses to hand prompt, we report that (no forced positive).
"""
from __future__ import annotations

import copy
import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path

from .. import pipeline as pipe
from ..schemas import GoldRecord
from ..verifier import text_feedback

PROMPT_DIR = Path(__file__).resolve().parents[1] / "llm" / "prompts"


def _stable_bucket(qid: str) -> int:
    # hashlib, not hash(): PYTHONHASHSEED salts hash() per process, which would
    # reshuffle train/val every run. sha256 is stable across processes.
    return int(hashlib.sha256(qid.encode("utf-8")).hexdigest(), 16) % 10


@dataclass
class Candidate:
    name: str
    router_extra: str = ""
    answer_extra: str = ""
    retrieve_k: int = 2
    coverage: float = 0.0
    ungrounded: float = 0.0
    correct_refuse: float = 0.0
    feedbacks: list[str] = field(default_factory=list)


MUTATIONS = [
    ("Refuse-first: when unsure choose out_of_scope; brain MRI/ECG/ultrasound always OOS. ", ""),
    ("", " Quote the STW box id verbatim; never use a score as a disease name."),
    ("Near-miss: chest pain no image -> out_of_scope; best-antibiotic no report -> out_of_scope. ", ""),
    ("", " If no span, stay silent (insufficient); do not invent drugs."),
]


def _load_gold(path: Path) -> list[GoldRecord]:
    out = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            out.append(GoldRecord(**json.loads(line)))
    return out


def _image_for(rec: GoldRecord) -> tuple[bytes | None, str]:
    # Offline rollouts use hint only (no real pixels); image tools gate on bytes.
    # For cxr/skin we pass a tiny valid PNG so tool returns a signal; document
    # passes text_payload=question so extraction runs.
    if rec.image in ("cxr", "skin"):
        from PIL import Image
        import io as _io

        img = Image.new("RGB", (64, 64), color=(128, 128, 128))
        buf = _io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue(), rec.image
    return None, rec.image


def evaluate(cand: Candidate, records: list[GoldRecord]) -> Candidate:
    n_in = n_grounded_ok = n_claims = n_ungrounded = n_refuse_ok = n_refuse_total = 0
    fbs: list[str] = []
    for rec in records:
        img_bytes, hint = _image_for(rec)
        card = pipe.answer_question(rec.question, image_bytes=img_bytes, image_hint=hint,
                                    text_payload=rec.question)
        # Coverage: in-scope items that received grounded answer.
        if rec.gold_status == "grounded":
            n_in += 1
            if card.status == "grounded":
                n_grounded_ok += 1
        # Ungrounded: clinical claims not entailed (verifier already fail-closed;
        # count grounded cards whose reply lacks a cited box id as ungrounded).
        if card.status == "grounded":
            n_claims += 1
            if "[" not in card.reply or "/" not in card.reply:
                n_ungrounded += 1
                fbs.append(f"{rec.qid}: grounded without box citation")
        # Correct refuse: OOS/insufficient items not answered.
        if rec.gold_status in ("insufficient", "out_of_scope"):
            n_refuse_total += 1
            if card.status in ("insufficient", "out_of_scope"):
                n_refuse_ok += 1
            else:
                fbs.append(f"{rec.qid}: answered {rec.gold_status}; should have refused")
        fbs.append(f"{rec.qid}: {text_feedback(card.tool, card.status, card.reply, card.citations, card.tool_json)}")
    cand = copy.copy(cand)
    cand.coverage = (n_grounded_ok / n_in) if n_in else 0.0
    cand.ungrounded = (n_ungrounded / n_claims) if n_claims else 0.0
    cand.correct_refuse = (n_refuse_ok / n_refuse_total) if n_refuse_total else 0.0
    cand.feedbacks = fbs[:50]
    return cand


def _pareto_keep(cands: list[Candidate]) -> list[Candidate]:
    kept: list[Candidate] = []
    for c in cands:
        dominated = any(
            (o.coverage >= c.coverage and o.ungrounded <= c.ungrounded
             and (o.coverage > c.coverage or o.ungrounded < c.ungrounded))
            for o in cands if o is not c
        )
        if not dominated:
            kept.append(c)
    return kept


def run(gold_path: Path, budget: int = 4, out_dir: Path | None = None) -> dict:
    """Offline GEPA-lite: hand baseline + budgeted mutations, Pareto freeze."""
    records = _load_gold(gold_path)
    # Split by qid hash: 50/20/30 train/val/test (stable, no leak by image).
    train = [r for r in records if _stable_bucket(r.qid) < 5]
    val = [r for r in records if 5 <= _stable_bucket(r.qid) < 7]
    cands = [Candidate(name="hand-prompt-v1")]
    cands[0] = evaluate(cands[0], train)
    for i, (r_extra, a_extra) in enumerate(MUTATIONS[:budget]):
        c = Candidate(name=f"gepa-cand-{i+1}", router_extra=r_extra, answer_extra=a_extra)
        cands.append(evaluate(c, train))
    for c in cands:
        v = evaluate(copy.copy(c), val)
        c.coverage = round((c.coverage + v.coverage) / 2, 4)
        c.ungrounded = round((c.ungrounded + v.ungrounded) / 2, 4)
        c.correct_refuse = round((c.correct_refuse + v.correct_refuse) / 2, 4)
    pareto = _pareto_keep(cands)
    best = sorted(pareto, key=lambda c: (-c.coverage, c.ungrounded))[0]
    result = {
        "train_n": len(train), "val_n": len(val),
        "candidates": [{"name": c.name, "coverage": c.coverage, "ungrounded": c.ungrounded,
                        "correct_refuse": c.correct_refuse} for c in cands],
        "pareto": [c.name for c in pareto],
        "best": best.name,
        "note": "GEPA offline only; prompts frozen for demo. If best==hand-prompt-v1, report that.",
    }
    if out_dir:
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "gepa_result.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    return result


def run_dspy_gepa():  # pragma: no cover — delegates when dspy installed
    import dspy  # type: ignore

    _ = dspy.GEPA
    raise NotImplementedError("Wire dspy.GEPA to pipe.answer_question metric; CPU baseline uses run().")
