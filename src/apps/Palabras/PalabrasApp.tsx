import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppProps } from '../../config/apps';
import { LESSONS, loadLesson } from '../../data/curriculum';
import type { VocabItem } from '../../types/curriculum';
import { useStore } from '../../store';
import { speak } from '../../utils/tts';
import { sfx } from '../../utils/sound';
import { grade } from '../../utils/text';
import { Speak, Progress } from '../../ui/kit';

const STAGE = 8;
const ART = /^(el|la|los|las)\s+/i;
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const sample = <T,>(a: T[], n: number) => shuffle(a).slice(0, n);
const ABBR: Record<string, string> = { 'inf.': 'informal', 'form.': 'formal', 'sing.': 'singular', 'pl.': 'plural', 'masc.': 'masculine', 'fem.': 'feminine' };
/** English shown to the player; usage notes disambiguate e.g. tú vs usted forms. */
export const label = (w: VocabItem) => (w.notes ? `${w.en} (${w.notes.replace(/\b[a-z]+\./g, (m) => ABBR[m] ?? m)})` : w.en);
const uniqueByLabel = (ws: VocabItem[]) => ws.filter((w, i) => ws.findIndex((x) => label(x) === label(w)) === i);

export const key = (lesson: string, s: number) => `palabras:${lesson}:${s}`;

/** Split a lesson's vocabulary into stages of ~8 words (no stage smaller than 4). */
function stagesOf(v: VocabItem[]) {
  const out: VocabItem[][] = [];
  for (let i = 0; i < v.length; i += STAGE) out.push(v.slice(i, i + STAGE));
  if (out.length > 1 && out[out.length - 1].length < 4) out[out.length - 2].push(...out.pop()!);
  return out;
}
export const stageCount = (n: number) => Math.max(1, Math.floor(n / STAGE) + (n % STAGE >= 4 ? 1 : 0));

type Q =
  | { t: 'es-en' | 'en-es' | 'listen'; w: VocabItem; opts: VocabItem[] }
  | { t: 'spell'; w: VocabItem }
  | { t: 'match'; ws: VocabItem[] };

function buildQuestions(words: VocabItem[], pool: VocabItem[]): Q[] {
  const distract = (w: VocabItem) => shuffle([w, ...sample(pool.filter((p) => p.id !== w.id && label(p) !== label(w) && p.es !== w.es), 3)]);
  const types = ['es-en', 'en-es', 'listen'] as const;
  const qs: Q[] = shuffle(words).map((w, i) => ({ t: types[i % 3], w, opts: distract(w) }));
  const spellable = words.filter((w) => { const s = w.es.replace(ART, ''); return s.length <= 12 && /^[a-záéíóúüñ]+$/i.test(s); });
  const spells: Q[] = sample(spellable, 3).map((w) => ({ t: 'spell', w }));
  qs.splice(Math.ceil(qs.length / 2), 0, { t: 'match', ws: sample(uniqueByLabel(words), Math.min(5, words.length)) });
  return [...qs, ...spells];
}

export default function PalabrasApp({ args }: AppProps) {
  const [play, setPlay] = useState<{ lesson: string; stage: number } | null>(args?.lesson ? { lesson: args.lesson, stage: 0 } : null);
  useEffect(() => { if (args?.lesson) setPlay({ lesson: args.lesson, stage: 0 }); }, [args?.lesson]);
  return play ? <Game key={play.lesson + play.stage} {...play} onExit={() => setPlay(null)} /> : <MapView onPlay={(lesson, stage) => setPlay({ lesson, stage })} />;
}

