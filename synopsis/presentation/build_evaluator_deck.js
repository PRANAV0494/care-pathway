/**
 * GEU Phase-1 evaluator presentation — 10 slides.
 * Formal, WIDE (13.333 x 7.5), click-sequenced later via inject_animations.py.
 *
 * Run from Major_Project:
 *   node synopsis/presentation/build_evaluator_deck.js
 */
const pptxgen = require("pptxgenjs");
const path = require("path");

const ASSETS = path.resolve(__dirname, "../assets");
const OUT = path.resolve(__dirname, "../CarePathway_10slides.pptx");

const W = 13.333;
const H = 7.5;
const MX = 0.62;

const C = {
  navy: "0E1A2B",
  navyMid: "16324F",
  gold: "B8954A",
  goldSoft: "E8D9B0",
  cream: "F7F4EE",
  card: "FFFCF7",
  ink: "1C1917",
  body: "3F3A36",
  muted: "6B6560",
  line: "D9D2C5",
  white: "FFFFFF",
  sage: "2F5D50",
  rust: "8B3A3A",
  pale: "EEF2F6",
};

const FONT = { head: "Georgia", body: "Calibri" };

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE_GEU", width: W, height: H });
pres.layout = "WIDE_GEU";
pres.title = "Care Pathway — Phase-1 Synopsis";
pres.author = "Pranav Maheshwari";
pres.subject = "GEU B.Tech CSE Core Major Project — Evaluator Presentation";

function click(n, tag) {
  return `click_${String(n).padStart(2, "0")}${tag ? "_" + tag : ""}`;
}

function header(slide, section, page, dark) {
  const muted = dark ? "A8A49A" : C.muted;
  const ink = dark ? C.goldSoft : C.ink;
  slide.addText(section, {
    x: MX, y: 0.28, w: 8.4, h: 0.28,
    fontFace: FONT.body, fontSize: 11, color: muted,
    charSpacing: 2.2, margin: 0, objectName: "static_h",
  });
  slide.addText(`${page}  /  10`, {
    x: W - MX - 1.6, y: 0.28, w: 1.6, h: 0.28,
    fontFace: FONT.body, fontSize: 11, color: muted,
    align: "right", margin: 0, objectName: "static_p",
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MX, y: 0.62, w: W - 2 * MX, h: 0.015,
    fill: { color: dark ? "2A3A4E" : C.line },
    objectName: "static_rule",
  });
  return ink;
}

function footer(slide, dark) {
  const col = dark ? "8A8680" : C.muted;
  slide.addText("Graphic Era Deemed to be University  ·  B.Tech CSE Core  ·  Phase-1 Synopsis  ·  September 2026", {
    x: MX, y: 7.14, w: W - 2 * MX, h: 0.24,
    fontFace: FONT.body, fontSize: 10, color: col, margin: 0, objectName: "static_f",
  });
}

function title(slide, text, y) {
  slide.addText(text, {
    x: MX, y: y || 0.78, w: W - 2 * MX, h: 0.52,
    fontFace: FONT.head, fontSize: 26, color: C.ink, margin: 0,
    objectName: click(1, "title"),
  });
}

function card(slide, x, y, w, h, opts) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.card },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 },
    objectName: click(opts.n, "bg"),
  });
  if (opts.bar) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h,
      fill: { color: opts.bar },
      objectName: click(opts.n, "bar"),
    });
  }
}

