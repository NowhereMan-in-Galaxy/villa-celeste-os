export interface Verb {
  inf: string; en: string;
  sc?: 'ie' | 'ue' | 'i';            // present stem change
  pres?: string[]; yo?: string;       // full irregular present / irregular yo only
  pret?: string[]; ps?: string;       // full irregular preterite / irregular preterite stem
  impf?: string[]; fs?: string;       // irregular imperfect / future stem
  part?: string; tu?: string; subj?: string[];
  y?: boolean;                        // leer-type: i -> y in preterite, accented participle
}
export type Tense = 'pres' | 'pret' | 'impf' | 'fut' | 'cond' | 'perf' | 'subj' | 'isubj' | 'cmd';

export const PRONOUNS: string[][] = [['yo'], ['tú'], ['él', 'ella', 'usted'], ['nosotros', 'nosotras'], ['ellos', 'ellas', 'ustedes']];
export const CMD_LABELS = ['usted', 'ustedes', 'tú (afirmativo)', 'tú (negativo)'];

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const ending = (inf: string) => plain(inf.slice(-2)) as 'ar' | 'er' | 'ir';
const stemOf = (inf: string) => inf.slice(0, -2);

function chg(stem: string, t: 'ie' | 'ue' | 'i') {
  const sub = (ch: string, to: string) => { const i = stem.lastIndexOf(ch); return i < 0 ? stem : stem.slice(0, i) + to + stem.slice(i + 1); };
  if (t === 'ie') return sub('e', 'ie');
  if (t === 'i') return sub('e', 'i');
  return stem.includes('o') ? sub('o', 'ue') : sub('u', 'ue');
}
const chgIr = (stem: string, t: 'ie' | 'ue' | 'i') => { // pret / nosotros-subj change in -ir verbs
  const [a, b] = t === 'ue' ? ['o', 'u'] : ['e', 'i'];
  const i = stem.lastIndexOf(a);
  return i < 0 ? stem : stem.slice(0, i) + b + stem.slice(i + 1);
};

function join(inf: string, stem: string, e: string) {
  const front = /^[eé]/.test(e), back = /^[ao]/.test(e);
  if (front && /car$/.test(inf)) stem = stem.replace(/c$/, 'qu');
  else if (front && /gar$/.test(inf)) stem = stem.replace(/g$/, 'gu');
  else if (front && /zar$/.test(inf)) stem = stem.replace(/z$/, 'c');
  else if (back && /g[ei]r$/.test(inf)) stem = stem.replace(/g$/, 'j');
  else if (back && /guir$/.test(inf)) stem = stem.replace(/gu$/, 'g');
  return stem + e;
}

const PRES = { ar: ['o', 'as', 'a', 'amos', 'an'], er: ['o', 'es', 'e', 'emos', 'en'], ir: ['o', 'es', 'e', 'imos', 'en'] };
const SUBJ = { ar: ['e', 'es', 'e', 'emos', 'en'], er: ['a', 'as', 'a', 'amos', 'an'], ir: ['a', 'as', 'a', 'amos', 'an'] };

function pres(v: Verb, p: number): string {
  if (v.pres) return v.pres[p];
  if (p === 0 && v.yo) return v.yo;
  const e = ending(v.inf);
  let s = stemOf(v.inf);
  if (v.sc && p !== 3) s = chg(s, v.sc);
  return join(v.inf, s, PRES[e][p]);
}

function pret(v: Verb, p: number): string {
  if (v.pret) return v.pret[p];
  if (v.ps) return v.ps + ['e', 'iste', 'o', 'imos', v.ps.endsWith('j') ? 'eron' : 'ieron'][p];
  const e = ending(v.inf);
  let s = stemOf(v.inf);
  if (v.y) return s + ['í', 'íste', 'yó', 'ímos', 'yeron'][p];
  if (e === 'ir' && v.sc && (p === 2 || p === 4)) s = chgIr(s, v.sc);
  return join(v.inf, s, (e === 'ar' ? ['é', 'aste', 'ó', 'amos', 'aron'] : ['í', 'iste', 'ió', 'imos', 'ieron'])[p]);
}

function subj(v: Verb, p: number): string {
  if (v.subj) return v.subj[p];
  const e = ending(v.inf);
  let s: string;
  if (p !== 3 || v.pres || v.yo) s = pres(v, 0).slice(0, -1);
  else { s = stemOf(v.inf); if (e === 'ir' && v.sc) s = chgIr(s, v.sc); }
  return join(v.inf, s, SUBJ[e][p]);
}

const accentLast = (s: string) => s.replace(/([aeiou])([^aeiou]*)$/, (_, a, r) => 'áéíóú'['aeiou'.indexOf(a)] + r);

/** p: 0 yo, 1 tú, 2 él, 3 nosotros, 4 ellos (for 'cmd': 0 usted, 1 ustedes, 2 tú+, 3 tú-). */
export function conjugate(v: Verb, t: Tense, p: number): string {
  const e = ending(v.inf), stem = stemOf(v.inf);
  switch (t) {
    case 'pres': return pres(v, p);
    case 'pret': return pret(v, p);
    case 'impf': return v.impf ? v.impf[p] : stem + (e === 'ar' ? ['aba', 'abas', 'aba', 'ábamos', 'aban'] : ['ía', 'ías', 'ía', 'íamos', 'ían'])[p];
    case 'fut': return (v.fs ?? plain(v.inf)) + ['é', 'ás', 'á', 'emos', 'án'][p];
    case 'cond': return (v.fs ?? plain(v.inf)) + ['ía', 'ías', 'ía', 'íamos', 'ían'][p];
    case 'perf': return ['he', 'has', 'ha', 'hemos', 'han'][p] + ' ' + (v.part ?? (v.y ? stem + 'ído' : stem + (e === 'ar' ? 'ado' : 'ido')));
    case 'subj': return subj(v, p);
    case 'isubj': { const s = pret(v, 4).slice(0, -3); return (p === 3 ? accentLast(s) : s) + ['ra', 'ras', 'ra', 'ramos', 'ran'][p]; }
    case 'cmd': return [subj(v, 2), subj(v, 4), v.tu ?? pres(v, 2), 'no ' + subj(v, 1)][p];
  }
}
