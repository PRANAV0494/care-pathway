"""Locks conformance — skips when care_pathway is absent (e.g. plain main).

After the baseline lands, asserts:
- Phase-1 catalogue is exactly the 7 locked tools.
- Watermark literal is intact (not a diagnosis).
- No slice ships a four-class civic-dispatch tool.
"""
import pytest

care_pathway = pytest.importorskip("care_pathway", reason="baseline not merged yet")

LOCKED_CATALOGUE = {"cxr_tool", "skin_tool", "document_tool", "nlem_lookup",
                    "cdsco_lookup", "stw_retrieve", "out_of_scope"}


def test_catalogue_is_exactly_locked():
    assert set(care_pathway.TOOL_CATALOGUE) == LOCKED_CATALOGUE


def test_watermark_intact():
    assert care_pathway.WATERMARK.startswith("NOT A DIAGNOSIS")


def test_no_civic_dispatch_tool():
    assert "call_112" not in care_pathway.TOOL_CATALOGUE
    assert "close_now" not in care_pathway.TOOL_CATALOGUE
