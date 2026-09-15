"""
Add fade slide transitions and click-sequence fade-in animations.

Shapes named click_NN_* appear together on click N (fade, 450 ms).
Names starting with static_ are never animated.
"""
from __future__ import annotations

import re
import shutil
import sys
import zipfile
from collections import defaultdict
from pathlib import Path
import xml.etree.ElementTree as ET

P = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
ET.register_namespace("p", P)
ET.register_namespace("a", A)
ET.register_namespace(
    "r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
)

NS = {"p": P, "a": A}


def spid_and_name(el):
    cNvPr = None
    for path in (
        "./p:nvSpPr/p:cNvPr",
        "./p:nvPicPr/p:cNvPr",
        "./p:nvGraphicFramePr/p:cNvPr",
        "./p:nvCxnSpPr/p:cNvPr",
    ):
        cNvPr = el.find(path, NS)
        if cNvPr is not None:
            break
    if cNvPr is None:
        return None, None
    return cNvPr.get("id"), cNvPr.get("name") or ""


def collect_click_groups(tree):
    groups = defaultdict(list)
    for tag in ("sp", "pic", "graphicFrame", "cxnSp"):
        for el in tree.findall(f".//p:{tag}", NS):
            sid, name = spid_and_name(el)
            if not sid:
                continue
            m = re.match(r"click_(\d+)", name)
            if m:
                groups[int(m.group(1))].append(sid)
    return dict(sorted(groups.items()))


def el(tag, attrib=None, children=None):
    node = ET.Element(f"{{{P}}}{tag}", attrib or {})
    for child in children or []:
        if child is not None:
            node.append(child)
    return node


def fade_effect(eid, spid, dur="450"):
    return el(
        "animEffect",
        {"transition": "in", "filter": "fade"},
        [
            el(
                "cBhvr",
                None,
                [
                    el("cTn", {"id": str(eid), "dur": dur}),
                    el("tgtEl", None, [el("spTgt", {"spid": str(spid)})]),
                ],
            )
        ],
    )


def build_timing(groups):
    tid = 1

    def nid():
        nonlocal tid
        tid += 1
        return str(tid)

    click_pars = []
    bld = []
    for gi, (_n, spids) in enumerate(groups.items()):
        inner = []
        for j, spid in enumerate(spids):
            node_type = "clickEffect" if j == 0 else "withEffect"
            # first shape of a later group is also a click
            if gi > 0 and j == 0:
                node_type = "clickEffect"
            if gi == 0 and j == 0:
                node_type = "clickEffect"
            inner.append(
                el(
                    "par",
                    None,
                    [
                        el(
                            "cTn",
                            {
                                "id": nid(),
                                "presetID": "10",
                                "presetClass": "entr",
                                "presetSubtype": "0",
                                "fill": "hold",
                                "grpId": "0",
                                "nodeType": node_type,
                            },
                            [
                                el("stCondLst", None, [el("cond", {"delay": "0"})]),
                                el("childTnLst", None, [fade_effect(nid(), spid)]),
                            ],
                        )
                    ],
                )
            )
            bld.append(el("bldP", {"spid": str(spid), "grpId": "0"}))

        click_pars.append(
            el(
                "par",
                None,
                [
                    el(
                        "cTn",
                        {"id": nid(), "fill": "hold"},
                        [
                            el("stCondLst", None, [el("cond", {"delay": "indefinite"})]),
                            el(
                                "childTnLst",
                                None,
                                [
                                    el(
                                        "par",
                                        None,
                                        [
                                            el(
                                                "cTn",
                                                {"id": nid(), "fill": "hold"},
                                                [
                                                    el(
                                                        "stCondLst",
                                                        None,
                                                        [el("cond", {"delay": "0"})],
                                                    ),
                                                    el("childTnLst", None, inner),
                                                ],
                                            )
                                        ],
                                    )
                                ],
                            ),
                        ],
                    )
                ],
            )
        )

    seq = el(
        "seq",
        {"concurrent": "true", "nextAc": "seek"},
        [
            el(
                "cTn",
                {"id": nid(), "dur": "indefinite", "nodeType": "mainSeq"},
                [el("childTnLst", None, click_pars)],
            ),
            el(
                "prevCondLst",
                None,
                [
                    el(
                        "cond",
                        {"evt": "onPrev", "delay": "0"},
                        [el("tgtEl", None, [el("sldTgt")])],
                    )
                ],
            ),
            el(
                "nextCondLst",
                None,
                [
                    el(
                        "cond",
                        {"evt": "onNext", "delay": "0"},
                        [el("tgtEl", None, [el("sldTgt")])],
                    )
                ],
            ),
        ],
    )
    timing = el(
        "timing",
        None,
        [
            el(
                "tnLst",
                None,
                [
                    el(
                        "par",
                        None,
                        [
                            el(
                                "cTn",
                                {
                                    "id": "1",
                                    "dur": "indefinite",
                                    "restart": "never",
                                    "nodeType": "tmRoot",
                                },
                                [el("childTnLst", None, [seq])],
                            )
                        ],
                    )
                ],
            ),
            el("bldLst", None, bld),
        ],
    )
    return timing


def process_slide_xml(xml_bytes: bytes) -> bytes:
    tree = ET.fromstring(xml_bytes)
    groups = collect_click_groups(tree)
    # Remove existing timing/transition
    for child in list(tree):
        tag = child.tag.split("}")[-1]
        if tag in ("timing", "transition"):
            tree.remove(child)
    trans = el("transition", {"spd": "med", "advClick": "1"}, [el("fade")])
    tree.append(trans)
    if groups:
        tree.append(build_timing(groups))
    return ET.tostring(tree, encoding="utf-8", xml_declaration=True)


def main(src: str, dst: str):
    src_p, dst_p = Path(src), Path(dst)
    tmp = dst_p.with_suffix(".anim.zip")
    shutil.copy2(src_p, tmp)
    buf = {}
    with zipfile.ZipFile(tmp, "r") as z:
        names = z.namelist()
        for name in names:
            data = z.read(name)
            if re.match(r"ppt/slides/slide\d+\.xml$", name):
                data = process_slide_xml(data)
            buf[name] = data
    with zipfile.ZipFile(dst_p, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in buf.items():
            z.writestr(name, data)
    tmp.unlink(missing_ok=True)
    print("animated", dst_p)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
