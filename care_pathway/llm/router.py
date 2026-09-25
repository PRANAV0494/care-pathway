"""Router LLM role — structured tool call only. Host executes the function."""
from __future__ import annotations

from . import prompts
from .backend import get_backend

VALID = {"cxr_tool", "skin_tool", "document_tool", "out_of_scope"}


def route(question: str, image_kind: str = "none", prompt_version: str = "v1") -> str:
    prompt = prompts.load_prompt("router", prompt_version)
    tool = get_backend().route(question, image_kind, prompt)
    return tool if tool in VALID else "out_of_scope"
