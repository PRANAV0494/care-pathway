# Care Pathway — poora project, Hinglish mein

Yeh file viva / evaluator ke liye hai. **Yahi baat report aur PPT dono mein hai.** Koi extra claim mat add karna. Future tense: abhi Phase-1 synopsis hai, numbers abhi measure nahi hue.

**Cover title (report / PPT):** Care Pathway: Guideline-Grounded Health Assistant with Specialist Tools and Fail-Closed Answering

**Short name:** Care Pathway

**Student:** Pranav Maheshwari · GE-232023518  
**Guide:** Dr. Narayan Chaturvedi, Associate Professor  
**Team ID:** MP2026CSE344 · solo · B.Tech CSE Core · Graphic Era Deemed to be University, Dehradun · September 2026

---

## 1. Project kya hai — ek line

Yeh **doctor nahi** hai. Yeh ek **fail-closed answering system** hai: user sawal poochta hai (kabhi X-ray / skin photo / dawai pack / lab PDF ke saath). Local LLM **sirf named tools call** karta hai. Jo sentence likhi jaaye woh **official Indian page** (ICMR STW box, NLEM row, ya CDSCO NSQ row) se entail honi chahiye. Nahi to system **chup** — `insufficient` ya `out_of_scope`. Card pe watermark: **NOT A DIAGNOSIS**.

---

## 2. Project kya NAHI hai (viva mein pehle yeh bol dena)

- Hospital HIS / OpenCare / GEIMS jaisa clinic software nahi  
- Software as a medical device nahi  
- Auto-prescribe / auto-dial / 112 dispatch nahi  
- “Humne cancer / TB solve kar diya” nahi  
- Bada LLM (Qwen) **train / doctor-fine-tune** nahi  
- Live clinic deploy nahi, real hospital charts bina ethics ke nahi  
- Fake AUROC / “98% cancer” nahi  
- Chatting specialist-doctor **agents** ka swarm nahi  

Imaging nets (CXR, skin) **baseline replicate** hain — jaise Myopia wale EfficientNetB0 replicate karte hain. **Novelty** imaging architecture nahi, **grounding + refuse + GEPA** hai.

---

## 3. Problem kya hai

India mein log pehle se ChatGPT-type models se sehat poochte hain. Teen failure:

1. **Invention** — dawai / dose / referral jo retrieved official span mein hai hi nahi  
2. **Over-talking** — out-of-scope sawal pe bhi jawab (kyunki few-shot mein sirf answered examples the)  
3. **Galat architecture** — har disease ko chatting “agent” bana dena; loop mein tests order; evaluable nahi, doctor nahi  

Asli gap yeh nahi ki India ke paas guidelines nahi. Gap yeh hai ki **guidelines ko fail-closed answering** se bind nahi kiya.

---

## 4. Official Indian sources (yeh numbers internet-verified hain)

### 4.1 ICMR / NHA / WHO Standard Treatment Workflows (STW)

- **157** workflows, **28** specialties  
- NMC public notice: **15 September 2025**  
- Download: https://www.icmr.gov.in/standard-treatment-workflows-stws  
- Shape: **ek-page flowchart** — diamonds, arrows (“if red flag, refer”)  
- Text-chunk RAG is diamond ko tod deta hai → isliye **page image retrieve** (ColPali-class)  
- Box/arrow IDs official PDF mein nahi hain → **tum label** karoge un pages pe jo gold questions actually use karti hain (pulmonology/CXR, dermatology/skin, jo lookup cite kare)  

Dermatology STWs infection / eczema / dermatophytosis zyada hain, melanoma kam. Agar HAM10000 class ka matching STW box nahi mila → **correct refuse**. Yeh bug nahi, feature hai.

### 4.2 NLEM 2022

- **384** medicines  
- Launch: **13 September 2022** (PIB / MoHFW)  
- PDF hai, **live API nahi**  
- Lookup: brand/generic list mein hai ya nahi  

### 4.3 CDSCO NSQ

- Monthly **Not of Standard Quality** tables: product, batch, manufacturer, test failed  
- Public HTML/PDF, **documented bulk API nahi**  
- Dated snapshot rakho  
- **Is mahine ki list mein nahi mila ≠ safe** — yeh rule verifier mein hard-code  

