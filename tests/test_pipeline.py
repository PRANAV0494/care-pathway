"""Fail-closed pipeline tests — no invented metrics, only behaviour contracts."""
import io

from PIL import Image

from care_pathway import WATERMARK
from care_pathway.pipeline import answer_question


def _png():
    img = Image.new("RGB", (64, 64), color=(10, 200, 30))
    b = io.BytesIO()
    img.save(b, format="PNG")
    return b.getvalue()


def test_oos_skips_tools():
    card = answer_question("Brain MRI me tumor hai kya?", image_hint="none", text_payload="brain mri")
    assert card.status == "out_of_scope"
    assert card.reply == ""
    assert card.watermark == WATERMARK


def test_antibiotic_demand_refused():
    card = answer_question("Uncle ko bukhar hai, best antibiotic batao, koi report nahi.", image_hint="none")
    assert card.status == "out_of_scope"


def test_cxr_grounded_with_png():
    card = answer_question("Mujhe 3 hafte se khaansi hai, chest X-ray karaya hai?", image_bytes=_png(), image_hint="cxr")
    assert card.status in ("grounded", "insufficient")
    if card.status == "grounded":
        assert "[" in card.reply and "/" in card.reply
    assert card.watermark.startswith("NOT A DIAGNOSIS")


def test_unreadable_cxr_is_insufficient():
    card = answer_question("X-ray report do", image_bytes=b"not-an-image", image_hint="cxr")
    assert card.status == "insufficient"


def test_document_nlem_grounded():
    card = answer_question("Paracetamol NLEM me hai kya?", image_hint="none", text_payload="Paracetamol NLEM me hai")
    assert card.status in ("grounded", "insufficient", "out_of_scope")
