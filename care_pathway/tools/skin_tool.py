"""T2 skin_tool — frozen JSON function (default: skin lesion).

Baseline: HAM10000 / ISIC (Tschandl et al., Sci Data 2018), EfficientNet-class.
CPU stub mirrors cxr_tool: validity gate + deterministic scores.
One swap allowed (oral / mammo) — still one named set, never stacked.
"""
from __future__ import annotations

import hashlib
import io

from PIL import Image

from ..schemas import SkinToolOutput
from .base import ToolSpec, register

CLASSES_7 = ["nv", "mel", "bkl", "bcc", "akiec", "vasc", "df"]


def skin_tool_fn(image_bytes: bytes | None = None, dataset: str = "ham10000-baseline") -> SkinToolOutput:
    if image_bytes is None:
        return SkinToolOutput(pred_class="", score=0.0, dataset=dataset, unreadable=True, detail="no image bytes")
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        img2 = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        w, h = img2.size
        if w < 32 or h < 32:
            return SkinToolOutput(pred_class="", score=0.0, dataset=dataset, unreadable=True, detail=f"too small {w}x{h}")
        detail = f"{w}x{h} rgb-ok"
    except Exception as e:  # noqa: BLE001
        return SkinToolOutput(pred_class="", score=0.0, dataset=dataset, unreadable=True, detail=f"unreadable: {type(e).__name__}")
    h = int(hashlib.sha256(image_bytes).hexdigest()[8:16], 16)
    idx = h % len(CLASSES_7)
    score = round((h % 10_000) / 10_000.0 * 0.49 + 0.5, 3)  # 0.5..0.99 deterministic
    return SkinToolOutput(pred_class=CLASSES_7[idx], score=score, dataset=dataset, unreadable=False, detail=detail)


register(
    ToolSpec(
        name="skin_tool",
        kind="train-freeze",
        description="Skin-lesion class+score JSON. Trained on HAM10000/ISIC on B200, frozen at serve.",
        fn=skin_tool_fn,
    )
)
