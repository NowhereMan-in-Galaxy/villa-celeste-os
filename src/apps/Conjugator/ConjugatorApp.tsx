import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { grade } from '../../utils/text';
import { openApp } from '../../os/wm';
import { conjugate, PRONOUNS, CMD_LABELS } from './conj';
import { MODES, TENSE_ES, TenseMode, POR_PARA, SER_ESTAR, DuelItem } from './data';

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const hiKey = (m: string) => `conj:hi:${m}`;
const NEON = ['#39ff14', '#00e5ff', '#ff2bd6', '#ffe600', '#ff8a00'];
const stripPron = (s: string) => s.replace(/^(yo|tú|tu|él|ella|usted|ud\.?|nosotros|nosotras|ellos|ellas|ustedes|uds\.?)\s+/i, '');

interface Item { id: number; label: string; sub: string; answer: string; y: number; x: number; color: string; dead?: number }

function makePrompt(m: TenseMode): Omit<Item, 'id' | 'y' | 'x' | 'color'> {
  const verb = pick(m.pool);
  if (m.tense === 'cmd') {
    const p = Math.floor(Math.random() * 4);
    return { label: `${CMD_LABELS[p]} · ${verb.inf}`, sub: verb.en, answer: conjugate(verb, 'cmd', p) };
  }
  const p = Math.floor(Math.random() * 5);
  return { label: `${pick(PRONOUNS[p])} · ${verb.inf}`, sub: `${TENSE_ES[m.tense]} · ${verb.en}`, answer: conjugate(verb, m.tense, p) };
}

function Hud({ score, lives, combo, level, hi }: { score: number; lives: number; combo: number; level: number; hi: number }) {
  return (
    <div className="pixel flex flex-wrap gap-x-4 gap-y-1 px-2 py-1 text-[9px] border-b border-green-900" style={{ color: '#39ff14' }}>
      <span>PTS {String(score).padStart(5, '0')}</span>
      <span style={{ color: '#ff2bd6' }}>{'♥'.repeat(Math.max(lives, 0)) || '☠'}</span>
      <span style={{ color: '#ffe600' }}>COMBO x{combo}</span>
      <span style={{ color: '#00e5ff' }}>NIV {level}</span>
      <span className="ml-auto" style={{ color: '#ff8a00' }}>HI {hi}</span>
    </div>
  );
}

