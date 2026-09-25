import pytest

from care_pathway.slice_ui_docs.ui_polish import card_shape


def test_slice_ui_docs_smoke():
    assert card_shape("grounded")["watermark"].startswith("NOT A DIAGNOSIS")


def test_unknown_status_raises_value_error():
    with pytest.raises(ValueError):
        card_shape("diagnosed")
