# Care Pathway — implementation (Phase-1 v1, CPU-runnable baseline)

Educational research prototype. **Not a doctor, not a hospital HIS, not software as a medical device.**
Watermark on every card: **NOT A DIAGNOSIS. Not a substitute for a registered medical practitioner.**
LLM is **loaded, not trained**. GEPA runs **offline only**. No accuracy numbers claimed until measured.

## Quickstart (CPU, no GPU/data needed)

```powershell
pip install -r requirements.txt
pytest -q
python -m care_pathway.training.train_cxr --smoke
python -m care_pathway.training.train_skin --smoke
python -m care_pathway.training.train_doc --smoke
$env:CARE_PATHWAY_TOKEN="demo-token"
uvicorn care_pathway.api.main:app --reload
# open http://127.0.0.1:8000/  (chat UI at /ui)
```

## Serve-time flow (GEPA not in this path)

`INPUT → RETRIEVE → ROUTER LLM → TOOL (host executes) → ANSWER LLM → VERIFIER → CARD (grounded|insufficient|out_of_scope)`

## Catalogue (locked Phase-1)

`cxr_tool` (train+freeze, CheXpert), `skin_tool` (HAM10000/ISIC), `document_tool` (OCR/KIE),
`nlem_lookup`, `cdsco_lookup`, `stw_retrieve`, `out_of_scope`. Extra tools join as JSON functions.

## Offline only

```powershell
python scripts/run_eval.py
python scripts/run_gepa.py --budget 4 --out artifacts/gepa
```

Eval prints coverage / ungrounded-rate / correct-refuse on `care_pathway/data/gold.jsonl`
(seed 36 items; expand to 400–800 with dual annotation before claiming anything).
Specialist AUROC/F1: `not-measured` until real CheXpert/HAM10000 splits run on B200.

## B200 (real training)

```powershell
pip install -r requirements-optional-b200.txt
python -m care_pathway.training.train_cxr --data <CheXpert-small> --out artifacts/t1_cxr.pt
```

See `care_pathway/data/README.md` for source URLs + gaps (box IDs annotated by us; T3 has no public Indian pack set).
