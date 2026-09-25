"""Tool registry — every specialist is a JSON function, not a chatting agent."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

REGISTRY: dict[str, "ToolSpec"] = {}


@dataclass(frozen=True)
class ToolSpec:
    name: str
    kind: str  # train-freeze | lookup | retrieve | refuse
    description: str
    fn: Callable


def register(spec: ToolSpec) -> ToolSpec:
    REGISTRY[spec.name] = spec
    return spec


def get_tool(name: str) -> ToolSpec:
    if name not in REGISTRY:
        raise KeyError(f"Unknown tool {name!r}. Catalogue: {sorted(REGISTRY)}")
    return REGISTRY[name]


def catalogue() -> list[dict]:
    return [
        {"name": s.name, "kind": s.kind, "description": s.description}
        for s in REGISTRY.values()
    ]
