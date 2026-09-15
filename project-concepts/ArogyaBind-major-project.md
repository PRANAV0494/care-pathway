# Care Pathway

**Guideline-grounded health assistant with specialist tools and fail-closed answering.**  
Specialist **tools** (chest X-ray, one cancer image, medicine/lab document) return JSON scores/fields. A **local LLM** may only write a sentence that an official Indian workflow entails — or it stays silent. **GEPA** evolves the LLM prompts offline.

**Type:** AI/ML major project (software). Chat UI.  
**India problem:** People already ask AI for health advice. Generic bots invent drugs and skip Indian guidelines. ICMR Standard Treatment Workflows exist; they are **one-page flowcharts**. The gap is **grounding, refusal, and prompt evolution**, not another chatbot and not “we detected cancer.”  
**Guide:** Narayan Sir’s ideas only where they help (similar examples, short reasoning, extra look when unsure). GEPA for **prompts**, not diagnosis. Snell MATH **out**.  
**GPU:** Campus **B200** (or equivalent) to **train/freeze** the vision specialists and to run GEPA rollouts. B200 is capacity, not the contribution.

---

## 0. How to read this note (for Sir)

This note is the full project definition.

- The **product** is a fail-closed **answer card**, not a doctor.
- Specialist nets are **tools**, not small doctor-agents.
- Imaging papers (CheXpert, ISIC) are **baselines we replicate**, like EfficientNetB0 in a fundus synopsis.
- The **enhancement** is numbered in Section 3 (visual STW + GEPA coverage-vs-ungrounded + near-miss refusals).
- No live clinic, no hospital HIS as the thesis, no four-class civic dispatch.

If time is short: Sections 1–7, 11, 14, 16.

---

## 1. One-line concept

User sends a question and optionally an image (X-ray, skin lesion, pack, lab PDF). A local LLM **routes** to the matching frozen specialist **tool**. That tool returns JSON (score or fields). The LLM may reply **only** with a sentence entailed by a retrieved ICMR STW / NLEM / CDSCO span. Else: `insufficient` or `out_of_scope`. GEPA rewrites router and answer **prompts** on a train split and is **frozen** for the demo.

---

## 2. India problem

### 2.1 What already exists

- General AI is already used for health queries in India (2025–26 reporting). Advice is often mixed or harmful; Hinglish and urgency are weak.
- Consumer chat (Practo, 1mg, Apollo 24/7, etc.) and research dialogue systems (Med-PaLM, AMIE, Nature 2026) already exist at a scale we will not beat.
- **ICMR / NHA / WHO Standard Treatment Workflows:** 157 one-page workflows, 28 specialties (government notice, Sep 2025). NCDC/ICMR antimicrobial guidelines v2 (Nov 2025). **NLEM** and **CDSCO NSQ** batch lists are public.
- Commercial CXR (e.g. qXR) and many student cancer CNNs already **detect**. Detection is not our thesis.

### 2.2 What is still student-sized

1. A **closed** skill set (CXR findings, one cancer image, pack/lab) with **correct refuse** outside it.
2. Official sources are often **flowcharts**, not prose. Text-chunk RAG loses the diamond (“if red flag → refer”).
3. **GEPA** (Agrawal et al., ICLR 2026) was shown on math/code/IE, not on **coverage vs ungrounded rate** with verifier **text** feedback from Indian STWs.
4. Few-shot usually retrieves **answered** neighbours. That teaches the model to always talk. We retrieve **near-miss refusals** so ICL teaches **when to shut up**.

### 2.3 Why “health GPT + many disease agents on B200” is the wrong slice

- No honest labelled set for all of Indian medicine.
- Unbounded chat diagnoses; not evaluable; unsafe.
- A B200 does not make EfficientNet-on-CheXpert novel. It only makes training **possible**.

---

## 3. Research gap (numbered — this is the thesis)

**Baseline we replicate (no new architecture claimed):**