// =====================================================================
// 01 TITLE
// =====================================================================
function slide01() {
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addImage({
    path: path.join(ASSETS, "geu_logo.png"),
    x: MX, y: 0.32, w: 0.78, h: 0.61,
    objectName: "static_logo",
  });
  s.addText("GRAPHIC ERA DEEMED TO BE UNIVERSITY, DEHRADUN", {
    x: 1.55, y: 0.36, w: 10.4, h: 0.26,
    fontFace: FONT.body, fontSize: 12, color: C.navyMid, charSpacing: 1.4, margin: 0,
    objectName: click(1, "uni"),
  });
  s.addText("Department of Computer Science & Engineering  ·  B.Tech CSE Core", {
    x: 1.55, y: 0.62, w: 10.4, h: 0.24,
    fontFace: FONT.body, fontSize: 13, color: C.muted, margin: 0,
    objectName: click(1, "dept"),
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y: 1.08, w: W - 2 * MX, h: 0.015,
    fill: { color: C.line }, objectName: "static_rule",
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.32, w: 3.7, h: 0.36, rectRadius: 0.04,
    fill: { color: C.card }, line: { color: C.gold, width: 1.25 },
    objectName: click(2, "chipbg"),
  });
  s.addText("PHASE-1 MAJOR PROJECT SYNOPSIS", {
    x: MX, y: 1.32, w: 3.7, h: 0.36,
    fontFace: FONT.body, fontSize: 10, color: C.navyMid, align: "center", valign: "middle",
    charSpacing: 1.2, margin: 0, objectName: click(2, "chip"),
  });

  s.addText("Care Pathway", {
    x: MX, y: 1.82, w: 12.0, h: 0.95,
    fontFace: FONT.head, fontSize: 44, color: C.navyMid, margin: 0,
    objectName: click(3, "title"),
  });
  s.addText("Guideline-grounded health assistant with specialist tools and fail-closed answering.", {
    x: MX, y: 2.82, w: 11.6, h: 0.7,
    fontFace: FONT.body, fontSize: 18, color: C.body, margin: 0,
    objectName: click(4, "sub"),
  });

  const meta = [
    ["Student", "Pranav Maheshwari   ·   GE-232023518"],
    ["Guide", "Dr. Narayan Chaturvedi   ·   Associate Professor"],
    ["Team ID", "MP2026CSE344"],
  ];
  meta.forEach((row, i) => {
    const x = MX + i * 4.05;
    s.addText(row[0], {
      x, y: 4.42, w: 3.85, h: 0.22,
      fontFace: FONT.body, fontSize: 11, color: C.gold, charSpacing: 1.2, margin: 0,
      objectName: click(5, "m" + i + "a"),
    });
    s.addText(row[1], {
      x, y: 4.64, w: 3.85, h: 0.42,
      fontFace: FONT.body, fontSize: 14, color: C.ink, margin: 0,
      objectName: click(5, "m" + i + "b"),
    });
  });

  s.addText("No diagnostic claim. No trained “health GPT”. Future tense only.", {
    x: MX, y: 5.28, w: 12, h: 0.32,
    fontFace: FONT.body, fontSize: 13, italic: true, color: C.muted, margin: 0,
    objectName: click(6, "disc"),
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y: 5.78, w: W - 2 * MX, h: 0.015,
    fill: { color: C.gold }, objectName: "static_goldline",
  });
  s.addText("Evaluators  ·  September 2026  ·  10 slides", {
    x: MX, y: 6.0, w: 12, h: 0.32,
    fontFace: FONT.body, fontSize: 13, color: C.navyMid, margin: 0,
    objectName: click(6, "eval"),
  });
  footer(s);
}

// =====================================================================
// 02 PROBLEM
// =====================================================================
function slide02() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "01  ·  PROBLEM", "02");
  title(s, "People already ask language models for health advice.");
  footer(s);

  s.addText("The failure is not missing Indian guidelines. It is ungrounded answering: invented drugs, skipped official pages, and talk when evidence is missing.", {
    x: MX, y: 1.38, w: 12.05, h: 0.55,
    fontFace: FONT.body, fontSize: 15, color: C.body, margin: 0,
    objectName: click(2, "lead"),
  });

  const cols = [
    { n: 3, k: "01", h: "Invention", t: "A drug, dose, or referral that does not appear in any retrieved official span." },
    { n: 4, k: "02", h: "Over-talking", t: "The model answers an out-of-scope item because prompts were built only from answered neighbours." },
    { n: 5, k: "03", h: "Wrong architecture", t: "Chatting “specialist agents” that order tests in a loop are not evaluable and are not a doctor." },
  ];
  cols.forEach((c, i) => {
    const x = MX + i * 4.08;
    card(s, x, 2.12, 3.92, 3.55, { n: c.n, bar: C.gold });
    s.addText(c.k, {
      x: x + 0.28, y: 2.32, w: 3.4, h: 0.36,
      fontFace: FONT.head, fontSize: 18, color: C.gold, margin: 0,
      objectName: click(c.n, "k"),
    });
    s.addText(c.h, {
      x: x + 0.28, y: 2.72, w: 3.4, h: 0.42,
      fontFace: FONT.head, fontSize: 20, color: C.ink, margin: 0,
      objectName: click(c.n, "h"),
    });
    s.addText(c.t, {
      x: x + 0.28, y: 3.24, w: 3.4, h: 2.1,
      fontFace: FONT.body, fontSize: 15, color: C.body, margin: 0,
      objectName: click(c.n, "t"),
    });
  });

  s.addNotes("Open: India already has STWs, NLEM, CDSCO. The student gap is fail-closed answering, not another chatbot and not “we detected cancer.”");
}

