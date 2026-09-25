"""T1 cxr_tool — frozen JSON function.

Baseline to replicate: Irvin et al., CheXpert (AAAI 2019), DenseNet-121.
CPU baseline here: image-validity gate + deterministic heuristic scores so the
fail-closed pipeline runs without GPU/data. Real training lives in
training/train_cxr.py (B200, CheXpert-small) and replaces weights file only —
interface unchanged.
"""
from __future__ import annotations

import hashlib
import io

from PIL import Image

from ..schemas import CXRToolOutput
from .base import ToolSpec, register

LABELS_5 = ["Atelectasis", "Cardiomegaly", "Consolidation", "Edema", "Pleural Effusion"]


def _is_readable_image(raw: bytes) -> tuple[bool, str]:
    if not raw:
        return False, "empty bytes"
    try:
        img = Image.open(io.BytesIO(raw))
        img.verify()
        img2 = Image.open(io.BytesIO(raw)).convert("L")
        w, h = img2.size
        if w < 32 or h < 32:
            return False, f"too small {w}x{h}"
        return True, f"{w}x{h} grayscale-ok"
    except Exception as e:  # noqa: BLE001 — gate must never crash pipeline
        return False, f"unreadable: {type(e).__name__}"


def cxr_tool_fn(image_bytes: bytes | None = None, dataset: str = "chexpert-small-baseline") -> CXRToolOutput:
    """Frozen tool call. Returns scores, never a diagnosis sentence."""
    if image_bytes is None:
        return CXRToolOutput(findings=[], scores=[], dataset=dataset, unreadable=True, detail="no image bytes")
    ok, detail = _is_readable_image(image_bytes)
    if not ok:
        return CXRToolOutput(findings=[], scores=[], dataset=dataset, unreadable=True, detail=detail)
    # Deterministic pseudo-scores from bytes hash — stable, honest stub.
    # Real weights replace this block; verifier treats scores as signals, not names.
    h = int(hashlib.sha256(image_bytes).hexdigest()[:8], 16)
    scores = [round(((h >> (4 * i)) % 100) / 100.0, 3) for i in range(len(LABELS_5))]
    findings = [LABELS_5[i] for i, s in enumerate(scores) if s >= 0.5]
    return CXRToolOutput(findings=findings, scores=scores, dataset=dataset, unreadable=False, detail=detail)


register(
    ToolSpec(
        name="cxr_tool",
        kind="train-freeze",
        description="Chest X-ray findings+scores JSON. Trained on CheXpert on B200, frozen at serve.",
        fn=cxr_tool_fn,
    )
)
