import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Speak } from '../../ui/kit';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { grade } from '../../utils/text';
import { openApp } from '../../os/wm';
import { LESSONS } from '../../data/curriculum';
import { BUDDIES, EPISODES, FAMILIES, Episode, Opt } from './data';

interface Msg { who: string; es: string; en: string; me?: boolean; note?: string; ok?: boolean }
const DOT = { on: '#00c000', away: '#e0a000', off: '#888' };
const lvl = (id: string) => (LESSONS as any[]).find((l) => l.id === id)?.cefrLevel ?? '';
const nHearts = (f: Record<string, unknown>, b: string) => (f[`chisme:hearts:${b}`] as number) || 0;

function Bubble({ m }: { m: Msg }) {
  const [en, setEn] = useState(false);
  return (
    <div className={`group flex ${m.me ? 'justify-end' : 'justify-start'} pop`}>
      <div className={`max-w-[88%] px-2 py-1 border ${m.me ? 'bg-[#dfeaff] border-[#7f9fd0]' : 'bg-white border-[#999]'}`}>
        <div className="text-[11px] font-bold" style={{ color: m.me ? '#003399' : '#990000' }}>{m.who} dice:</div>
        <div className="select-text">{m.es} <span className="opacity-40 group-hover:opacity-100"><Speak text={m.es} /></span></div>
        {en && <div className="text-xs italic text-[#555] select-text">{m.en}</div>}
        {m.note && <div className="text-xs text-[#0a6a0a]">{m.note}</div>}
        <button className="text-[10px] underline text-[#00c] opacity-70" onClick={() => { sfx('click'); setEn(!en); }}>{en ? 'ocultar EN' : 'EN'}</button>
      </div>
    </div>
  );
}

function Chat({ ep, onExit }: { ep: Episode; onExit: () => void }) {
  const { setFlag, solve, unlock, addXP } = useStore.getState();
  const buddy = BUDDIES.find((b) => b.id === ep.buddy)!;
  const [log, setLog] = useState<Msg[]>([]);
  const [ptr, setPtr] = useState(0);
  const [typing, setTyping] = useState<string | null>(null);
  const [why, setWhy] = useState('');
  const [miss, setMiss] = useState(false);
  const [txt, setTxt] = useState('');
  const [gr, setGr] = useState<'' | 'wrong'>('');
  const [gained, setGained] = useState(0);
  const end = useRef<HTMLDivElement>(null);
  const step = ep.steps[ptr];

  useEffect(() => {
    if (!step) {
      const f = useStore.getState().flags;
      if (!f[`chisme:done:${ep.id}`]) {
        setFlag(`chisme:done:${ep.id}`, true);
        addXP(15);
        sfx('levelup');
        const n = EPISODES.filter((e) => e.id === ep.id || f[`chisme:done:${e.id}`]).length;
        if (n >= 5) unlock('chismoso');
      }
      return;
    }
    if (step.k !== 'm') return;
    setTyping(step.from);
    const tm = setTimeout(() => {
      setTyping(null);
      setLog((l) => [...l, { who: step.from, es: step.es, en: step.en }]);
      sfx('uhoh');
      setPtr((p) => p + 1);
    }, 700 + Math.min(step.es.length * 12, 1200));
    return () => clearTimeout(tm);
  }, [ptr]);

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [log, typing, why, ptr]);

  const advance = (me: Msg, first: boolean) => {
    const key = `chisme:${ep.id}:${ptr}`;
    sfx('ding');
    solve(key);
    if (first) {
      const hk = `chisme:hearts:${ep.buddy}`;
      setFlag(hk, nHearts(useStore.getState().flags, ep.buddy) + 1);
      setGained((g) => g + 1);
      me.note = '♥ +1';
    }
    setLog((l) => [...l, me]);
    setWhy(''); setMiss(false); setTxt(''); setGr('');
    setPtr((p) => p + 1);
  };
  const pick = (o: Opt) => {
    if (o.ok) advance({ who: 'Tú', es: o.es, en: o.en, me: true }, !miss);
    else { sfx('wrong'); setMiss(true); setWhy(`✗ ${o.why ?? ''}`); }
  };
  const check = () => {
    if (step?.k !== 't') return;
    const r = grade(txt, step.answer);
    if (r === 'wrong') { sfx('wrong'); setMiss(true); setGr('wrong'); return; }
    advance({ who: 'Tú', es: txt.trim(), en: step.en, me: true, note: r === 'accent' ? '¡Ojo con los acentos!' : undefined }, !miss);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="panel flex items-center gap-2 p-1 text-xs flex-wrap">
        <button className="btn !min-w-0 px-1 sm:hidden" onClick={onExit}><ArrowLeft size={12} /></button>
        <b>{buddy.ava} {ep.title}</b>
        <span className="pixel text-[8px] px-1 bg-[#000080] text-white">{ep.lesson} · {lvl(ep.lesson)}</span>
        <span className="opacity-70">{ep.skill}{ep.role ? ` · Tú eres ${ep.role}` : ''}</span>
        <button className="btn !min-w-0 px-1 ml-auto" onClick={() => openApp('academia', { lesson: ep.lesson })}>📖 Lección {ep.lesson}</button>
        <button className="btn !min-w-0 px-1" onClick={onExit}>Salir</button>
      </div>
      <div className="inset flex-1 min-h-0 overflow-y-auto p-2 flex flex-col gap-2">
        {log.map((m, i) => <Bubble key={i} m={m} />)}
        {typing && <div className="text-xs italic opacity-70">{typing} está escribiendo<span className="blink">...</span></div>}
        {!step && (
          <div className="panel p-2 text-center pop">
            <div className="pixel text-[9px] mb-1">¡Conversación terminada!</div>
            <div>♥ +{gained} corazones con {buddy.name} (total {nHearts(useStore.getState().flags, ep.buddy)}) · +15 XP</div>
            <button className="btn mt-2" onClick={onExit}>Cerrar chat</button>
          </div>
        )}
        <div ref={end} />
      </div>
      {step?.k === 'c' && (
        <div className="panel p-1 flex flex-col gap-1">
          <div className="text-xs">💬 {step.q}</div>
          {step.opts.map((o, i) => (
            <button key={i} className="btn !justify-start text-left !h-auto py-1 select-text" onClick={() => pick(o)}>{o.es}</button>
          ))}
          {why && <div className="text-xs text-[#a00000] pop">{why}</div>}
        </div>
      )}
      {step?.k === 't' && (
        <div className="panel p-1 flex flex-col gap-1">
          <div className="text-xs">⌨️ {step.q}</div>
          <div className="flex gap-1">
            <input className={`field flex-1 ${gr}`} value={txt} autoFocus onChange={(e) => { setTxt(e.target.value); setGr(''); }} onKeyDown={(e) => e.key === 'Enter' && check()} placeholder="Escribe en español..." />
            <button className="btn" onClick={check}>Enviar</button>
          </div>
          {gr === 'wrong' && <div className="text-xs text-[#a00000] pop">✗ Pista: {step.hint}</div>}
        </div>
      )}
    </div>
  );
}