// =====================================================================
// 03 OFFICIAL SOURCES
// =====================================================================
function slide03() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "02  ·  OFFICIAL INDIAN SOURCES", "03");
  title(s, "The sources exist. They are not a safe answering system.");
  footer(s);

  const stats = [
    { n: 2, num: "157", lab: "Standard Treatment\nWorkflows", sub: "ICMR + NHA + WHO  ·  NMC notice 15 Sep 2025" },
    { n: 3, num: "28", lab: "Specialties", sub: "One-page visual workflows, not textbook chapters" },
    { n: 4, num: "384", lab: "NLEM 2022 medicines", sub: "Launched 13 Sep 2022  ·  a PDF, not a live API" },
  ];
  stats.forEach((st, i) => {
    const x = MX + i * 4.08;
    card(s, x, 1.46, 3.92, 2.55, { n: st.n, bar: C.navy });
    s.addText(st.num, {
      x: x + 0.28, y: 1.62, w: 3.4, h: 0.72,
      fontFace: FONT.head, fontSize: 36, color: C.navy, margin: 0,
      objectName: click(st.n, "num"),
    });
    s.addText(st.lab, {
      x: x + 0.28, y: 2.36, w: 3.4, h: 0.7,
      fontFace: FONT.head, fontSize: 16, color: C.ink, margin: 0,
      objectName: click(st.n, "lab"),
    });
    s.addText(st.sub, {
      x: x + 0.28, y: 3.1, w: 3.4, h: 0.7,
      fontFace: FONT.body, fontSize: 12, color: C.muted, margin: 0,
      objectName: click(st.n, "sub"),
    });
  });

  card(s, MX, 4.2, 12.08, 2.55, { n: 5, bar: C.gold });
  s.addText("Also used as lookup tables", {
    x: MX + 0.32, y: 4.38, w: 11.4, h: 0.32,
    fontFace: FONT.body, fontSize: 12, color: C.gold, charSpacing: 1.1, margin: 0,
    objectName: click(5, "h"),
  });
  s.addText("CDSCO monthly Not of Standard Quality (NSQ) lists — product, batch, manufacturer, test failed. Absence from this month’s list is never rendered as “safe”.", {
    x: MX + 0.32, y: 4.76, w: 11.4, h: 0.7,
    fontFace: FONT.body, fontSize: 15, color: C.body, margin: 0,
    objectName: click(5, "t1"),
  });
  s.addText("A language model can still quote these loosely, invent a drug not in the retrieved row, or treat a convolutional score as a disease name. That is the problem this project bounds.", {
    x: MX + 0.32, y: 5.48, w: 11.4, h: 0.95,
    fontFace: FONT.body, fontSize: 15, color: C.body, margin: 0,
    objectName: click(5, "t2"),
  });

  s.addNotes("Cite NMC 15 Sep 2025; NLEM PIB 13 Sep 2022; CDSCO NSQ filter page. Do not say we created these documents.");
}