- Irvin et al., CheXpert (AAAI 2019) — DenseNet-121 (or EfficientNet) multi-label CXR.  
- ISIC / HAM10000 skin-lesion classification papers (Codella, Tschandl et al.).  
- Document KIE: Donut / LayoutLMv3 / PaddleOCR.  
- Agrawal et al., **GEPA** (ICLR 2026 oral, arXiv:2507.19457) as the **prompt optimizer** (not as a clinician).

**Gaps we treat as the enhancement (Myopia style — no numbers at synopsis):**

1. **Visual STW:** retrieve **page images** of ICMR flowcharts (ColPali / ColQwen class), not only text chunks. The answer must point at a **box/arrow**, or refuse.  
2. **GEPA Pareto for abstention:** evolve prompts for **coverage vs ungrounded rate**, using verifier **strings** (“invented a drug”, “answered OOS”), not only 0/1.  
3. **Demonstration selection for silence:** ICL includes near-miss `out_of_scope` / `insufficient` items, not only similar answered items.

Optional extras (not required for the claim): Hinglish questions vs English STW spans; brand–generic map (Crocin / paracetamol); CDSCO list **month** so “not in list” is never “safe.”

---

## 4. What this project is / is not

### 4.1 Is

- Software compound system: 3 frozen tools + local LLM + retrieval + code verifier + chat UI.
- **Replication** of CXR and skin (or swapped cancer set) under a controlled protocol.
- **Fail-closed answering** grounded in Indian official pages.
- GEPA **offline** on prompts.
- B200 (or campus GPU) for specialist training and GEPA rollouts.

### 4.2 Is not

- A doctor, SaMD, or live GEIMS clinic.
- A swarm of chatting “oncology agents.”
- Training on real hospital charts without ethics.
- “We solved TB / cancer.” qXR and ISIC winners already exist.
- Four-class civic dispatch (`call_112` / `close_now`).
- Snell MATH best-of-N as the method paper.

---

## 5. Specialist tools vs small agents (locked)

| | **Tool (what we build)** | **Agent (what we do not build)** |
|---|---|---|
| Job | One model, one JSON | Loop that chats and “orders tests” |
| Example | `cxr_tool(img) → {finding, score}` | “Cancer agent, please manage this patient” |
| Train on B200 | Yes: CheXpert / ISIC / OCR | You do not SGD-train an agent; you prompt an LLM |
| In GEPA | A **tool call** in the trace | Not a separate evolving doctor |

The **only** agent-like piece is the LLM **router + writer** with GEPA-frozen prompts. Specialists are **functions**.

**Locked three tools (ceiling for this degree):**

| ID | Tool | Public data | Baseline to replicate | JSON out |
|---|---|---|---|---|
| **T1 CXR** | Chest X-ray | CheXpert and/or VinDr-CXR | DenseNet-121 / EfficientNet on CheXpert (Irvin et al.) | `{findings[], scores[], dataset}` |
| **T2 Cancer image** | **Skin lesion (default)** | ISIC / HAM10000 | EfficientNet/ResNet ISIC papers | `{class, score, dataset}` |
| **T3 Document** | Pack or lab PDF | CDSCO NSQ tables + synthetic/public packs; lab layouts | Donut / LayoutLM / PaddleOCR | `{batch/brand/analyte, match or range, unreadable?}` |

**T2 swap (if the team prefers a more India-heavy cancer image):** oral-cavity photos or VinDr-Mammo — **one** swap only, still one named set. Do not add a third cancer.

**T1 India note:** TB/pneumonia matter in India; commercial qXR already ships. T1 is a **replicated CXR baseline**, used as a tool. We do not claim an NTEP product.

---

## 6. Narayan Sir — only what this needs

