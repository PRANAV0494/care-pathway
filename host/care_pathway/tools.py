"""Dummy host-side tools. Real nets are not loaded in v0."""

from __future__ import annotations

DUMMY = True
NLEM_2022_DUMMY = {"paracetamol", "amoxicillin", "metformin", "isoniazid"}


def run(name: str, arguments: dict | None) -> dict:
    arguments = arguments or {}
    if name == "cxr_tool":
        return {
            "dummy": DUMMY,
            "findings": [{"name": "Cardiomegaly", "score": 0.41}],
            "unreadable": False,
        }
    if name == "skin_tool":
        return {
            "dummy": DUMMY,
            "class": "nv",
            "score": 0.33,
            "dataset": "HAM10000",
        }
    if name == "document_tool":
        return {
            "dummy": DUMMY,
            "batch": "DUMMY001",
            "brand": None,
            "analyte": None,
            "unreadable": False,
        }
    if name == "nlem_lookup":
        raw = str(arguments.get("name") or "").strip().lower()
        return {
            "dummy": DUMMY,
            "name": raw,
            "in_list": raw in NLEM_2022_DUMMY,
            "nlem_year": 2022,
        }
    if name == "cdsco_lookup":
        return {
            "dummy": DUMMY,
            "product": arguments.get("product"),
            "batch": arguments.get("batch"),
            "match": False,
            "in_list": False,
            "safe_unknown": True,
            "note": "Absence from this dummy NSQ snapshot is not a safety certificate.",
        }
    if name == "stw_retrieve":
        return {
            "dummy": DUMMY,
            "page_id": "STW-PUL-HEART-FAILURE-01",
            "box_ids": ["box-3"],
            "span_text": "Chest radiograph may show cardiomegaly.",
        }
    if name == "out_of_scope":
        return {"dummy": DUMMY, "status": "out_of_scope"}
    raise KeyError(name)
