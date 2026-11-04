import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, SkipForward, BookOpen } from 'lucide-react';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { speak } from '../../utils/tts';
import { openApp } from '../../os/wm';
import { Speak } from '../../ui/kit';
import { EPISODES, PORTRAITS } from './data';

type Subs = 'es' | 'both' | 'none';
const CSS = `@keyframes ovnoise{0%{background-position:0 0}25%{background-position:-40px 20px}50%{background-position:30px -30px}75%{background-position:-20px -10px}100%{background-position:10px 40px}}
@keyframes ovroll{from{transform:translateY(-100%)}to{transform:translateY(100%)}}
.ov-noise{background-image:repeating-radial-gradient(circle at 17% 32%,#fff 0,#000 1px,#888 2px,#000 3px);background-size:90px 90px;animation:ovnoise .12s steps(2) infinite}
.ov-scan{background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}
.ov-roll{animation:ovroll 4s linear infinite;background:linear-gradient(transparent,rgba(255,255,255,.08),transparent);height:30%}`;

export default function LaOvejaNegraApp() {
  const [ei, setEi] = useState(0);
  const [idx, setIdx] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [subs, setSubs] = useState<Subs>('both');
  const [tuning, setTuning] = useState(true);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [cleared, setCleared] = useState<Record<string, boolean>>({});
  const [wrongStatic, setWrongStatic] = useState(false);
  const flags = useStore((s) => s.flags);
  const ep = EPISODES[ei];
  const line = idx >= 0 ? ep.lines[idx] : undefined;
  const needsPick = !!line?.cp && !cleared[`${ei}:${idx}`];
  const timer = useRef<number>();

  const channel = (n: number) => {
    sfx('click');
    window.speechSynthesis?.cancel();
    setCleared({});
    setEi(n); setIdx(-1); setDone(false); setPicked(null); setPaused(false); setTuning(true);
    window.setTimeout(() => { setTuning(false); setIdx(0); }, 700);
  };
  useEffect(() => { const t = window.setTimeout(() => { setTuning(false); setIdx(0); }, 700); return () => { clearTimeout(t); window.speechSynthesis?.cancel(); }; }, []);

  const next = useCallback(() => {
    if (idx + 1 >= ep.lines.length) {
      setDone(true);
      const st = useStore.getState();
      st.setFlag(`novela:done:${ep.id}`, true);
      const n = EPISODES.filter((e) => useStore.getState().flags[`novela:done:${e.id}`]).length;
      if (n >= 3) st.unlock('oveja');
      st.toast(`Episodio terminado: ${ep.title}`);
      sfx('levelup');
    } else setIdx(idx + 1);
    setPicked(null);
  }, [idx, ep]);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!line || tuning || done || needsPick || paused) return;
    speak(line.es);
    timer.current = window.setTimeout(next, 1800 + line.es.length * 75);
    return () => clearTimeout(timer.current);
  }, [idx, ei, tuning, done, needsPick, paused, line, next]);
  useEffect(() => { if (needsPick) { window.speechSynthesis?.cancel(); sfx('drama'); } }, [needsPick]);

  const opts = useMemo(() => {
    if (!line?.cp) return [];
    const a = [line.es, ...line.cp.wrong];
    const r = (ei + idx) % 3;
    return [...a.slice(r), ...a.slice(0, r)];
  }, [line, ei, idx]);

  const pick = (o: string, i: number) => {
    if (!line?.cp) return;
    setPicked(i);
    if (o === line.es) {
      sfx('ding');
      useStore.getState().solve(`novela:${ep.id}:${idx}`);
      setCleared((c) => ({ ...c, [`${ei}:${idx}`]: true }));
      setPicked(null);
    } else {
      sfx('wrong'); setWrongStatic(true);
      setTimeout(() => setWrongStatic(false), 600);
    }
  };

  const portrait = line ? PORTRAITS[line.w] ?? '🙂' : '';
  const doneCount = EPISODES.filter((e) => flags[`novela:done:${e.id}`]).length;

  return (
    <div className="h-full flex flex-col overflow-auto" style={{ background: 'var(--face)' }}>
      <style>{CSS}</style>
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-2 min-h-0">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="p-3 md:p-4 rounded-xl" style={{ background: 'linear-gradient(#2a2a2e,#101012)', boxShadow: 'inset 0 0 0 3px #3a3a3e, 0 4px 0 #000' }}>
            <div className="relative overflow-hidden bg-black select-none" style={{ aspectRatio: '4/3', borderRadius: '8% / 10%', boxShadow: 'inset 0 0 40px #000, inset 0 0 8px #0f0a' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center"
                style={{ background: line?.sofa ? 'radial-gradient(#5a3a28,#1c1008)' : 'radial-gradient(#35507a,#0c1424)' }}>
                {line && !done && (
                  <>
                    <div className="text-[56px] md:text-[80px] leading-none">{portrait}</div>
                    <div className="vt text-xl md:text-2xl text-yellow-200 mt-1">{line.sofa ? `🛋️ ${line.w} (desde el sofá)` : line.w}</div>
                  </>
                )}
                {done && <div className="vt text-2xl text-green-300 pop">FIN DEL EPISODIO<br /><span className="text-lg">{doneCount}/8 vistos</span></div>}
                {needsPick && line?.cp && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3 vt text-lg md:text-2xl text-red-300 blink">
                    ■ MODO DIRECTOR — ESCENA CONGELADA ■
                  </div>
                )}
              </div>
              {line && !done && !needsPick && subs !== 'none' && (
                <div className="absolute left-0 right-0 bottom-3 px-3 text-center">
                  <div className="inline-block bg-black/75 px-2 py-1 max-w-full select-text">
                    <div className="text-white text-sm md:text-base font-bold">{line.es}</div>
                    {subs === 'both' && <div className="text-yellow-200 text-xs md:text-sm italic">{line.en}</div>}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 ov-scan pointer-events-none" />
              <div className="absolute inset-x-0 top-0 ov-roll pointer-events-none" />
              {(tuning || wrongStatic) && <div className="absolute inset-0 ov-noise" />}
              <div className="absolute top-2 right-3 vt text-2xl md:text-3xl" style={{ color: '#4f4', textShadow: '0 0 6px #0f0' }}>CH {String(ep.ch).padStart(2, '0')}</div>
              <div className="absolute top-2 left-3 vt text-xl" style={{ color: '#fff', textShadow: '0 0 4px #fff' }}>{paused ? '❚❚ PAUSA' : '▶ PLAY'}</div>
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px 20px rgba(0,0,0,.65)' }} />
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="w-3 h-3 rounded-full" style={{ background: '#e22', boxShadow: '0 0 6px #e22' }} />
              <button className="btn" onClick={() => { sfx('click'); setPaused((p) => !p); window.speechSynthesis?.cancel(); }}>{paused ? <Play size={12} className="inline" /> : <Pause size={12} className="inline" />} {paused ? 'Seguir' : 'Pausa'}</button>
              <button className="btn" disabled={needsPick || done} onClick={() => { sfx('click'); window.speechSynthesis?.cancel(); next(); }}><SkipForward size={12} className="inline" /> Siguiente</button>
              <button className="btn" onClick={() => { sfx('click'); setSubs(subs === 'es' ? 'both' : subs === 'both' ? 'none' : 'es'); }}>Subs: {subs === 'es' ? 'ES' : subs === 'both' ? 'ES+EN' : 'No'}</button>
              {line && <Speak text={line.es} />}
              <button className="btn ml-auto" onClick={() => openApp('academia', { lesson: ep.lesson })}><BookOpen size={12} className="inline" /> Lección {ep.lesson}</button>
            </div>
          </div>
        </div>

        <div className="md:w-72 flex flex-col gap-2 min-w-0">
          {needsPick && line?.cp ? (
            <fieldset className="group pop"><legend>🎬 Modo Director</legend>
              <p className="text-sm mb-2 select-text">{line.cp.q}</p>
              <p className="text-xs mb-2 font-bold">¿Qué dice {line.w}?</p>
              <div className="flex flex-col gap-1">
                {opts.map((o, i) => (
                  <button key={o} className={`btn !text-left !h-auto py-1 select-text ${picked === i ? 'on' : ''}`} onClick={() => pick(o, i)}>{o}</button>
                ))}
              </div>
              {picked !== null && opts[picked] !== line.es && (
                <div className="mt-2 p-2 text-sm inset pop" style={{ color: '#a00' }}>📡 ¡Interferencia! {line.cp.why}</div>
              )}
              <div className="text-[11px] mt-2 opacity-70">Tema: {ep.focus}</div>
            </fieldset>
          ) : (
            <fieldset className="group"><legend>Episodio actual</legend>
              <div className="font-bold text-sm">{ep.title}</div>
              <div className="text-xs italic mb-1">{ep.sub}</div>
              <div className="text-xs">Gramática: {ep.focus}</div>
              <div className="text-xs mt-1">Escena {Math.max(idx + 1, 0)}/{ep.lines.length}</div>
              {line && !done && <div className="mt-2 text-sm inset p-2 select-text">{line.es}</div>}
            </fieldset>
          )}
          <fieldset className="group"><legend>📼 Canales ({doneCount}/8)</legend>
            <div className="flex flex-col gap-1">
              {EPISODES.map((e, i) => (
                <button key={e.id} className={`btn !text-left !h-auto py-1 ${i === ei ? 'on' : ''}`} onClick={() => channel(i)}>
                  <span className="vt text-base">CH{String(e.ch).padStart(2, '0')}</span> {flags[`novela:done:${e.id}`] ? '✅' : '▫️'} {e.title.replace('La oveja negra ', '')}
                </button>
              ))}
            </div>
            <div className="text-[11px] mt-1 opacity-70">{doneCount >= 3 ? 'Logro desbloqueado: Fanático de La Oveja Negra' : 'Mira 3 episodios para ser Fanático de La Oveja Negra.'}</div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