export default function ChismeNetApp() {
  const flags = useStore((s) => s.flags);
  const [buddyId, setBuddyId] = useState<string | null>(null);
  const [ep, setEp] = useState<Episode | null>(null);
  const [toast, setToast] = useState('');
  const done = EPISODES.filter((e) => flags[`chisme:done:${e.id}`]).length;

  useEffect(() => {
    const on = BUDDIES.filter((b) => b.status === 'on');
    const t1 = setTimeout(() => { setToast(on[Math.floor(Math.random() * on.length)].name); sfx('uhoh'); }, 1200);
    const t2 = setTimeout(() => setToast(''), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const buddy = BUDDIES.find((b) => b.id === buddyId);
  const eps = EPISODES.filter((e) => e.buddy === buddyId);
  const chatting = !!ep;

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 min-h-0 flex">
        <div className={`${buddyId ? 'hidden sm:flex' : 'flex'} w-full sm:w-52 shrink-0 flex-col p-1 min-h-0`}>
          <div className="pixel text-[8px] p-1">ChismeNet Messenger '98</div>
          <div className="inset flex-1 overflow-y-auto">
            {FAMILIES.map((f) => (
              <div key={f}>
                <div className="bg-[#c0c0ff] text-[11px] font-bold px-1">▼ {f}</div>
                {BUDDIES.filter((b) => b.family === f).map((b) => (
                  <div key={b.id} className={`row-item ${b.id === buddyId ? 'sel' : ''} !items-start`} onClick={() => { sfx('click'); if (!ep) setBuddyId(b.id); }}>
                    <span className="inline-block w-2 h-2 rounded-full mr-1 mt-1.5 shrink-0" style={{ background: DOT[b.status] }} />
                    <span className="min-w-0">
                      <b>{b.name}</b> <span className="text-[10px] text-[#c00]">{'♥'.repeat(Math.min(nHearts(flags, b.id), 5))}</span>
                      <span className="block text-[10px] opacity-70 truncate">{b.nick}</span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="text-[10px] p-1">Chats: {done}/{EPISODES.length} · 🏆 Chismoso a 5</div>
        </div>
        <div className={`${buddyId ? 'flex' : 'hidden sm:flex'} flex-1 min-w-0 flex-col p-1 min-h-0`}>
          {chatting ? <Chat key={ep!.id} ep={ep!} onExit={() => setEp(null)} />
            : !buddy ? <div className="inset flex-1 grid place-items-center p-4 text-center">Elige un amigo de la lista para chismear.<br />(Doble clic en cualquier palabra para traducirla.)</div>
            : (
              <div className="inset flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                <button className="btn !min-w-0 px-1 self-start sm:hidden" onClick={() => setBuddyId(null)}><ArrowLeft size={12} /> Lista</button>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{buddy.ava}</span>
                  <div><b>{buddy.name}</b> <span className="text-xs">({buddy.status === 'on' ? 'conectado' : 'ausente'})</span>
                    <div className="text-xs select-text">{buddy.nick}</div></div>
                </div>
                <div className="text-xs">Corazones: <span className="text-[#c00]">{'♥'.repeat(nHearts(flags, buddy.id)) || '—'}</span></div>
                {eps.map((e) => (
                  <button key={e.id} className="btn !h-auto !justify-start text-left p-2 flex-col !items-start" onClick={() => { sfx('open'); setEp(e); }}>
                    <span><b>{e.title}</b> {flags[`chisme:done:${e.id}`] ? <Check size={12} className="inline text-green-700" /> : null}</span>
                    <span className="text-[11px] opacity-80">{e.lesson} · {lvl(e.lesson)} · {e.skill}</span>
                  </button>
                ))}
              </div>
            )}
        </div>
      </div>
      {toast && (
        <div className="absolute right-2 bottom-2 pop border border-black px-2 py-1 text-xs shadow" style={{ background: '#ffffc0' }}>
          <b>{toast}</b> se ha conectado. :-)
        </div>
      )}
    </div>
  );
}
