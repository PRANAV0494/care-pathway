/**
 * GEU Phase-1 Major Project Synopsis
 * Guideline-grounded health assistant with an extensible specialist tool-calling interface.
 *
 * From Major_Project folder:
 *   node synopsis/generate_health_synopsis.js
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, LevelFormat, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak, HeightRule,
} = require("docx");

const cover = require("./COVER_FIELDS_health");

const ROOT = path.resolve(__dirname);
const ASSETS = path.join(ROOT, "assets");
const OUT_DOCX = path.join(ROOT, "Guideline_Grounded_Health_Assistant_GEU_Phase1_Synopsis.docx");

const TITLE_SHORT = "Care Pathway";
const TITLE_LINE =
  "Guideline-Grounded Health Assistant with Specialist Tools and Fail-Closed Answering";
const TITLE_FULL = `${TITLE_SHORT}: ${TITLE_LINE}`;
const TITLE_CAPS = TITLE_FULL.toUpperCase();

const FONT = "Times New Roman";
const A4 = { width: 11906, height: 16838 };
const BODY_W = 8666; // A4 minus left 1.25" and right 1"
const COVER_W = 10466;

const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: thin, bottom: thin, left: thin, right: thin };

function run(text, o = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: o.size || 24,
    bold: !!o.bold,
    italics: !!o.italics,
    color: o.color || "000000",
  });
}

function para(text, o = {}) {
  return new Paragraph({
    heading: o.heading,
    alignment: o.align || AlignmentType.JUSTIFIED,
    spacing: o.spacing || { after: 200, line: 360 },
    indent: o.indent,
    pageBreakBefore: o.pageBreakBefore,
    numbering: o.numbering,
    children: o.children || [run(text, o)],
  });
}

function center(text, o = {}) {
  return para(text, { ...o, align: AlignmentType.CENTER });
}

function body(text) {
  return para(text, { size: 24, spacing: { after: 200, line: 360 } });
}

function spacer(twips = 200) {
  return new Paragraph({ spacing: { after: twips }, children: [run("")] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80, line: 360 },
    children: [run(text, { size: 24 })],
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 240, line: 276 },
    children: [run(text, { size: 20, bold: true })],
  });
}

function imagePara(file, wPx, hPx, alt) {
  const data = fs.readFileSync(file);
  const ext = path.extname(file).slice(1).toLowerCase();
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
    children: [
      new ImageRun({
        type: ext === "jpg" ? "jpg" : "png",
        data,
        transformation: { width: wPx, height: hPx },
        altText: { name: alt, description: alt, title: alt },
      }),
    ],
  });
}

function cell(text, width, o = {}) {
  const inner = Array.isArray(text)
    ? text
    : [
        new Paragraph({
          alignment: o.align || AlignmentType.LEFT,
          spacing: { after: 40, line: 276 },
          children: [run(String(text), { size: o.size || 20, bold: !!o.bold })],
        }),
      ];
  return new TableCell({
    borders: o.borders || borders,
    width: { size: width, type: WidthType.DXA },
    shading: o.shading ? { fill: o.shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    verticalAlign: o.valign || VerticalAlign.CENTER,
    columnSpan: o.span,
    children: inner,
  });
}

function table(headers, rows, colWidths) {
  const width = colWidths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    children: headers.map((h, i) =>
      cell(h, colWidths[i], { bold: true, align: AlignmentType.CENTER, shading: "D9D9D9" })
    ),
  });
  const dataRows = rows.map(
    (r) => new TableRow({ children: r.map((c, i) => cell(c, colWidths[i])) })
  );
  return new Table({
    width: { size: width, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows],
  });
}

function tocLine(left, right) {
  return new Paragraph({
    spacing: { after: 80, line: 360 },
    tabStops: [{ type: "right", position: BODY_W, leader: "dot" }],
    children: [run(left, { size: 24 }), run("\t", { size: 24 }), run(String(right), { size: 24 })],
  });
}

function footerBlock() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        border: { top: { style: BorderStyle.SINGLE, size: 8, color: "000000", space: 8 } },
        spacing: { before: 80 },
        children: [
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 }),
          run(" | Page", { size: 20 }),
        ],
      }),
    ],
  });
}

function emptyHdr() {
  return new Header({ children: [new Paragraph({ children: [] })] });
}
function emptyFtr() {
  return new Footer({ children: [new Paragraph({ children: [] })] });
}

function h1(num, title, o = {}) {
  const kids = [];
  if (num) {
    kids.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        pageBreakBefore: !!o.pageBreakBefore,
        spacing: { before: 0, after: 80, line: 276 },
        children: [run(String(num), { size: 32, bold: true })],
      })
    );
    kids.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 280, line: 276 },
        children: [run(title, { size: 36, bold: true })],
      })
    );
  } else {
    kids.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        pageBreakBefore: !!o.pageBreakBefore,
        spacing: { before: 0, after: 280, line: 276 },
        children: [run(title, { size: 36, bold: true })],
      })
    );
  }
  return kids;
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120, line: 276 },
    children: [run(text, { size: 28, bold: true })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { before: 160, after: 80, line: 276 },
    children: [run(text, { size: 24, bold: true })],
  });
}

function coverSection() {
  const logo = path.join(ASSETS, "geu_logo.png");
  const logoW = 140;
  const logoH = Math.round(140 * (312 / 396));
  const inner = [];

  inner.push(center("A Synopsis", { size: 48, bold: true, spacing: { after: 60, line: 276 } }));
  inner.push(center("Of", { size: 26, italics: true, spacing: { after: 60, line: 276 } }));
  inner.push(center("Project", { size: 26, spacing: { after: 60, line: 276 } }));
  inner.push(center("On", { size: 26, italics: true, spacing: { after: 200, line: 276 } }));
  inner.push(
    center(TITLE_SHORT.toUpperCase(), {
      size: 40,
      bold: true,
      spacing: { after: 80, line: 276 },
      children: [run(TITLE_SHORT.toUpperCase(), { size: 40, bold: true })],
    })
  );
  inner.push(
    center(TITLE_LINE.toUpperCase(), {
      size: 20,
      bold: true,
      spacing: { after: 200, line: 300 },
      children: [run(TITLE_LINE.toUpperCase(), { size: 20, bold: true })],
    })
  );
  inner.push(
    center("Submitted in partial fulfillment of the requirement for the award of the degree of", {
      size: 20,
      spacing: { after: 120, line: 276 },
    })
  );
  inner.push(center("BACHELOR OF TECHNOLOGY", { size: 24, bold: true, spacing: { after: 40, line: 276 } }));
  inner.push(center("IN", { size: 22, spacing: { after: 40, line: 276 } }));
  inner.push(
    center("COMPUTER SCIENCE & ENGINEERING", { size: 24, bold: true, spacing: { after: 40, line: 276 } })
  );
  inner.push(center(cover.branchLine, { size: 22, spacing: { after: 160, line: 276 } }));
  inner.push(center("Under the Guidance of", { size: 22, italics: true, spacing: { after: 60, line: 276 } }));
  inner.push(center(cover.guideName.toUpperCase(), { size: 24, bold: true, spacing: { after: 20, line: 276 } }));
  inner.push(
    center(`${cover.guideDesignation}, Graphic Era Deemed to be University`, {
      size: 20,
      spacing: { after: 80, line: 276 },
    })
  );
  inner.push(center(`Project Team ID: ${cover.teamId}`, { size: 20, spacing: { after: 120, line: 276 } }));
  inner.push(imagePara(logo, logoW, logoH, "Graphic Era Deemed to be University emblem"));
  inner.push(center("Submitted By", { size: 22, bold: true, spacing: { before: 120, after: 80, line: 276 } }));
  for (const s of cover.students) {
    inner.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40, line: 276 },
        children: [run(s.name, { size: 22 }), run("     ", { size: 22 }), run(s.enroll, { size: 22 })],
      })
    );
  }
  inner.push(spacer(160));
  inner.push(
    center("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", {
      size: 22,
      bold: true,
      spacing: { after: 40, line: 276 },
    })
  );
  inner.push(
    center("GRAPHIC ERA DEEMED TO BE UNIVERSITY", { size: 22, bold: true, spacing: { after: 40, line: 276 } })
  );
  inner.push(center("DEHRADUN", { size: 22, bold: true, spacing: { after: 40, line: 276 } }));
  inner.push(center(cover.monthYear, { size: 22, bold: true, spacing: { after: 0, line: 276 } }));

  return [
    new Table({
      width: { size: COVER_W, type: WidthType.DXA },
      columnWidths: [COVER_W],
      rows: [
        new TableRow({
          height: { value: 15200, rule: HeightRule.ATLEAST },
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.DOUBLE, size: 24, color: "000000" },
                bottom: { style: BorderStyle.DOUBLE, size: 24, color: "000000" },
                left: { style: BorderStyle.DOUBLE, size: 24, color: "000000" },
                right: { style: BorderStyle.DOUBLE, size: 24, color: "000000" },
              },
              width: { size: COVER_W, type: WidthType.DXA },
              margins: { top: 160, bottom: 160, left: 160, right: 160 },
              verticalAlign: VerticalAlign.CENTER,
              children: inner,
            }),
          ],
        }),
      ],
    }),
  ];
}

function frontMatter() {
  const studentLine = cover.students.map((s) => `${s.name} (${s.enroll})`).join(", ");
  const kids = [];

  kids.push(center("CERTIFICATE", { size: 32, bold: true, spacing: { after: 400, line: 276 } }));
  kids.push(
    body(
      `This is to certify that the project synopsis entitled \u201C${TITLE_FULL}\u201D is being submitted by ${studentLine} for the partial fulfillment of the requirement for the award of the degree of B. Tech-CSE (${cover.branchLine}) in Department of Computer Science & Engineering, Graphic Era Deemed to be University, Dehradun, and is a record of his own work carried out under my supervision. The matter embodied in the synopsis has not been submitted in any other university or institution for the award of any degree.`
    )
  );
  kids.push(spacer(800));
  kids.push(para(cover.guideName, { size: 24, bold: true, align: AlignmentType.LEFT, spacing: { after: 40, line: 276 } }));
  kids.push(para(cover.guideDesignation, { size: 24, align: AlignmentType.LEFT, spacing: { after: 40, line: 276 } }));
  kids.push(
    para("Department of Computer Science and Engineering,", {
      size: 24,
      align: AlignmentType.LEFT,
      spacing: { after: 40, line: 276 },
    })
  );
  kids.push(
    para("Graphic Era Deemed to be University, Dehradun, India.", {
      size: 24,
      align: AlignmentType.LEFT,
      spacing: { after: 40, line: 276 },
    })
  );

  kids.push(pageBreak());
  kids.push(center("DECLARATION", { size: 32, bold: true, spacing: { after: 400, line: 276 } }));
  kids.push(
    body(
      `I hereby declare that the project synopsis entitled \u201C${TITLE_FULL}\u201D is being submitted for the partial fulfillment of the requirement for the award of the degree of B. Tech-CSE (${cover.branchLine}) in Department of Computer Science & Engineering, Graphic Era Deemed to be University, Dehradun, is my original work and has not been submitted to any other university or institution for the award of any degree or diploma.`
    )
  );
  kids.push(spacer(400));
  for (const s of cover.students) {
    kids.push(
      para(`${s.name}  (${s.enroll})                                        Signature: ____________`, {
        size: 24,
        align: AlignmentType.LEFT,
        spacing: { after: 200, line: 360 },
      })
    );
  }

  kids.push(pageBreak());
  kids.push(center("TABLE OF CONTENTS", { size: 32, bold: true, spacing: { after: 280, line: 276 } }));
  kids.push(
    table(
      ["S.No.", "CONTENT", "PAGE NO."],
      [
        ["", "Abstract", "5"],
        ["1.", "Introduction", "6"],
        ["", "1.1  Background", "6"],
        ["", "1.2  Problem Context", "6"],
        ["", "1.3  Official Indian Treatment Workflows", "6"],
        ["", "1.4  Consumer Health Chat versus Grounded Answering", "7"],
        ["", "1.5  Specialist Tools versus Chatting Agents", "7"],
        ["", "1.6  Role of a Local Language Model", "7"],
        ["", "1.7  Motivation for the Present Study", "7"],
        ["", "1.8  Research Gap", "8"],
        ["", "1.9  Scope of the Project", "8"],
        ["2.", "Literature Review", "9"],
        ["3.", "Problem Statement & Objectives", "12"],
        ["", "3.1  Problem Statement", "12"],
        ["", "3.2  Objectives", "12"],
        ["4.", "Proposed Methodology", "14"],
        ["5.", "Hardware and Software Requirements", "19"],
        ["6.", "Expected Outcomes", "20"],
        ["7.", "Conclusion", "21"],
        ["", "References", "22"],
      ],
      [900, 6266, 1500]
    )
  );
  return kids;
}

function abstractAndBody() {
  const fig1 = path.join(ASSETS, "fig4_1_workflow.png");
  const fig2 = path.join(ASSETS, "fig4_2_architecture.png");
  const fig3 = path.join(ASSETS, "fig4_3_pipeline.png");
  const figW = 560;
  const fig12H = Math.round(figW * (980 / 2000));
  const fig3H = Math.round(figW * (520 / 2000));
  const k = [];

  k.push(...h1(null, "ABSTRACT", { pageBreakBefore: true }));
  k.push(
    body(
      "People in India already ask general-purpose language models for health advice. Those systems often invent medicine names, skip official Indian treatment pages, and continue talking when the evidence is missing. At the same time, the country already publishes machine-usable sources for grounding: ICMR / NHA / WHO Standard Treatment Workflows (STWs) as one-page flowcharts [1], the National List of Essential Medicines (NLEM) [2], and monthly CDSCO Not of Standard Quality (NSQ) batch tables [3]. The student-sized gap is not another chatbot and not a claim that a convolutional network has \u201Csolved\u201D tuberculosis or cancer. The gap is a fail-closed answering system in which a local language model may call specialist tools and may write a sentence only when an official span entails that sentence."
    )
  );
  k.push(
    body(
      "This Major Project therefore proposes Care Pathway: a guideline-grounded health assistant with specialist tools and fail-closed answering. Each tool is a frozen function with a named JSON schema. The host, not the language model, executes the function. The language model is used only as a router and a writer. It is not pretrained in this project, and it is not fine-tuned to become a doctor. Specialist vision and document models will be trained by the student on public research sets and then frozen. Additional tools may later be registered under the same contract without changing the fail-closed writer or the verifier."
    )
  );
  k.push(
    body(
      "The Phase-1 catalogue that will be implemented and evaluated registers a chest X-ray tool (CheXpert baseline [4]), a skin-lesion tool (HAM10000 / ISIC [5]), a pack-or-lab document tool, lookup tools over NLEM and CDSCO, visual retrieval over STW page images, and an explicit out-of-scope refuse. Imaging papers are treated as baselines to replicate, in the same sense that a fundus synopsis replicates EfficientNetB0 [6]. The numbered enhancement is (i) visual retrieval of ICMR flowchart pages rather than text-only chunks, (ii) in-context demonstrations that include near-miss refusals, and (iii) offline GEPA prompt evolution for coverage versus ungrounded rate [7]. No improved numerical results are claimed at the synopsis stage. The product is an answer card with a watermark that it is not a diagnosis. It is not software as a medical device and not a hospital information system."
    )
  );
  k.push(
    para("", {
      align: AlignmentType.JUSTIFIED,
      spacing: { before: 80, after: 80, line: 360 },
      children: [
        run("Keywords: ", { size: 24, bold: true }),
        run(
          "Tool calling, fail-closed answering, ICMR Standard Treatment Workflows, NLEM, CDSCO NSQ, CheXpert, HAM10000, visual document retrieval, GEPA prompt evolution, refusal.",
          { size: 24 }
        ),
      ],
    })
  );

  k.push(...h1("1", "INTRODUCTION", { pageBreakBefore: true }));
  k.push(h2("1.1 Background"));
  k.push(
    body(
      "Health queries in ordinary language are already a mass behaviour. A user types a complaint in English or Hinglish, sometimes attaches a photograph of a chest film, a skin lesion, a medicine strip, or a laboratory printout, and expects a short answer. Consumer applications and large dialogue systems already occupy this interface at a scale that a B.Tech project will not displace [8]. What they typically do not do, in a form that a student can evaluate, is bind every emitted sentence to a named official Indian page and refuse when that page does not exist."
    )
  );
  k.push(
    body(
      "India does not lack written clinical guidance. The National Medical Commission public notice of 15 September 2025 records 157 Standard Treatment Workflows across 28 specialties, prepared by ICMR with the National Health Authority and WHO, as one-page visual workflows rather than textbook chapters [1]. NLEM 2022 lists 384 essential medicines [2]. CDSCO publishes monthly NSQ tables of products, batches, and manufacturers that failed quality tests [3]. These artefacts are public. They are not, by themselves, a safe answering system: a language model can quote them loosely, invent a drug that is not in the retrieved row, or treat a convolutional score as a disease name."
    )
  );

  k.push(h2("1.2 Problem Context"));
  k.push(
    body(
      "Two failure modes dominate ungrounded health chat. The first is invention: a drug, a dose, or a referral that does not appear in the retrieved official span. The second is over-talking: the model answers an out-of-scope question (for example a brain MRI, a paediatric emergency, or a request to prescribe) because few-shot prompts were built only from answered neighbours. A third, quieter failure is architectural. If every disease is wrapped as a chatting \u201Cagent\u201D that orders tests in a loop, the system is no longer evaluable and is not a doctor. The present work treats specialists as tools that return JSON, and treats silence as a first-class output."
    )
  );

  k.push(h2("1.3 Official Indian Treatment Workflows"));
  k.push(
    body(
      "ICMR STWs are one-page flowcharts. Diamonds and arrows encode the decision (\u201Cif red flag, refer\u201D). Text-chunk retrieval that splits a PDF into overlapping windows often loses that diamond. This project will therefore retrieve STW page images with a ColPali-class visual retriever [9], and will require the written sentence to point at a labelled box or to refuse. NLEM and CDSCO are tables, not flowcharts; they will be queried as lookup tools with a dated snapshot, so that \u201Cnot in this month\u2019s NSQ list\u201D is never rendered as \u201Csafe.\u201D"
    )
  );

  k.push(h2("1.4 Consumer Health Chat versus Grounded Answering"));
  k.push(
    body(
      "Commercial Indian health chat and international clinical-dialogue research (including systems such as AMIE [8]) already demonstrate that a large model can hold a medical conversation. They do not give this project a labelled Indian gold set, a licence to deploy at a clinic, or a thesis that \u201Cwe built HealthGPT.\u201D The proposed product is narrower: a closed catalogue of tools, a local open-weight language model that may call those tools, a code verifier, and three card statuses \u2014 grounded, insufficient, and out_of_scope."
    )
  );

  k.push(h2("1.5 Specialist Tools versus Chatting Agents"));
  k.push(
    body(
      "A tool, in this synopsis, is a frozen function with a JSON schema. The chest X-ray network returns findings and scores. The skin network returns a class and a score. The document model returns fields. A lookup returns a table row or a miss. An agent, which this project will not build, is a loop that chats, \u201Corders tests,\u201D and writes a plan. The only agent-like piece is the language-model router and writer, whose prompts will be frozen after offline evolution. The host executes every tool call. The model never runs weights of a specialist by itself and never invents a new tool name at serve time."
    )
  );

  k.push(h2("1.6 Role of a Local Language Model"));
  k.push(
    body(
      "An open-weight model in the Qwen class [10] will be loaded locally. It will not be pretrained on hospital notes and will not be supervised-fine-tuned into a clinician. Its job is to read the user text and optional file, emit a structured tool call from a published catalogue, and, after JSON returns, draft at most one sentence that a retrieved STW box, NLEM row, or CDSCO row entails. GEPA [7] will rewrite the router and answer prompts on a train split, using verifier text as feedback, and will then be switched off. There is no genetic search per live user."
    )
  );

  k.push(h2("1.7 Motivation for the Present Study"));
  k.push(
    body(
      "CheXpert [4] and HAM10000 [5] are mature public imaging benchmarks. Donut and LayoutLM-class models [11], [12] are mature document extractors. Replicating those baselines as student tools is honest work, analogous to replicating EfficientNetB0 [6] on fundus photographs, but it is not by itself a novel major-project claim. What those papers do not provide is a fail-closed Indian answering head: visual STW retrieval, near-miss refusal demonstrations, and a coverage-versus-ungrounded Pareto on prompts. That combination is the motivation."
    )
  );

  k.push(h2("1.8 Research Gap"));
  k.push(
    body(
      "The literature leaves a bounded, student-sized gap, which this project treats as numbered rather than as a licence to practise medicine:"
    )
  );
  k.push(
    body(
      "(i) Official Indian sources are often flowcharts. Text-only retrieval loses the decision diamond, so an answer can be fluent and still ungrounded."
    )
  );
  k.push(
    body(
      "(ii) Imaging papers report AUROC on CheXpert or accuracy on ISIC. They do not report whether a language model that called those nets invented a drug or answered out of scope."
    )
  );
  k.push(
    body(
      "(iii) GEPA has been shown on tasks including mathematical reasoning and code [7], not on an Indian STW abstention Pareto whose feedback strings are \u201Cinvented a drug\u201D and \u201Canswered OOS.\u201D"
    )
  );
  k.push(
    body(
      "(iv) Standard in-context learning retrieves answered neighbours and teaches the model to always talk. Near-miss refusals are rarely first-class demonstrations."
    )
  );
  k.push(
    body(
      "(v) Unbounded multi-agent \u201Cspecialist doctors\u201D are not evaluable in a B.Tech setting and are not a substitute for a registered medical practitioner."
    )
  );

  k.push(h2("1.9 Scope of the Project"));
  k.push(
    body(
      "The scope is software: public-set specialist training, a tool-calling catalogue, local language-model routing and writing, visual and tabular retrieval, a deterministic verifier, a labelled gold question set including refusals, an offline GEPA ablation, and a browser chat card with a watermark. The project will not train the large language model from scratch, will not fine-tune it as a doctor, will not deploy in a live clinic, will not use real hospital charts without ethics approval, will not auto-prescribe, and will not claim a reduction in national disease burden. Traces will be hashed and no patient identity will be stored, consistent with the Digital Personal Data Protection Act, 2023 [13]. Further specialist tools may be registered later under the same JSON interface; Phase-1 evaluation will be reported on the catalogue that is actually implemented."
    )
  );

  k.push(...h1("2", "LITERATURE REVIEW", { pageBreakBefore: true }));
  k.push(
    body(
      "This chapter reviews official Indian sources, replicated imaging and document baselines, visual retrieval, prompt evolution, and clinical dialogue, and restates the gap."
    )
  );

  k.push(h2("2.1 Official Indian Sources"));
  k.push(
    body(
      "The NMC notice of 15 September 2025 states that ICMR, NHA, and WHO have issued 157 STWs covering 28 specialties, downloadable as one-page workflows [1]. NLEM 2022, launched on 13 September 2022, lists 384 medicines and is a PDF, not a live API [2]. CDSCO publishes monthly NSQ HTML/PDF tables (product, batch, manufacturer, test failed) without a documented bulk API [3]. Optional extra corpus includes NCDC/ICMR national antimicrobial treatment guidelines, version 2.0, November 2025 [14]. These documents will be cited as retrieval sources. This project will not generate guideline text and pass it off as an official page."
    )
  );

  k.push(h2("2.2 Chest Radiograph Classification"));
  k.push(
    body(
      "Irvin et al. introduced CheXpert: 224,316 chest radiographs from 65,240 patients with 14 observations and an explicit uncertain label, and reported DenseNet-121 as the competition CNN [4], [15]. Competition evaluation often uses five observations (Atelectasis, Cardiomegaly, Consolidation, Edema, Pleural Effusion) under U-ones / U-zeros protocols. The licence is research, non-commercial, and non-clinical. VinDr-CXR is an optional extra test set of 18,000 PA films from Vietnam, not India, under a PhysioNet credentialed agreement [16]. Commercial Indian CXR products such as qXR already ship; this project will replicate a public baseline as a tool and will not claim an NTEP product."
    )
  );

  k.push(h2("2.3 Skin-Lesion Classification"));
  k.push(
    body(
      "Tschandl, Rosendahl, and Kittler released HAM10000: 10,015 dermatoscopic images across seven classes, including melanoma and basal-cell carcinoma, under CC BY-NC [5]. The set was released through the ISIC archive and used as the public training set for ISIC 2018 Task 3 [17]. EfficientNet-class transfer learning is a standard student baseline [6]. The photographs are not Indian clinic photos; that limitation will be stated in the viva. Many ISIC classes will have no matching ICMR dermatology STW box (those pages emphasise infection and eczema). Correct refuse in that case is a feature of fail-closed answering, not a dataset bug."
    )
  );

  k.push(h2("2.4 Document Understanding"));
  k.push(
    body(
      "Donut [11] and LayoutLMv3 [12] are representative document KIE methods; PaddleOCR / PP-OCR is a practical OCR stack [18]. There is no locked public Indian strip-carton set. Phase 1 will therefore synthesise packs from CDSCO batch strings plus self-collected OTC photographs (no patient prescriptions), and will treat laboratory PDFs similarly with a dated reference-range table. Field-level F1 and exact batch match will be the tool metrics, not \u201Cthe medicine is safe.\u201D"
    )
  );

  k.push(h2("2.5 Visual Retrieval of Page Images"));
  k.push(
    body(
      "ColPali and ColQwen-class models embed PDF page images for late-interaction retrieval [9]. They are the natural retriever for one-page STW flowcharts. This project will use an open checkpoint and will not claim to have trained ColPali from scratch. Box and arrow identifiers are not in the official PDFs; a labelled subset of pages that the system actually retrieves (pulmonology, dermatology, and related) will be annotated by the student."
    )
  );

  k.push(h2("2.6 Prompt Evolution"));
  k.push(
    body(
      "Agrawal et al. introduced GEPA (Genetic-Pareto), an ICLR 2026 oral, which mutates prompts from execution traces and natural-language feedback and keeps a Pareto set [7]. The DSPy implementation is dspy.GEPA [19]. The paper evaluates GEPA on tasks including mathematical reasoning and code, not on Indian STW abstention. This project will use GEPA only on router and answer prompts, never on specialist weights, and only offline. Extra test-time search of the kind used on mathematical contest problems is out of scope here. If tools disagree, the planned behaviour is one extra look or insufficient, not best-of-N search."
    )
  );

  k.push(h2("2.7 Clinical Dialogue Systems"));
  k.push(
    body(
      "Large clinical-dialogue systems, including AMIE [8], show that guideline-grounded conversation is an active research area at industrial scale. They are cited so that this synopsis does not pretend the gap is \u201Cnobody has used a language model in medicine.\u201D The remaining student gap is a closed tool catalogue, Indian official pages as the only writable spans, and a measured refuse."
    )
  );

  k.push(h2("2.8 Research Gap"));
  k.push(
    body(
      "Taken together: (i) STWs, NLEM, and CDSCO are public but flowchart-shaped or table-shaped [1]\u2013[3]; (ii) CheXpert and HAM10000 are replicable tools, not a thesis by themselves [4], [5]; (iii) visual page retrieval and GEPA exist as methods [7], [9] and have not been scored on coverage versus ungrounded rate with Indian STW verifier text; (iv) refusal near-misses are not the usual ICL diet. That gap justifies a project that wraps frozen specialists as an extensible tool-calling interface and evaluates fail-closed answering, rather than training another unbounded health chatbot."
    )
  );

  k.push(...h1("3", "PROBLEM STATEMENT & OBJECTIVES", { pageBreakBefore: true }));
  k.push(h2("3.1 Problem Statement"));
  k.push(
    body(
      "Although convolutional networks have demonstrated usable published performance for chest radiograph observation classification and skin-lesion recognition on public datasets, and although large language models can hold a health conversation, those components are not a grounded Indian answering system. There remains a need for (i) an independent, verifiable reproduction of specialist baselines as frozen JSON tools under a controlled protocol, and (ii) a scientifically justified investigation of whether a local language model that may only call those tools, retrieve official STW/NLEM/CDSCO spans, and pass a fail-closed verifier can raise coverage at a controlled ungrounded rate, with correct refuse on out-of-scope items, without claiming diagnostic performance against clinicians. The tool-calling interface will be specified so that further tools can be registered later without turning the thesis into an unbounded swarm of chatting agents."
    )
  );

  k.push(h2("3.2 Objectives"));
  k.push(
    bullet(
      "To study and critically analyse official Indian sources (ICMR STWs, NLEM 2022, CDSCO NSQ) as retrieval and verification material rather than as generated prose."
    )
  );
  k.push(
    bullet(
      "To specify an extensible specialist tool-calling interface (name, JSON schema, host execution, refuse) that a local language model can call."
    )
  );
  k.push(
    bullet(
      "To replicate a CheXpert chest X-ray baseline (DenseNet-121 or EfficientNet) as a frozen tool, reporting AUROC/F1 on the official split honestly against the paper, without a SOTA claim unless it is earned."
    )
  );
  k.push(
    bullet(
      "To replicate a HAM10000 / ISIC skin-lesion baseline as a frozen tool, with lesion-id-aware splits and an explicit statement of geographic and STW mismatch."
    )
  );
  k.push(
    bullet(
      "To implement a pack/lab document tool (OCR/KIE) and NLEM/CDSCO lookup tools, including the rule that absence from the NSQ list is not a safety certificate."
    )
  );
  k.push(
    bullet(
      "To retrieve ICMR STW page images with a ColPali-class model and to annotate box identifiers on the subset actually used."
    )
  );
  k.push(
    bullet(
      "To construct a student gold question set (in-scope, insufficient, out-of-scope, including Hinglish and near-miss refusals) with route, status, and span identifiers."
    )
  );
  k.push(
    bullet(
      "To use in-context demonstrations that include near-miss refusals so that the router learns when not to call a tool and when not to speak."
    )
  );
  k.push(
    bullet(
      "To evolve router and answer prompts offline with GEPA, freeze the chosen Pareto candidate, and compare hand prompts versus GEPA on coverage versus ungrounded rate."
    )
  );
  k.push(
    bullet(
      "To implement a code verifier and a chat card (grounded / insufficient / out_of_scope) with the watermark that the output is not a diagnosis."
    )
  );
  k.push(
    bullet(
      "To document the pipeline so that a further tool can be registered later under the same JSON contract without retraining the language model."
    )
  );

  k.push(...h1("4", "PROPOSED METHODOLOGY", { pageBreakBefore: true }));
  k.push(
    body(
      "The methodology is organised as baseline tool replication, then a fail-closed answering enhancement. No improved metric is claimed in this synopsis. All verbs below are prospective."
    )
  );

  k.push(h2("4.1 Overall System Workflow"));
  k.push(
    body(
      "At serve time the user will submit a question and optionally an image or PDF. The host will retrieve STW page images, NLEM/CDSCO rows, and similar gold items (including refusals). The router language model will emit a tool call from the published catalogue, or out_of_scope. The host will execute the named function. The answer model will draft only from retrieved spans plus tool JSON. The verifier will accept, strip, or refuse. GEPA will not run on the live path."
    )
  );
  k.push(imagePara(fig1, figW, fig12H, "Proposed overall workflow of the system"));
  k.push(caption("Fig. 4.1  Proposed overall workflow of the system."));

  k.push(h2("4.2 Extensible Specialist Tool-Calling Interface"));
  k.push(
    body(
      "The language model will see a catalogue of functions, in the same shape as ordinary function-calling, not a swarm of chatting doctors. Each entry has a name, a natural-language when-to-use description, argument types, and a JSON output schema. The model may emit only those names. The host runs the function and returns JSON into the context. This is the interface that later tools will join: a new specialist is a new schema plus frozen weights or a new table, not a new agent loop."
    )
  );
  k.push(
    body(
      "Serve-time rules that keep the interface closed even when the catalogue grows: the model cannot invent a tool; it cannot execute code; it cannot loop indefinitely; if two tools conflict, at most one extra look is allowed, then insufficient; out_of_scope skips every specialist and forbids clinical text. GEPA traces will log the tool name and JSON so that prompt evolution sees the call, not an unstructured chat."
    )
  );

  k.push(h2("4.3 Phase-1 Tool Catalogue"));
  k.push(
    body(
      "The catalogue that will be implemented for evaluation is listed in Table 4.1. Imaging and document rows are trained specialist tools. NLEM, CDSCO, and STW retrieve are lookup tools (no extra CNN). out_of_scope is a refuse, not a fourth vision model. Further tools, if added in a later phase, will use the same columns."
    )
  );
  k.push(
    table(
      ["Name", "Kind", "What the host runs", "JSON out (indicative)"],
      [
        ["cxr_tool", "Trained specialist", "Frozen CheXpert CNN (DenseNet-121 / EfficientNet)", "findings[], scores[], unreadable?"],
        ["skin_tool", "Trained specialist", "Frozen HAM10000/ISIC net", "class, score, dataset"],
        ["document_tool", "Trained specialist", "OCR/KIE on pack or lab PDF", "batch/brand/analyte, unreadable?"],
        ["nlem_lookup", "Lookup", "NLEM 2022 table", "in list / not in list"],
        ["cdsco_lookup", "Lookup", "Dated NSQ snapshot", "match / not in list (not \u201Csafe\u201D)"],
        ["stw_retrieve", "Lookup", "ColPali-class on STW page images", "page id, box ids"],
        ["out_of_scope", "Refuse", "No specialist run", "status = out_of_scope"],
      ],
      [1400, 1700, 2766, 2800]
    )
  );
  k.push(caption("Table 4.1  Phase-1 tool catalogue (extensible JSON interface)."));

  k.push(h2("4.4 Dataset Acquisition and Specialist Training"));
  k.push(
    body(
      "CheXpert will be obtained under Stanford research terms (CheXpert-small is sufficient to start; patient-level splits; U-ones/U-zeros/U-ignore reported) [4]. HAM10000 will be obtained from Harvard Dataverse / ISIC under CC BY-NC, split by lesion identifier [5]. VinDr-CXR may be added as an extra test only after the PhysioNet DUA [16]. Pack and lab layouts will be synthesised and self-collected; there is no named public Indian pack-OCR set to download. Specialist nets will be trained with PyTorch on campus GPU, then frozen. DenseNet-121 on CheXpert-small does not require a B200; a large GPU is justified for language-model serving and GEPA rollouts."
    )
  );

  k.push(h2("4.5 Retrieval of Official Pages and Tables"));
  k.push(
    body(
      "STW PDFs will be rasterised to page images and indexed with a ColPali-class embedder [9]. A subset of pages that the gold questions actually need (pulmonology/CXR, dermatology/skin, and any page a lookup cites) will receive student box identifiers. NLEM 2022 and monthly CDSCO NSQ tables will be parsed into dated snapshots. Gold questions will store gold_span_id. The language model will never be asked to recite a guideline from parameters."
    )
  );

  k.push(h2("4.6 Router and Answer Prompts"));
  k.push(
    body(
      "Two frozen prompts will be used at serve time, possibly on the same local weights. The router prompt sees the user text, file type, retrieved neighbours including at least one near-miss refuse when available, and the catalogue; it emits a tool call or out_of_scope. The answer prompt sees tool JSON and retrieved spans only; it may draft a short sentence or stay silent. Demonstration selection follows the guide\u2019s emphasis on similar examples, including refusals, rather than only answered twins."
    )
  );

  k.push(h2("4.7 Fail-Closed Verifier"));
  k.push(
    body(
      "The verifier is code inside the API, not a fourth neural net. Planned rules include: empty tool JSON after an in-scope route yields insufficient; a finding, drug, or action absent from retrieved spans is dropped or rejected; clinical imperative on an out-of-scope item fails; unreadable OCR or a non-CXR image sent to cxr_tool yields insufficient; a T1/T2 score used as a disease name fails unless the STW box uses that wording; tool disagreement yields one extra pass, then insufficient. Card status is grounded, insufficient, or out_of_scope."
    )
  );

  k.push(h2("4.8 Gold Questions and Splits"));
  k.push(
    body(
      "A student-labelled set of several hundred items will be built. It does not exist as a download. Each record will hold question text, optional image type, gold_route, gold_status, gold_span_id, and a short gold_reply or empty. Splits will be by question id. The same image must not leak across train and test. Hinglish items will be included. Dual annotation and disagreement handling will be written before the test numbers are reported."
    )
  );

  k.push(h2("4.9 GEPA Prompt Evolution (Offline Only)"));
  k.push(
    body(
      "On the train split, GEPA will run the compound program, read traces (tool JSON, retrieved page, draft, verifier text), mutate prompts, and keep a Pareto set of coverage versus ungrounded rate [7], [19]. Text feedback is required (for example \u201Ccited a drug not in the retrieved NLEM span\u201D). Specialist weights, NLEM/CDSCO tables, STW pixels, and verifier rules are not mutated. The chosen candidate is frozen for the demo. If GEPA loses to a hand prompt or to MIPROv2, that result will be reported."
    )
  );

  k.push(h2("4.10 Proposed System Architecture"));
  k.push(
    body(
      "Four serve-time layers are proposed: the browser chat, a FastAPI gateway (demo login, job queue, hashed traces, no patient identity store), retrieval stores, and the router\u2013tools\u2013writer\u2013verifier path. Figure 4.2 shows the stack. The watermark on every card will read that the output is not a diagnosis and is not a substitute for a registered medical practitioner."
    )
  );
  k.push(imagePara(fig2, figW, fig12H, "Proposed system architecture"));
  k.push(caption("Fig. 4.2  Proposed system architecture."));

  k.push(h2("4.11 Evaluation Protocol"));
  k.push(
    body(
      "Specialist replication will use the metrics of the source papers (CheXpert AUROC/F1; ISIC accuracy/macro-F1; document field-F1 / exact batch match). Product metrics, which are the enhancement, will be coverage, ungrounded rate, correct refuse, and a coverage-versus-ungrounded Pareto. Diagnostic accuracy versus radiologists, lives saved, and invented percentages will not be reported. A small human check of cards for non-prescriptive Hindi/English readability is secondary. No numbers beyond the cited baseline literature are claimed in this synopsis."
    )
  );

  k.push(h2("4.12 End-to-End Pipeline"));
  k.push(
    body(
      "The proposed pipeline is: ingest STW PDFs and tables; train and freeze specialist tools; register them in the tool catalogue; build gold questions including refusals; hand-prompt baseline; GEPA on train; freeze prompts; evaluate on test; chat demo. Figure 4.3 summarises baseline tools versus the prompt-evolution enhancement. Further tools, if registered later, enter at the catalogue step without a new language-model pretraining run."
    )
  );
  k.push(imagePara(fig3, figW, fig3H, "Proposed methodology pipeline"));
  k.push(caption("Fig. 4.3  Proposed methodology pipeline (baseline tools, then GEPA enhancement)."));

  k.push(...h1("5", "HARDWARE AND SOFTWARE REQUIREMENTS", { pageBreakBefore: true }));
  k.push(h2("5.1 Hardware Requirements"));
  k.push(
    body(
      "Development will use a laptop with at least 16 GB RAM. Campus GPU (B200 or equivalent, or a smaller GPU if the B200 is busy) will be used to train specialist tools more quickly, to serve a 7B\u201332B-class local language model, and to run GEPA rollouts. A 7B model and fewer GEPA steps remain scientifically valid if the large GPU is unavailable. DenseNet-121 on CheXpert-small is not a B200-scale job by itself."
    )
  );
  k.push(
    table(
      ["Requirement", "Recommended"],
      [
        ["Processor", "Intel Core i7 / AMD Ryzen 7 or equivalent"],
        ["RAM", "16 GB or higher on the development laptop"],
        ["Storage", "SSD sufficient for CheXpert-small, HAM10000, STW rasters, and snapshots"],
        ["GPU", "Campus NVIDIA GPU (B200 or equivalent) for LLM serving and GEPA; smaller CUDA GPU acceptable"],
        ["Display", "Standard HD display for the chat demo"],
      ],
      [2800, 5866]
    )
  );
  k.push(caption("Table 5.1  Hardware requirements."));

  k.push(h2("5.2 Software Requirements"));
  k.push(
    table(
      ["Software / Technology", "Purpose"],
      [
        ["Python, PyTorch, Hugging Face", "Specialist tools and local language model"],
        ["timm / torchvision", "CXR and skin networks"],
        ["PaddleOCR / Donut / LayoutLMv3", "Document tool"],
        ["ColPali or ColQwen class", "STW page-image retrieval"],
        ["vLLM or equivalent (optional)", "Serve Qwen-class weights locally"],
        ["DSPy + dspy.GEPA", "Offline prompt evolution"],
        ["FAISS / Qdrant", "Gold questions and STW embeddings"],
        ["FastAPI", "Gateway and verifier"],
        ["HTML/JS or React", "Chat card UI"],
        ["Visual Studio Code / Git", "Development and version control"],
      ],
      [3600, 5066]
    )
  );
  k.push(caption("Table 5.2  Software requirements."));

  k.push(...h1("6", "EXPECTED OUTCOMES", { pageBreakBefore: true }));
  k.push(
    body(
      "The following outcomes are anticipated. Consistent with the fact that experiments have not been completed at the synopsis stage, all performance-related outcomes are expressed as expectations rather than achieved results."
    )
  );
  k.push(
    bullet(
      "A specified extensible tool-calling interface, with a Phase-1 catalogue of trained specialists, lookup tools, and an explicit refuse."
    )
  );
  k.push(
    bullet(
      "Frozen chest X-ray and skin-lesion tools with honest baseline numbers versus CheXpert and HAM10000/ISIC papers, without an unearned SOTA claim."
    )
  );
  k.push(bullet("A document tool and dated NLEM/CDSCO lookups, including \u201Cnot in list \u2260 safe.\u201D"));
  k.push(bullet("Visual STW retrieval with student box identifiers on the pages actually used."));
  k.push(bullet("A gold question set that includes grounded, insufficient, and out-of-scope items and near-miss refusals."));
  k.push(
    bullet(
      "An ablation table of hand prompt versus GEPA versus refusal-aware ICL versus visual STW, and a Pareto plot of coverage versus ungrounded rate."
    )
  );
  k.push(bullet("A chat demo that shows a watermarked card and does not prescribe."));
  k.push(
    bullet(
      "A written account if GEPA or visual STW does not win, rather than a forced positive result."
    )
  );
  k.push(
    bullet(
      "A documented path to register a further tool later under the same JSON contract, without pretence that the large language model was trained as a doctor."
    )
  );

  k.push(...h1("7", "CONCLUSION", { pageBreakBefore: true }));
  k.push(
    body(
      "Unconstrained health chat is already common, and unconstrained specialist \u201Cagents\u201D are a poor B.Tech slice of that problem. Official Indian workflows, essential-medicine lists, and quality-alert tables already exist. Public imaging sets already support honest tool replication. The remaining work that this synopsis proposes is to put those pieces behind an extensible tool-calling interface, to let a local language model call only those functions, and to forbid any sentence that an official span does not entail."
    )
  );
  k.push(
    body(
      "The contribution is therefore not a new chest-network architecture and not a live clinic. It is fail-closed answering: visual STW retrieval, refusal demonstrations, and offline prompt evolution scored on coverage versus ungrounded rate. Specialist nets will be trained and frozen by the student. The large language model will be loaded, not trained. Further tools, if needed later, join the catalogue as JSON functions. They do not become extra chatting doctors."
    )
  );
  k.push(
    body(
      "As this is Phase 1 of the Major Project, the present document establishes the problem, the literature, the objectives, the methodology, and the requirements. Implementation, testing, and evaluation belong to the next phase. No improved numerical result is claimed here."
    )
  );

  k.push(...h1(null, "REFERENCES", { pageBreakBefore: true }));
  const refs = [
    "[1]  Indian Council of Medical Research, National Health Authority, and World Health Organization, \u201CStandard Treatment Workflows (STWs),\u201D and National Medical Commission, public notice dated 15 September 2025. [Online]. Available: https://www.icmr.gov.in/standard-treatment-workflows-stws",
    "[2]  Ministry of Health and Family Welfare, Government of India, National List of Essential Medicines (NLEM) 2022, New Delhi, 2022. [Online]. Available: https://cdsco.gov.in/opencms/opencms/en/consumer/Essential-Medicines/",
    "[3]  Central Drugs Standard Control Organisation, \u201CNot of Standard Quality (NSQ) drugs \u2014 public lists.\u201D [Online]. Available: https://cdscoonline.gov.in/CDSCO/viewPublicNSQDrug",
    "[4]  J. Irvin et al., \u201CCheXpert: A large chest radiograph dataset with uncertainty labels and expert comparison,\u201D in Proc. AAAI Conf. on Artificial Intelligence, vol. 33, 2019, pp. 590\u2013597.",
    "[5]  P. Tschandl, C. Rosendahl, and H. Kittler, \u201CThe HAM10000 dataset, a large collection of multi-source dermatoscopic images of common pigmented skin lesions,\u201D Scientific Data, vol. 5, Art. no. 180161, 2018.",
    "[6]  M. Tan and Q. V. Le, \u201CEfficientNet: Rethinking model scaling for convolutional neural networks,\u201D in Proc. 36th Int. Conf. on Machine Learning (ICML), PMLR 97, 2019, pp. 6105\u20136114.",
    "[7]  L. A. Agrawal et al., \u201CGEPA: Reflective prompt evolution can outperform reinforcement learning,\u201D arXiv:2507.19457, 2025; ICLR 2026 (oral).",
    "[8]  T. Tu et al., \u201CTowards conversational diagnostic artificial intelligence,\u201D Nature, vol. 642, no. 8067, pp. 442\u2013450, Jun. 2025.",
    "[9]  M. Faysse et al., \u201CColPali: Efficient document retrieval with vision language models,\u201D arXiv:2407.01449, 2024; ICLR 2025.",
    "[10] A. Yang et al., \u201CQwen2.5 technical report,\u201D arXiv:2412.15115, 2024.",
    "[11] G. Kim et al., \u201COCR-free document understanding transformer,\u201D in Proc. European Conf. on Computer Vision (ECCV), 2022.",
    "[12] Y. Huang et al., \u201CLayoutLMv3: Pre-training for document AI with unified text and image masking,\u201D in Proc. ACM Multimedia, 2022.",
    "[13] Government of India, The Digital Personal Data Protection Act, 2023, No. 22 of 2023, Gazette of India.",
    "[14] National Centre for Disease Control and Indian Council of Medical Research, National Treatment Guidelines for Antimicrobial Use in Infectious Disease Syndromes, version 2.0, Nov. 2025.",
    "[15] G. Huang, Z. Liu, L. van der Maaten, and K. Q. Weinberger, \u201CDensely connected convolutional networks,\u201D in Proc. IEEE Conf. on Computer Vision and Pattern Recognition (CVPR), 2017, pp. 4700\u20134708.",
    "[16] H. Q. Nguyen et al., \u201CVinDr-CXR: An open dataset of chest X-rays with radiologist\u2019s annotations,\u201D Scientific Data, vol. 9, Art. no. 429, 2022.",
    "[17] N. C. F. Codella et al., \u201CSkin lesion analysis toward melanoma detection 2018: A challenge hosted by the International Skin Imaging Collaboration (ISIC),\u201D arXiv:1902.03368, 2019.",
    "[18] Y. Du, C. Li, R. Guo, et al., \u201CPP-OCR: A practical ultra lightweight OCR system,\u201D arXiv:2009.09941, 2020.",
    "[19] O. Khattab et al., \u201CDSPy: Compiling declarative language model calls into self-improving pipelines,\u201D arXiv:2310.03714, 2023.",
  ];
  for (const r of refs) {
    k.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 140, line: 300 },
        indent: { left: 360, hanging: 360 },
        children: [run(r, { size: 22 })],
      })
    );
  }
  return k;
}

async function main() {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: 24 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 36, bold: true, font: FONT, color: "000000" },
          paragraph: { spacing: { before: 120, after: 200 }, outlineLevel: 0 },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 28, bold: true, font: FONT, color: "000000" },
          paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, bold: true, font: FONT, color: "000000" },
          paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: { size: A4, margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        headers: { default: emptyHdr() },
        footers: { default: emptyFtr() },
        children: coverSection(),
      },
      {
        properties: {
          page: {
            size: A4,
            margin: { top: 1080, right: 1440, bottom: 1080, left: 1800 },
            pageNumbers: { start: 2 },
          },
        },
        headers: { default: emptyHdr() },
        footers: { default: footerBlock() },
        children: [...frontMatter(), ...abstractAndBody()],
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_DOCX, buf);
  console.log("Wrote", OUT_DOCX, "bytes", buf.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
