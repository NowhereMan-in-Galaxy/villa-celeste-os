import { useEffect, useMemo, useState } from 'react';
import type { AppProps } from '../../config/apps';
import { LESSONS, loadLesson } from '../../data/curriculum';
import type { LessonData } from '../../types/curriculum';
import { useStore } from '../../store';
import { Speak, SrsStar, Tabs, Progress } from '../../ui/kit';
import { ActivityView } from './ActivityView';
import { openApp } from '../../os/wm';
import { sfx } from '../../utils/sound';
import { gradable } from '../../utils/text';

type Tab = 'vocab' | 'gram' | 'act' | 'lect';

/** A lesson is open if sandbox is on, it's among the first 3 of a book, or the previous lesson is ≥ 30%. */
export function useUnlocked() {
  const { lessons, settings } = useStore();
  return (id: string) => {
    if (settings.unlockAll) return true;
    const i = LESSONS.findIndex((l) => l.id === id), l = LESSONS[i];
    return l.lessonNumber <= 3 || (lessons[LESSONS[i - 1].id] ?? 0) >= 30;
  };
}

function lessonQids(L: LessonData) {
  const ids = L.activities.flatMap((a) => Object.keys(a.answers).map((n) => `${a.id}-${n}`));
  if (L.culturalReading) ids.push(...Object.keys(L.culturalReading.answers).map((n) => `${L.id}-read-${n}`));
  return ids;
}

export default function AcademiaApp({ args }: AppProps) {
  const [book, setBook] = useState<1 | 2>(1);
  const [q, setQ] = useState('');
  const [id, setId] = useState<string>(args?.lesson ?? 'B1-L01');
  const [L, setL] = useState<LessonData | null>(null);
  const [tab, setTab] = useState<Tab>('vocab');
  const [actIdx, setActIdx] = useState(0);
  const { lessons, solved, setLessonProgress, unlock } = useStore();
  const unlocked = useUnlocked();

  useEffect(() => { if (args?.lesson) { setId(args.lesson); setBook(args.lesson[1] === '2' ? 2 : 1); } }, [args?.lesson]);
  useEffect(() => { let on = true; loadLesson(id).then((d) => on && (setL(d), setActIdx(0))); return () => { on = false; }; }, [id]);

  // Recompute lesson progress whenever solved set changes.
  const qids = useMemo(() => (L ? lessonQids(L) : []), [L]);
  const pct = qids.length ? Math.round((qids.filter((x) => solved[x]).length / qids.length) * 100) : 0;
  useEffect(() => {
    if (!L) return;
    setLessonProgress(L.id, pct);
    if (pct >= 80) {
      unlock('vecino');
      if (L.id === 'B1-L06') unlock('fiesta');
      if (/subjunctive/i.test(L.title)) unlock('subjuntivo');
      const all = useStore.getState().lessons;
      if ([1, 2].some((b) => LESSONS.filter((x) => x.book === b).every((x) => (all[x.id] ?? 0) >= 80))) unlock(LESSONS.filter((x) => x.book === 1).every((x) => (all[x.id] ?? 0) >= 80) ? 'libro1' : 'libro2');
    }
  }, [pct, L]);

  const list = LESSONS.filter((l) => l.book === book && (!q || `${l.title} ${l.grammarTitles.join(' ')} ${l.neighborhoodFocus.join(' ')}`.toLowerCase().includes(q.toLowerCase())));
  const meta = LESSONS.find((l) => l.id === id)!;

  return (
    <div className="h-full flex">
      <aside className="w-[230px] shrink-0 flex flex-col gap-1 p-1 max-sm:hidden">
        <div className="flex gap-1">{([1, 2] as const).map((b) => <button key={b} className={`btn flex-1 ${book === b ? 'on font-bold' : ''}`} onClick={() => setBook(b)}>Libro {b}</button>)}</div>
        <input className="field" placeholder="🔍 Buscar tema, personaje..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="inset flex-1 overflow-auto">
          {list.map((l) => {
            const open = unlocked(l.id), p = lessons[l.id] ?? 0;
            return (
              <div key={l.id} className={`list-item text-[12px] flex gap-1 items-center ${l.id === id ? 'sel' : ''} ${open ? '' : 'opacity-50'}`}
                onClick={() => (open ? (sfx('click'), setId(l.id)) : (sfx('error'), useStore.getState().toast('🔒 Completa el 30% de la lección anterior (o activa "Desbloquear todo" en Control)')))}>
                <span className="w-5 text-center">{!open ? '🔒' : p >= 80 ? '✅' : p > 0 ? '📗' : '📘'}</span>
                <span className="flex-1 leading-tight"><b>{l.lessonNumber}.</b> {l.title}</span>
                <span className="text-[10px] opacity-70">{l.cefrLevel}</span>
              </div>
            );
          })}
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col p-1">
        <div className="panel p-2 flex items-center gap-3 flex-wrap">
          <select className="field sm:hidden" value={id} onChange={(e) => setId(e.target.value)}>
            {LESSONS.filter((l) => unlocked(l.id)).map((l) => <option key={l.id} value={l.id}>{l.id} {l.title}</option>)}
          </select>
          <div className="flex-1 min-w-[200px]">
            <div className="text-[11px] opacity-70">{meta.id} · Nivel {meta.cefrLevel} · {meta.book === 1 ? 'El Vecindario de Villa Celeste' : 'Más Allá de Villa Celeste'}</div>
            <div className="font-bold text-[15px]">{meta.title}</div>
            {meta.neighborhoodFocus.length > 0 && <div className="text-[11px]">👥 {meta.neighborhoodFocus.slice(0, 8).join(', ')}</div>}
          </div>
          <div className="w-40"><Progress value={pct / 100} /><div className="text-[11px] text-center">{pct}% completado</div></div>
        </div>
        <div className="mt-1">
          <Tabs<Tab> value={tab} onChange={setTab} tabs={[['vocab', 'I. Vocabulario'], ['gram', 'II. Repaso general'], ['act', 'III. Actividades'], ['lect', 'IV. Lectura y Reto oral']]} />
        </div>
        <div className="panel flex-1 min-h-0 overflow-auto p-2">
          {!L || L.id !== id ? <div>Cargando lección...</div> :
            tab === 'vocab' ? <Vocab L={L} /> :
            tab === 'gram' ? <Grammar L={L} /> :
            tab === 'act' ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 flex-wrap">
                  {L.activities.map((a, i) => {
                    const done = Object.keys(a.answers).every((n) => solved[`${a.id}-${n}`]) && Object.keys(a.answers).length > 0;
                    return <button key={a.id} className={`btn ${i === actIdx ? 'on font-bold' : ''}`} onClick={() => setActIdx(i)}>{done ? '✅' : '✏️'} Actividad {a.key}</button>;
                  })}
                </div>
                {L.activities[actIdx] && <ActivityView key={L.activities[actIdx].id} act={L.activities[actIdx]} lessonId={L.id} />}
              </div>
            ) : <Reading L={L} />}
        </div>
      </main>
    </div>
  );
}

