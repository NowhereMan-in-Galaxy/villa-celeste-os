import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { speak } from '../../utils/tts';
import { fold } from '../../utils/text';
import { openApp } from '../../os/wm';
import { LESSONS, loadLesson } from '../../data/curriculum';
import { Tabs } from '../../ui/kit';
import { DRILLS } from './data';
import type { AppProps } from '../../config/apps';

interface Item { id: string; es: string }
interface Res { pct: number; words: { w: string; ok: boolean }[]; heard?: string; mode: 'sr' | 'self' }
type Status = 'idle' | 'speaking' | 'recording';

const clean = (s: string) => s.replace(/\(.*?\)/g, '').split(/\s+\/\s+|;/)[0].trim();
function score(target: string, heard: string[]): Res {
  const tw = target.split(/\s+/).filter(Boolean);
  let best: Res | null = null;
  for (const h of heard) {
    const hs = fold(h).split(' ').filter(Boolean), pool = [...hs];
    const words = tw.map((w) => { const i = pool.indexOf(fold(w)); if (i >= 0) pool.splice(i, 1); return { w, ok: i >= 0 }; });
    const pct = Math.round((100 * words.filter((x) => x.ok).length) / Math.max(tw.length, 1));
    if (!best || pct > best.pct) best = { pct, words, heard: h, mode: 'sr' };
  }
  return best ?? { pct: 0, words: tw.map((w) => ({ w, ok: false })), heard: '', mode: 'sr' };
}

