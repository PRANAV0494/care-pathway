# Care Pathway host v0

Laptop-only scaffold. **Dummy tools.** Real fail-closed verifier and watermarked card.

The large language model is not loaded here. Vision nets are not loaded here. GEPA is not on this path.

## Run

```powershell
cd host
python -m pip install -r requirements.txt
python -m pytest
python -m uvicorn care_pathway.api:app --reload --port 8000
```

Open http://127.0.0.1:8000/ — demo card.

`POST /v1/consult` with a catalogue name. Unknown names return 400. `out_of_scope` never runs a specialist. A draft is `grounded` only if it is an extractive copy of a retrieved span.

Dummy `cdsco_lookup` miss is **not** rendered as safe.
