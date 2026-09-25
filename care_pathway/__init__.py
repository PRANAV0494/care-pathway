"""Care Pathway — guideline-grounded health assistant (educational prototype).

Not a doctor, not a hospital HIS, not software as a medical device.
Every answer card is watermarked: not a diagnosis.
LLM is loaded, not trained. GEPA runs offline only.
"""

__version__ = "0.1.0"

WATERMARK = "NOT A DIAGNOSIS. Not a substitute for a registered medical practitioner."

TOOL_CATALOGUE = [
    "cxr_tool",
    "skin_tool",
    "document_tool",
    "nlem_lookup",
    "cdsco_lookup",
    "stw_retrieve",
    "out_of_scope",
]