function Vocab({ L }: { L: LessonData }) {
  const [flash, setFlash] = useState(false);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const addAll = () => { L.vocabulary.forEach((v) => useStore.getState().addCard(v.id, v.es, v.en)); sfx('ding'); };
  const v = L.vocabulary[i % L.vocabulary.length];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap items-center">
        <button className={`btn ${flash ? '' : 'on'}`} onClick={() => setFlash(false)}>📋 Lista</button>
        <button className={`btn ${flash ? 'on' : ''}`} onClick={() => setFlash(true)}>🃏 Tarjetas</button>
        <button className="btn" onClick={addAll}>★ Añadir las {L.vocabulary.length} al SRS</button>
        <span className="text-[11px] opacity-70">Clic derecho en 🔊 = lento</span>
      </div>
      {flash && v ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="inset w-[340px] max-w-full h-[180px] flex flex-col items-center justify-center cursor-pointer text-center p-4" onClick={() => { setFlip(!flip); sfx('click'); }}>
            <div className="text-[24px] font-bold">{flip ? v.en : v.es}</div>
            {flip && v.notes && <div className="text-[12px] opacity-70">[{v.notes}]</div>}
            <div className="text-[11px] opacity-60 mt-3">{flip ? 'inglés' : 'español'} · clic para voltear</div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="btn" onClick={() => { setI((i - 1 + L.vocabulary.length) % L.vocabulary.length); setFlip(false); }}>◀</button>
            <Speak text={v.es} /><SrsStar id={v.id} es={v.es} en={v.en} />
            <span className="text-[12px] w-16 text-center">{(i % L.vocabulary.length) + 1}/{L.vocabulary.length}</span>
            <button className="btn" onClick={() => { setI(i + 1); setFlip(false); }}>▶</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {L.vocabulary.map((v) => (
            <div key={v.id} className="inset px-2 py-1 flex items-center gap-1">
              <div className="flex-1 min-w-0 select-text"><b>{v.es}</b> <span className="opacity-80">– {v.en}</span>{v.notes && <span className="text-[10px] ml-1 px-1 bg-[#ffffe1] border border-[#808080]">{v.notes}</span>}</div>
              <Speak text={v.es} /><SrsStar id={v.id} es={v.es} en={v.en} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Grammar({ L }: { L: LessonData }) {
  const [open, setOpen] = useState<string | null>(L.grammar[0]?.id ?? null);
  return (
    <div className="flex flex-col gap-1">
      {L.grammar.map((g) => (
        <div key={g.id}>
          <button className={`btn w-full text-left font-bold ${open === g.id ? 'on' : ''}`} onClick={() => setOpen(open === g.id ? null : g.id)}>{open === g.id ? '▾' : '▸'} {g.title}</button>
          {open === g.id && <div className="inset p-3 mono text-[13px] leading-relaxed overflow-x-auto select-text">{g.content}</div>}
        </div>
      ))}
      <div className="text-[11px] opacity-70 mt-2">💡 Doble clic en cualquier palabra para traducirla y escucharla.</div>
    </div>
  );
}

function Reading({ L }: { L: LessonData }) {
  const r = L.culturalReading;
  const { solved, solve } = useStore();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const nums = r ? Object.keys(r.answers).sort((a, b) => +a - +b) : [];
  const check = () => {
    setChecked(true);
    let ok = 0;
    nums.forEach((n) => { const a = r!.answers[n].toLowerCase(), v = (vals[n] ?? '').toLowerCase(); if (v && a[0] === v[0]) { ok++; solve(`${L.id}-read-${n}`); } });
    sfx(ok === nums.length ? 'ding' : 'wrong');
  };
  const cf = nums.length > 0 && nums.every((n) => /^(c|f|cierto|falso)$/i.test(r!.answers[n]));
  return (
    <div className="flex flex-col gap-3">
      {r ? (
        <fieldset className="group">
          <legend className="font-bold">📰 Lectura cultural</legend>
          <div className="text-[12px] italic mb-2">{r.instructions}</div>
          <div className="inset p-3 leading-relaxed select-text whitespace-pre-wrap text-[14px]">{r.text}</div>
          <div className="mt-2 flex flex-col gap-1">
            {nums.map((n) => cf ? (
              <label key={n} className="flex items-center gap-2">{n}.
                <select className={`field ${checked ? (vals[n]?.[0] === r.answers[n][0].toLowerCase() ? 'right' : 'wrong') : ''}`} value={vals[n] ?? ''} onChange={(e) => setVals({ ...vals, [n]: e.target.value })}>
                  <option value="">—</option><option value="c">Cierto</option><option value="f">Falso</option>
                </select>{solved[`${L.id}-read-${n}`] && '✅'}
              </label>
            ) : (
              <div key={n} className="text-[13px]"><b>{n}.</b> <Reveal text={r.answers[n]} onOk={() => solve(`${L.id}-read-${n}`)} done={!!solved[`${L.id}-read-${n}`]} /></div>
            ))}
            {cf && <button className="btn self-start font-bold mt-1" onClick={check}>✔ Comprobar</button>}
          </div>
        </fieldset>
      ) : <div className="text-[12px] opacity-75">Esta lección no tiene lectura cultural. ¡Practica la conversación!</div>}
      <fieldset className="group">
        <legend className="font-bold">🎙️ Reto oral</legend>
        {L.speaking ? (
          <div className="inset p-3 mono text-[13px] leading-relaxed max-h-[340px] overflow-auto select-text">{L.speaking}</div>
        ) : (
          <div className="text-[13px]">Lee en voz alta el vocabulario de esta lección y graba tu pronunciación. Usa 3 palabras nuevas en una frase sobre tus vecinos de Villa Celeste.</div>
        )}
        <div className="flex gap-2 mt-2">
          <button className="btn" onClick={() => openApp('fonetica', { lesson: L.id })}>🎙️ Abrir Grabadora de Voz</button>
          {L.vocabulary.length > 0 && <button className="btn" onClick={() => { const s = L.vocabulary.slice(0, 8).map((v) => v.es).join('. '); import('../../utils/tts').then((m) => m.speak(s)); }}>🔊 Escuchar vocabulario</button>}
        </div>
      </fieldset>
    </div>
  );
}

function Reveal({ text, onOk, done }: { text: string; onOk: () => void; done: boolean }) {
  const [show, setShow] = useState(false);
  if (!show) return <button className="btn text-[11px]" onClick={() => setShow(true)}>Ver respuesta modelo</button>;
  return <span>{text} <Speak text={text} /> {done ? '✅' : <button className="btn text-[11px]" onClick={() => { onOk(); sfx('ding'); }}>¡La tenía bien!</button>}</span>;
}
