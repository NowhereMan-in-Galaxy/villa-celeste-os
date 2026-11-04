import indexJson from './generated/index.json';
import type { LessonData, LessonMeta, Glossary, GlossEntry } from '../types/curriculum';
import { fold } from '../utils/text';

export const LESSONS = indexJson as LessonMeta[];
const files = import.meta.glob<LessonData>('./generated/lessons/*.json', { import: 'default' });
const cache: Record<string, LessonData> = {};

export async function loadLesson(id: string): Promise<LessonData> {
  return (cache[id] ??= await files[`./generated/lessons/${id}.json`]());
}

let gloss: Promise<Glossary> | null = null;
let lookupMap: Map<string, GlossEntry> | null = null;
export const loadGlossary = () => (gloss ??= import('./generated/glossary.json').then((m) => m.default as Glossary));

/** Look up a single Spanish word (strips articles, tries simple de-inflections). */
export async function lookupWord(word: string): Promise<GlossEntry | null> {
  const g = await loadGlossary();
  if (!lookupMap) {
    lookupMap = new Map();
    for (const e of [...g.cognates, ...g.topic, ...g.es]) {
      const k = fold(e.es.replace(/^(el|la|los|las|un|una)\s+/i, ''));
      lookupMap.set(k, e);
    }
  }
  const w = fold(word);
  const tries = [w, w.replace(/s$/, ''), w.replace(/es$/, ''), w.replace(/a$/, 'o'), w.replace(/as$/, 'o'), w.replace(/os$/, 'o')];
  for (const t of tries) { const e = lookupMap.get(t); if (e) return e; }
  return null;
}