| Topic | Use | Status |
|---|---|---|
| **Demonstration selection** | Retrieve *k* similar gold triples; **quota: at least one near-miss refuse** when available | **Must** (v1 ablation includes k=0) |
| **ICL** | Those triples in the router/answer prompt | **Must** if k>0 |
| **Reasoning** | Each sentence ← STW box / NLEM / CDSCO line. UI shows span, not a long CoT | **Must** |
| **Extra look when unsure** | CXR score vs complaint disagree, or two tools conflict → **one** extra pass or `insufficient` | **Useful** |
| **Snell MATH TTC** | Out | **Out** unless Sir asks |

---

## 7. GEPA (how it is used)

**GEPA** (Genetic-Pareto): run the compound program, read traces (tool JSON, retrieved page, draft, verifier text), reflect in language, mutate prompts, keep a Pareto set. DSPy: `dspy.GEPA`. Paper: Agrawal et al., ICLR 2026.

**Optimize:** router prompt, answer prompt, optionally retrieve instruction.  
**Not optimize:** T1/T2/T3 weights (those are trained the ordinary way on B200, then frozen).

**Metric for GEPA:**

- Scalar: grounding, correct refuse, specialist agreement with gold.  
- **Text feedback (required):** e.g. “cited a drug not in retrieved NLEM span”, “answered a cardiology question with no STW hit”, “treated CXR score as a diagnosis.”

**Serve:** freeze best Pareto candidate. **No** genetic search per user. Optional later: extra search only on tool-disagreement (not MATH).

**Ablation:** hand prompt vs GEPA vs MIPROv2 (if time) on the **same** test questions, plotted as **coverage vs ungrounded rate**. If GEPA loses, we report that.

---

## 8. Architecture

Three figures in **IEEE vector** form (7.16 in two-column width). Name on the cover is still a placeholder; the diagrams use the **function**, not the brand.

**Use these in a paper / synopsis (LaTeX):**

| File | Format |
|---|---|
| `assets/ieee_fig1_workflow.pdf` (also `.svg`, `.eps`) | Fig. 1 workflow |
| `assets/ieee_fig2_architecture.pdf` | Fig. 2 serve-time stack |
| `assets/ieee_fig3_gepa.pdf` | Fig. 3 GEPA offline vs serve |
| `assets/ieee_figures.tex` | Ready `\begin{figure*}` captions |

Embed: `\includegraphics[width=\textwidth]{ieee_fig1_workflow.pdf}`

Preview (PNG, not for print):

![Fig. 1. Online answering workflow](assets/ieee_fig1_workflow_preview.png)

*Fig. 1. Serve-time path. GEPA is not in this figure. Prompts were frozen after offline optimisation (Fig. 3).*

![Fig. 2. Software architecture](assets/ieee_fig2_architecture_preview.png)

*Fig. 2. Four layers at serve time. The verifier is code inside the API, not a fourth neural net.*

![Fig. 3. GEPA is offline only](assets/ieee_fig3_gepa_preview.png)

*Fig. 3. Train/val vs demo/test. T1/T2/T3 weights are never mutated by GEPA.*

Regenerate vectors (from `project-concepts/`):

```
python make_ieee_figures.py
```

Student-report (filled-header) PNGs remain from `make_architecture_figures.py` if the GEU Word synopsis needs them. **IEEE submission should use the PDF/EPS files.**

### 8.1 What each box does

| Box | Lives in | Job |
|---|---|---|
| Browser chat | Client | Text + optional image/PDF. Shows a card. Watermark: not a diagnosis. |
| FastAPI | Gateway | Auth (demo login), job queue, hashed traces. **No patient identity store.** |
| Retrieve | Stores | (a) ICMR STW **page images** via ColPali/ColQwen; (b) NLEM 2022 + CDSCO NSQ **tables**; (c) gold Q&A including **refuse near-misses**. |
| Router LLM | Frozen prompt | Pick `T1` / `T2` / `T3` / `out_of_scope`. Prompt written by GEPA, then frozen. |
| T1 / T2 / T3 | Frozen weights | **Tools**, not agents. JSON only. Trained on GPU, then frozen. |
| Answer LLM | Frozen prompt | May draft a sentence **only** from retrieved spans + tool JSON. |
| Verifier | Code | Fail-closed. No span → drop sentence. OOS → no clinical text. Tool fight → one retry or `insufficient`. |

