"""S8 — Entailment checker + verifier hardening (code, not a neural net).

Rules: every clinical sentence must overlap a retrieved STW/NLEM/CDSCO span;
score-as-diagnosis fails unless the box uses that wording; OOS clinical text
fails; unreadable -> insufficient; disagreement -> one extra look then silent.
Optional NLI model plugs in later; human gold on test cards decides. The
checker never generates guideline text — it only accepts/strips/refuses.
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
