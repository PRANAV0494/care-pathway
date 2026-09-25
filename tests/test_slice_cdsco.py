from care_pathway.slice_cdsco.cdsco_scrape import NsqRow, archive_month


def test_slice_cdsco_smoke(tmp_path):
    out = archive_month([NsqRow("Paracetamol 500mg", "AB1234", "2026-08")], tmp_path / "nsq.txt")
    assert "AB1234" in out.read_text()