### 8.2 Serve-time data flow

1. User submits question ± file.  
2. Retrieve STW pages, tables, and similar gold (including refusals).  
3. Router: tool or `out_of_scope`. OOS **skips** T1–T3.  
4. Matching tool returns JSON (scores or fields).  
5. Answer LLM drafts from spans + JSON.  
6. Verifier accepts, strips, or refuses.  
7. Card: `grounded` | `insufficient` | `out_of_scope`.

### 8.3 What GEPA is allowed to touch

- **Yes:** router prompt, answer prompt, optional retrieve instruction.  
- **No:** T1/T2/T3 weights, NLEM/CDSCO tables, STW PDF pixels, verifier rules.  
- **When:** train/val only. **Not** on each live query.

### 8.4 ASCII (same as Fig. 1, for print)

```
INPUT  →  RETRIEVE  →  ROUTER LLM  →  ANSWER LLM  →  VERIFIER
                         |                                  |
              T1 CXR / T2 skin / T3 doc                     |
              (JSON tools, frozen)                          v
                                               grounded | insufficient | out_of_scope
```

---

## 9. Data

High-level map (verified Sep 2026). **URLs, licenses, access, and caveats are in Section 20.** The gold question set does **not** exist yet; it is work we must label.

| Source | Role | Status |
|---|---|---|
| ICMR STW PDFs (page images + text) | Retrieval; gold spans / box ids | Public. **Box ids are not in the PDF; we must annotate.** |
| NLEM **2022** (384 medicines) | Drug-list match | Public PDF, not an API |
| CDSCO monthly NSQ HTML/PDF | Batch match; freshness | Public tables, not a clean API |
| CheXpert | Train/test T1 | Research download after Stanford registration; **non-clinical** |
| VinDr-CXR | Optional T1 / extra test | PhysioNet **credentialed DUA**. Vietnam, not India |
| HAM10000 / ISIC | Train/test T2 | Public; **CC BY-NC** (non-commercial) |
| Pack + lab layouts | Train/test T3 | **No named public pack-OCR set locked.** Synthetic + CDSCO rows |
| **Student gold questions** | 400–800 items | **To be created.** Not a download |

No real hospital PACS/EMR dumps without ethics. No “we used GEIMS patients” as a claim.

Gold record:

```
qid, question, image? (cxr|skin|pack|lab|none)
gold_route          T1 | T2 | T3 | oos
gold_status         grounded | insufficient | out_of_scope
gold_span_id        STW page/box or NLEM/CDSCO id or null
gold_reply          short or empty
```

Split by qid. Same image must not leak across train/test.

---

## 10. Verifier (fail-closed)

1. Router in-scope but empty tool JSON → `insufficient`.  
2. Answer finding/drug/action not in retrieved spans → drop or reject.  
3. Clinical imperative on an OOS question → fail.  
4. Unreadable OCR / non-CXR image sent to T1 → `insufficient`.  
5. T1/T2 score used as a disease name in the sentence → fail unless STW box uses that wording.  
6. Tool disagreement → one extra pass, then `insufficient`.

---

## 11. Evaluation (what the thesis is graded on)

**Specialist replication (baselines):**

- T1: AUROC / F1 on CheXpert (or VinDr) official split — report honestly vs the paper, no “we beat SOTA” unless we did.  
- T2: accuracy / macro-F1 on ISIC split.  
- T3: field-F1 / exact batch match.

**Product metrics (enhancement):**

| Metric | Meaning |
|---|---|
| **Ungrounded rate** | Clinical claims not entailed by retrieved official text/box |
| **Coverage** | Share of in-scope items that received a grounded answer (not silent) |
| **Correct refuse** | OOS / insufficient items that were not answered |
| **Pareto plot** | coverage vs ungrounded rate for hand prompt vs GEPA |

