/** Lowercase, strip accents/punctuation/extra spaces for lenient comparison. */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[¿?¡!.,;:"“”'()[\]]/g, '').replace(/\s+/g, ' ').trim();

/** Accent-exact comparison but case/punctuation-insensitive. */
const soft = (s: string) => s.toLowerCase().replace(/[¿?¡!.,;:"“”'()[\]]/g, '').replace(/\s+/g, ' ').trim();

/** Alternatives in textbook keys are separated by " / ". */
export const alternatives = (answer: string) =>
  answer.split(/\s*\/\s*/).flatMap((a) => {
    const clean = a.replace(/\[[^\]]*\]/g, '').trim();
    const noParen = clean.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
    return noParen && noParen !== clean ? [clean, noParen] : [clean];
  }).filter(Boolean);

export type Verdict = 'right' | 'accent' | 'wrong';
/** Grade trying the input alone and joined with the words printed around the blank. */
export function gradeCtx(input: string, answer: string, before = '', after = ''): Verdict {
  if (!input.trim()) return 'wrong';
  const c = [input, `${input} ${after}`, `${before} ${input}`, `${before} ${input} ${after}`].map((x) => grade(x, answer));
  return c.includes('right') ? 'right' : c.includes('accent') ? 'accent' : 'wrong';
}

export function grade(input: string, answer: string): Verdict {
  if (!input.trim()) return 'wrong';
  const alts = alternatives(answer);
  if (alts.some((a) => soft(a) === soft(input))) return 'right';
  if (alts.some((a) => fold(a) === fold(input))) return 'accent';
  return 'wrong';
}

/** Whether an answer key entry is short enough to auto-grade (vs. open-ended self-check). */
export const gradable = (answer: string) => !!answer && alternatives(answer).every((a) => a.length <= 45) && !/answers will vary|respuestas variarán/i.test(answer);