// =====================================================================
// 04 RESEARCH GAP
// =====================================================================
function slide04() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "03  ·  RESEARCH GAP", "04");
  title(s, "A bounded student gap — not a licence to practise medicine.");
  footer(s);

  const gaps = [
    { n: 2, t: "Flowchart loss", d: "ICMR STWs are diamonds and arrows. Text-chunk retrieval loses the decision." },
    { n: 3, t: "Wrong metric", d: "CheXpert AUROC and ISIC accuracy do not score invented drugs or out-of-scope answers." },
    { n: 4, t: "GEPA unused here", d: "GEPA is shown on math and code, not on an Indian STW abstention Pareto." },
    { n: 5, t: "ICL always talks", d: "Standard neighbours are answered items. Near-miss refusals are rarely first-class demonstrations." },
    { n: 6, t: "Agent swarm", d: "Unbounded “specialist doctors” are not evaluable in a B.Tech setting." },
  ];
  gaps.forEach((g, i) => {
    const y = 1.42 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: 12.08, h: 0.94,
      fill: { color: C.card },
      shadow: { type: "outer", color: "000000", blur: 7, offset: 1, angle: 135, opacity: 0.07 },
      objectName: click(g.n, "bg"),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: 0.08, h: 0.94, fill: { color: C.navy }, objectName: click(g.n, "bar"),
    });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: MX + 0.28, y: y + 0.22, w: 0.7, h: 0.5,
      fontFace: FONT.head, fontSize: 20, color: C.gold, margin: 0, valign: "middle",
      objectName: click(g.n, "num"),
    });
    s.addText(g.t, {
      x: MX + 1.1, y: y + 0.1, w: 10.6, h: 0.34,
      fontFace: FONT.head, fontSize: 16, color: C.ink, margin: 0,
      objectName: click(g.n, "t"),
    });
    s.addText(g.d, {
      x: MX + 1.1, y: y + 0.44, w: 10.6, h: 0.4,
      fontFace: FONT.body, fontSize: 14, color: C.body, margin: 0,
      objectName: click(g.n, "d"),
    });
  });

  s.addNotes("If asked “is this novel?”: imaging is the baseline; the enhancement is visual STW + refuse ICL + GEPA coverage vs ungrounded.");
}