**Ablations:** k=0 vs similar-answered vs **near-miss refuse quota**; text-chunk STW vs **page-image STW**; verifier on/off.

**Not metrics:** diagnostic accuracy vs radiologists; lives saved; 98% cancer.

Small human check (~20 cards): is the reply non-prescriptive and readable in Hindi/English. Likert is secondary.

---

## 12. UI (v1)

Browser chat: text + upload.  
Card: status colour, quoted STW/NLEM/CDSCO line, tool scores folded.  
Watermark: **NOT A DIAGNOSIS. Not a substitute for a registered medical practitioner.**  
Demo login. No patient identity store. Traces hashed.

---

## 13. Pipeline

```
Ingest STW PDFs → page images + text → embed (ColPali class + text)
Train T1 on CheXpert/VinDr on B200 → freeze
Train T2 on ISIC on B200 → freeze
Train T3 OCR/KIE → freeze
Build gold questions (in / insufficient / oos)
Hand-prompt baseline → ungrounded + coverage
GEPA on train (router + answer) with verifier feedback → freeze
ICL with refuse near-misses on test
Ablation table + Pareto plot
Chat demo
```

---

## 14. Hardware and software

**Hardware**

- Dev: 16 GB+ RAM laptop.  
- **B200 / campus GPU:** T1/T2 training, optional VLM, GEPA rollouts on 7B–32B class LLM. A smaller GPU still supports the science if B200 is busy; then use a 7B LLM and fewer GEPA steps.

**Software**

| Tool | Purpose |
|---|---|
| Python, PyTorch, Hugging Face | T1/T2/T3 + local LLM |
| vLLM (optional) | Serve Qwen2.5 / Qwen2.5-VL class |
| DSPy + `dspy.GEPA` | Prompt evolution |
| timm / torchvision | CXR and skin nets |
| PaddleOCR / Donut / LayoutLM | T3 |
| ColPali or ColQwen class | STW page retrieval |
| FastAPI | API |
| HTML/JS or React | Chat |
| FAISS / Qdrant | Gold Q&A + STW embeddings |

---

## 15. Risks

| Risk | Bound |
|---|---|
| Looks like health GPT | Closed tools + refuse as lead table |
| Looks like 2018 CXR/cancer CNN | Imaging is **baseline**; enhancement is grounding + GEPA + refuse demos |
| GEPA sticker | Mandatory Pareto ablation |
| Hallucinated STW | Never generate guideline text as a source |
| Safety | Watermark; no prescribe; no real identifiers |
| Too many tools | Hard cap: T1, T2, T3 |
| B200 worship | GPU in hardware table only |

---

## 16. What to tell Sir in one minute

We replicate **CheXpert CXR** and **ISIC skin** (or one swapped cancer set) as **frozen tools** on the B200. A local LLM **calls** them. It may only speak if an **ICMR flowchart box** (visual retrieve) or NLEM/CDSCO row entails the sentence. **Near-miss refusals** go in the prompt. **GEPA** tunes those prompts for **more coverage at the same ungrounded rate**. We are not training a doctor and not deploying at a hospital.

---

## 17. Expected outcomes

**Synopsis (Phase 1):** this spec. **No improved AUROC or ungrounded-rate claimed.**

**After implementation:**

- Frozen T1/T2/T3 with honest baseline numbers vs papers.  
- Gold question set including refuse.  
- Table: hand prompt vs GEPA vs ICL-refuse vs visual STW.  
- Pareto: coverage vs ungrounded.  
- Chat demo with watermark.  
- If GEPA or visual STW does not win, we write that.

---

## 18. Working academic title (GEU synopsis later)

**Care Pathway: Guideline-Grounded Health Assistant with Specialist Tools and Fail-Closed Answering**

---

## 19. Locked decisions (do not reopen without Sir)

