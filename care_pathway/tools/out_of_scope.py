"""out_of_scope — refuse function. Calls nothing, returns status."""
from .base import ToolSpec, register


def out_of_scope_fn(reason: str = "") -> dict:
    return {"status": "out_of_scope", "reason": reason or "outside Phase-1 catalogue"}


register(ToolSpec(name="out_of_scope", kind="refuse", description="Refuse outside-scope queries.", fn=out_of_scope_fn))
