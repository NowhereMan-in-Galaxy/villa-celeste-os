#!/usr/bin/env python3
"""Compile the 60 extracted textbook lessons + glossaries into JSON under src/data/generated/."""
import json, re, os, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "textbooks" / "extracted"
OUT = ROOT / "src" / "data" / "generated"
DASH = re.compile(r"\s+[–—-]\s+")
SEC = re.compile(r"^\s*(I|II|III|IV|V|VI)\.\s+(Vocabulario|Repaso|Actividades|Lectura|Respuestas)", re.I)
CEFR = {(1, 0): "A1", (1, 1): "A1+", (1, 2): "A2", (2, 0): "A2+", (2, 1): "B1", (2, 2): "B1+"}

# Characters to tag lessons with (search names in the lesson text).
CAST = ["Luis", "Cecilia", "Alberto", "Diego", "Javier", "Erica", "Esteban", "Luisa", "Felipe", "Elena",
        "Carlos", "Alejandra", "Pablo", "Marisol", "Alejandro", "Marcela", "Jimena", "Álvaro", "Gustavo",
        "Leonor", "Julia", "Andrés", "José", "Ema", "Ignacio", "Juan Manuel"]


def clean_lines(text):
    out = []
    for ln in re.sub(r"[\x00-\x08\x0b-\x1f]", "", text.replace("\t", "    ")).split("\n"):
        s = ln.strip()
        if s == "--- PAGE BREAK ---" or s.startswith("Learning Spanish") or re.fullmatch(r"\d{1,3}", s):
            continue
        out.append(ln.rstrip())
    return out


def dedent(lines):
    ind = [len(l) - len(l.lstrip()) for l in lines if l.strip()]
    m = min(ind) if ind else 0
    txt = "\n".join(l[m:] for l in lines)
    return re.sub(r"\n{3,}", "\n\n", txt).strip("\n")


def chunks(line):
    """Split a two-column line into (startcol, text) chunks."""
    return [(m.start(), m.group().strip()) for m in re.finditer(r"\S.*?(?=(?<!\d\.)(?<!\d\.\s)(?<!\d\.\s\s)\s{3,}\S|$)", line)]


def parse_pairs(lines, with_categories=False):
    items, last, cat = [], {}, {}
    widths = [c[0] for l in lines for c in chunks(l) if c[0] > 20]
    split = min(widths) - 2 if widths else 40
    for l in lines:
        for start, t in chunks(l):
            col = 0 if start < split else 1
            if DASH.search(t):
                es, en = DASH.split(t, 1)
                it = {"es": es.strip(), "en": en.strip()}
                if with_categories and cat.get(col):
                    it["category"] = cat[col]
                items.append(it); last[col] = it
            elif "/" in t and with_categories and len(t) < 60 and not t.startswith("Glosario"):
                cat[0] = cat[1] = t.strip(); last[col] = None
            elif last.get(col) and not re.fullmatch(r"[A-ZÑ]", t):
                last[col]["en"] += " " + t
    for it in items:
        m = re.search(r"\[([^\]]+)\]\s*$", it["en"])
        if m:
            it["notes"] = m.group(1); it["en"] = it["en"][: m.start()].strip()
        it["en"] = re.sub(r"\s+", " ", it["en"])
    return items


def split_letters(lines, pat=r"^\s{0,8}([a-l])\.\s+(?=\S)"):
    blocks, cur = [], None
    for l in lines:
        m = re.match(pat, l)
        if m:
            cur = {"key": m.group(1), "lines": [l[m.end():]]}; blocks.append(cur)
        elif cur:
            cur["lines"].append(l)
    return blocks


def parse_answers(lines):
    keys = {}
    for b in split_letters(lines):
        nums, raw = {}, dedent(b["lines"])
        for l in b["lines"]:
            for _, t in chunks(l):
                m = re.match(r"(\d{1,2})\.\s*(.*)", t)
                if m:
                    nums[m.group(1)] = m.group(2).strip()
        keys[b["key"]] = {"raw": raw, "items": nums}
    return keys


def norm(s):
    return unicodedata.normalize("NFC", s)