// =====================================================================
// 05 PROPOSED SYSTEM
// =====================================================================
function slide05() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "04  ·  PROPOSED SYSTEM", "05");
  title(s, "Named tools only. Then a sentence an official span entails.");
  footer(s);

  const cols = [
    { n: 2, k: "Tools", h: "Frozen JSON functions", t: "Each specialist is a function with a schema. The host executes it. Extra tools later join the same contract — they do not become chatting agents." },
    { n: 3, k: "Router + writer", h: "Local open-weight LLM", t: "Qwen-class weights are loaded, not pretrained, not fine-tuned into a doctor. GEPA rewrites prompts offline, then is frozen." },
    { n: 4, k: "Verifier", h: "Fail-closed code", t: "Three card statuses only: grounded, insufficient, out_of_scope. A sentence must be entailed by an STW box, NLEM row, or CDSCO row." },
  ];
  cols.forEach((c, i) => {
    const x = MX + i * 4.08;
    card(s, x, 1.46, 3.92, 3.85, { n: c.n, bar: i === 2 ? C.sage : C.navy });
    s.addText(c.k.toUpperCase(), {
      x: x + 0.28, y: 1.64, w: 3.4, h: 0.28,
      fontFace: FONT.body, fontSize: 11, color: C.gold, charSpacing: 1.3, margin: 0,
      objectName: click(c.n, "k"),
    });
    s.addText(c.h, {
      x: x + 0.28, y: 2.0, w: 3.4, h: 0.7,
      fontFace: FONT.head, fontSize: 18, color: C.ink, margin: 0,
      objectName: click(c.n, "h"),
    });
    s.addText(c.t, {
      x: x + 0.28, y: 2.78, w: 3.4, h: 2.2,
      fontFace: FONT.body, fontSize: 14, color: C.body, margin: 0,
      objectName: click(c.n, "t"),
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y: 5.5, w: 12.08, h: 1.4,
    fill: { color: C.card },
    line: { color: C.gold, width: 1.25 },
    objectName: click(5, "band"),
  });
  s.addText("Product  ·  a watermarked answer card. Not a diagnosis. Not software as a medical device. Not a hospital HIS.", {
    x: MX + 0.36, y: 5.72, w: 11.4, h: 0.95,
    fontFace: FONT.body, fontSize: 16, color: C.navyMid, margin: 0, valign: "middle",
    objectName: click(5, "bandt"),
  });

  s.addNotes("If asked about more tools: the interface is extensible JSON; Phase-1 evaluation is on the catalogue we actually implement.");
}

// =====================================================================
// 06 CATALOGUE
// =====================================================================
function slide06() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "05  ·  PHASE-1 TOOL CATALOGUE", "06");
  title(s, "Closed names the model may emit. The host runs them.");
  footer(s);

  const head = [
    { text: "Name", options: { fill: { color: C.navy }, color: C.white, bold: true, align: "left", valign: "middle" } },
    { text: "Kind", options: { fill: { color: C.navy }, color: C.white, bold: true, align: "left", valign: "middle" } },
    { text: "What the host runs", options: { fill: { color: C.navy }, color: C.white, bold: true, align: "left", valign: "middle" } },
    { text: "JSON out", options: { fill: { color: C.navy }, color: C.white, bold: true, align: "left", valign: "middle" } },
  ];
  const rows = [
    ["cxr_tool", "Trained specialist", "Frozen CheXpert CNN (DenseNet-121 / EfficientNet)", "findings[], scores[], unreadable?"],
    ["skin_tool", "Trained specialist", "Frozen HAM10000 / ISIC net", "class, score, dataset"],
    ["document_tool", "Trained specialist", "OCR / KIE on pack or lab PDF", "batch / brand / analyte, unreadable?"],
    ["nlem_lookup", "Lookup", "NLEM 2022 table", "in list / not in list"],
    ["cdsco_lookup", "Lookup", "Dated NSQ snapshot", "match / not in list (not \u201Csafe\u201D)"],
    ["stw_retrieve", "Lookup", "ColPali-class on STW page images", "page id, box ids"],
    ["out_of_scope", "Refuse", "No specialist is run", "status = out_of_scope"],
  ].map((r, i) => {
    const bg = i % 2 === 0 ? C.card : C.pale;
    return r.map((cell) => ({
      text: cell,
      options: { fill: { color: bg }, color: C.ink, align: "left", valign: "middle" },
    }));
  });

  s.addTable([head, ...rows], {
    x: MX, y: 1.42, w: 12.08, h: 4.55,
    colW: [2.15, 2.35, 4.55, 3.03],
    border: [{ pt: 0 }, { pt: 0 }, { pt: 0 }, { pt: 0 }],
    fontFace: FONT.body,
    fontSize: 12,
    color: C.ink,
    align: "left",
    valign: "middle",
    objectName: click(2, "table"),
  });

  s.addText("Further tools, if added later, use the same four columns. They are not extra chatting doctors. Imaging nets are trained and frozen by the student. The large language model is not.", {
    x: MX, y: 6.08, w: 12.08, h: 0.85,
    fontFace: FONT.body, fontSize: 14, color: C.body, margin: 0,
    objectName: click(3, "note"),
  });

  s.addNotes("HAM10000 is ISIC 2018 Task 3 train. CheXpert is research / non-commercial / non-clinical. qXR already ships in India — we replicate a public baseline, not an NTEP product.");
}

// =====================================================================
// 07 WORKFLOW
// =====================================================================
function slide07() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "06  ·  SERVE-TIME WORKFLOW", "07");
  title(s, "Question in. One tool call. Official span. Then a card — or silence.");
  footer(s);

  const imgW = 10.7;
  const imgH = imgW * (980 / 2000);
  const imgX = (W - imgW) / 2;
  s.addImage({
    path: path.join(ASSETS, "fig4_1_workflow.png"),
    x: imgX, y: 1.38, w: imgW, h: imgH,
    objectName: click(2, "fig"),
  });


  s.addNotes("Walk left to right: retrieve → router emits a name → host runs the function → writer drafts only from spans + JSON → verifier.");
}