1. Product = grounded chat card, not HIS, not diagnosis.  
2. Tools = T1 CXR, T2 skin (cancer image), T3 pack/lab. No extra agents.  
3. Novelty = visual STW + GEPA abstention Pareto + refuse demonstrations.  
4. GEPA offline only.  
5. MATH TTC out.  
6. No real hospital charts without ethics.  
7. No numbers in the Phase-1 synopsis.

---

## 20. Verified data appendix (checked Sep 2026)

This section is the honest inventory. If a row says **gap**, the md previously implied it was ready and it is not.

### 20.1 Official Indian text (retrieval + verifier tables)

| Asset | What is true | URL / access | Gap for us |
|---|---|---|---|
| **ICMR STWs** | NMC public notice **15 Sep 2025**: ICMR + NHA + WHO, **157** workflows, **28** specialties. Downloadable PDFs. Format is **one-page visual workflows** (not Wikipedia prose). | https://www.icmr.gov.in/standard-treatment-workflows-stws and https://stw.icmr.org.in | No machine-readable **box/arrow IDs**. Visual-STW novelty requires **our** page raster + box labels on the subset we use (pulmonology/CXR, dermatology/skin, oncology if T2 swap). Indexing 157 pages is small; labelling boxes is the work. |
| **NLEM** | **NLEM 2022**, launched 13 Sep 2022, **384** medicines (not a live API). | https://cdsco.gov.in/opencms/opencms/en/consumer/Essential-Medicines/ | Parse PDF to a table. Brands (Crocin) are **not** in NLEM; brand–generic is extra work (optional). |
| **CDSCO NSQ** | Monthly **Not of Standard Quality** tables (product, batch, mfr, test failed). | https://cdscoonline.gov.in/CDSCO/viewPublicNSQDrug | Scrape/archive **by month**. No official bulk API. “Not in list ≠ safe” must be in the UI copy. |
| **NCDC/ICMR antimicrobial guidelines** | National Treatment Guidelines for Antimicrobial Use, **v2.0, Nov 2025** (NCDC + ICMR). | NCDC/MoHFW PDF series | Optional extra corpus; not required if STWs + NLEM suffice. |

### 20.2 Imaging (T1, T2)

| Asset | What is true | Access / license | Gap for us |
|---|---|---|---|
| **CheXpert** (Irvin et al., **AAAI 2019**, arXiv:1901.07031) | **224,316** CXRs, **65,240** patients, 14 observations, **uncertain** labels. Paper’s best CNN: **DenseNet-121**. Competition labels often the 5: Atelectasis, Cardiomegaly, Consolidation, Edema, Pleural Effusion. | Stanford ML group; **research, non-commercial, non-clinical**. Email/register. **Small ~11 GB**, full ~440 GB. | Must handle **U-ones / U-zeros / U-ignore**. Split by **patient**, not image. Does **not** need a B200 (DenseNet-121 is small). B200 is for speed / LLM / GEPA. |
| **VinDr-CXR** (Nguyen et al., *Sci Data* 2022; arXiv:2012.15029) | **18,000** PA CXRs, 15k train / 3k test, 17 radiologists, 22 local + 6 global labels. **Vietnam** (Hanoi / Hospital 108), **not India**. | PhysioNet credentialed **DUA**. Research/education only. | Optional extra test / India-*like* geography. Do not write “Indian CXR set.” |
| **HAM10000** (Tschandl, Rosendahl, Kittler, *Sci. Data* 2018, doi:10.1038/sdata.2018.161) | **10,015** dermatoscopic images, 7 classes (incl. melanoma, BCC). Harvard Dataverse + ISIC. | **CC BY-NC** (non-commercial). Cite the data paper. | Europe/Australia skin tones, **not** Indian clinic photos. Official ISIC 2018 test server if we claim challenge numbers. Split by **lesion id** (same lesion, many images). |
| **ISIC challenges** (Codella et al.) | Related live challenges; HAM10000 was training for ISIC 2018 Task 3. | ISIC archive | Do not mix challenge years without stating which split. |