def parse_lesson(book, n, title):
    text = norm((SRC / f"book{book}" / f"lesson_{n:02d}.txt").read_text(encoding="utf-8"))
    lines = clean_lines(text)
    secs, cur = {}, None
    for l in lines:
        m = SEC.match(l)
        if m and not (cur == "resp" and m.group(2).lower().startswith("lect")):
            cur = m.group(2).lower()[:4]; secs[cur] = []; continue
        if cur:
            secs[cur].append(l)
    vocab = parse_pairs(secs.get("voca", []))
    lid = f"B{book}-L{n:02d}"
    for i, v in enumerate(vocab):
        v["id"] = f"{lid}-v{i}"
    # Grammar sections A., B., ...
    grammar = []
    for b in split_letters(secs.get("repa", []), r"^\s{0,8}([A-H])\.\s+(?=[A-ZÁÉÍÓÚ¿¡])"):
        title_ = b["lines"][0].strip()
        grammar.append({"id": f"{lid}-g{b['key']}", "title": f"{b['key']}. {title_}", "content": dedent(b["lines"][1:])})
    if not grammar and secs.get("repa"):
        grammar.append({"id": f"{lid}-g", "title": "Repaso general", "content": dedent(secs["repa"])})
    resp = secs.get("resp", [])
    cut = next((i for i, l in enumerate(resp) if re.fullmatch(r"\s*(IV\.\s*)?Lectura cultural( / Cultural [Rr]eading)?\s*", l)), None)
    answers = parse_answers(resp[:cut] if cut is not None else resp)
    if cut is not None:
        tail = resp[cut + 1:]
        nums = {}
        for l in tail:
            for _, t in chunks(l):
                m = re.match(r"(\d{1,2})\.\s*(.*)", t)
                if m and m.group(1) not in nums:
                    nums[m.group(1)] = m.group(2).strip()
        answers["_read"] = {"items": nums, "raw": dedent(tail)}
    activities = []
    for b in split_letters(secs.get("acti", [])):
        body = b["lines"]
        para = []
        for l in body:
            if not l.strip() and para:
                break
            para.append(l.strip())
        head = " ".join(para)
        es, _, en = head.partition(" / ")
        ans = answers.get(b["key"], {})
        activities.append({
            "id": f"{lid}-a{b['key']}", "key": b["key"], "instructionsEs": es.strip(), "instructionsEn": en.strip(),
            "rawText": dedent(body[len(para):]), "answers": ans.get("items", {}), "rawAnswerKey": ans.get("raw", ""),
        })
    reading = None
    if secs.get("lect"):
        body = dedent(secs["lect"])
        paras = body.split("\n\n")
        instr = paras[0].replace("\n", " ")
        # The reading's answer key is the letter after the last activity.
        used = {a["key"] for a in activities}
        extra = [k for k in answers if k not in used]
        ak = answers.get("_read") or (answers.get(extra[0]) if extra else None)
        reading = {"instructions": instr, "text": "\n\n".join(paras[1:]),
                   "answers": ak["items"] if ak else {}, "rawAnswerKey": ak["raw"] if ak else ""}
    focus = [c for c in CAST if re.search(r"\b" + c + r"\b", text)]
    return {
        "id": lid, "book": book, "lessonNumber": n, "globalIndex": (book - 1) * 30 + n, "title": title,
        "cefrLevel": CEFR[(book, (n - 1) // 10)], "neighborhoodFocus": focus,
        "vocabulary": vocab, "grammar": grammar, "activities": activities, "culturalReading": reading,
    }


def parse_speaking():
    p = SRC / "book2" / "speaking_activities.txt"
    out = {}
    lines = clean_lines(norm(p.read_text(encoding="utf-8")))
    cur = None
    for l in lines:
        m = re.match(r"^\s*Lesson (\d+)\s*$", l)
        if m:
            cur = int(m.group(1)); out[cur] = []; continue
        if cur:
            out[cur].append(l)
    return {f"B2-L{k:02d}": dedent(v) for k, v in out.items()}


def parse_glossaries():
    res = {"es": [], "topic": [], "cognates": []}
    seen = set()
    for book in (1, 2):
        d = SRC / f"book{book}"
        for it in parse_pairs(clean_lines(norm((d / "glossary_es_en.txt").read_text(encoding="utf-8")))):
            k = it["es"].lower()
            if k not in seen and len(k) < 60:
                seen.add(k); res["es"].append(it)
        res["topic"] += [dict(it, book=book) for it in parse_pairs(clean_lines(norm((d / "glossary_by_topic.txt").read_text(encoding="utf-8"))), True)]
        res["cognates"] += parse_pairs(clean_lines(norm((d / "glossary_of_cognates.txt").read_text(encoding="utf-8"))))
    res["es"].sort(key=lambda x: unicodedata.normalize("NFD", re.sub(r"^(el|la|los|las)\s+", "", x["es"].lower())))
    return res


def main():
    manifest = json.loads((SRC / "MANIFEST.json").read_text(encoding="utf-8"))
    (OUT / "lessons").mkdir(parents=True, exist_ok=True)
    speaking = parse_speaking()
    index, report = [], []
    for bk in ("book1", "book2"):
        for m in manifest[bk]["lessons"]:
            L = parse_lesson(int(bk[-1]), m["lesson"], m["title"])
            if L["id"] in speaking:
                L["speaking"] = speaking[L["id"]]
            (OUT / "lessons" / f"{L['id']}.json").write_text(json.dumps(L, ensure_ascii=False), encoding="utf-8")
            nq = sum(len(a["answers"]) for a in L["activities"])
            index.append({k: L[k] for k in ("id", "book", "lessonNumber", "globalIndex", "title", "cefrLevel", "neighborhoodFocus")}
                         | {"grammarTitles": [g["title"] for g in L["grammar"]], "vocabCount": len(L["vocabulary"]), "questionCount": nq})
            report.append(f"{L['id']} v={len(L['vocabulary']):3} g={len(L['grammar'])} a={len(L['activities'])} q={nq:3} read={'Y' if L['culturalReading'] else '-'}")
    (OUT / "index.json").write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")
    g = parse_glossaries()
    g["grammar"] = [dedent(clean_lines(norm((SRC / f"book{b}" / "grammar_reference.txt").read_text(encoding="utf-8")))) for b in (1, 2)]
    (OUT / "glossary.json").write_text(json.dumps(g, ensure_ascii=False), encoding="utf-8")
    print("\n".join(report))
    print(f"glossary es={len(g['es'])} topic={len(g['topic'])} cognates={len(g['cognates'])} speaking={len(speaking)}")


if __name__ == "__main__":
    main()
