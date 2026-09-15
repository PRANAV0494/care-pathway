"""Redraw Fig. 4.1 with T2 = skin tool (not leftover CANCER-IMAGE)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent / "assets" / "fig4_1_workflow.png"
W, H = 2000, 980
BG, INK, HEAD, HEAD_FG, FILL, MUTED = (255, 255, 255), (0, 0, 0), (20, 20, 20), (255, 255, 255), (255, 255, 255), (80, 80, 80)


def font(size, bold=False):
    windir = Path(r"C:\Windows\Fonts")
    names = (["timesbd.ttf", "times.ttf"] if bold else ["times.ttf", "Times New Roman.ttf"])
    for n in names:
        p = windir / n
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


F_TITLE, F_HEAD, F_BODY, F_TINY, F_CAP = font(28, True), font(16, True), font(16), font(13), font(16, True)


def tsize(draw, text, fnt):
    b = draw.textbbox((0, 0), text, font=fnt)
    return b[2] - b[0], b[3] - b[1]


def center(draw, xywh, lines, fnt, fill=INK, gap=2):
    x, y, w, h = xywh
    widths, heights = [], []
    for ln in lines:
        tw, th = tsize(draw, ln, fnt)
        widths.append(tw)
        heights.append(th)
    total = sum(heights) + gap * (len(lines) - 1)
    cy = y + (h - total) / 2
    for ln, tw, th in zip(lines, widths, heights):
        draw.text((x + (w - tw) / 2, cy), ln, font=fnt, fill=fill)
        cy += th + gap


def box(draw, x, y, w, h, header, body, tag=None):
    draw.rectangle([x, y, x + w, y + h], outline=INK, width=2, fill=FILL)
    hh = 34
    draw.rectangle([x, y, x + w, y + hh], outline=INK, width=2, fill=HEAD)
    label = f"[{tag}]  {header}" if tag else header
    center(draw, (x, y, w, hh), [label], F_HEAD, fill=HEAD_FG)
    center(draw, (x + 8, y + hh, w - 16, h - hh), body, F_BODY)


def harrow(draw, x1, y, x2):
    draw.line([(x1, y), (x2, y)], fill=INK, width=3)
    draw.polygon([(x2, y), (x2 - 12, y - 7), (x2 - 12, y + 7)], fill=INK)


def varrow(draw, x, y1, y2):
    draw.line([(x, y1), (x, y2)], fill=INK, width=3)
    draw.polygon([(x, y2), (x - 7, y2 - 12), (x + 7, y2 - 12)], fill=INK)


def main():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    title = "PROPOSED SYSTEM — OVERALL WORKFLOW"
    tw, th = tsize(d, title, F_TITLE)
    d.text(((W - tw) / 2, 18), title, font=F_TITLE, fill=INK)

    bw, bh, gap = 300, 128, 40
    y1 = 70
    heads = [
        ("N1", "INPUT", ["Question text", "Optional image / PDF"]),
        ("N2", "RETRIEVE", ["STW page images", "NLEM / CDSCO", "Similar gold Q&A"]),
        ("N3", "ROUTER LLM", ["Frozen prompt", "Named tool or OOS"]),
        ("N4", "ANSWER LLM", ["Frozen prompt", "Draft from spans only"]),
        ("N5", "VERIFIER", ["Fail-closed code", "No span → reject"]),
    ]
    total = 5 * bw + 4 * gap
    x0 = (W - total) // 2
    xs = [x0 + i * (bw + gap) for i in range(5)]
    for i, (tag, head, body) in enumerate(heads):
        box(d, xs[i], y1, bw, bh, head, body, tag)
        if i < 4:
            harrow(d, xs[i] + bw, y1 + bh / 2, xs[i + 1])

    # tools under router
    y2 = 280
    twid, tht, tgap = 300, 118, 50
    tools = [
        ("T1", "CXR TOOL", ["CheXpert CNN", "Findings + scores"]),
        ("T2", "SKIN TOOL", ["HAM10000 / ISIC", "Class + score"]),
        ("T3", "DOCUMENT TOOL", ["OCR / Donut / LayoutLM", "Batch, brand, analyte"]),
    ]
    ttotal = 3 * twid + 2 * tgap
    tx0 = (W - ttotal) // 2
    txs = [tx0 + i * (twid + tgap) for i in range(3)]
    rx = xs[2] + bw / 2
    bar_y = y1 + bh + 28
    d.line([(rx, y1 + bh), (rx, bar_y)], fill=INK, width=3)
    d.line([(txs[0] + twid / 2, bar_y), (txs[2] + twid / 2, bar_y)], fill=INK, width=3)
    for i, (tag, head, body) in enumerate(tools):
        cx = txs[i] + twid / 2
        d.line([(cx, bar_y), (cx, y2)], fill=INK, width=3)
        varrow(d, cx, y2 - 1, y2)
        box(d, txs[i], y2, twid, tht, head, body, tag)

    note = "Router calls only the matching tool.  Out-of-scope skips T1–T3 and goes to the verifier."
    nw, _ = tsize(d, note, F_TINY)
    d.text(((W - nw) / 2, y2 + tht + 10), note, font=F_TINY, fill=MUTED)

    y3 = 520
    sw, sh, sgap = 360, 118, 50
    statuses = [
        ("GROUNDED", ["Quoted STW / NLEM / CDSCO", "+ tool JSON"]),
        ("INSUFFICIENT", ["Unreadable, missing span,", "or tools disagree"]),
        ("OUT OF SCOPE", ["No specialist is run.", "No clinical sentence."]),
    ]
    stotal = 3 * sw + 2 * sgap
    sx0 = (W - stotal) // 2
    sxs = [sx0 + i * (sw + sgap) for i in range(3)]
    vx = xs[4] + bw / 2
    bar2 = y3 - 28
    d.line([(vx, y1 + bh), (vx, bar2)], fill=INK, width=3)
    d.line([(sxs[0] + sw / 2, bar2), (sxs[2] + sw / 2, bar2)], fill=INK, width=3)
    for i, (head, body) in enumerate(statuses):
        cx = sxs[i] + sw / 2
        d.line([(cx, bar2), (cx, y3)], fill=INK, width=3)
        varrow(d, cx, y3 - 1, y3)
        box(d, sxs[i], y3, sw, sh, head, body, None)

    cap = "Fig. 4.1  Proposed overall workflow.  Watermark: NOT A DIAGNOSIS.  GEPA is not on this path."
    cw, _ = tsize(d, cap, F_CAP)
    d.text(((W - cw) / 2, H - 48), cap, font=F_CAP, fill=INK)
    img.save(OUT, dpi=(180, 180))
    print("wrote", OUT)


if __name__ == "__main__":
    main()