export default function FoneticaApp({ args }: AppProps) {
  const [tab, setTab] = useState<'drills' | 'lesson'>(args?.lesson ? 'lesson' : 'drills');
  const [drillId, setDrillId] = useState(DRILLS[0].id);
  const [lessonId, setLessonId] = useState<string>(args?.lesson ?? 'B1-L01');
  const [lessonItems, setLessonItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [slow, setSlow] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [res, setRes] = useState<Res | null>(null);
  const [selfAsk, setSelfAsk] = useState(false);
  const [msg, setMsg] = useState('');
  const [mine, setMine] = useState<string | null>(null);
  const good = Number(useStore((s) => s.flags['fonetica:good']) ?? 0);

  const drill = DRILLS.find((d) => d.id === drillId)!;
  const items: Item[] = tab === 'drills' ? drill.items.map((es, i) => ({ id: `${drill.id}${i}`, es })) : lessonItems;
  const cur = items[Math.min(idx, items.length - 1)];
  const target = cur ? clean(cur.es) : '';
  const curRef = useRef({ id: '', target: '' });
  curRef.current = { id: cur?.id ?? '', target };

  const canvas = useRef<HTMLCanvasElement>(null);
  const R = useRef<{ stream?: MediaStream; ctx?: AudioContext; an?: AnalyserNode; mr?: MediaRecorder; sr?: any; chunks: Blob[]; status: Status; speaking: number; got: boolean }>({ chunks: [], status: 'idle', speaking: 0, got: false });
  R.current.status = status;

  useEffect(() => {
    if (tab !== 'lesson') return;
    let off = false;
    loadLesson(lessonId).then((l) => {
      if (off) return;
      setLessonItems(l.vocabulary.filter((v) => v.es && v.es.length > 1).slice(0, 40).map((v, i) => ({ id: `${lessonId}:${i}`, es: v.es })));
      setIdx(0);
    });
    return () => { off = true; };
  }, [tab, lessonId]);

  useEffect(() => { setRes(null); setSelfAsk(false); setMsg(''); setMine((u) => { if (u) URL.revokeObjectURL(u); return null; }); }, [idx, drillId, lessonId, tab]);

  useEffect(() => {
    let raf = 0, t = 0;
    const draw = () => {
      const c = canvas.current;
      if (c) {
        const g = c.getContext('2d')!, W = c.width, H = c.height, r = R.current;
        g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
        g.strokeStyle = '#063'; g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();
        g.strokeStyle = '#3f3'; g.lineWidth = 2; g.beginPath();
        t += 0.2;
        if (r.status === 'recording' && r.an) {
          const d = new Uint8Array(r.an.fftSize); r.an.getByteTimeDomainData(d);
          for (let i = 0; i < W; i++) { const y = (d[Math.floor((i / W) * d.length)] / 255) * H; i ? g.lineTo(i, y) : g.moveTo(i, y); }
        } else {
          const amp = r.status === 'speaking' ? H * 0.3 : 1.5;
          for (let i = 0; i < W; i++) { const y = H / 2 + Math.sin(i * 0.09 + t) * amp * Math.sin(i * 0.013 + t * 0.3) + (r.status === 'speaking' ? (Math.random() - 0.5) * 8 : 0); i ? g.lineTo(i, y) : g.moveTo(i, y); }
        }
        g.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); teardown(true); window.speechSynthesis?.cancel(); };
    // eslint-disable-next-line
  }, []);

  function teardown(abort = false) {
    const r = R.current;
    try { if (abort) r.sr?.abort(); else r.sr?.stop(); } catch { /* */ }
    try { if (r.mr && r.mr.state !== 'inactive') r.mr.stop(); } catch { /* */ }
    r.stream?.getTracks().forEach((t) => t.stop());
    try { r.ctx?.close(); } catch { /* */ }
    r.stream = r.ctx = r.an = r.sr = undefined;
  }

  function finish(r: Res) {
    teardown(true);
    setStatus('idle'); setRes(r); setSelfAsk(false);
    const st = useStore.getState(), { id } = curRef.current, qid = `fonetica:${id}`;
    if (r.pct >= 80) {
      sfx('ding');
      if (!st.solved[qid]) {
        st.solve(qid);
        const n = Number(st.flags['fonetica:good'] ?? 0) + 1;
        st.setFlag('fonetica:good', n);
        if (n >= 10) st.unlock('voz');
      }
    } else sfx('wrong');
  }

  function toSelf(m: string) { teardown(true); setStatus('idle'); setSelfAsk(true); setMsg(m); }

  function play() {
    stopAll();
    if (!target) return;
    sfx('click'); setStatus('speaking');
    speak(target, slow ? 0.7 : 1);
    const ms = 600 + target.length * (slow ? 110 : 75);
    window.clearTimeout(R.current.speaking);
    R.current.speaking = window.setTimeout(() => setStatus((s) => (s === 'speaking' ? 'idle' : s)), ms);
  }

  function stopAll() {
    window.speechSynthesis?.cancel(); window.clearTimeout(R.current.speaking);
    if (R.current.status === 'recording') {
      const r = R.current;
      if (r.sr) { try { r.sr.stop(); } catch { /* */ } return; }
      if (r.mr && r.mr.state !== 'inactive') { r.mr.stop(); return; }
    }
    setStatus('idle');
  }

  async function record() {
    stopAll(); window.speechSynthesis?.cancel();
    setRes(null); setSelfAsk(false); setMsg(''); setMine(null);
    const r = R.current; r.chunks = []; r.got = false;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    try {
      r.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      r.ctx = new AC(); r.an = r.ctx.createAnalyser(); r.an.fftSize = 1024;
      r.ctx.createMediaStreamSource(r.stream).connect(r.an);
      if (typeof MediaRecorder !== 'undefined') {
        r.mr = new MediaRecorder(r.stream);
        r.mr.ondataavailable = (e) => e.data.size && r.chunks.push(e.data);
        r.mr.onstop = () => { if (r.chunks.length) setMine(URL.createObjectURL(new Blob(r.chunks, { type: r.mr?.mimeType || 'audio/webm' }))); if (!SR) { setStatus('idle'); setSelfAsk(true); setMsg('Escucha tu voz y evalúate.'); } };
        r.mr.start();
      }
    } catch { r.stream = undefined; }
    if (SR) {
      const sr = new SR();
      sr.lang = 'es-MX'; sr.interimResults = false; sr.maxAlternatives = 3;
      sr.onresult = (e: any) => { r.got = true; const alts: string[] = Array.from(e.results[0] as ArrayLike<any>).map((a: any) => a.transcript); finish(score(curRef.current.target, alts)); };
      sr.onerror = (e: any) => { if (e.error !== 'aborted' && !r.got) { r.got = true; toSelf(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Micrófono bloqueado: evalúate tú mismo.' : 'No te escuché bien. ¿Cómo te fue?'); } };
      sr.onend = () => { if (!r.got && R.current.status === 'recording') toSelf('No te escuché. ¿Cómo te fue?'); };
      r.sr = sr;
      try { sr.start(); } catch { r.sr = undefined; }
    }
    if (!r.sr && !r.mr) { toSelf('Tu navegador no puede grabar: evalúate tú mismo después de decirlo en voz alta.'); return; }
    setStatus('recording'); sfx('open');
    if (!r.sr) window.setTimeout(() => { if (R.current.mr?.state === 'recording') R.current.mr.stop(); }, 7000);
  }

  const self = (pct: number) => finish({ pct, words: target.split(/\s+/).map((w) => ({ w, ok: pct >= 80 })), mode: 'self' });
  const go = (d: number) => { stopAll(); sfx('click'); setIdx((i) => Math.max(0, Math.min(items.length - 1, i + d))); };

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="flex gap-3 px-2 py-0.5 border-b border-gray-400 text-xs"><span>Archivo</span><span>Edición</span><span>Efectos</span><span>Ayuda</span><span className="ml-auto">🏆 {good}/10 frases buenas</span></div>
      <div className="panel m-1 p-2 flex flex-col gap-2">
        <div className="flex gap-2 items-stretch">
          <div className="sunken bg-black px-2 flex flex-col justify-center mono text-[11px]" style={{ color: '#3f3', minWidth: 74 }}>
            <span>Pos.: {String(idx + 1).padStart(2, '0')}</span><span>Long.: {String(items.length).padStart(2, '0')}</span>
          </div>
          <canvas ref={canvas} width={480} height={64} className="sunken flex-1 min-w-0 h-16 bg-black" />
        </div>
        <div className="flex gap-1 items-center flex-wrap">
          <button className="btn" onClick={() => go(-1)} title="Anterior">◀◀</button>
          <button className={`btn ${status === 'speaking' ? 'on' : ''}`} onClick={play} title="Escuchar modelo">▶</button>
          <button className="btn" onClick={stopAll} title="Detener">■</button>
          <button className={`btn ${status === 'recording' ? 'on' : ''}`} style={{ color: '#c00' }} onClick={record} title="Grabar">●</button>
          <button className="btn" onClick={() => go(1)} title="Siguiente">▶▶</button>
          <label className="ml-2 flex items-center gap-1 text-xs"><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> Lento 0.75x</label>
          {mine && <audio src={mine} controls className="h-7 ml-auto max-w-[180px]" />}
        </div>
      </div>

      <Tabs tabs={[['drills', '🔤 Ejercicios de sonidos'], ['lesson', '📖 Frases de lecciones']]} value={tab} onChange={(t) => { setTab(t); setIdx(0); }} />
      <div className="flex-1 min-h-0 overflow-auto flex flex-col gap-2 p-2">
        {tab === 'drills' ? (
          <div className="flex gap-1 flex-wrap">{DRILLS.map((d) => <button key={d.id} className={`btn ${d.id === drillId ? 'on' : ''}`} onClick={() => { setDrillId(d.id); setIdx(0); }}>{d.title}</button>)}</div>
        ) : (
          <div className="flex gap-2 items-center">
            <select className="field" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>{LESSONS.map((l) => <option key={l.id} value={l.id}>{l.id} · {l.title}</option>)}</select>
            <button className="btn" onClick={() => openApp('academia', { lesson: lessonId })}>📖</button>
          </div>
        )}
        {tab === 'drills' && <div className="inset p-2 select-text"><p>{drill.es}</p><p className="text-gray-500 text-xs mt-1">{drill.en}</p></div>}

        {cur ? (
          <div className="inset p-3 text-center">
            <div className="text-2xl font-bold select-text leading-snug">
              {(res?.words ?? target.split(/\s+/).map((w) => ({ w, ok: null as boolean | null }))).map((x, i) => (
                <span key={i} style={{ color: x.ok === null ? undefined : x.ok ? '#0a7a0a' : '#c00' }}>{x.w} </span>
              ))}
            </div>
            {res && (
              <div className="pop mt-2">
                <div className="text-xl font-bold" style={{ color: res.pct >= 80 ? '#0a7a0a' : '#c00' }}>{res.pct}% {res.pct >= 80 ? '¡Muy bien! 🎉' : 'Inténtalo otra vez'}</div>
                {res.mode === 'sr' && <div className="text-xs text-gray-600">Escuché: "{res.heard || '…'}"</div>}
              </div>
            )}
            {status === 'recording' && <div className="blink mt-2 text-red-600 font-bold">● Grabando… di la frase en voz alta</div>}
            {selfAsk && (
              <div className="pop mt-2">
                <div className="text-xs mb-1">{msg}</div>
                <div className="flex gap-2 justify-center"><button className="btn" onClick={() => self(100)}>😀 Bien</button><button className="btn" onClick={() => self(60)}>😐 Regular</button><button className="btn" onClick={() => self(0)}>😟 Repetir</button></div>
              </div>
            )}
          </div>
        ) : <div className="inset p-3 text-center">Cargando frases…</div>}

        <div className="flex flex-col gap-0.5">
          {items.map((it, i) => (
            <button key={it.id} className={`row-item text-left ${i === idx ? 'sel' : ''}`} onClick={() => { stopAll(); setIdx(i); }}>
              {useStore.getState().solved[`fonetica:${it.id}`] ? '✅ ' : '○ '}{clean(it.es)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