function MapView({ onPlay }: { onPlay: (l: string, s: number) => void }) {
  const { flags, settings } = useStore();
  const [book, setBook] = useState<1 | 2>(1);
  const stars = (l: string, s: number) => (flags[key(l, s)] as number) ?? 0;
  const lessonDone = (i: number) => { const l = LESSONS[i]; return Array.from({ length: stageCount(l.vocabCount) }, (_, s) => stars(l.id, s)).every((x) => x > 0); };
  const lessonOpen = (i: number) => settings.unlockAll || LESSONS[i].lessonNumber === 1 || lessonDone(i - 1);
  const total = Object.entries(flags).filter(([k]) => k.startsWith('palabras:')).reduce((a, [, v]) => a + (v as number), 0);
  const firstOpen = useRef<HTMLDivElement>(null);
  useEffect(() => { firstOpen.current?.scrollIntoView({ block: 'center' }); }, [book]);
  let marked = false;

  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(#1a1a40, #2d1b4e)' }}>
      <div className="flex items-center gap-2 p-2 text-white flex-wrap">
        <div className="pixel text-[13px] text-[#ffcc00] flex-1">PALABRAS EN JUEGO</div>
        <span className="text-[13px]">⭐ {total}</span>
        {([1, 2] as const).map((b) => <button key={b} className={`btn text-black ${book === b ? 'on font-bold' : ''}`} onClick={() => setBook(b)}>Libro {b}</button>)}
      </div>
      <div className="flex-1 overflow-auto p-2 flex flex-col gap-2">
        {LESSONS.map((l, i) => {
          if (l.book !== book) return null;
          const open = lessonOpen(i), n = stageCount(l.vocabCount);
          const current = open && !lessonDone(i) && !marked;
          if (current) marked = true;
          return (
            <div key={l.id} ref={current ? firstOpen : undefined} className={`panel p-2 flex items-center gap-2 flex-wrap ${open ? '' : 'opacity-50'} ${current ? 'outline outline-2 outline-[#ffcc00]' : ''}`}>
              <div className="w-10 h-10 grid place-items-center pixel text-[12px] text-white shrink-0" style={{ background: lessonDone(i) ? '#2a8a2a' : open ? 'var(--title-a)' : '#666' }}>{open ? l.lessonNumber : '🔒'}</div>
              <div className="flex-1 min-w-[140px]">
                <div className="font-bold text-[13px] leading-tight">{l.title}</div>
                <div className="text-[11px] opacity-70">{l.vocabCount} palabras · {l.cefrLevel}</div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: n }, (_, s) => {
                  const st = stars(l.id, s), can = open && (s === 0 || stars(l.id, s - 1) > 0 || settings.unlockAll);
                  return (
                    <button key={s} disabled={!can} className="btn !px-2 flex flex-col items-center leading-none py-1 min-w-[46px]" onClick={() => { sfx('open'); onPlay(l.id, s); }}>
                      <span className="text-[11px] font-bold">{can ? `Nivel ${s + 1}` : '🔒'}</span>
                      <span className="text-[11px] tracking-tighter">{[0, 1, 2].map((k) => (k < st ? '★' : '☆')).join('')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {!settings.unlockAll && <div className="text-white/70 text-[11px] text-center p-2">Gana al menos ★ en todos los niveles de una lección para abrir la siguiente.</div>}
      </div>
    </div>
  );
}

function Game({ lesson, stage, onExit }: { lesson: string; stage: number; onExit: () => void }) {
  const [words, setWords] = useState<VocabItem[] | null>(null);
  const [pool, setPool] = useState<VocabItem[]>([]);
  const [phase, setPhase] = useState<'study' | 'play' | 'win' | 'lose'>('study');
  const [qs, setQs] = useState<Q[]>([]);
  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const meta = LESSONS.find((l) => l.id === lesson)!;

  useEffect(() => { loadLesson(lesson).then((L) => { setWords(stagesOf(L.vocabulary)[stage] ?? []); setPool(L.vocabulary); }); }, [lesson, stage]);
  const start = () => { setQs(buildQuestions(words!, pool)); setI(0); setHearts(5); setMistakes(0); setCombo(0); setScore(0); setPhase('play'); sfx('levelup'); };

  const answer = (ok: boolean, w?: VocabItem) => {
    const st = useStore.getState();
    if (ok) {
      sfx('ding');
      const c = combo + 1;
      setCombo(c);
      setScore((s) => s + 10 + Math.min(c, 5) * 2);
      st.addXP(2);
    } else {
      sfx('wrong');
      setCombo(0);
      setMistakes((m) => m + 1);
      if (w) { st.addCard(w.id, w.es, w.en); setQs((q) => [...q, q[i]]); }
      if (hearts <= 1) { setHearts(0); setPhase('lose'); sfx('error'); return; }
      setHearts((h) => h - 1);
    }
  };
  const next = () => {
    if (i + 1 < qs.length) return setI(i + 1);
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const st = useStore.getState(), k = key(lesson, stage);
    if (stars > ((st.flags[k] as number) ?? 0)) st.setFlag(k, stars);
    st.addXP(stars * 10);
    st.toast(`${'★'.repeat(stars)} ¡Nivel superado!`);
    setPhase('win');
    sfx('levelup');
  };

  if (!words) return <div className="p-4">Cargando...</div>;
  const header = (
    <div className="flex items-center gap-2 p-2 panel">
      <button className="btn" onClick={onExit}>◀ Mapa</button>
      <div className="flex-1 text-[12px] truncate"><b>{meta.lessonNumber}. {meta.title}</b> · Nivel {stage + 1}</div>
      {phase === 'play' && <><span className="text-[16px] tracking-tight">{'❤️'.repeat(hearts)}{'🖤'.repeat(5 - hearts)}</span><span className="pixel text-[10px]">{score}</span></>}
    </div>
  );

  if (phase === 'study')
    return (
      <div className="h-full flex flex-col">{header}
        <div className="flex-1 overflow-auto p-3">
          <div className="text-[13px] mb-2">Primero mira y escucha estas {words.length} palabras. Toca una tarjeta para oírla.</div>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
            {words.map((w) => (
              <button key={w.id} className="inset p-3 text-left cursor-pointer hover:bg-[#ffffe1]" onClick={() => speak(w.es)}>
                <div className="font-bold text-[16px]">{w.es}</div>
                <div className="text-[12px] opacity-75">{w.en}{w.notes && <i> [{w.notes}]</i>}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="p-2 panel flex justify-end"><button className="btn font-bold text-[14px] px-6" onClick={start}>¡A jugar! ▶</button></div>
      </div>
    );

  if (phase === 'win' || phase === 'lose') {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    return (
      <div className="h-full flex flex-col">{header}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 text-center pop">
          <div className="text-[48px]">{phase === 'win' ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '💔'}</div>
          <div className="pixel text-[14px]">{phase === 'win' ? '¡NIVEL SUPERADO!' : 'SIN VIDAS'}</div>
          <div className="text-[13px]">{phase === 'win' ? `Puntos: ${score} · Errores: ${mistakes}` : 'Las palabras que fallaste están en tu mazo SRS. ¡Inténtalo otra vez!'}</div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => setPhase('study')}>Repasar</button>
            <button className="btn" onClick={start}>Jugar otra vez</button>
            <button className="btn font-bold" onClick={onExit}>Mapa ▶</button>
          </div>
        </div>
      </div>
    );
  }

  const q = qs[i];
  return (
    <div className="h-full flex flex-col">{header}
      <div className="px-2 pt-2"><Progress value={i / qs.length} /></div>
      {combo >= 3 && <div className="text-center pixel text-[10px] text-[#d4a000] pt-1">¡COMBO x{combo}!</div>}
      <div className="flex-1 overflow-auto p-3 flex flex-col items-center justify-center">
        {q.t === 'match' ? <Match key={i} ws={q.ws} onMiss={() => answer(false)} onDone={() => { answer(true); next(); }} />
          : q.t === 'spell' ? <Spell key={i} w={q.w} onAnswer={(ok) => answer(ok, q.w)} onNext={next} />
          : <Choice key={i} q={q} onAnswer={(ok) => answer(ok, q.w)} onNext={next} />}
      </div>
    </div>
  );
}

function Choice({ q, onAnswer, onNext }: { q: Extract<Q, { opts: VocabItem[] }>; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const showEs = q.t === 'en-es';
  useEffect(() => { if (q.t !== 'en-es') speak(q.w.es); }, [q]);
  const pick = (o: VocabItem) => {
    if (picked) return;
    setPicked(o.id);
    onAnswer(o.id === q.w.id);
    if (o.id === q.w.id && q.t === 'en-es') speak(q.w.es);
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { const n = +e.key; if (n >= 1 && n <= q.opts.length) pick(q.opts[n - 1]); if (e.key === 'Enter' && picked) onNext(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  return (
    <div className="w-full max-w-[460px] flex flex-col gap-3">
      <div className="text-[12px] opacity-70 text-center">{q.t === 'listen' ? 'Escucha y elige el significado' : q.t === 'es-en' ? '¿Qué significa?' : '¿Cómo se dice en español?'}</div>
      <div className="inset p-4 text-center min-h-[84px] flex items-center justify-center gap-2">
        {q.t === 'listen' ? <button className="btn text-[28px] px-6 py-2" onClick={() => speak(q.w.es)} onContextMenu={(e) => { e.preventDefault(); speak(q.w.es, 0.7); }}>🔊</button>
          : <span className="text-[24px] font-bold">{q.t === 'es-en' ? q.w.es : label(q.w)}</span>}
        {q.t === 'es-en' && <Speak text={q.w.es} />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.opts.map((o, n) => {
          const state = picked && (o.id === q.w.id ? 'right' : o.id === picked ? 'wrong' : '');
          return (
            <button key={o.id} className={`btn text-[15px] py-3 text-left ${state === 'right' ? '!bg-[#b8f0b8]' : state === 'wrong' ? '!bg-[#f6b8b8]' : ''}`} onClick={() => pick(o)}>
              <span className="opacity-50 text-[11px] mr-2">{n + 1}</span>{showEs ? o.es : label(o)}
            </button>
          );
        })}
      </div>
      {picked && <Feedback ok={picked === q.w.id} w={q.w} onNext={onNext} />}
    </div>
  );
}

function Feedback({ ok, w, onNext }: { ok: boolean; w: VocabItem; onNext: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => btn.current?.focus(), []);
  return (
    <div className={`p-2 flex items-center gap-2 pop ${ok ? 'bg-[#d8ffd8]' : 'bg-[#ffd8d8]'}`}>
      <div className="flex-1 text-[13px]">{ok ? '¡Correcto! ' : 'Era: '}<b>{w.es}</b> = {label(w)} {!ok && <span className="text-[11px] opacity-70">(volverá a salir)</span>}</div>
      <button ref={btn} className="btn font-bold" onClick={onNext}>Seguir ▶</button>
    </div>
  );
}

function Spell({ w, onAnswer, onNext }: { w: VocabItem; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const art = w.es.match(ART)?.[0] ?? '';
  const target = w.es.slice(art.length);
  const tiles = useMemo(() => shuffle(target.toLowerCase().split('').map((c, i) => ({ c, i }))), [target]);
  const [used, setUsed] = useState<number[]>([]);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState<null | 'right' | 'accent' | 'wrong'>(null);
  const value = typed || used.map((n) => tiles[n].c).join('');
  const submit = () => {
    if (result || !value) return;
    const r = grade(value, target);
    setResult(r);
    onAnswer(r !== 'wrong');
    speak(w.es);
  };
  return (
    <div className="w-full max-w-[460px] flex flex-col gap-3">
      <div className="text-[12px] opacity-70 text-center">Escribe en español</div>
      <div className="inset p-4 text-center text-[22px] font-bold">{label(w)}</div>
      <div className="flex items-center gap-2 justify-center">
        {art && <span className="text-[18px] opacity-70">{art}</span>}
        <input className={`field text-[20px] w-[220px] ${result ?? ''}`} value={value} autoFocus disabled={!!result}
          onChange={(e) => { setTyped(e.target.value); setUsed([]); }} onKeyDown={(e) => e.key === 'Enter' && (result ? onNext() : submit())} />
      </div>
      {!result && (
        <div className="flex gap-1 justify-center flex-wrap">
          {tiles.map((t, n) => (
            <button key={n} disabled={used.includes(n)} className="btn !px-0 w-9 h-9 text-[16px] font-bold" onClick={() => { setTyped(''); setUsed([...used, n]); sfx('type'); }}>{t.c}</button>
          ))}
          <button className="btn h-9" onClick={() => { setUsed(used.slice(0, -1)); setTyped(''); }}>⌫</button>
        </div>
      )}
      {!result ? <button className="btn font-bold self-center px-6" onClick={submit}>Comprobar</button>
        : <Feedback ok={result !== 'wrong'} w={w} onNext={onNext} />}
      {result === 'accent' && <div className="text-[12px] text-center">Casi: fíjate en el acento → <b>{target}</b></div>}
    </div>
  );
}

function Match({ ws, onMiss, onDone }: { ws: VocabItem[]; onMiss: () => void; onDone: () => void }) {
  const left = useMemo(() => shuffle(ws), [ws]);
  const right = useMemo(() => shuffle(ws), [ws]);
  const [sel, setSel] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState<string | null>(null);
  const tapRight = (w: VocabItem) => {
    if (!sel || done.includes(w.id)) return;
    if (w.id === sel) {
      const d = [...done, w.id];
      setDone(d); setSel(null); sfx('click');
      if (d.length === ws.length) setTimeout(onDone, 300);
    } else { setBad(w.id); onMiss(); setTimeout(() => setBad(null), 400); setSel(null); }
  };
  return (
    <div className="w-full max-w-[520px] flex flex-col gap-2">
      <div className="text-[12px] opacity-70 text-center">Une cada palabra con su significado</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {left.map((w) => (
            <button key={w.id} disabled={done.includes(w.id)} className={`btn py-2 text-[14px] ${sel === w.id ? 'on font-bold' : ''} ${done.includes(w.id) ? '!bg-[#b8f0b8]' : ''}`}
              onClick={() => { setSel(w.id); speak(w.es); }}>{w.es}</button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {right.map((w) => (
            <button key={w.id} disabled={done.includes(w.id)} className={`btn py-2 text-[13px] ${done.includes(w.id) ? '!bg-[#b8f0b8]' : ''} ${bad === w.id ? '!bg-[#f6b8b8]' : ''}`} onClick={() => tapRight(w)}>{label(w)}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