// =====================================================================
// 08 METHODOLOGY
// =====================================================================
function slide08() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "07  ·  METHODOLOGY", "08");
  title(s, "Replicate the tools. Then evolve the prompts. Do not mix the two.");
  footer(s);

  card(s, MX, 1.42, 5.88, 3.05, { n: 2, bar: C.navy });
  s.addText("BASELINE  ·  what we train", {
    x: MX + 0.28, y: 1.56, w: 5.4, h: 0.28,
    fontFace: FONT.body, fontSize: 11, color: C.gold, charSpacing: 1.1, margin: 0,
    objectName: click(2, "h"),
  });
  s.addText([
    { text: "CheXpert CXR net, patient-level splits, U-ones / U-zeros reported honestly against Irvin et al.", options: { bullet: true, breakLine: true } },
    { text: "HAM10000 / ISIC skin net, split by lesion_id.", options: { bullet: true, breakLine: true } },
    { text: "Document OCR/KIE; synthetic packs + self-collected OTC photos. No patient Rx.", options: { bullet: true } },
  ], {
    x: MX + 0.28, y: 1.95, w: 5.4, h: 2.25,
    fontFace: FONT.body, fontSize: 13, color: C.body, paraSpaceAfter: 6, margin: 0,
    objectName: click(2, "b"),
  });

  card(s, MX + 6.2, 1.42, 5.88, 3.05, { n: 3, bar: C.sage });
  s.addText("ENHANCEMENT  ·  what we freeze as text", {
    x: MX + 6.48, y: 1.56, w: 5.4, h: 0.28,
    fontFace: FONT.body, fontSize: 11, color: C.gold, charSpacing: 1.1, margin: 0,
    objectName: click(3, "h"),
  });
  s.addText([
    { text: "Visual STW retrieve (ColPali-class). Student box IDs on pages actually used.", options: { bullet: true, breakLine: true } },
    { text: "In-context demonstrations that include near-miss refusals.", options: { bullet: true, breakLine: true } },
    { text: "GEPA on train only. Best Pareto prompt is frozen. No genetic search per user.", options: { bullet: true } },
  ], {
    x: MX + 6.48, y: 1.95, w: 5.4, h: 2.25,
    fontFace: FONT.body, fontSize: 13, color: C.body, paraSpaceAfter: 6, margin: 0,
    objectName: click(3, "b"),
  });

  const pW = 9.6;
  const pH = pW * (520 / 2000);
  s.addImage({
    path: path.join(ASSETS, "fig4_3_pipeline.png"),
    x: (W - pW) / 2, y: 4.62, w: pW, h: pH,
    objectName: click(4, "fig"),
  });

  s.addNotes("If GEPA loses to a hand prompt, we write that. No SOTA claim unless earned on the official split.");
}

// =====================================================================
// 09 EVALUATION
// =====================================================================
function slide09() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "08  ·  EVALUATION", "09");
  title(s, "What will be measured. Nothing is claimed as a result today.");
  footer(s);

  const cells = [
    { n: 2, h: "Specialist replication", t: "CheXpert AUROC / F1 on the official split. ISIC accuracy / macro-F1, lesion-id splits. Document field-F1 and exact batch match." },
    { n: 3, h: "Product metrics", t: "Coverage. Ungrounded rate. Correct refuse. Coverage-versus-ungrounded Pareto. These are the enhancement." },
    { n: 4, h: "Ablations", t: "Hand prompt vs GEPA vs refusal-aware ICL vs visual STW. If an enhancement does not win, that is reported." },
    { n: 5, h: "Not reported", t: "Diagnostic accuracy vs radiologists. Lives saved. Invented percentages. “98% cancer.”" },
  ];
  cells.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MX + col * 6.2;
    const y = 1.42 + row * 2.55;
    card(s, x, y, 5.88, 2.38, { n: c.n, bar: i === 3 ? C.rust : C.navy });
    s.addText(c.h, {
      x: x + 0.28, y: y + 0.18, w: 5.35, h: 0.4,
      fontFace: FONT.head, fontSize: 16, color: C.ink, margin: 0,
      objectName: click(c.n, "h"),
    });
    s.addText(c.t, {
      x: x + 0.28, y: y + 0.64, w: 5.35, h: 1.5,
      fontFace: FONT.body, fontSize: 14, color: C.body, margin: 0,
      objectName: click(c.n, "t"),
    });
  });

  s.addNotes("Gold Q&A set does not exist as a download. STW box IDs must be labelled. Say that if asked “is the data ready?”");
}

