import json

import pytest

from care_pathway.slice_cdsco.cdsco_scrape import NsqRow, archive_month


def test_slice_cdsco_smoke(tmp_path):
    out = archive_month([NsqRow("Paracetamol 500mg", "AB1234", "2026-08")], tmp_path / "nsq.jsonl")
    rows = [json.loads(l) for l in out.read_text().splitlines()]
    assert rows[0]["batch_no"] == "AB1234"


def test_pipe_in_product_survives_roundtrip(tmp_path):
    out = archive_month([NsqRow("A|B Syrup", "XY1", "2026-08")], tmp_path / "nsq.jsonl")
    assert json.loads(out.read_text().splitlines()[0])["product"] == "A|B Syrup"


def test_bad_month_rejected(tmp_path):
    with pytest.raises(ValueError):
        archive_month([NsqRow("P", "B", "Aug-2026")], tmp_path / "nsq.jsonl")
