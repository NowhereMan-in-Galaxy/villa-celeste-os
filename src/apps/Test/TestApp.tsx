import { useEffect, useMemo, useState } from 'react';
import type { AppProps } from '../../config/apps';
import type { VocabItem } from '../../types/curriculum';
import { LESSONS } from '../../data/curriculum';
import { useStore } from '../../store';
import { openApp } from '../../os/wm';
import { speak } from '../../utils/tts';
import { sfx } from '../../utils/sound';
import { Speak, Progress } from '../../ui/kit';
import { label } from '../Palabras/PalabrasApp';

type W = VocabItem & { l: number };
const BANDS = 12; // 5 lessons per band
const PER_BLOCK = 4;
const BLOCKS = 8;
const CEFR = ['A1', 'A1', 'A1+', 'A1+', 'A2', 'A2', 'A2+', 'A2+', 'B1', 'B1', 'B1+', 'B1+'];
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

interface Result { date: number; known: number; total: number; level: string; startLesson: number; bands: number[] }
type Answer = { w: W; ok: boolean; unsure: boolean };

/** Accuracy per band corrected for guessing (4 options: wrong guesses imply ~1/3 lucky guesses). */
function estimate(answers: Answer[], bandSizes: number[]): Omit<Result, 'date'> {
  const p: (number | null)[] = Array.from({ length: BANDS }, (_, b) => {
    const a = answers.filter((x) => Math.floor(x.w.l / 5) === b);
    if (!a.length) return null;
    const c = a.filter((x) => x.ok).length, w = a.filter((x) => !x.ok && !x.unsure).length;
    return Math.max(0, Math.min(1, (c - w / 3) / a.length));
  });
  const tested = p.map((v, b) => (v === null ? -1 : b)).filter((b) => b >= 0);
  const filled = p.map((v, b) => {
    if (v !== null) return v;
    const below = tested.filter((t) => t < b).pop(), above = tested.find((t) => t > b);
    if (below === undefined) return p[above!]! >= 0.75 ? 1 : p[above!]!;
    if (above === undefined) return p[below]! < 0.5 ? 0 : p[below]! * 0.5;
    return (p[below]! + p[above]!) / 2;
  });
  const known = Math.round(filled.reduce((s, v, b) => s + v * bandSizes[b], 0));
  const top = filled.map((v, b) => (v >= 0.6 ? b : -1)).reduce((a, b) => Math.max(a, b), -1);
  const firstWeak = filled.findIndex((v) => v < 0.7);
  return {
    known, total: bandSizes.reduce((a, b) => a + b, 0), bands: filled,
    level: top < 0 ? 'Principiante' : CEFR[top],
    startLesson: firstWeak < 0 ? LESSONS.length - 1 : firstWeak * 5,
  };
}