### 4.4 Extra (optional retrieve, generate nahi)

- NCDC + ICMR: *National Treatment Guidelines for Antimicrobial Use in Infectious Disease Syndromes*, **version 2.0, November 2025**  

Yeh documents **tum likhoge nahi**. Sirf retrieve + cite.

---

## 5. Architecture — kaun kya karta hai

Do LLM **roles**, same local weights, **do frozen prompts**:

```
USER  →  question + optional image/PDF
            ↓
HOST  →  STW pages + NLEM/CDSCO rows + similar gold (including refuse) retrieve
            ↓
ROUTER LLM  →  structured tool call  (ya out_of_scope)
            ↓
HOST  →  named function CHALATA hai  (model khud weight nahi chalaata)
            ↓
JSON wapas context mein
            ↓
ANSWER LLM  →  ek short sentence  SIRF spans + JSON se  (ya silent)
            ↓
VERIFIER (Python code, neural net nahi)
            ↓
CARD:  grounded  |  insufficient  |  out_of_scope
            + watermark NOT A DIAGNOSIS
```

**GEPA live path pe nahi.** Demo pe prompts already freeze.

Serve-time rules:

- Model naya tool invent nahi kar sakta  
- Model code execute nahi karta — **host** karta hai  
- Infinite ReAct loop nahi  
- Do tools disagree → **ek extra look**, phir `insufficient`  
- `out_of_scope` → koi specialist nahi, clinical sentence forbidden  

UI: browser chat + FastAPI. Demo login, hashed traces, **koi patient identity store nahi** (DPDP Act 2023, No. 22).

---

## 6. “Tool” ka matlab (evaluator ko yeh crystal clear)

**Tool** = frozen **JSON function**. Name, when-to-use, args, output fields. LLM naam nikalta hai; Python chalaata hai.

**Agent** = chatting loop jo plan likhe, tests order kare — **is project mein nahi**.

Interface **extensible** hai: baad mein naya specialist = naya schema + frozen weights/table. Extra chatting doctor nahi. Phase-1 evaluation **usi catalogue** pe jise tum implement karoge.

---

## 7. Phase-1 tool catalogue (yeh PPT Table / Report Table 4.1)

| Name | Kind | Host kya chalaata hai | JSON out |
|---|---|---|---|
| `cxr_tool` | Train + freeze | CheXpert CNN (DenseNet-121 / EfficientNet) | findings[], scores[], unreadable? |
| `skin_tool` | Train + freeze | HAM10000 / ISIC net | class, score, dataset |
| `document_tool` | Train + freeze | OCR/KIE pack ya lab PDF | batch / brand / analyte, unreadable? |
| `nlem_lookup` | Lookup, CNN nahi | NLEM 2022 table | in list / not in list |
| `cdsco_lookup` | Lookup | dated NSQ snapshot | match / not in list (not “safe”) |
| `stw_retrieve` | Lookup | ColPali-class on STW **page images** | page id, box ids |
| `out_of_scope` | Refuse | kuch nahi | status = out_of_scope |

T2 **swap** ho sakta hai (oral / mammo) — **stack nahi**. Extra cancer CNN nahi. Extra tools later same 4 columns.

---

## 8. Poora data — kya download, kya tum banaoge

### 8.1 CheXpert (T1) — **download, phir tum train**

- Paper: Irvin et al., AAAI 2019, vol. 33, pp. 590–597  
- **224,316** chest radiographs, **65,240** patients, **14** observations, uncertain labels  
- Competition 5: Atelectasis, Cardiomegaly, Consolidation, Edema, Pleural Effusion  
- Uncertainty: **U-ones / U-zeros / U-ignore** report karna  
- Unka best CNN: **DenseNet-121**  
- Licence: research, **non-commercial, non-clinical**  
- Start: **CheXpert-small** kaafi; patient-level splits (leakage mat karna)  
- Metric: paper jaisa AUROC / F1, official split pe **honest** vs Irvin — SOTA tabhi bolo jab earn ho  

**VinDr-CXR (optional extra test, T1 ka India nahi):** 18,000 PA films, Vietnam (Hospital 108 + Hanoi Medical University), 15k train / 3k test, 17 radiologists, 22 local + 6 global labels. PhysioNet **credentialed DUA** ke baad. India nahi hai — viva mein bol dena.

