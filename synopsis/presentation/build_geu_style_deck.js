/**
 * Care Pathway — GEU Phase-1 evaluator deck
 * 12-slide CardioSense_AI.pptx structure; cream / gold / navy of our current deck.
 *
 * node synopsis/presentation/build_geu_style_deck.js
 * python synopsis/presentation/inject_animations.py <in> <out>
 */
const pptxgen = require("pptxgenjs");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaCogs,
  FaUniversity,
  FaShieldAlt,
  FaPills,
  FaCommentDots,
  FaProjectDiagram,
  FaSitemap,
  FaTools,
  FaVolumeMute,
  FaExclamationTriangle,
  FaLaptop,
  FaCode,
  FaPuzzlePiece,
  FaLock,
  FaSearch,
  FaLanguage,
  FaChartBar,
  FaIdCard,
  FaDatabase,
  FaListOl,
  FaClipboardList,
  FaRandom,
  FaCheckDouble,
  FaFlask,
  FaBookOpen,
  FaQuoteLeft,
} = require("react-icons/fa");

const ASSETS = path.resolve(__dirname, "../assets");
const OUT = path.resolve(__dirname, "../Phase1_Evaluator_Presentation.pptx");

const W = 13.333;
const H = 7.5;
const MX = 0.6;

const C = {
  navy: "16324F",
  gold: "B8954A",
  cream: "F7F4EE",
  card: "FFFCF7",
  ink: "1C1917",
  body: "3F3A36",
  muted: "6B6560",
  line: "D9D2C5",
  white: "FFFFFF",
  sage: "2F5D50",
  rust: "8B3A3A",
};

const FONT = { head: "Georgia", body: "Calibri" };

function click(n, tag) {
  return `click_${String(n).padStart(2, "0")}${tag ? "_" + tag : ""}`;
}

function shadow() {
  return { type: "outer", color: "000000", blur: 8, offset: 1, angle: 135, opacity: 0.07 };
}

async function iconData(Icon, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

function bg(s) {
  s.background = { color: C.cream };
}

function header(s, kicker, title, page, total) {
  s.addText(kicker, {
    x: MX, y: 0.28, w: 9.2, h: 0.28,
    fontFace: FONT.body, fontSize: 11, color: C.gold, charSpacing: 1.8, margin: 0,
    objectName: "static_sec",
  });
  s.addText(`${String(page).padStart(2, "0")}  /  ${String(total).padStart(2, "0")}`, {
    x: 10.4, y: 0.28, w: 2.33, h: 0.28,
    fontFace: FONT.body, fontSize: 11, color: C.muted, align: "right", margin: 0,
    objectName: "static_pg",
  });
  s.addShape(s._pres ? s._pres.shapes.RECTANGLE : "rect", {
    x: MX, y: 0.62, w: 12.13, h: 0.012, fill: { color: C.line },
    objectName: "static_rule",
  });
  s.addText(title, {
    x: MX, y: 0.72, w: 12.13, h: 0.58,
    fontFace: FONT.head, fontSize: 26, color: C.ink, margin: 0,
    objectName: click(1, "h1"),
  });
}

function footer(s) {
  s.addText("Graphic Era Deemed to be University  ·  B.Tech CSE Core  ·  Phase-1 Synopsis  ·  September 2026", {
    x: MX, y: 7.12, w: 12.13, h: 0.24,
    fontFace: FONT.body, fontSize: 11, color: C.muted, margin: 0,
    objectName: "static_ft",
  });
}

function card(s, pres, x, y, w, h, n, bar) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.card },
    shadow: shadow(),
    objectName: click(n, "bg"),
  });
  if (bar) {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.07, h,
      fill: { color: bar },
      objectName: click(n, "bar"),
    });
  }
}

function goldNum(s, pres, x, y, n, label) {
  s.addShape(pres.shapes.OVAL, {
    x, y, w: 0.38, h: 0.38,
    fill: { color: C.gold },
    objectName: click(n, "ov"),
  });
  s.addText(String(label), {
    x, y, w: 0.38, h: 0.38,
    fontFace: FONT.body, fontSize: 12, bold: true, color: C.white,
    align: "center", valign: "middle", margin: 0,
    objectName: click(n, "ovt"),
  });
}

function iconBadge(s, pres, x, y, size, data, n, fill) {
  s.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: fill || C.gold },
    objectName: click(n, "ov"),
  });
  const pad = size * 0.26;
  s.addImage({
    data,
    x: x + pad, y: y + pad, w: size - 2 * pad, h: size - 2 * pad,
    objectName: click(n, "ic"),
  });
}