// =====================================================================
// 10 CLOSE
// =====================================================================
function slide10() {
  const s = pres.addSlide();
  s.background = { color: C.cream };
  header(s, "09  ·  SCOPE AND CLOSE", "10");
  footer(s);

  s.addText("What we will do. What we will not claim.", {
    x: MX, y: 0.78, w: 12.05, h: 0.5,
    fontFace: FONT.head, fontSize: 26, color: C.ink, margin: 0,
    objectName: click(1, "title"),
  });

  card(s, MX, 1.42, 5.88, 3.35, { n: 2, bar: C.sage });
  s.addText("WILL", {
    x: MX + 0.32, y: 1.58, w: 5.3, h: 0.3,
    fontFace: FONT.body, fontSize: 12, color: C.gold, charSpacing: 1.6, margin: 0,
    objectName: click(2, "h"),
  });
  s.addText([
    { text: "Train and freeze CXR, skin, and document tools on public research sets.", options: { bullet: true, breakLine: true } },
    { text: "Register lookups over NLEM, CDSCO, and STW pages.", options: { bullet: true, breakLine: true } },
    { text: "Build a gold set that includes refusals.", options: { bullet: true, breakLine: true } },
    { text: "Evolve prompts with GEPA, freeze them, demo a watermarked card.", options: { bullet: true } },
  ], {
    x: MX + 0.32, y: 1.98, w: 5.3, h: 2.55,
    fontFace: FONT.body, fontSize: 14, color: C.body, paraSpaceAfter: 7, margin: 0,
    objectName: click(2, "b"),
  });

  card(s, MX + 6.2, 1.42, 5.88, 3.35, { n: 3, bar: C.rust });
  s.addText("WILL NOT", {
    x: MX + 6.52, y: 1.58, w: 5.3, h: 0.3,
    fontFace: FONT.body, fontSize: 12, color: C.gold, charSpacing: 1.6, margin: 0,
    objectName: click(3, "h"),
  });
  s.addText([
    { text: "Pretrain or doctor-fine-tune the large language model.", options: { bullet: true, breakLine: true } },
    { text: "Deploy in a live clinic or use real hospital charts without ethics.", options: { bullet: true, breakLine: true } },
    { text: "Auto-prescribe, auto-dial, or claim a reduction in disease burden.", options: { bullet: true, breakLine: true } },
    { text: "Report a number we have not measured.", options: { bullet: true } },
  ], {
    x: MX + 6.52, y: 1.98, w: 5.3, h: 2.55,
    fontFace: FONT.body, fontSize: 14, color: C.body, paraSpaceAfter: 7, margin: 0,
    objectName: click(3, "b"),
  });

  s.addText("Thank you.", {
    x: MX, y: 5.0, w: 12.05, h: 0.55,
    fontFace: FONT.head, fontSize: 28, color: C.navyMid, margin: 0,
    objectName: click(4, "ty"),
  });
  s.addText("Pranav Maheshwari  ·  GE-232023518  ·  Guide: Dr. Narayan Chaturvedi  ·  MP2026CSE344", {
    x: MX, y: 5.58, w: 12.05, h: 0.32,
    fontFace: FONT.body, fontSize: 14, color: C.body, margin: 0,
    objectName: click(4, "meta"),
  });
  s.addText("Questions.", {
    x: MX, y: 6.0, w: 12.05, h: 0.35,
    fontFace: FONT.body, fontSize: 16, italic: true, color: C.muted, margin: 0,
    objectName: click(5, "q"),
  });

  s.addNotes("Close on honesty. Hardware: laptop 16 GB; campus GPU for LLM serving and GEPA, not because DenseNet needs a B200.");
}

slide01();
slide02();
slide03();
slide04();
slide05();
slide06();
slide07();
slide08();
slide09();
slide10();

pres.writeFile({ fileName: OUT }).then(() => {
  console.log("Wrote", OUT);
});