function Invaders({ mode, onExit }: { mode: TenseMode; onExit: () => void }) {
  const [, setTick] = useState(0);
  const g = useRef({ items: [] as Item[], score: 0, lives: 3, combo: 0, hits: 0, nextId: 1, spawnIn: 0.5, over: false, shake: 0, msg: '' });
  const [val, setVal] = useState('');
  const [fb, setFb] = useState<'' | 'right' | 'accent' | 'wrong'>('');
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const inp = useRef<HTMLInputElement>(null);
  const hi = Number(useStore.getState().flags[hiKey(mode.id)] ?? 0);
  const s = g.current;
  const level = 1 + Math.floor(s.hits / 5);

  useEffect(() => {
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1); last = now;
      if (!s.over && !pausedRef.current) {
        const lv = 1 + Math.floor(s.hits / 5), fall = Math.max(7, 16 - lv * 0.9);
        s.spawnIn -= dt;
        const live = s.items.filter((i) => !i.dead).length;
        if (s.spawnIn <= 0 && live < Math.min(4, 2 + Math.floor(lv / 3))) {
          const id = s.nextId++;
          s.items.push({ id, ...makePrompt(mode), y: 0, x: 4 + Math.random() * 50, color: NEON[id % NEON.length] });
          s.spawnIn = Math.max(1.4, 4.2 - lv * 0.25);
        }
        for (const it of s.items) {
          if (it.dead) { it.dead -= dt; continue; }
          it.y += dt / fall;
          if (it.y >= 0.9) { it.dead = 1.2; s.lives--; s.combo = 0; s.shake = 0.3; s.msg = `✗ ${it.answer}`; sfx('error'); if (s.lives <= 0) end(); }
        }
        s.items = s.items.filter((i) => !i.dead || i.dead > 0);
        s.shake = Math.max(0, s.shake - dt);
      }
      setTick((t) => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, []);

  function end() {
    s.over = true;
    const st = useStore.getState();
    if (s.score > Number(st.flags[hiKey(mode.id)] ?? 0)) st.setFlag(hiKey(mode.id), s.score);
    sfx('drama');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (s.over || !val.trim()) return;
    const input = stripPron(val.trim());
    let best: { it: Item; v: 'right' | 'accent' } | null = null;
    for (const it of s.items) {
      if (it.dead) continue;
      const v = grade(input, it.answer);
      if (v === 'right' || (v === 'accent' && !best)) best = { it, v };
      if (v === 'right') break;
    }
    const st = useStore.getState();
    if (best) {
      const pts = (best.v === 'right' ? 10 : 5) + s.combo * 2;
      s.score += pts; s.combo++; s.hits++;
      s.items = s.items.filter((i) => i !== best!.it);
      s.msg = best.v === 'right' ? `+${pts}` : `+${pts} (acento: ${best.it.answer})`;
      setFb(best.v); sfx(best.v === 'right' ? 'ding' : 'click'); st.addXP(1);
      if (s.hits % 5 === 0) sfx('levelup');
      if (s.score >= 200) st.unlock('arcade');
      if (s.score > Number(st.flags[hiKey(mode.id)] ?? 0)) st.setFlag(hiKey(mode.id), s.score);
    } else { s.combo = 0; s.msg = '¡Casi!'; setFb('wrong'); sfx('wrong'); }
    setVal(''); setTimeout(() => setFb(''), 400);
  }

  const togglePause = () => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); if (!pausedRef.current) inp.current?.focus(); };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Hud score={s.score} lives={s.lives} combo={s.combo} level={level} hi={Math.max(hi, s.score)} />
      <div className="relative flex-1 overflow-hidden min-h-[240px]" style={{ background: 'radial-gradient(#06130a, #000)', transform: s.shake ? `translateX(${Math.sin(s.shake * 80) * 4}px)` : undefined }}
        onClick={() => inp.current?.focus()}>
        {s.items.map((it) => (
          <div key={it.id} className="absolute select-text whitespace-nowrap px-2 py-1 border text-center" style={{ top: `${it.y * 100}%`, left: `${it.x}%`, color: it.color, borderColor: it.color, background: '#000a', textShadow: `0 0 6px ${it.color}`, opacity: it.dead ? Math.max(it.dead, 0) : 1 }}>
            <div className="vt text-2xl leading-none">{it.dead ? it.answer : it.label}</div>
            <div className="text-[10px] opacity-80 mono">{it.sub}</div>
          </div>
        ))}
        <div className="absolute left-0 right-0 border-t-2 border-dashed" style={{ top: '90%', borderColor: '#ff2bd6' }} />
        <div className="absolute bottom-1 left-2 pixel text-[9px]" style={{ color: fb === 'wrong' ? '#ff3b3b' : '#39ff14' }}>{s.msg}</div>
        {paused && <div className="absolute inset-0 flex items-center justify-center pixel text-sm" style={{ background: '#000c', color: '#ffe600' }}>PAUSA</div>}
        {s.over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pop" style={{ background: '#000d' }}>
            <div className="pixel text-lg" style={{ color: '#ff2bd6' }}>GAME OVER</div>
            <div className="pixel text-xs" style={{ color: '#39ff14' }}>{s.score} puntos {s.score >= hi && s.score > 0 ? '· ¡NUEVO RÉCORD!' : ''}</div>
            <div className="flex gap-2"><button className="btn" onClick={onExit}>Menú</button><button className="btn" onClick={() => { onExit(); setTimeout(() => window.dispatchEvent(new CustomEvent('conj-restart', { detail: mode.id })), 0); }}>Otra vez</button></div>
          </div>
        )}
      </div>
      <form onSubmit={submit} className="flex gap-2 p-2 bg-black border-t border-green-900">
        <input ref={inp} autoFocus value={val} onChange={(e) => setVal(e.target.value)} disabled={s.over} autoCapitalize="off" autoCorrect="off" spellCheck={false}
          className={`field flex-1 vt text-xl ${fb === 'right' ? 'right' : fb === 'accent' ? 'accent' : fb === 'wrong' ? 'wrong' : ''}`} placeholder="escribe la conjugación y pulsa Enter…" />
        <button type="button" className="btn" onClick={togglePause}>{paused ? '▶' : '⏸'}</button>
        <button type="button" className="btn" onClick={() => { if (!s.over) end(); onExit(); }}>✕</button>
      </form>
    </div>
  );
}

