"""Closed Phase-1 tool catalogue. The model may emit only these names."""

from care_pathway import CATALOGUE

SCHEMAS = {
    "cxr_tool": {
        "description": "Frozen CheXpert CNN. Dummy JSON in v0.",
        "arguments": {
            "type": "object",
            "properties": {"file_id": {"type": "string"}},
        },
        "returns": ["findings[]", "scores[]", "unreadable"],
    },
    "skin_tool": {
        "description": "Frozen HAM10000/ISIC net. Dummy JSON in v0.",
        "arguments": {
            "type": "object",
            "properties": {"file_id": {"type": "string"}},
        },
        "returns": ["class", "score", "dataset"],
    },
    "document_tool": {
        "description": "OCR/KIE on pack or lab PDF. Dummy JSON in v0.",
        "arguments": {
            "type": "object",
            "properties": {"file_id": {"type": "string"}},
        },
        "returns": ["batch", "brand", "analyte", "unreadable"],
    },
    "nlem_lookup": {
        "description": "NLEM 2022 table lookup. Small dummy table in v0.",
        "arguments": {
            "type": "object",
            "properties": {"name": {"type": "string"}},
            "required": ["name"],
        },
        "returns": ["in_list", "nlem_year"],
    },
    "cdsco_lookup": {
        "description": "Dated NSQ snapshot. Miss is not a safety certificate.",
        "arguments": {
            "type": "object",
            "properties": {
                "product": {"type": "string"},
                "batch": {"type": "string"},
            },
        },
        "returns": ["match", "in_list", "safe_unknown"],
    },
    "stw_retrieve": {
        "description": "ColPali-class STW page retrieve. Dummy page in v0.",
        "arguments": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
        },
        "returns": ["page_id", "box_ids", "span_text"],
    },
    "out_of_scope": {
        "description": "Refuse. No specialist is run. No clinical sentence.",
        "arguments": {"type": "object", "properties": {}},
        "returns": ["status"],
    },
}


def known(name: str) -> bool:
    return name in CATALOGUE


def public_catalogue() -> list[dict]:
    return [{"name": n, **SCHEMAS[n]} for n in CATALOGUE]