export default function TestApp(_: AppProps) {
  const [words, setWords] = useState<W[] | null>(null);
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [band, setBand] = useState(0);
  const [block, setBlock] = useState<W[]>([]);
  const [blockNo, setBlockNo] = useState(0);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const history = (useStore((s) => s.flags['vocabtest:history']) as Result[] | undefined) ?? [];

  useEffect(() => {
    import('../../data/generated/vocab.json').then((m) =>
      setWords((m.default as { l: number; es: string; en: string; n?: string }[]).map((v, i) => ({ id: `t${i}`, l: v.l, es: v.es, en: v.en, notes: v.n }))));
  }, []);
  const bandSizes = useMemo(() => Array.from({ length: BANDS }, (_, b) => words?.filter((w) => Math.floor(w.l / 5) === b).length ?? 0), [words]);

  const used = new Set(answers.map((a) => a.w.es));
  const draw = (b: number) => shuffle(words!.filter((w) => Math.floor(w.l / 5) === b && !used.has(w.es))).slice(0, PER_BLOCK);
  const start = (b: number) => { setAnswers([]); setBand(b); setBlock(draw(b)); setBlockNo(0); setQi(0); setPicked(null); setPhase('quiz'); sfx('open'); };

  const w = block[qi];
  const opts = useMemo(() => {
    if (!w || !words) return [];
    const pool = words.filter((x) => Math.abs(Math.floor(x.l / 5) - band) <= 1 && label(x) !== label(w) && x.es !== w.es);
    return shuffle([w, ...shuffle(pool).slice(0, 3)]);
  }, [w]);
  useEffect(() => { if (w && phase === 'quiz') speak(w.es); }, [w, phase]);

  const answer = (choice: W | null) => {
    if (picked) return;
    const ok = choice?.id === w.id;
    setPicked(choice?.id ?? 'unsure');
    sfx(ok ? 'ding' : 'click');
    const next = [...answers, { w, ok, unsure: !choice }];
    setAnswers(next);
    setTimeout(() => advance(next), ok ? 450 : 900);
  };

  const advance = (next: Answer[]) => {
    setPicked(null);
    if (qi + 1 < block.length) return setQi(qi + 1);
    const score = next.slice(-block.length).filter((a) => a.ok).length;
    const nb = Math.max(0, Math.min(BANDS - 1, band + (score >= 3 ? (blockNo < 3 ? 2 : 1) : score <= 1 ? -1 : 0)));
    if (blockNo + 1 >= BLOCKS || (score <= 1 && band === 0 && blockNo >= 2)) return finish(next);
    setBand(nb); setBlock(draw(nb)); setBlockNo(blockNo + 1); setQi(0);
  };

  const finish = (all: Answer[]) => {
    const r: Result = { date: Date.now(), ...estimate(all, bandSizes) };
    const st = useStore.getState();
    st.setFlag('vocabtest:history', [...history, r].slice(-10));
    st.setFlag('palabras:placement', Math.max(r.startLesson - 1, (st.flags['palabras:placement'] as number) ?? -1));
    st.addXP(20);
    setResult(r); setPhase('result'); sfx('levelup');
  };

  if (!words) return <div className="p-4">Cargando el banco de palabras...</div>;

  if (phase === 'intro')
    return (
      <div className="h-full overflow-auto p-4 flex flex-col gap-4 max-w-[620px] mx-auto">
        <div>
          <div className="text-[20px] font-bold">¿Cuántas palabras sabes?</div>
          <div className="opacity-75 mt-1">Un test adaptativo de unos 5 minutos sobre las {words.length.toLocaleString('es')} palabras del curso. Las preguntas se vuelven más fáciles o más difíciles según tus respuestas.</div>
        </div>
        <div className="inset p-3 text-[13px] leading-relaxed" style={{ background: '#ffffe1' }}>
          <b>Importante:</b> si no conoces una palabra, pulsa <b>«No lo sé»</b>. Adivinar hace que el resultado sea menos preciso. (If you don't know a word, say so: guessing makes the estimate less accurate.)
        </div>
        <div className="font-bold">¿Cuánto español sabes ya?</div>
        <div className="grid gap-2">
          {[[0, 'Nada o casi nada', 'Empiezo desde cero'], [3, 'Un poco', 'Sé saludar, presentarme y algunos verbos'], [6, 'Bastante', 'Puedo hablar del pasado y leer textos sencillos']].map(([b, t, s]) => (
            <button key={b} className="btn text-left p-3" onClick={() => start(b as number)}><b>{t}</b><br /><span className="text-[12px] opacity-75">{s}</span></button>
          ))}
        </div>
        {history.length > 0 && <History h={history} />}
      </div>
    );

  if (phase === 'result' && result) return <ResultView r={result} prev={history[history.length - 2]} answers={answers} onAgain={() => setPhase('intro')} />;

  const total = BLOCKS * PER_BLOCK, done = blockNo * PER_BLOCK + qi;
  return (
    <div className="h-full flex flex-col p-3 gap-3 max-w-[560px] mx-auto w-full">
      <div className="flex items-center gap-2 text-[12px]"><div className="flex-1"><Progress value={done / total} /></div><span>{done + 1}/{total}</span></div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="text-center text-[12px] opacity-70">¿Qué significa?</div>
        <div className="inset p-5 text-center flex items-center justify-center gap-2"><span className="text-[26px] font-bold">{w.es}</span><Speak text={w.es} /></div>
        <div className="grid gap-2">
          {opts.map((o) => {
            const st = picked && (o.id === w.id ? '!bg-[#b8f0b8]' : o.id === picked ? '!bg-[#f6b8b8]' : '');
            return <button key={o.id} className={`btn py-3 text-[15px] text-left ${st}`} onClick={() => answer(o)}>{label(o)}</button>;
          })}
          <button className={`btn py-2 text-[14px] ${picked === 'unsure' ? 'on' : ''}`} onClick={() => answer(null)}>🤷 No lo sé</button>
        </div>
      </div>
    </div>
  );
}

function ResultView({ r, prev, answers, onAgain }: { r: Result; prev?: Result; answers: Answer[]; onAgain: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => { let i = 0; const t = setInterval(() => { i++; setN(Math.round((r.known * i) / 30)); if (i >= 30) clearInterval(t); }, 30); return () => clearInterval(t); }, [r]);
  const missed = answers.filter((a) => !a.ok);
  const lesson = LESSONS[r.startLesson];
  const [saved, setSaved] = useState(false);
  return (
    <div className="h-full overflow-auto p-4 flex flex-col gap-4 max-w-[640px] mx-auto">
      <div className="text-center pop">
        <div className="text-[13px] opacity-70">Conoces aproximadamente</div>
        <div className="pixel text-[34px] my-2" style={{ color: 'var(--title-a)' }}>{n.toLocaleString('es')}</div>
        <div className="text-[13px] opacity-70">de las {r.total.toLocaleString('es')} palabras del curso ({Math.round((r.known / r.total) * 100)}%)</div>
        <div className="inline-block mt-3 px-3 py-1 font-bold text-white" style={{ background: 'var(--title-a)' }}>Nivel estimado: {r.level}</div>
        {prev && <div className="text-[12px] mt-2">{r.known >= prev.known ? '📈' : '📉'} Antes: {prev.known.toLocaleString('es')} ({new Date(prev.date).toLocaleDateString('es-MX')})</div>}
      </div>
      <fieldset className="group">
        <legend>Por bloques de lecciones</legend>
        <div className="flex items-end gap-1 h-28">
          {r.bands.map((p, b) => (
            <div key={b} className="flex-1 flex flex-col items-center justify-end h-full" title={`Lecciones ${b * 5 + 1}–${b * 5 + 5}: ${Math.round(p * 100)}%`}>
              <div className="text-[9px]">{Math.round(p * 100)}</div>
              <div className="w-full sunken" style={{ height: `${Math.max(2, p * 80)}%`, background: p >= 0.7 ? '#2a8a2a' : p >= 0.4 ? '#d4a000' : '#c04040' }} />
            </div>
          ))}
        </div>
        <div className="flex text-[10px] mt-1"><span className="flex-1">Libro 1 →</span><span className="flex-1 text-right">← Libro 2</span></div>
      </fieldset>
      <div className="panel p-3 flex flex-col gap-2">
        <div><b>Recomendación:</b> empieza en la lección <b>{lesson.lessonNumber} del Libro {lesson.book}</b>, «{lesson.title}».{r.startLesson > 0 && ' Las lecciones anteriores ya están abiertas en Palabras.'}</div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn font-bold" onClick={() => openApp('palabras', { lesson: lesson.id })}>🎮 Jugar esa lección</button>
          <button className="btn" onClick={() => openApp('academia', { lesson: lesson.id })}>📖 Abrir en Academia</button>
        </div>
      </div>
      {missed.length > 0 && (
        <fieldset className="group">
          <legend>Palabras que no sabías ({missed.length})</legend>
          <div className="flex flex-wrap gap-1 text-[13px]">
            {missed.map((a) => <span key={a.w.id} className="inset px-2 py-[2px]" title={label(a.w)}><b>{a.w.es}</b> <span className="opacity-60">{label(a.w)}</span></span>)}
          </div>
          <button className="btn mt-2" disabled={saved} onClick={() => { missed.forEach((a) => useStore.getState().addCard(`test-${a.w.es}`, a.w.es, label(a.w))); setSaved(true); sfx('ding'); }}>
            {saved ? '✓ Añadidas al mazo' : '★ Añadirlas a mi mazo de repaso'}
          </button>
        </fieldset>
      )}
      <div className="text-[12px] opacity-70">Es una estimación: repite el test cada pocas semanas para ver tu progreso.</div>
      <button className="btn self-start" onClick={onAgain}>Hacer el test otra vez</button>
    </div>
  );
}

function History({ h }: { h: Result[] }) {
  return (
    <fieldset className="group">
      <legend>Tus resultados</legend>
      {h.slice().reverse().map((r) => (
        <div key={r.date} className="flex justify-between text-[13px] py-[2px]">
          <span>{new Date(r.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span><b>{r.known.toLocaleString('es')}</b> palabras · {r.level}</span>
        </div>
      ))}
    </fieldset>
  );
}