function Duelo({ kind, onExit }: { kind: 'porpara' | 'serestar' | 'mix'; onExit: () => void }) {
  const mk = () => {
    const a = kind === 'porpara' ? POR_PARA : kind === 'serestar' ? SER_ESTAR : [...POR_PARA, ...SER_ESTAR];
    return [...a].sort(() => Math.random() - 0.5);
  };
  const deck = useRef<DuelItem[]>(mk());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0), [lives, setLives] = useState(3), [combo, setCombo] = useState(0);
  const [t, setT] = useState(10);
  const [res, setRes] = useState<null | { ok: boolean; pick: number | null }>(null);
  const over = lives <= 0;
  const key = hiKey(`duelo-${kind}`);
  const hi = Number(useStore.getState().flags[key] ?? 0);
  const cur = deck.current[idx % deck.current.length];

  useEffect(() => {
    if (res || over) return;
    setT(10);
    const t0 = performance.now();
    const h = setInterval(() => {
      const left = 10 - (performance.now() - t0) / 1000;
      if (left <= 0) { clearInterval(h); setT(0); answer(null); } else setT(left);
    }, 100);
    return () => clearInterval(h);
    // eslint-disable-next-line
  }, [idx, res, over]);

  function answer(p: number | null) {
    if (res) return;
    const ok = p === cur[3], st = useStore.getState();
    setRes({ ok, pick: p });
    if (ok) {
      const pts = 10 + Math.round(t) + combo * 2, ns = score + pts;
      setScore(ns); setCombo(combo + 1); sfx('ding'); st.addXP(1);
      if (ns >= 200) st.unlock('arcade');
      if (ns > Number(st.flags[key] ?? 0)) st.setFlag(key, ns);
    } else { setLives(lives - 1); setCombo(0); sfx(p === null ? 'error' : 'wrong'); if (lives - 1 <= 0) sfx('drama'); }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Hud score={score} lives={lives} combo={combo} level={1 + Math.floor(idx / 5)} hi={Math.max(hi, score)} />
      <div className="flex-1 overflow-auto p-3 flex flex-col gap-3 items-center justify-center" style={{ background: 'radial-gradient(#10061a, #000)' }}>
        {over ? (
          <div className="flex flex-col items-center gap-3 pop">
            <div className="pixel text-lg" style={{ color: '#ff2bd6' }}>GAME OVER</div>
            <div className="pixel text-xs" style={{ color: '#39ff14' }}>{score} puntos</div>
            <div className="flex gap-2"><button className="btn" onClick={onExit}>Menú</button></div>
          </div>
        ) : (
          <>
            <div className="w-full max-w-lg h-3 border border-green-700"><div className="h-full" style={{ width: `${t * 10}%`, background: t < 3 ? '#ff3b3b' : '#39ff14', transition: 'width .1s linear' }} /></div>
            <div className="vt text-3xl text-center select-text" style={{ color: '#00e5ff', textShadow: '0 0 8px #00e5ff' }}>{cur[0].replace('____', '______')}</div>
            <div className="flex gap-3 flex-wrap justify-center">
              {[cur[1], cur[2]].map((o, i) => (
                <button key={i} disabled={!!res} onClick={() => answer(i)} className="pixel text-sm px-6 py-3 border-2"
                  style={{ color: res ? (i === cur[3] ? '#39ff14' : res.pick === i ? '#ff3b3b' : '#555') : ['#ffe600', '#ff2bd6'][i], borderColor: res ? (i === cur[3] ? '#39ff14' : res.pick === i ? '#ff3b3b' : '#333') : ['#ffe600', '#ff2bd6'][i], background: '#000' }}>{o}</button>
              ))}
            </div>
            {res && (
              <div className="pop text-center max-w-lg p-2 border" style={{ borderColor: res.ok ? '#39ff14' : '#ff3b3b', color: res.ok ? '#39ff14' : '#ff8080' }}>
                <div className="pixel text-[10px] mb-1">{res.ok ? '¡CORRECTO!' : res.pick === null ? '¡SE ACABÓ EL TIEMPO!' : '¡INCORRECTO!'}</div>
                <div className="vt text-xl select-text">{cur[4]}</div>
                <button className="btn mt-2" autoFocus onClick={() => { setRes(null); setIdx(idx + 1); }}>Siguiente ▶</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ConjugatorApp() {
  const flags = useStore((s) => s.flags);
  const [tab, setTab] = useState<'inv' | 'duelo'>('inv');
  const [mode, setMode] = useState<TenseMode | null>(null);
  const [run, setRun] = useState(0);
  const [duel, setDuel] = useState<'porpara' | 'serestar' | 'mix' | null>(null);
  const hi = (m: string) => Number(flags[hiKey(m)] ?? 0);

  useEffect(() => {
    const h = (e: Event) => { const m = MODES.find((x) => x.id === (e as CustomEvent).detail); if (m) { setRun((r) => r + 1); setMode(m); } };
    window.addEventListener('conj-restart', h);
    return () => window.removeEventListener('conj-restart', h);
  }, []);

  const playing = mode || duel;
  return (
    <div className="h-full flex flex-col bg-black text-green-400">
      {!playing && (
        <div className="flex gap-1 p-1 bg-[var(--face)]">
          <button className={`btn ${tab === 'inv' ? 'on' : ''}`} onClick={() => { sfx('click'); setTab('inv'); }}>👾 Verb Invaders</button>
          <button className={`btn ${tab === 'duelo' ? 'on' : ''}`} onClick={() => { sfx('click'); setTab('duelo'); }}>⚔️ Duelo</button>
        </div>
      )}
      {mode && <Invaders key={run} mode={mode} onExit={() => setMode(null)} />}
      {duel && <Duelo kind={duel} onExit={() => setDuel(null)} />}
      {!playing && (
        <div className="flex-1 overflow-auto p-3" style={{ background: 'radial-gradient(#06130a, #000)' }}>
          {tab === 'inv' ? (
            <>
              <h1 className="pixel text-sm mb-1" style={{ color: '#39ff14' }}>VERB INVADERS</h1>
              <p className="vt text-xl mb-3" style={{ color: '#00e5ff' }}>Escribe la conjugación antes de que toque el suelo. ¡3 vidas! Sin acentos = mitad de puntos.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {MODES.map((m, i) => (
                  <div key={m.id} className="border p-2 flex flex-col gap-1" style={{ borderColor: NEON[i % 5] }}>
                    <div className="vt text-xl leading-tight" style={{ color: NEON[i % 5] }}>{m.label}</div>
                    <div className="mono text-[11px] text-gray-400">{m.hint}</div>
                    <div className="flex gap-1 items-center mt-1">
                      <button className="btn" onClick={() => { sfx('open'); setRun((r) => r + 1); setMode(m); }}>▶ Jugar</button>
                      <button className="btn" onClick={() => openApp('academia', { lesson: m.lesson })}>📖 {m.lesson}</button>
                      <span className="pixel text-[8px] ml-auto" style={{ color: '#ff8a00' }}>HI {hi(m.id)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="pixel text-sm mb-1" style={{ color: '#ff2bd6' }}>DUELO: POR/PARA · SER/ESTAR</h1>
              <p className="vt text-xl mb-3" style={{ color: '#00e5ff' }}>10 segundos por frase. Después de cada respuesta, ¡la regla!</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {([['porpara', 'Por vs. Para', 'B2-L22'], ['serestar', 'Ser vs. Estar', 'B2-L20'], ['mix', 'Mezcla', 'B2-L22']] as const).map(([k, l, les], i) => (
                  <div key={k} className="border p-2 flex flex-col gap-1" style={{ borderColor: NEON[i] }}>
                    <div className="vt text-2xl" style={{ color: NEON[i] }}>{l}</div>
                    <div className="flex gap-1 items-center">
                      <button className="btn" onClick={() => { sfx('open'); setDuel(k); }}>▶ Duelo</button>
                      <button className="btn" onClick={() => openApp('academia', { lesson: les })}>📖 {les}</button>
                    </div>
                    <span className="pixel text-[8px]" style={{ color: '#ff8a00' }}>HI {hi(`duelo-${k}`)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
