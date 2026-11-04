import { Fragment, useMemo, useState } from 'react';
import type { Activity } from '../../types/curriculum';
import { gradeCtx, gradable, Verdict } from '../../utils/text';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { Speak } from '../../ui/kit';

type Seg = { t: 'text'; s: string } | { t: 'blank'; num: string; part: number; opts?: string[]; before: string; after: string };

const isCF = (a: string) => /^(c|f|cierto|falso)$/i.test(a.trim());
const CF = ['cierto', 'falso'];
const cfNorm = (s: string) => (s.trim().toLowerCase().startsWith('c') ? 'cierto' : 'falso');

/** Split activity text into text + blanks, attributing each blank to the preceding item number. */
export function segment(raw: string, answers: Record<string, string>) {
  const segs: Seg[] = [];
  const re = /_{3,}|(?:^|(?<=\s))(\d{1,2})\.(?=[\s_¡¿]|$)/gm;
  let last = 0, cur: string | null = null, m: RegExpExecArray | null;
  const parts: Record<string, number> = {};
  while ((m = re.exec(raw))) {
    if (m[1]) { if (answers[m[1]] !== undefined) cur = m[1]; continue; }
    segs.push({ t: 'text', s: raw.slice(last, m.index) });
    last = m.index + m[0].length;
    if (!cur) { segs.push({ t: 'text', s: m[0] }); continue; }
    const after = raw.slice(last, last + 60).match(/^\s{0,3}\(([^()]+\/[^()]+)\)/);
    const part = (parts[cur] = (parts[cur] ?? -1) + 1);
    const before = (raw.slice(Math.max(0, m.index - 40), m.index).split(/[\n:.!?]|\d+\./).pop() ?? '').trim();
    const aft = (raw.slice(last, last + 40).split(/[\n.!?,(]|_{3}/)[0] ?? '').trim();
    segs.push({ t: 'blank', num: cur, part, before, after: aft, opts: after ? after[1].split('/').map((s) => s.trim()) : undefined });
  }
  segs.push({ t: 'text', s: raw.slice(last) });
  // Expected answer per blank; drop blank attribution if the key can't be split to match.
  const counts: Record<string, number> = {};
  for (const s of segs) if (s.t === 'blank') counts[s.num] = (counts[s.num] ?? 0) + 1;
  const expected = (num: string, part: number) => {
    const a = answers[num];
    if (counts[num] === 1) return a;
    const p = a.split(/\s*,\s*/);
    return p.length === counts[num] ? p[part] : part === 0 ? a : null;
  };
  return { segs, counts, expected };
}

export function ActivityView({ act, lessonId }: { act: Activity; lessonId: string }) {
  const { solved, solve } = useStore();
  const { segs, counts, expected } = useMemo(() => segment(act.rawText, act.answers), [act]);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [showKey, setShowKey] = useState(false);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const nums = Object.keys(act.answers).sort((a, b) => +a - +b);
  const qid = (n: string) => `${act.id}-${n}`;
  const sheet = nums.filter((n) => !counts[n]); // items with no inline blank

  const check = () => {
    const v: Record<string, Verdict> = {};
    let ok = 0, tot = 0;
    const perItem: Record<string, boolean> = {};
    const judge = (key: string, num: string, input: string, exp: string, before = '', after = '') => {
      const r = isCF(exp) ? (input && cfNorm(input) === cfNorm(exp) ? 'right' : 'wrong') : gradeCtx(input, exp, before, after);
      v[key] = r;
      perItem[num] = (perItem[num] ?? true) && r !== 'wrong';
    };
    segs.forEach((s) => {
      if (s.t !== 'blank') return;
      const exp = expected(s.num, s.part);
      if (exp === null || !gradable(exp)) return;
      judge(`${s.num}.${s.part}`, s.num, vals[`${s.num}.${s.part}`] ?? '', exp, s.before, s.after);
    });
    sheet.forEach((n) => gradable(act.answers[n]) && judge(`${n}.s`, n, vals[`${n}.s`] ?? '', act.answers[n]));
    for (const [n, good] of Object.entries(perItem)) { tot++; if (good) { ok++; solve(qid(n)); } }
    setVerdicts(v);
    sfx(tot && ok === tot ? 'ding' : ok ? 'click' : 'wrong');
    if (tot && ok === tot) useStore.getState().toast(`¡Perfecto! ${ok}/${tot} ✔`);
  };

  const input = (key: string, exp: string | null, opts?: string[], wide = false) => {
    const val = vals[key] ?? '';
    const cls = `field ${verdicts[key] ?? ''} mx-[2px] align-baseline`;
    const set = (x: string) => setVals((p) => ({ ...p, [key]: x }));
    const options = opts ?? (exp && isCF(exp) ? CF : undefined);
    if (options)
      return <select className={cls} value={val} onChange={(e) => set(e.target.value)}><option value="">—</option>{options.map((o) => <option key={o}>{o}</option>)}</select>;
    const w = Math.max(6, Math.min(22, Math.max(...(exp ?? '').split(' / ').map((a) => a.length)) + 1));
    return <input className={cls} style={{ width: wide ? '100%' : `${w}ch` }} value={val} title={verdicts[key] === 'accent' ? '¡Casi! Revisa los acentos.' : undefined}
      onChange={(e) => set(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} />;
  };

  const answered = nums.filter((n) => solved[qid(n)]).length;
  return (
    <div className="flex flex-col gap-2">
      <div className="panel p-2">
        <div className="font-bold">{act.key}. {act.instructionsEs} <Speak text={act.instructionsEs} /></div>
        {act.instructionsEn && <div className="text-[12px] opacity-75 italic mt-1">{act.instructionsEn}</div>}
      </div>
      <div className="inset p-3 mono text-[13px] leading-[2] overflow-x-auto select-text">
        {segs.map((s, i) => {
          if (s.t === 'text') return <Fragment key={i}>{s.s}</Fragment>;
          const exp = expected(s.num, s.part);
          if (exp === null || !gradable(exp)) return <Fragment key={i}>________</Fragment>;
          return <Fragment key={i}>{input(`${s.num}.${s.part}`, exp, s.opts)}</Fragment>;
        })}
      </div>
      {sheet.length > 0 && (
        <fieldset className="group">
          <legend>Hoja de respuestas</legend>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'auto 1fr' }}>
            {sheet.map((n) => {
              const a = act.answers[n];
              return (
                <Fragment key={n}>
                  <span className="text-right pr-1 pt-[3px]">{n}.</span>
                  {gradable(a) ? <div>{input(`${n}.s`, a, undefined)}</div> : (
                    <div className="flex flex-col gap-1">
                      <textarea className="field w-full" rows={2} placeholder="Escribe tu respuesta..." />
                      {reveal[n] ? (
                        <div className="text-[12px]"><b>Modelo:</b> {a} <Speak text={a} />{' '}
                          {!solved[qid(n)] && <button className="btn text-[11px]" onClick={() => { solve(qid(n)); sfx('ding'); }}>¡La tenía bien! ✔</button>}
                        </div>
                      ) : <button className="btn self-start text-[11px]" onClick={() => setReveal((r) => ({ ...r, [n]: true }))}>Ver respuesta modelo</button>}
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </fieldset>
      )}
      {segs.some((s) => s.t === 'blank' && expected(s.num, s.part) !== null && !gradable(expected(s.num, s.part)!)) && (
        <div className="text-[12px] opacity-75">Algunas respuestas son abiertas: compáralas con la clave de respuestas.</div>
      )}
      <div className="flex gap-2 items-center flex-wrap">
        <button className="btn font-bold" onClick={check}>✔ Comprobar</button>
        <button className="btn" onClick={() => setShowKey(!showKey)}>{showKey ? 'Ocultar' : 'IV. Respuestas correctas'}</button>
        <button className="btn" onClick={() => { setVals({}); setVerdicts({}); }}>Borrar</button>
        <span className="text-[12px] ml-auto">Resueltas: {answered}/{nums.length}</span>
      </div>
      {showKey && <div className="inset p-2 mono text-[12px] select-text" style={{ background: '#ffffe1' }}>{act.rawAnswerKey || nums.map((n) => `${n}. ${act.answers[n]}`).join('\n')}</div>}
    </div>
  );
}

