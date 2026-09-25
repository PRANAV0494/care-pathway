"""Frozen prompts — GEPA may rewrite this TEXT offline, never weights.

Two roles, same local weights, two frozen prompts (router + answer).
Default text below is the hand-prompt baseline; GEPA winner replaces files
prompts/router_v*.txt and prompts/answer_v*.txt and is frozen for demo.
"""
from __future__ import annotations

from pathlib import Path

PROMPT_DIR = Path(__file__).resolve().parent / "prompts"

ROUTER_BASE = """You are the Care Pathway router (educational prototype, not a doctor).
Pick exactly one tool from: cxr_tool, skin_tool, document_tool, out_of_scope.
Rules:
- chest X-ray / CXR / khaansi+film -> cxr_tool
- skin/mole/daag/photo of lesion -> skin_tool
- pack/strip/batch/lab/pdf/NLEM/CDSCO/medicine list -> document_tool
- brain MRI, ECG, ultrasound, surgery plan, direct diagnosis demand without in-scope image, antibiotic dose demand -> out_of_scope
- If unsure, choose out_of_scope. Never invent a tool.
Output JSON only: {"tool": "<name>"}.
Near-miss refusals you must respect:
- brain MRI -> out_of_scope (no MRI tool)
- chest pain no image "am I dying" -> out_of_scope
- "best antibiotic, no report" -> out_of_scope
"""

ANSWER_BASE = """You are the Care Pathway answer writer (not a doctor).
You may write ONE short sentence ONLY if it is entailed by a retrieved STW box / NLEM / CDSCO row.
Otherwise output empty (system maps to insufficient/out_of_scope).
Rules:
- Quote or closely paraphrase the span; name page_id/box_id.
- Never use a tool score as a disease name unless the STW box uses that wording.
- Never prescribe dose; never say "you have X".
- If out_of_scope, output empty.
- Watermark is added by code, not by you.
"""

EXAMPLES_ROUTER = [
    ("X-ray + cough -> cxr_tool", "cxr_tool"),
    ("mole photo -> skin_tool", "skin_tool"),
    ("pack + NLEM? -> document_tool", "document_tool"),
    ("chest pain, no image, am I dying -> out_of_scope", "out_of_scope"),
    ("brain MRI -> out_of_scope", "out_of_scope"),
]


def load_prompt(name: str, version: str = "v1") -> str:
    p = PROMPT_DIR / f"{name}_{version}.txt"
    if p.exists():
        return p.read_text(encoding="utf-8")
    return ROUTER_BASE if name == "router" else ANSWER_BASE