**qXR (Qure.ai)** India mein commercial CXR pehle se hai. Tum **public baseline replicate** karte ho, NTEP product nahi.

### 8.2 HAM10000 / ISIC (T2) — **download, phir tum train**

- Tschandl, Rosendahl, Kittler, *Scientific Data* 2018, Art. 180161  
- **10,015** dermatoscopic images, **saat** classes (nv, mel, bcc, bkl, akiec, df, vasc)  
- Licence: **CC BY-NC**  
- ISIC 2018 Task 3 ka public training set (Codella et al., arXiv:1902.03368)  
- Split: **`lesion_id` se** — same lesion ke multiple photos train/test dono mein nahi  
- Photos **Austria / Australia** clinics — Indian OPD nahi. Limitation bolna  
- EfficientNet-class transfer learning standard student baseline (Tan & Le, ICML 2019)  
- Agar class ka STW box nahi → **correct refuse**  

### 8.3 Document / pack / lab (T3) — **koi named Indian pack set nahi**

- Methods: Donut (ECCV 2022), LayoutLMv3 (ACM MM 2022), PaddleOCR / PP-OCR (Du, Li, Guo et al., arXiv:2009.09941)  
- Data: CDSCO batch strings se **synthetic packs** + khud ke OTC photos  
- **Patient prescription mat lo**  
- Labs: similar, dated reference-range table  
- Metric: field-F1, exact batch match — “medicine safe hai” nahi  

### 8.4 STW pages + tables

- STW PDFs → page images → ColPali / ColQwen-class embed (Faysse et al., arXiv:2407.01449, **ICLR 2025**)  
- ColPali **from scratch train nahi** — open checkpoint  
- NLEM 2022 + monthly CDSCO → dated snapshots  
- Gold questions mein `gold_span_id`  

### 8.5 Gold Q&A set — **download nahi, tum label karoge**

Har item:

- question text (English + **Hinglish**)  
- optional image type  
- `gold_route` (kaunsa tool)  
- `gold_status` (grounded / insufficient / out_of_scope)  
- `gold_span_id`  
- short `gold_reply` ya empty  

Split **question id** se. Same image leak nahi. Dual annotation + disagreement protocol **numbers se pehle** likhna. Near-miss refuse examples **first-class** — sirf answered twins nahi.

### 8.6 Local LLM — **download weights, train nahi**

- Qwen-class open weights (Qwen2.5 report: arXiv:2412.15115)  
- Serve: vLLM optional  
- Do prompts: router + answer, GEPA ke baad **freeze**  

---

## 9. Ek query ka walkthrough (teen scenes)

**A. “Yeh meri chest X-ray, tightness hai.”**  
Router → `cxr_tool`. Host DenseNet chalaata hai. JSON: findings + scores. `stw_retrieve` pulmonology page. Agar STW box cardiomegaly/CXR entail kare → grounded **quote**. “Tumhe heart failure hai” **nahi**. File selfie ho to T1 `unreadable` → insufficient.

**B. Pack photo + “yeh Crocin batch theek hai?”**  
`document_tool` → batch/brand. Phir `nlem_lookup` / `cdsco_lookup`. NSQ list miss ≠ safe.

**C. “Uncle ko fever, best antibiotic, koi report nahi.”**  
`out_of_scope`. Koi T1/T2/T3 nahi, koi drug name nahi.

Skin photo + “cancer?” → `skin_tool` + STW. Melanoma vs ICMR derm pages mismatch common → **correct refuse**.

---

## 10. Verifier (code) — kya check karta hai

Neural net nahi. FastAPI ke andar rules:

- In-scope route ke baad empty JSON → `insufficient`  
- Finding / drug / action retrieved spans mein nahi → drop ya reject  
- Out-of-scope pe clinical imperative → fail  
- Non-CXR image `cxr_tool` pe → insufficient  
- T1/T2 score ko disease **name** banana, jab STW woh wording use na kare → fail  
- Tool disagreement → ek extra pass, phir insufficient  

Teen statuses hi: **grounded / insufficient / out_of_scope**.

---

## 11. Methodology do phases (Myopia jaisa)

**Baseline (jo tum TRAIN karte ho):** CheXpert, HAM10000, document OCR — paper metrics, honest numbers.

