import os
import re
import json

BASE = "/Users/DELL/.gemini/antigravity/scratch/villa-celeste-os/textbooks/extracted"

def split_book(book_id, full_txt_path):
    with open(full_txt_path, "r", encoding="utf-8") as f:
        text = f.read()
    pages = text.split("\x0c")
    out_dir = os.path.join(BASE, book_id)
    os.makedirs(out_dir, exist_ok=True)

    lesson_starts = {}
    supplemental_starts = {}

    for idx, p in enumerate(pages):
        if idx < 8:
            continue  # skip TOC
        lines = [l.strip() for l in p.splitlines() if l.strip()]
        if not lines:
            continue
        header_block = " ".join(lines[:3])
        if lines[0].startswith("Lesson") and len(lines) >= 3 and re.match(r"^\d+$", lines[1]):
            lnum = int(lines[1])
            title = re.sub(r"^Lesson\s+", "", lines[0]).strip()
            if lnum not in lesson_starts:
                lesson_starts[lnum] = (idx, title)
        elif "Speaking Activities" in header_block and "speaking_activities" not in supplemental_starts:
            supplemental_starts["speaking_activities"] = idx
        elif "Grammar Reference" in header_block and "grammar_reference" not in supplemental_starts:
            supplemental_starts["grammar_reference"] = idx
        elif "Glossary by Topic" in header_block and "glossary_by_topic" not in supplemental_starts:
            supplemental_starts["glossary_by_topic"] = idx
        elif "Glossary of Cognates" in header_block and "glossary_of_cognates" not in supplemental_starts:
            supplemental_starts["glossary_of_cognates"] = idx
        elif "Spanish-English Glossary" in header_block and "glossary_es_en" not in supplemental_starts:
            supplemental_starts["glossary_es_en"] = idx
        elif "English-Spanish Glossary" in header_block and "glossary_en_es" not in supplemental_starts:
            supplemental_starts["glossary_en_es"] = idx

    sorted_lessons = sorted(lesson_starts.items(), key=lambda x: x[0])
    manifest_lessons = []

    for i, (lnum, (start_idx, title)) in enumerate(sorted_lessons):
        if i + 1 < len(sorted_lessons):
            end_idx = sorted_lessons[i + 1][1][0]
        else:
            end_idx = min([v for v in supplemental_starts.values() if v > start_idx], default=len(pages))
        chunk = "\n\n--- PAGE BREAK ---\n\n".join(pages[start_idx:end_idx])
        fname = f"lesson_{lnum:02d}.txt"
        fpath = os.path.join(out_dir, fname)
        with open(fpath, "w", encoding="utf-8") as out:
            out.write(chunk)
        manifest_lessons.append({
            "book": book_id,
            "lesson": lnum,
            "globalLessonId": f"{'B1' if book_id == 'book1' else 'B2'}-L{lnum:02d}",
            "title": title,
            "file": f"textbooks/extracted/{book_id}/{fname}",
            "pages": f"{start_idx + 1}-{end_idx}",
            "chars": len(chunk)
        })

    supp_ordered = sorted(supplemental_starts.items(), key=lambda x: x[1])
    supp_manifest = []
    for i, (sname, sidx) in enumerate(supp_ordered):
        eidx = supp_ordered[i + 1][1] if i + 1 < len(supp_ordered) else len(pages)
        chunk = "\n\n--- PAGE BREAK ---\n\n".join(pages[sidx:eidx])
        fname = f"{sname}.txt"
        fpath = os.path.join(out_dir, fname)
        with open(fpath, "w", encoding="utf-8") as out:
            out.write(chunk)
        supp_manifest.append({
            "book": book_id,
            "section": sname,
            "file": f"textbooks/extracted/{book_id}/{fname}",
            "pages": f"{sidx + 1}-{eidx}",
            "chars": len(chunk)
        })

    return {"lessons": manifest_lessons, "supplemental": supp_manifest}

m1 = split_book("book1", os.path.join(BASE, "book1_full.txt"))
m2 = split_book("book2", os.path.join(BASE, "book2_full.txt"))

manifest = {
    "book1_title": "Learning Spanish: How to Understand and Speak a New Language (Part I - Villa Celeste)",
    "book2_title": "Learning Spanish II: How to Understand and Speak a New Language (Part II - Más allá de Villa Celeste)",
    "book1": m1,
    "book2": m2
}

with open(os.path.join(BASE, "MANIFEST.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print(f"Book 1 lessons: {len(m1['lessons'])}, supplemental: {[s['section'] for s in m1['supplemental']]}")
print(f"Book 2 lessons: {len(m2['lessons'])}, supplemental: {[s['section'] for s in m2['supplemental']]}")
