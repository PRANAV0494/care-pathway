"""Pydantic schemas — single source of truth for tools, cards, gold records."""
from __future__ import annotations

from pydantic import BaseModel, Field

from . import WATERMARK

CardStatus = str  # grounded | insufficient | out_of_scope (validated in pipeline)
RouteName = str  # cxr_tool | skin_tool | document_tool | out_of_scope


class STWSpan(BaseModel):
    page_id: str = ""
    box_id: str = ""
    text: str = ""


class STWRetrieveOutput(BaseModel):
    page_id: str = ""
    box_ids: list[str] = Field(default_factory=list)
    spans: list[STWSpan] = Field(default_factory=list)


class CXRToolOutput(BaseModel):
    findings: list[str] = Field(default_factory=list)
    scores: list[float] = Field(default_factory=list)
    dataset: str = "chexpert-small-baseline"
    unreadable: bool = False
    detail: str = ""


class SkinToolOutput(BaseModel):
    pred_class: str = ""
    score: float = 0.0
    dataset: str = "ham10000-baseline"
    unreadable: bool = False
    detail: str = ""


class DocumentToolOutput(BaseModel):
    brand: str = ""
    batch: str = ""
    analyte: str = ""
    value: str = ""
    match: str = "unknown"
    unreadable: bool = False
    detail: str = ""


class NLEMLookupOutput(BaseModel):
    query: str = ""
    in_list: bool = False
    generic: str = ""
    source: str = "NLEM-2022-seed"


class CDSLookupOutput(BaseModel):
    query: str = ""
    match: bool = False
    snapshot_month: str = ""
    note: str = "Not in list is not safe."
    source: str = "CDSCO-NSQ-seed"


class ToolCall(BaseModel):
    name: str = "out_of_scope"
    args: dict = Field(default_factory=dict)


class AnswerCard(BaseModel):
    status: str = "insufficient"
    reply: str = ""
    citations: list[STWSpan] = Field(default_factory=list)
    tool: str = "out_of_scope"
    tool_json: dict = Field(default_factory=dict)
    nlem: NLEMLookupOutput | None = None
    cdsco: CDSLookupOutput | None = None
    watermark: str = WATERMARK
    trace_hash: str = ""


class GoldRecord(BaseModel):
    qid: str
    question: str
    image: str = "none"
    gold_route: str = "out_of_scope"
    gold_status: str = "out_of_scope"
    gold_span_id: str | None = None
    gold_reply: str = ""