**Enhancement (jo TEXT freeze hota hai):**

1. Visual STW retrieve (flowchart page, text chunk nahi)  
2. ICL mein **near-miss refusals** (Narayan Sir: similar examples, including refuse)  
3. **GEPA** offline — coverage vs ungrounded-rate Pareto  

Agar GEPA haath-wale prompt se haar jaaye — **woh bhi likhna**. Forced positive nahi.

Pipeline: Data → Baseline tools train/freeze → Gold set → Hand prompt → GEPA (train only) → Freeze → Test + demo.

---

## 12. GEPA — evaluator ko kaise samjhana (yeh section poora padh ke bolo)

### 12.1 GEPA kya hai

**GEPA = Genetic-Pareto** (kabhi “reflective prompt evolution” bhi kehte hain).

Paper: Lakshya A. Agrawal et al., “GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning,” arXiv:**2507.19457**, **ICLR 2026 oral**.

DSPy: `dspy.GEPA` (Khattab et al., DSPy, arXiv:2310.03714).

**Yeh LLM ke weights update nahi karta.** Yeh **prompt ka text** search karta hai.

Paper ke tasks: math (jaise AIME), code, related — **Indian STW abstention nahi**. Tumhara thesis slice: usi method ko **coverage vs ungrounded** pe lagana, feedback strings jaise “invented a drug” / “answered OOS”.

### 12.2 Ordinary prompt vs GEPA

- Hand prompt: tum English mein router/answer instructions likhte ho, test pe measure  
- MIPROv2: DSPy ka doosra optimizer, mostly **scalar score** (kitna sahi)  
- **GEPA extra:** metric sirf number nahi, **natural-language feedback** bhi deti hai. Reflection LLM us text ko padh ke naya prompt propose karta hai  

Isliye GEPA “genetic + Pareto”: kai prompt candidates, traces se seekhte hain, ek **Pareto set** rakhte hain — ek axis pe coverage, doosri pe ungrounded rate. Dono ek saath max nahi hote: zyada jawab = zyada jhoot ka risk. Tum **trade-off plot** dikhaoge.

### 12.3 Ek GEPA rollout (offline, train split ONLY)

```
1. Abhi wala router prompt + answer prompt lo
2. Train gold questions pe system chalao
   (tool call → JSON → draft → verifier)
3. Trace save: tool name, JSON, retrieved page/box, draft, verifier text
4. Metric:
     score  = coverage / correct refuse  (jo define kiya)
     feedback = English sentence, e.g.
       "Cited a drug not in the retrieved NLEM span"
       "Answered OOS; should have been out_of_scope"
5. Reflection LLM trace + feedback padh ke prompt MUTATE karta hai
   (naye instructions, naye refuse examples)
6. Naya candidate evaluate
7. Pareto pe rakho jo coverage↑ kare bina ungrounded↑ ke (ya controlled)
8. Repeat budget tak (light/medium) — campus GPU / B200 yahan use
9. EK winner freeze → demo. Live user pe GEPA nahi
```

**Mutate nahi hota:** T1/T2/T3 weights, NLEM/CDSCO tables, STW pixels, verifier rules.

### 12.4 Viva lines (hafte se rat lo)

- “GEPA is **not** ‘we trained Qwen on Indian patients’.”  
- “GEPA rewrites **prompts** from **traces + text feedback**, then we **freeze**.”  
- “We score **coverage versus ungrounded rate**, not CheXpert AUROC as the product metric.”  
- “If GEPA loses to a hand prompt, we report that.”  
- “No genetic search per live query.”  
- Sir wala TTC/MATH **out of scope**. Extra compute = **ek extra look** jab tools disagree, phir insufficient — best-of-N math search nahi.

### 12.5 ICL (Narayan Sir) GEPA ke saath kaise fit hota hai

Router prompt mein **similar gold examples**, including:

- X-ray + cough → `cxr_tool`  
- mole photo → `skin_tool`  
- pack + NLEM? → `document_tool` + `nlem_lookup`  
- chest pain, no image, “am I dying” → `out_of_scope` / insufficient  
- brain MRI → `out_of_scope` (MRI tool nahi)  

GEPA inhi demonstrations / instructions ko better kar sakta hai. **Refuse near-miss** ke bina model hamesha bolega.

