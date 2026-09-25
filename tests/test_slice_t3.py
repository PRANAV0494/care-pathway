from care_pathway.slice_t3_kie.synth_packs import smoke, synth_pack


def test_slice_t3_smoke():
    assert "AB" in synth_pack("AB0001", "Crocin")
    assert smoke()["metrics"] == "not-measured"


def test_synth_is_deterministic_per_seed():
    assert synth_pack("AB0001", "Crocin", seed=7) == synth_pack("AB0001", "Crocin", seed=7)
    assert synth_pack("AB0001", "Crocin", seed=7) != synth_pack("AB0002", "Crocin", seed=7)
