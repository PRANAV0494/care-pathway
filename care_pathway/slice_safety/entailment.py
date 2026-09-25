"""S8 — Word-overlap pre-gate for the verifier (code, not a neural net).

Scope: this module implements ONLY the overlap check (sentence content words
vs span blob, >= 0.25). OOS-strip, unreadable, disagreement-retry, and
score-as-diagnosis live in the PR2/PR3 verifiers, not here. Heuristic limits:
drops words <= 3 chars, ignores negation, common words can false-entail — so
this is NOT the final safety gate. Optional NLI + human gold on test cards
decide; the checker never generates guideline text.
"""
from __future__ import annotations


def _norm(s: str) -> str:
    return " ".join((s or "").lower().split())


def entailed(sentence: str, spans: list[str]) -> bool:
    blob = _norm(" ".join(spans))
    content = [w for w in _norm(sentence).split() if len(w) > 3]
    if not content:
        return False
    return sum(1 for w in content if w in blob) / len(content) >= 0.25


def smoke() -> dict:
    assert entailed("refer to higher centre", ["refer to higher centre urgently"])
    assert not entailed("take miracle cure now", ["refer to higher centre"])
    return {"checker": "rules-only", "nli": "optional-later"}
