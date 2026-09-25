"""T3 document_tool — frozen OCR/KIE JSON function (pack or lab PDF).

Methods: Donut / LayoutLMv3 / PaddleOCR.
Data gap (honest): no locked public Indian pack-OCR set — synthetic packs from
CDSCO rows + self-taken OTC photos; no patient prescriptions.
CPU baseline: text/bytes regex extraction; real KIE replaces internals only.
"""
from __future__ import annotations

import re

from ..schemas import DocumentToolOutput
from .base import ToolSpec, register

BATCH_RE = re.compile(r"\b[A-Z]{1,4}\d{3,10}\b")
BRAND_HINTS = ["crocin", "paracetamol", "azithral", "augmentin", "dolo", "combiflam", " Shelcal".strip().lower()]
ANALYTE_RE = re.compile(r"(haemoglobin|hemoglobin|wbc|rbc|platelet|creatinine|glucose|hba1c|tsh)", re.I)


def _to_text(payload: bytes | str | None) -> str:
    if payload is None:
        return ""
    if isinstance(payload, str):
        return payload
    # Try PDF text extract if pypdf present, else latin-1 decode fallback.
    if payload[:4] == b"%PDF":
        try:
            from pypdf import PdfReader
            import io as _io

            reader = PdfReader(_io.BytesIO(payload))
            return "\n".join((p.extract_text() or "") for p in reader.pages)[:8000]
        except Exception:  # noqa: BLE001 — fall through to decode
            pass
    try:
        return payload.decode("utf-8", errors="ignore")[:8000]
    except Exception:  # noqa: BLE001
        return ""


def document_tool_fn(payload: bytes | str | None = None, kind: str = "pack") -> DocumentToolOutput:
    text = _to_text(payload)
    if not text.strip():
        return DocumentToolOutput(match="unknown", unreadable=True, detail="empty/unreadable document")
    low = text.lower()
    brand = next((b for b in BRAND_HINTS if b in low), "")
    m_batch = BATCH_RE.search(text)
    batch = m_batch.group(0) if m_batch else ""
    m_an = ANALYTE_RE.search(text)
    analyte = m_an.group(1).lower() if m_an else ""
    value = ""
    if analyte:
        mv = re.search(re.escape(m_an.group(1)) + r"[^0-9]{0,12}([0-9]+\.?[0-9]*)", text, re.I)
        value = mv.group(1) if mv else ""
    if kind == "pack" and not (brand or batch):
        return DocumentToolOutput(brand=brand, batch=batch, match="unknown", unreadable=True, detail="pack fields not legible")
    if kind == "lab" and not analyte:
        return DocumentToolOutput(analyte=analyte, value=value, match="unknown", unreadable=True, detail="lab analyte not legible")
    return DocumentToolOutput(
        brand=brand, batch=batch, analyte=analyte, value=value,
        match="extracted", unreadable=False, detail=f"kind={kind} chars={len(text)}",
    )


register(
    ToolSpec(
        name="document_tool",
        kind="train-freeze",
        description="Pack/lab OCR fields JSON. KIE trained/frozen; never returns safety verdict.",
        fn=document_tool_fn,
    )
)
