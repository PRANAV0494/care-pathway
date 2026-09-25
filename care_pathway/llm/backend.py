"""Local LLM backend interface — loaded, not trained.

Default: deterministic rule router (no GPU) so CI + laptop demo work.
Optional: HuggingFace / vLLM backend if env provides weights (7B–32B class,
e.g. Qwen2.5). GEPA never trains weights — it only rewrites prompt text.
"""
from __future__ import annotations

import os
import re


class RuleBackend:
    """CPU baseline backend: rule router + span-constrained writer."""

    def route(self, question: str, image_kind: str, prompt: str) -> str:  # noqa: ARG002
        q = (question or "").lower()
        ik = (image_kind or "none").lower()
        # Explicit OOS first (fail-closed).
        oos_hints = ["brain mri", "mri", "ecg", "ultrasound", "surgery", "am i dying",
                     "best antibiotic", "antibiotic", "dose batao", "diagnose now",
                     "tumor", "gender batao", "pakka batao", "confirm karo"]
        # "pakka batao/confirm" alone is insufficient, not always OOS — handled by verifier;
        # but direct diagnosis demand with no in-scope grounding -> OOS.
        if any(h in q for h in ["brain", "mri", "ecg", "ultrasound", "surgery"]):
            return "out_of_scope"
        if "antibiotic" in q and ("no report" in q or "without" in q or "bina" in q or "koi report nahi" in q):
            return "out_of_scope"
        if ik in ("cxr",) or "x-ray" in q or "xray" in q or "cxr" in q or "khaansi" in q and "film" in q or "chest x" in q:
            # image kind wins when present
            if ik == "cxr":
                return "cxr_tool"
            if any(w in q for w in ["x-ray", "xray", "cxr", "chest", "khaansi", "cough", "tb", "cardiomegaly", "consolidation"]):
                return "cxr_tool"
        if ik == "skin" or any(w in q for w in ["mole", "skin", "daag", "twacha", "lesion", "ring", "khujli", "phenki", "rash"]):
            return "skin_tool"
        if ik in ("pack", "lab") or any(w in q for w in ["pack", "strip", "batch", "nlem", "cdsco", "nsq", "crocin", "dolo", "paracetamol", "ors", "lab", "haemoglobin", "hemoglobin", "medicine", "dawai"]):
            return "document_tool"
        # Fallback by image kind
        if ik == "cxr":
            return "cxr_tool"
        if ik == "skin":
            return "skin_tool"
        if ik in ("pack", "lab"):
            return "document_tool"
        return "out_of_scope"


def get_backend():
    """Return HF/vLLM backend if CARE_PATHWAY_LLM=hf and transformers present, else rules."""
    if os.getenv("CARE_PATHWAY_LLM", "rule").lower() in ("hf", "vllm"):
        try:
            from .hf_backend import HFBackend  # type: ignore

            return HFBackend()
        except Exception:
            pass
    return RuleBackend()