async function build() {
  const I = {
    cogs: await iconData(FaCogs),
    uni: await iconData(FaUniversity),
    shield: await iconData(FaShieldAlt),
    pills: await iconData(FaPills),
    chat: await iconData(FaCommentDots),
    proj: await iconData(FaProjectDiagram),
    site: await iconData(FaSitemap),
    tools: await iconData(FaTools),
    mute: await iconData(FaVolumeMute),
    warn: await iconData(FaExclamationTriangle),
    laptop: await iconData(FaLaptop),
    code: await iconData(FaCode),
    puzzle: await iconData(FaPuzzlePiece),
    lock: await iconData(FaLock),
    search: await iconData(FaSearch),
    lang: await iconData(FaLanguage),
    chart: await iconData(FaChartBar),
    card: await iconData(FaIdCard),
    db: await iconData(FaDatabase),
    list: await iconData(FaListOl),
    clip: await iconData(FaClipboardList),
    rand: await iconData(FaRandom),
    check: await iconData(FaCheckDouble),
    flask: await iconData(FaFlask),
    book: await iconData(FaBookOpen),
    quote: await iconData(FaQuoteLeft),
  };

  const pres = new pptxgen();
  pres.defineLayout({ name: "WIDE_GEU", width: W, height: H });
  pres.layout = "WIDE_GEU";
  pres.title = "Care Pathway — Phase-1 Synopsis";
  pres.author = "Pranav Maheshwari";
  pres.subject = "GEU B.Tech CSE Core Major Project";

  // Patch header() to use this pres for the rule shape
  function rule(s, y) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: 12.13, h: 0.012, fill: { color: C.line },
      objectName: "static_rule",
    });
  }

  function slideHead(s, kicker, title, page) {
    s.addText(kicker, {
      x: MX, y: 0.28, w: 9.2, h: 0.28,
      fontFace: FONT.body, fontSize: 11, color: C.gold, charSpacing: 1.8, margin: 0,
      objectName: "static_sec",
    });
    s.addText(`${String(page).padStart(2, "0")}  /  12`, {
      x: 10.4, y: 0.28, w: 2.33, h: 0.28,
      fontFace: FONT.body, fontSize: 11, color: C.muted, align: "right", margin: 0,
      objectName: "static_pg",
    });
    rule(s, 0.62);
    s.addText(title, {
      x: MX, y: 0.72, w: 12.13, h: 0.55,
      fontFace: FONT.head, fontSize: 26, color: C.ink, margin: 0,
      objectName: click(1, "h1"),
    });
  }

  // =====================================================================
  // 01 TITLE  — cream GEU branding, CardioSense short-name composition
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);

    s.addImage({
      path: path.join(ASSETS, "geu_logo.png"),
      x: MX, y: 0.38, w: 0.72, h: 0.57,
      objectName: "static_logo",
    });
    s.addText("GRAPHIC ERA DEEMED TO BE UNIVERSITY, DEHRADUN", {
      x: 1.48, y: 0.40, w: 11.2, h: 0.26,
      fontFace: FONT.body, fontSize: 13, color: C.navy, charSpacing: 1.4, margin: 0,
      objectName: click(1, "uni"),
    });
    s.addText("Department of Computer Science & Engineering  ·  B.Tech CSE Core", {
      x: 1.48, y: 0.68, w: 11.2, h: 0.24,
      fontFace: FONT.body, fontSize: 14, color: C.muted, margin: 0,
      objectName: click(1, "dept"),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y: 1.12, w: 12.13, h: 0.012, fill: { color: C.gold },
      objectName: click(1, "ln"),
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: MX, y: 1.38, w: 3.55, h: 0.34, rectRadius: 0.04,
      fill: { color: C.card }, line: { color: C.gold, width: 1.15 },
      objectName: click(2, "chipbg"),
    });
    s.addText("PHASE-1 MAJOR PROJECT SYNOPSIS", {
      x: MX, y: 1.38, w: 3.55, h: 0.34,
      fontFace: FONT.body, fontSize: 10, color: C.navy, align: "center", valign: "middle",
      charSpacing: 1.1, margin: 0, objectName: click(2, "chip"),
    });

    s.addText("Care Pathway", {
      x: MX, y: 1.88, w: 12.13, h: 0.85,
      fontFace: FONT.head, fontSize: 44, color: C.navy, margin: 0,
      objectName: click(3, "title"),
    });
    s.addText("Guideline-Grounded Health Assistant with Specialist Tools and Fail-Closed Answering.", {
      x: MX, y: 2.78, w: 12.13, h: 0.42,
      fontFace: FONT.body, fontSize: 18, color: C.body, margin: 0,
      objectName: click(4, "sub"),
    });
    s.addText("A replication and prompt-evolution study. Not a diagnosis. The large language model is loaded, not trained.", {
      x: MX, y: 3.26, w: 12.13, h: 0.36,
      fontFace: FONT.body, fontSize: 14, italic: true, color: C.muted, margin: 0,
      objectName: click(5, "disc"),
    });

    const meta = [
      ["Student", "Pranav Maheshwari  ·  GE-232023518"],
      ["Guide", "Dr. Narayan Chaturvedi  ·  Associate Professor"],
      ["Team ID", "MP2026CSE344"],
    ];
    meta.forEach((m, i) => {
      const x = MX + i * 4.15;
      s.addText(m[0], {
        x, y: 4.85, w: 3.95, h: 0.28,
        fontFace: FONT.body, fontSize: 12, color: C.gold, charSpacing: 1.2, margin: 0,
        objectName: click(6, "ml" + i),
      });
      s.addText(m[1], {
        x, y: 5.16, w: 3.95, h: 0.40,
        fontFace: FONT.body, fontSize: 15, color: C.ink, margin: 0,
        objectName: click(6, "mv" + i),
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y: 5.78, w: 12.13, h: 0.012, fill: { color: C.gold },
      objectName: click(6, "ln2"),
    });
    s.addText("Evaluators  ·  September 2026  ·  12 slides  ·  Dehradun", {
      x: MX, y: 5.96, w: 12.13, h: 0.32,
      fontFace: FONT.body, fontSize: 14, color: C.navy, margin: 0,
      objectName: click(6, "ev"),
    });

    footer(s);
  }

  // =====================================================================
  // 02 ABSTRACT
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "02  ·  ABSTRACT", "What is Care Pathway?", 2);
    footer(s);

    card(s, pres, MX, 1.42, 12.13, 1.62, 2, C.gold);
    s.addText("Care Pathway is a fail-closed answering system. A local language model may call named specialist tools and may write a sentence only when an official Indian span — an ICMR STW box, an NLEM row, or a CDSCO NSQ row — entails it. Otherwise the card is insufficient or out_of_scope. It is not a doctor, not a hospital HIS, and not software as a medical device.", {
      x: MX + 0.32, y: 1.54, w: 11.5, h: 1.38,
      fontFace: FONT.body, fontSize: 15, color: C.body, valign: "top", margin: 0,
      objectName: click(2, "p"),
    });

    const cols = [
      { ic: I.cogs, t: "Named tool calls", d: "Frozen JSON functions. The host runs CXR, skin, document, and lookups. Extra tools later join the same contract." },
      { ic: I.uni, t: "Official Indian pages", d: "157 ICMR STWs across 28 specialties (NMC notice, 15 Sep 2025), 384 NLEM medicines (2022), monthly CDSCO NSQ tables." },
      { ic: I.shield, t: "Fail-closed card", d: "Grounded, insufficient, or out_of_scope. Watermark: not a diagnosis. GEPA is offline only." },
    ];
    cols.forEach((c, i) => {
      const x = MX + i * 4.15;
      card(s, pres, x, 3.22, 3.95, 2.95, 3 + i, C.navy);
      iconBadge(s, pres, x + 0.28, 3.42, 0.58, c.ic, 3 + i, C.gold);
      s.addText(c.t, {
        x: x + 0.28, y: 4.12, w: 3.4, h: 0.42,
        fontFace: FONT.head, fontSize: 16, color: C.ink, margin: 0,
        objectName: click(3 + i, "t"),
      });
      s.addText(c.d, {
        x: x + 0.28, y: 4.56, w: 3.4, h: 1.42,
        fontFace: FONT.body, fontSize: 13, color: C.body, valign: "top", margin: 0,
        objectName: click(3 + i, "d"),
      });
    });
  }

  // =====================================================================
  // 03 INTRODUCTION
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "03  ·  INTRODUCTION", "Why Care Pathway?", 3);
    footer(s);

    s.addText("People already ask language models for health advice. India already publishes STWs, NLEM, and CDSCO NSQ lists. The student-sized gap is ungrounded answering — invented drugs, skipped official pages, and talk when evidence is missing — not another chatbot and not “we detected cancer.”", {
      x: MX, y: 1.38, w: 12.13, h: 0.88,
      fontFace: FONT.body, fontSize: 15, color: C.body, margin: 0,
      objectName: click(2, "lead"),
    });

    const items = [
      [I.pills, "Invention", "A drug, dose, or referral that does not appear in any retrieved official span."],
      [I.chat, "Over-talking", "Out-of-scope items are answered because prompts were built only from answered neighbours."],
      [I.proj, "Wrong architecture", "Chatting specialist “agents” that order tests in a loop are not evaluable and are not a doctor."],
      [I.site, "Flowchart STWs", "ICMR pages are one-page diamonds and arrows. Text-chunk retrieval loses the decision."],
      [I.tools, "Tools, not agents", "Specialists return JSON. The host executes. The LLM names the function and then stays inside spans."],
      [I.mute, "Silence is a result", "insufficient and out_of_scope are first-class. The product is a watermarked card."],
    ];
    items.forEach((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MX + col * 6.35;
      const y = 2.42 + row * 1.48;
      iconBadge(s, pres, x, y + 0.08, 0.52, it[0], 3 + i, C.gold);
      s.addText(it[1], {
        x: x + 0.68, y: y, w: 5.4, h: 0.32,
        fontFace: FONT.head, fontSize: 15, color: C.ink, margin: 0,
        objectName: click(3 + i, "t"),
      });
      s.addText(it[2], {
        x: x + 0.68, y: y + 0.34, w: 5.4, h: 0.92,
        fontFace: FONT.body, fontSize: 13, color: C.body, valign: "top", margin: 0,
        objectName: click(3 + i, "d"),
      });
    });
  }

  // =====================================================================
  // 04 LITERATURE
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "04  ·  LITERATURE REVIEW", "Where Care Pathway fits", 4);
    footer(s);

    iconBadge(s, pres, MX, 1.42, 0.48, I.quote, 2, C.navy);
    s.addText("Official Indian sources, public imaging baselines, visual page retrieval, and prompt evolution already exist separately. They have not been scored together on coverage versus ungrounded rate with Indian STW verifier text.", {
      x: MX + 0.64, y: 1.38, w: 11.5, h: 0.78,
      fontFace: FONT.body, fontSize: 15, color: C.body, margin: 0,
      objectName: click(2, "lead"),
    });

    const pills = [
      { t: "ICMR STW  157 / 28", d: "NMC public notice, 15 Sep 2025" },
      { t: "NLEM 2022  ·  384", d: "Launched 13 Sep 2022  ·  a PDF" },
      { t: "CheXpert  ·  HAM10000", d: "Replicated as frozen tools" },
      { t: "GEPA  ·  ColPali", d: "Prompts offline  ·  page images" },
    ];
    pills.forEach((p, i) => {
      const x = MX + i * 3.12;
      card(s, pres, x, 2.32, 2.98, 1.48, 3 + i, C.navy);
      s.addText(p.t, {
        x: x + 0.22, y: 2.48, w: 2.58, h: 0.62,
        fontFace: FONT.head, fontSize: 14, color: C.ink, margin: 0,
        objectName: click(3 + i, "t"),
      });
      s.addText(p.d, {
        x: x + 0.22, y: 3.12, w: 2.58, h: 0.48,
        fontFace: FONT.body, fontSize: 12, color: C.muted, margin: 0,
        objectName: click(3 + i, "d"),
      });
    });

    card(s, pres, MX, 4.02, 12.13, 1.95, 7, C.gold);
    s.addText("The gap Care Pathway closes", {
      x: MX + 0.32, y: 4.16, w: 11.5, h: 0.36,
      fontFace: FONT.head, fontSize: 16, color: C.navy, valign: "top", margin: 0,
      objectName: click(7, "t"),
    });
    s.addText("Imaging papers report AUROC, not invented drugs. Clinical-dialogue systems (including AMIE, Nature vol. 642, Jun 2025) already converse at industrial scale. GEPA (ICLR 2026 oral) evolves prompts on math and code, not Indian STW abstention. Care Pathway wraps frozen specialists as an extensible JSON catalogue, retrieves STW page images, and measures fail-closed answering.", {
      x: MX + 0.32, y: 4.54, w: 11.5, h: 1.28,
      fontFace: FONT.body, fontSize: 14, color: C.body, valign: "top", margin: 0,
      objectName: click(7, "d"),
    });
  }

  // =====================================================================
  // 05 PROBLEM & OBJECTIVES
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "05  ·  PROBLEM STATEMENT & OBJECTIVES", "Problem statement & objectives", 5);
    footer(s);

    card(s, pres, MX, 1.40, 4.50, 5.42, 2, C.gold);
    iconBadge(s, pres, MX + 0.28, 1.58, 0.58, I.warn, 2, C.gold);
    s.addText("Problem statement", {
      x: MX + 1.02, y: 1.62, w: 3.2, h: 0.50,
      fontFace: FONT.head, fontSize: 16, color: C.ink, valign: "middle", margin: 0,
      objectName: click(2, "t"),
    });
    s.addText("Convolutional baselines for CXR and skin exist on public sets, and large models can hold a health chat. Those pieces are not a grounded Indian answering system.", {
      x: MX + 0.28, y: 2.32, w: 3.95, h: 1.70,
      fontFace: FONT.body, fontSize: 14, color: C.body, valign: "top", margin: 0,
      objectName: click(2, "d1"),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX + 0.28, y: 4.12, w: 3.95, h: 0.012, fill: { color: C.line },
      objectName: click(2, "ln"),
    });
    s.addText("Need: replicate specialists as frozen JSON tools, then test whether a local LLM that may only call them and pass a fail-closed verifier can raise coverage at a controlled ungrounded rate — without claiming diagnostic performance.", {
      x: MX + 0.28, y: 4.28, w: 3.95, h: 2.35,
      fontFace: FONT.body, fontSize: 14, color: C.body, valign: "top", margin: 0,
      objectName: click(2, "d2"),
    });

    const objs = [
      "Treat ICMR STW, NLEM 2022, and CDSCO NSQ as retrieval, not generated prose",
      "Specify an extensible JSON tool-calling interface the LLM may emit",
      "Replicate a CheXpert CXR baseline and freeze it as cxr_tool",
      "Replicate HAM10000 / ISIC skin as skin_tool (lesion-id splits)",
      "Implement document OCR/KIE plus NLEM and CDSCO lookups",
      "Retrieve STW page images (ColPali-class) and label box IDs used",
      "Build a gold set with Hinglish, near-miss refusals, and ICL refuse demos",
      "Evolve prompts with GEPA offline; freeze; watermarked chat card",
    ];
    objs.forEach((t, i) => {
      const y = 1.40 + i * 0.68;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 5.32, y, w: 7.41, h: 0.60,
        fill: { color: C.card },
        shadow: shadow(),
        objectName: click(3 + i, "bg"),
      });
      goldNum(s, pres, 5.46, y + 0.11, 3 + i, i + 1);
      s.addText(t, {
        x: 6.00, y, w: 6.55, h: 0.60,
        fontFace: FONT.body, fontSize: 13, color: C.ink, valign: "middle", margin: 0,
        objectName: click(3 + i, "t"),
      });
    });
  }

  // =====================================================================
  // 06 METHODOLOGY 1
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "06  ·  PROPOSED METHODOLOGY", "How Care Pathway works — Part 1", 6);
    footer(s);

    const steps = [
      { ic: I.db, t: "Official sources", d: "Index ICMR STW page images, NLEM 2022 (384 medicines), and dated CDSCO NSQ snapshots. Absence from NSQ is never rendered as “safe”." },
      { ic: I.lock, t: "Train and freeze specialists", d: "CheXpert CXR (DenseNet-121 / EfficientNet), patient-level splits, U-ones/U-zeros. HAM10000/ISIC skin, split by lesion_id. Document OCR/KIE on synthetic packs and self-collected OTC photos — no patient prescriptions." },
      { ic: I.list, t: "Register the catalogue", d: "cxr_tool, skin_tool, document_tool, nlem_lookup, cdsco_lookup, stw_retrieve, out_of_scope. The model may emit only these names. The host executes." },
      { ic: I.clip, t: "Gold questions", d: "Student-labelled items with gold_route, gold_status, gold_span_id. Include Hinglish and near-miss refusals. This set is not a public download." },
    ];
    steps.forEach((st, i) => {
      const y = 1.40 + i * 1.38;
      card(s, pres, MX, y, 12.13, 1.26, 2 + i, C.navy);
      goldNum(s, pres, MX + 0.22, y + 0.44, 2 + i, i + 1);
      s.addText(st.t, {
        x: MX + 0.78, y: y + 0.12, w: 10.95, h: 0.32,
        fontFace: FONT.head, fontSize: 16, color: C.ink, margin: 0,
        objectName: click(2 + i, "t"),
      });
      s.addText(st.d, {
        x: MX + 0.78, y: y + 0.46, w: 10.95, h: 0.70,
        fontFace: FONT.body, fontSize: 13, color: C.body, valign: "top", margin: 0,
        objectName: click(2 + i, "d"),
      });
    });
  }

  // =====================================================================
  // 07 METHODOLOGY 2
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "07  ·  PROPOSED METHODOLOGY", "How Care Pathway works — Part 2", 7);
    footer(s);

    const steps = [
      { t: "Router and answer prompts", d: "Same local Qwen-class weights, two frozen prompts. Router emits a tool call or out_of_scope. Answer drafts only from retrieved spans plus tool JSON — or stays silent. Demonstrations include near-miss refusals." },
      { t: "Fail-closed verifier", d: "Python in the API, not a fourth net. Empty JSON, unreadable input, missing span, or a clinical sentence on an out-of-scope item fails. Tool disagreement: one extra look, then insufficient. Card: grounded / insufficient / out_of_scope." },
      { t: "GEPA, offline only", d: "On the train split, GEPA (Agrawal et al., ICLR 2026 oral) mutates prompt text from traces and natural-language feedback (e.g. “cited a drug not in the NLEM span”). Specialist weights are never mutated. The chosen Pareto prompt is frozen. No genetic search per live user." },
    ];
    steps.forEach((st, i) => {
      const y = 1.40 + i * 1.52;
      card(s, pres, MX, y, 12.13, 1.40, 2 + i, i === 2 ? C.sage : C.navy);
      goldNum(s, pres, MX + 0.22, y + 0.50, 2 + i, i + 5);
      s.addText(st.t, {
        x: MX + 0.78, y: y + 0.12, w: 10.95, h: 0.32,
        fontFace: FONT.head, fontSize: 16, color: C.ink, margin: 0,
        objectName: click(2 + i, "t"),
      });
      s.addText(st.d, {
        x: MX + 0.78, y: y + 0.48, w: 10.95, h: 0.82,
        fontFace: FONT.body, fontSize: 13, color: C.body, valign: "top", margin: 0,
        objectName: click(2 + i, "d"),
      });
    });

    s.addText("No improved numerical result is claimed in this synopsis. Imaging metrics will be reported against the source papers after experiments.", {
      x: MX, y: 6.10, w: 12.13, h: 0.70,
      fontFace: FONT.body, fontSize: 13, italic: true, color: C.muted, margin: 0,
      objectName: click(5, "note"),
    });
  }

  // =====================================================================
  // 08 ARCHITECTURE
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "08  ·  SYSTEM ARCHITECTURE", "End-to-end serve-time flow", 8);
    footer(s);

    const boxW = 2.14;
    const stepX = 2.54;
    const nodes = [
      "Question + file",
      "Retrieve official pages",
      "Router LLM",
      "Host runs tool",
      "Answer LLM",
    ];
    nodes.forEach((label, i) => {
      const x = MX + i * stepX;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.42, w: boxW, h: 0.68, rectRadius: 0.05,
        fill: { color: C.navy },
        objectName: click(2, "n" + i),
      });
      s.addText(label, {
        x, y: 1.42, w: boxW, h: 0.68,
        fontFace: FONT.body, fontSize: 12, color: C.white, align: "center", valign: "middle", margin: 0,
        objectName: click(2, "nt" + i),
      });
      if (i < nodes.length - 1) {
        s.addShape(pres.shapes.RIGHT_ARROW, {
          x: x + boxW + 0.08, y: 1.63, w: 0.24, h: 0.24,
          fill: { color: C.gold },
          objectName: click(2, "a" + i),
        });
      }
    });

    s.addText("SPECIALIST CATALOGUE  ·  HOST EXECUTION", {
      x: MX, y: 2.26, w: 12.13, h: 0.26,
      fontFace: FONT.body, fontSize: 11, color: C.gold, charSpacing: 1.2, margin: 0,
      objectName: click(3, "lab"),
    });

    const tools = [
      ["cxr_tool", "CheXpert CNN"],
      ["skin_tool", "HAM10000 / ISIC"],
      ["document_tool", "OCR / KIE"],
      ["nlem_lookup", "NLEM 2022"],
      ["cdsco_lookup", "NSQ snapshot"],
      ["stw_retrieve", "ColPali pages"],
      ["out_of_scope", "Refuse"],
    ];
    tools.forEach((t, i) => {
      const x = MX + i * 1.76;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.58, w: 1.66, h: 0.92,
        fill: { color: C.card },
        line: { color: C.line, width: 1 },
        objectName: click(3, "tb" + i),
      });
      s.addText(t[0], {
        x, y: 2.64, w: 1.66, h: 0.40,
        fontFace: FONT.body, fontSize: 10, bold: true, color: C.navy, align: "center", margin: 0,
        objectName: click(3, "tt" + i),
      });
      s.addText(t[1], {
        x, y: 3.04, w: 1.66, h: 0.36,
        fontFace: FONT.body, fontSize: 10, color: C.muted, align: "center", margin: 0,
        objectName: click(3, "td" + i),
      });
    });

    const outs = [
      { bar: C.sage, t: "Grounded", d: "Sentence entailed by an STW box, NLEM row, or CDSCO row plus tool JSON." },
      { bar: C.navy, t: "Insufficient", d: "Unreadable, missing span, or tools disagree after one extra look." },
      { bar: C.rust, t: "Out of scope", d: "No specialist is run. No clinical sentence is written." },
    ];
    outs.forEach((o, i) => {
      const x = MX + i * 4.15;
      card(s, pres, x, 3.70, 3.95, 1.52, 4, o.bar);
      s.addText(o.t, {
        x: x + 0.28, y: 3.82, w: 3.45, h: 0.34,
        fontFace: FONT.head, fontSize: 16, color: C.ink, margin: 0,
        objectName: click(4, "ot" + i),
      });
      s.addText(o.d, {
        x: x + 0.28, y: 4.18, w: 3.45, h: 0.90,
        fontFace: FONT.body, fontSize: 13, color: C.body, valign: "top", margin: 0,
        objectName: click(4, "od" + i),
      });
    });

    s.addText("Verifier is code in FastAPI. GEPA does not run on this path. Watermark on every card: not a diagnosis.", {
      x: MX, y: 5.42, w: 12.13, h: 0.90,
      fontFace: FONT.body, fontSize: 13, italic: true, color: C.muted, margin: 0,
      objectName: click(5, "note"),
    });
  }

  // =====================================================================
  // 09 REQUIREMENTS
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "09  ·  REQUIREMENTS", "Hardware & software requirements", 9);
    footer(s);

    card(s, pres, MX, 1.42, 5.85, 5.40, 2, C.navy);
    iconBadge(s, pres, MX + 0.28, 1.60, 0.58, I.laptop, 2, C.gold);
    s.addText("Hardware", {
      x: MX + 1.02, y: 1.64, w: 4.4, h: 0.50,
      fontFace: FONT.head, fontSize: 18, color: C.ink, valign: "middle", margin: 0,
      objectName: click(2, "t"),
    });
    const hw = [
      "Laptop with 16 GB RAM or higher for development",
      "SSD for CheXpert-small, HAM10000, STW rasters, snapshots",
      "Campus NVIDIA GPU (B200 or equivalent) for LLM serving and GEPA rollouts",
      "A 7B model and fewer GEPA steps remain valid if the large GPU is busy",
      "DenseNet-121 on CheXpert-small does not itself require a B200",
    ];
    hw.forEach((t, i) => {
      s.addShape(pres.shapes.OVAL, {
        x: MX + 0.32, y: 2.42 + i * 0.80, w: 0.14, h: 0.14, fill: { color: C.gold },
        objectName: click(2, "d" + i),
      });
      s.addText(t, {
        x: MX + 0.58, y: 2.28 + i * 0.80, w: 4.95, h: 0.70,
        fontFace: FONT.body, fontSize: 13, color: C.body, valign: "top", margin: 0,
        objectName: click(2, "h" + i),
      });
    });

    card(s, pres, 6.70, 1.42, 6.03, 5.40, 3, C.gold);
    iconBadge(s, pres, 6.98, 1.60, 0.58, I.code, 3, C.gold);
    s.addText("Software", {
      x: 7.72, y: 1.64, w: 4.7, h: 0.50,
      fontFace: FONT.head, fontSize: 18, color: C.ink, valign: "middle", margin: 0,
      objectName: click(3, "t"),
    });
    const sw = [
      ["Language / DL", "Python, PyTorch, Hugging Face, timm"],
      ["Specialists", "DenseNet / EfficientNet; Donut / LayoutLMv3 / PaddleOCR"],
      ["Retrieval", "ColPali or ColQwen class; FAISS / Qdrant"],
      ["LLM + GEPA", "Qwen-class via vLLM (optional); DSPy + dspy.GEPA"],
      ["Serve / UI", "FastAPI, HTML/JS or React"],
      ["Tools", "VS Code, Git"],
    ];
    sw.forEach((row, i) => {
      const y = 2.38 + i * 0.68;
      if (i > 0) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: 6.98, y: y - 0.06, w: 5.50, h: 0.01, fill: { color: C.line },
          objectName: click(3, "ln" + i),
        });
      }
      s.addText(row[0], {
        x: 6.98, y, w: 1.85, h: 0.55,
        fontFace: FONT.body, fontSize: 12, bold: true, color: C.navy, valign: "middle", margin: 0,
        objectName: click(3, "a" + i),
      });
      s.addText(row[1], {
        x: 8.88, y, w: 3.55, h: 0.55,
        fontFace: FONT.body, fontSize: 12, color: C.body, valign: "middle", margin: 0,
        objectName: click(3, "b" + i),
      });
    });
  }

  // =====================================================================
  // 10 OUTCOMES
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "10  ·  EXPECTED OUTCOMES", "What the project will deliver", 10);
    footer(s);

    const cells = [
      [I.puzzle, "JSON catalogue", "An extensible tool interface with the Phase-1 set actually implemented, plus a documented path to register further tools."],
      [I.lock, "Frozen specialists", "CXR and skin tools with honest baseline numbers versus CheXpert and HAM10000/ISIC papers — no unearned SOTA."],
      [I.search, "Lookups + STW", "Document tool, dated NLEM/CDSCO, visual STW retrieve, student box IDs on pages used."],
      [I.lang, "Gold + refusals", "A labelled question set including grounded, insufficient, and out-of-scope items, with Hinglish near-misses."],
      [I.chart, "GEPA ablation", "Hand prompt vs GEPA vs refusal-aware ICL vs visual STW, and a coverage-versus-ungrounded Pareto. If GEPA loses, that is reported."],
      [I.card, "Watermarked demo", "A chat card. Not a diagnosis. No number we have not measured."],
    ];
    cells.forEach((c, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = MX + col * 4.15;
      const y = 1.42 + row * 2.48;
      card(s, pres, x, y, 3.95, 2.32, 2 + i, C.navy);
      iconBadge(s, pres, x + 0.22, y + 0.20, 0.50, c[0], 2 + i, C.gold);
      s.addText(c[1], {
        x: x + 0.84, y: y + 0.22, w: 2.90, h: 0.48,
        fontFace: FONT.head, fontSize: 15, color: C.ink, valign: "middle", margin: 0,
        objectName: click(2 + i, "t"),
      });
      s.addText(c[2], {
        x: x + 0.22, y: y + 0.82, w: 3.50, h: 1.42,
        fontFace: FONT.body, fontSize: 13, color: C.body, valign: "top", margin: 0,
        objectName: click(2 + i, "d"),
      });
    });
  }

  // =====================================================================
  // 11 CONCLUSION
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "11  ·  CONCLUSION", "Beyond another detection model", 11);
    footer(s);

    const pts = [
      "Official Indian workflows, essential-medicine lists, and quality-alert tables already exist. Public imaging sets already support honest tool replication.",
      "Care Pathway puts those pieces behind an extensible tool-calling interface. A local language model may call only those functions and may not write a sentence an official span does not entail.",
      "The contribution is fail-closed answering: visual STW retrieval, refusal demonstrations, and offline GEPA scored on coverage versus ungrounded rate — not a new CXR architecture and not a live clinic.",
      "Specialists are trained and frozen by the student. The large language model is loaded, not trained. Further tools join as JSON functions, not as extra chatting doctors.",
    ];
    pts.forEach((t, i) => {
      goldNum(s, pres, MX, 1.48 + i * 1.05, 2 + i, i + 1);
      s.addText(t, {
        x: MX + 0.56, y: 1.40 + i * 1.05, w: 11.55, h: 0.95,
        fontFace: FONT.body, fontSize: 15, color: C.body, margin: 0,
        objectName: click(2 + i, "t"),
      });
    });

    card(s, pres, MX, 5.68, 12.13, 1.12, 6, C.gold);
    s.addText("Care Pathway — only what the official page states; otherwise the card stays closed. Not a diagnosis.", {
      x: MX + 0.32, y: 5.68, w: 11.50, h: 1.12,
      fontFace: FONT.head, fontSize: 16, color: C.navy, valign: "middle", margin: 0,
      objectName: click(6, "tag"),
    });
  }

  // =====================================================================
  // 12 REFERENCES + THANK YOU
  // =====================================================================
  {
    const s = pres.addSlide();
    bg(s);
    slideHead(s, "12  ·  REFERENCES", "Primary sources cited in the synopsis", 12);

    const refs = [
      ["1", "ICMR / NHA / WHO STWs", "157 workflows, 28 specialties — NMC public notice, 15 September 2025. icmr.gov.in/standard-treatment-workflows-stws"],
      ["2", "NLEM 2022  ·  CDSCO NSQ", "384 essential medicines, launched 13 Sep 2022. Monthly Not of Standard Quality lists (no bulk API)."],
      ["3", "CheXpert  ·  HAM10000", "Irvin et al., AAAI 2019 (224,316 films). Tschandl et al., Sci. Data 2018 (10,015 images, CC BY-NC)."],
      ["4", "GEPA  ·  ColPali  ·  AMIE", "Agrawal et al., arXiv:2507.19457, ICLR 2026 oral. Faysse et al., ICLR 2025. Tu et al., Nature 642:442–450, Jun 2025."],
    ];
    refs.forEach((r, i) => {
      const y = 1.40 + i * 1.02;
      card(s, pres, MX, y, 12.13, 0.92, 2 + i, C.navy);
      goldNum(s, pres, MX + 0.20, y + 0.27, 2 + i, r[0]);
      s.addText(r[1], {
        x: MX + 0.74, y: y + 0.08, w: 11.0, h: 0.32,
        fontFace: FONT.head, fontSize: 14, color: C.ink, margin: 0,
        objectName: click(2 + i, "t"),
      });
      s.addText(r[2], {
        x: MX + 0.74, y: y + 0.42, w: 11.0, h: 0.42,
        fontFace: FONT.body, fontSize: 13, color: C.body, margin: 0,
        objectName: click(2 + i, "d"),
      });
    });

    s.addText("Thank you.", {
      x: MX, y: 5.58, w: 12.13, h: 0.42,
      fontFace: FONT.head, fontSize: 22, color: C.navy, margin: 0,
      objectName: click(6, "ty"),
    });
    s.addText("Pranav Maheshwari  ·  GE-232023518  ·  Guide: Dr. Narayan Chaturvedi  ·  MP2026CSE344", {
      x: MX, y: 6.02, w: 12.13, h: 0.32,
      fontFace: FONT.body, fontSize: 14, color: C.ink, margin: 0,
      objectName: click(6, "who"),
    });
    s.addText("Questions.  Full IEEE list is in the Phase-1 synopsis. No result in this deck is an experimental number of ours.", {
      x: MX, y: 6.38, w: 12.13, h: 0.42,
      fontFace: FONT.body, fontSize: 13, italic: true, color: C.muted, margin: 0,
      objectName: click(6, "q"),
    });
    footer(s);
  }

  await pres.writeFile({ fileName: OUT });
  console.log("Wrote", OUT);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