**qXR (Qure.ai)** is a **commercial** CXR product in India. T1 is a **replicated baseline**, not an NTEP competitor. That sentence in the spec is fair.

### 20.3 Document tool (T3) — weakest data row

| Asset | What is true | Gap |
|---|---|---|
| Pack OCR | Donut (Kim et al.), LayoutLMv3 (Huang et al.), PaddleOCR exist as **methods** | **No locked public Indian strip/carton set.** We must **synthesize** packs from CDSCO rows + public pack photos, or photograph OTC packs ourselves (no patient Rx). |
| Lab PDF | Same KIE methods | **No locked public Indian lab-PDF set.** Synthetic layouts + a small self-collected set. Reference ranges must be a **dated table** we cite (BIS 10500 / ICMR / kit insert) — not LLM memory. |

### 20.4 Methods papers (not data)

| Paper | Spec claim | Verdict |
|---|---|---|
| Agrawal et al., **GEPA**, arXiv:2507.19457, **ICLR 2026 oral** | Prompt optimizer; DSPy `dspy.GEPA` | **Correct** |
| Faysse et al., **ColPali**, arXiv:2407.01449 | Page-image retrieval; ColQwen is the Qwen-backed variant | **Correct as a class.** We use an open ColPali/ColQwen checkpoint; we do not train ColPali from scratch unless we say so. |
| Donut / LayoutLMv3 / PaddleOCR | T3 baselines | **Correct as methods** |
| AMIE, *Nature* 2026 | Guideline-grounded clinical dialogue at a scale we will not beat | **Correct as related work**, not a dataset |

### 20.5 What we still have to **make** (not download)

1. **Gold questions (400–800)** with route, status, span id, Hinglish subset — **does not exist**. Dual annotation + disagreement protocol not written yet.  
2. **STW box/arrow IDs** on the 10–30 pages we actually retrieve (pulmonology, dermatology, and any oncology page if T2 maps there).  
3. **T3 synthetic packs** joined to real CDSCO batch strings.  
4. **Entailment checker:** rules + optional NLI; human gold on the test cards. Not specified as a named model yet.  
5. **Train/val/test fractions** for the gold set (suggested: 50 / 20 / 30 by qid).  
6. Ethics/DPDP one-pager (no real identifiers; NC licenses respected).

### 20.6 Compute honesty

DenseNet-121 on CheXpert-small and EfficientNet on HAM10000 are **not** B200-scale jobs. B200 is justified for **GEPA rollouts + 7B–32B LLM + ColPali indexing**, and for faster CXR epochs. The spec must not imply T1/T2 *require* a B200.

### 20.7 Mapping tools → STWs (so retrieval is not empty)

| Tool | STW volumes that can actually ground a sentence |
|---|---|
| T1 CXR | Pulmonology; cardiology (e.g. heart failure STW names CXR); TB volume II |
| T2 skin | Dermatology volume III (bacterial skin, dermatophytosis, etc.). **Melanoma is a poor match** to those pages — many ISIC classes will correctly go to `insufficient` if no STW box exists. That is a **feature**. |
| T3 pack/lab | NLEM + CDSCO rows more than STWs; some STWs name first-line drugs |

If T2 is melanoma-heavy and dermatology STWs are infection/eczema, **correct refuse** will dominate T2 chat. That must be in the viva, not a surprise.

---

## 21. Verdict on “is everything there?”

| Layer | Complete? |
|---|---|
| Product, Sir, GEPA, architecture, metrics, UI, locks | **Yes** |
| Named baselines and India STW/NLEM/CDSCO facts | **Yes, after this appendix** |
| Downloadable gold Q&A, box labels, pack photos | **No — to be built** |
| T3 named dataset | **No — synthetic + self-collect** |
| License/access/split rules | **Now in §20; were missing before** |
