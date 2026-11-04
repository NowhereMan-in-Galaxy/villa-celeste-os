/** A line laid out in columns (conjugation tables, word banks) must keep its spacing. */
export const isTable = (l: string) => /\S\s{3,}\S/.test(l.trim().replace(/^(\d{1,2}\.|[a-hA-H]\.)\s+/, ''));
const startsItem = (l: string) => /^(\d{1,2}\.|[a-hA-H]\.\s|[•·▪◦-]\s|[¿¡]?[A-ZÁÉÍÓÚÑ][\wáéíóúñ ]{0,22}:\s)/.test(l);

/** Join hard-wrapped prose lines into paragraphs; keep tables, items and blank lines. */
export function reflow(raw: string) {
  const out: string[] = [];
  let joinable = false;
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t) { out.push(''); joinable = false; continue; }
    if (isTable(line)) { out.push(line.replace(/^\s+/, (m) => m.slice(0, 4))); joinable = false; continue; }
    const prev = out[out.length - 2];
    if ((!joinable || /\d\.$/.test(prev ?? '')) && /^[a-záéíóúñ_]/.test(t) && out[out.length - 1] === '' && prev && !isTable(prev)) { out.pop(); out[out.length - 1] += ' ' + t; }
    else if (joinable && !startsItem(t)) out[out.length - 1] += ' ' + t;
    else out.push(t);
    joinable = !/[:]$/.test(t);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}