---

## 13. Evaluation — kya measure, kya nahi

**Specialist replication (baseline):**

- CheXpert AUROC/F1, official split, vs Irvin  
- ISIC accuracy / macro-F1, lesion-id split  
- Document field-F1, exact batch match  

**Product (enhancement):**

- Coverage  
- Ungrounded rate  
- Correct refuse  
- Coverage-vs-ungrounded **Pareto**  
- Ablation: hand prompt vs GEPA vs refusal-ICL vs visual STW  

**Report nahi:** radiologist vs model diagnostic accuracy, lives saved, invented %, “98% cancer”.

Secondary: card Hindi/English readable, non-prescriptive — chhota human check.

**Synopsis stage pe koi improved number claim nahi.**

---

## 14. Hardware / software

**HW:** laptop 16 GB+; campus **B200 ya jo GPU mile** — LLM serve + GEPA rollouts ke liye. DenseNet CheXpert-small **B200 demand nahi**. 7B + kam GEPA steps bhi scientifically valid.

**SW:** Python, PyTorch, Hugging Face, timm, PaddleOCR/Donut/LayoutLMv3, ColPali/ColQwen, vLLM optional, DSPy + `dspy.GEPA`, FAISS/Qdrant, FastAPI, HTML/JS or React, VS Code, Git.

---

## 15. Expected outcomes (future tense)

- Extensible tool-calling spec + Phase-1 catalogue  
- Frozen CXR + skin tools, honest baseline numbers  
- Document tool + NLEM/CDSCO lookups + “not in list ≠ safe”  
- Visual STW + student box IDs  
- Gold set with refusals  
- Ablation table + Pareto plot  
- Watermarked chat demo  
- Agar GEPA/visual STW na jeete to likha hua account  
- Later tool same JSON se add, bina LLM pretrain  

---

## 16. Evaluator ke saamne 2-minute pitch (rat lo)

> Sir, log pehle se LLM se sehat poochte hain. India ke paas 157 STWs, 384 NLEM, CDSCO NSQ pehle se hain. Problem unhe generate karna nahi — **ungrounded answering** hai. Hum specialist ko **JSON tools** banate hain: CXR CheXpert pe train-freeze, skin HAM10000 pe, document OCR. Local Qwen **sirf tool call** karta hai, diagnose nahi. Sentence tabhi jab STW/NLEM/CDSCO span entail kare. Warna refuse. Imaging papers baseline hain. Enhancement visual STW, refuse demonstrations, aur **GEPA se prompt evolve** — weights nahi. GEPA offline, freeze, coverage vs ungrounded. Yeh doctor nahi, HIS nahi, koi fake accuracy nahi.

---

## 17. Unke likely sawal — seedha jawab

**Q. Novel kya hai?**  
A. CXR net nahi. Fail-closed Indian answering: visual STW + refuse ICL + GEPA abstention Pareto.

**Q. LLM train kiya?**  
A. Nahi. Open weights load. GEPA prompts. Specialists train.

**Q. GEPA weights change karta hai?**  
A. Nahi. Prompt text + traces + language feedback.

**Q. Aur tools?**  
A. Same JSON catalogue. Phase-1 pe teen trained + lookups + refuse. Extra CNN zoo nahi.

**Q. Data kahan se?**  
A. CheXpert, HAM10000 public. STW/NLEM/CDSCO government. Gold Q&A aur STW box IDs **hum label** karenge — download nahi. Indian pack-OCR named set nahi.

**Q. VinDr India hai?**  
A. Nahi, Vietnam. Extra test, DUA ke baad.

**Q. Clinic mein lagaoge?**  
A. Nahi. Synopsis + demo card. Ethics ke bina real charts nahi.

**Q. Accuracy kitni hai?**  
A. Synopsis pe **koi claimed result nahi**. CheXpert paper ke numbers unke hain; hamare replication numbers experiment ke baad.

---

## 18. Files (Desktop folder: `Major Project`)

- `Guideline_Grounded_Health_Assistant_GEU_Phase1_Synopsis.docx` / `.pdf` — report  
- `Phase1_Evaluator_Presentation.pptx` — 10 slides, cream, click-to-reveal  

Yeh explain file unke saath rakhna; viva mein **report + PPT** se mat bhato.
