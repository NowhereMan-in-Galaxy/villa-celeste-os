import { useMemo, useState } from 'react';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { openApp } from '../../os/wm';
import { Tabs, Speak } from '../../ui/kit';
import { CHARS, FAM, LOCS, TIES, Char, Loc } from './data';

const byId = Object.fromEntries(CHARS.map((c) => [c.id, c]));
const TIE_COLOR = { fam: '#b3261e', love: '#e91e8c', friend: '#1565c0', work: '#6d4c41', ex: '#444' } as const;
const CW = 100, CH = 118, CX = (c: Char) => 14 + c.col * 112, CY = (c: Char) => 14 + c.row * 150;

function Map({ onPerson }: { onPerson: (id: string) => void }) {
  const [sel, setSel] = useState<Loc | null>(null);
  return (
    <div className="flex-1 overflow-auto p-2 flex flex-col lg:flex-row gap-2" style={{ background: '#c8b98a' }}>
      <div className="inset p-0 overflow-auto shrink-0 lg:flex-1" style={{ minHeight: 0 }}>
        <svg viewBox="0 0 800 520" className="w-full h-auto" style={{ minWidth: 520, background: '#9ed08a' }}>
          <rect x="0" y="150" width="800" height="50" fill="#777" /><rect x="0" y="335" width="800" height="50" fill="#777" />
          <rect x="240" y="0" width="55" height="520" fill="#777" /><rect x="520" y="0" width="45" height="520" fill="#777" />
          {[[0, 175], [0, 360]].map(([x, y], i) => <line key={i} x1={x} y1={y} x2={800} y2={y} stroke="#ffe" strokeDasharray="14 10" strokeWidth="2" />)}
          {[267, 542].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="520" stroke="#ffe" strokeDasharray="14 10" strokeWidth="2" />)}
          {[[580, 420], [640, 450], [700, 410], [740, 470], [600, 490], [680, 495], [20, 510], [270, 500]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="14" fill="#2e7d32" /><circle cx={x - 4} cy={y - 4} r="6" fill="#4caf50" /></g>)}
          <text x="660" y="400" fontSize="13" textAnchor="middle" fill="#1b4d1b" fontFamily="VT323,monospace">Zona verde</text>
          {LOCS.map((l) => (
            <g key={l.id} onClick={() => { sfx('click'); setSel(l); }} style={{ cursor: 'pointer' }}>
              {l.round ? <ellipse cx={l.x + l.w / 2} cy={l.y + l.h / 2} rx={l.w / 2} ry={l.h / 2} fill={l.fill} stroke={sel?.id === l.id ? '#ff0' : '#2e5e2e'} strokeWidth={sel?.id === l.id ? 5 : 3} />
                : <><rect x={l.x + 4} y={l.y + 4} width={l.w} height={l.h} fill="#0003" /><rect x={l.x} y={l.y} width={l.w} height={l.h} fill={l.fill} stroke={sel?.id === l.id ? '#ff0' : '#333'} strokeWidth={sel?.id === l.id ? 5 : 2} />
                  <polygon points={`${l.x},${l.y} ${l.x + l.w},${l.y} ${l.x + l.w - 12},${l.y + 12} ${l.x + 12},${l.y + 12}`} fill="#0002" /></>}
              <text x={l.x + l.w / 2} y={l.y + l.h / 2 - 2} fontSize="30" textAnchor="middle">{l.emoji}</text>
              <text x={l.x + l.w / 2} y={l.y + l.h / 2 + 22} fontSize="11" textAnchor="middle" fontFamily="Tahoma,sans-serif" fontWeight="bold" fill="#111">{l.name.length > 18 ? l.name.split(' ').slice(0, 2).join(' ') : l.name}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="panel p-2 lg:w-72 shrink-0 overflow-auto">
        {sel ? (
          <div className="pop">
            <div className="text-lg font-bold">{sel.emoji} {sel.name}</div>
            <p className="my-2 select-text text-sm">{sel.desc} <Speak text={sel.desc} /></p>
            {sel.people.length > 0 && <>
              <div className="text-xs font-bold mb-1">Quién vive o trabaja aquí:</div>
              <div className="flex flex-wrap gap-1 mb-2">{sel.people.map((p) => <button key={p} className="btn" onClick={() => onPerson(p)}>{byId[p].emoji} {byId[p].name.split(' ')[0]}</button>)}</div>
            </>}
            <button className="btn" onClick={() => openApp('academia', { lesson: sel.les })}>📖 Lección {sel.les}</button>
          </div>
        ) : <div className="text-sm">Haz clic en un edificio del mapa para ver su descripción, sus habitantes y la lección relacionada. <b>Click a building.</b></div>}
      </div>
    </div>
  );
}

function File({ c, xp, onClose, onPerson }: { c: Char; xp: number; onClose: () => void; onPerson: (id: string) => void }) {
  const ties = TIES.filter((t) => t[0] === c.id || t[1] === c.id).map((t) => ({ other: byId[t[0] === c.id ? t[1] : t[0]], label: t[2], kind: t[3] }));
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-2" style={{ background: '#0008' }} onClick={onClose}>
      <div className="pop w-full max-w-xl max-h-full overflow-auto p-4 shadow-2xl" style={{ background: '#f3e6c0', color: '#2a2113', border: '2px solid #8b7442', fontFamily: '"Courier New",monospace' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-3 items-start">
          <div className="shrink-0 text-5xl w-20 h-24 flex items-center justify-center border-4 border-white shadow" style={{ background: FAM[c.fam].color + '55', transform: 'rotate(-3deg)' }}>{c.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] tracking-widest" style={{ color: '#a00' }}>EXPEDIENTE CONFIDENCIAL · {FAM[c.fam].name.toUpperCase()}</div>
            <div className="text-xl font-bold leading-tight select-text">{c.name}</div>
            <div className="text-sm">{c.role}</div>
          </div>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <p className="mt-3 text-sm leading-relaxed select-text">{c.bio} <Speak text={c.bio} /></p>
        <div className="mt-3 text-xs font-bold">RELACIONES:</div>
        <ul className="text-sm">{ties.map((t, i) => <li key={i}>• <button className="underline" onClick={() => onPerson(t.other.id)}>{t.other.name}</button> <span style={{ color: TIE_COLOR[t.kind] }}>({t.label})</span></li>)}{!ties.length && <li>• (sin lazos registrados)</li>}</ul>
        <div className="mt-3 text-xs font-bold">SECRETOS:</div>
        {c.secrets.map((s, i) => xp >= s.xp
          ? <p key={i} className="text-sm my-1 select-text">🔓 {s.text}</p>
          : <p key={i} className="text-sm my-1"><span className="px-1 font-bold" style={{ background: '#222', color: '#f33' }}>CLASIFICADO — necesitas {s.xp} XP</span> <span className="text-xs">(tienes {xp})</span></p>)}
        <div className="mt-3 flex gap-2 flex-wrap">
          <button className="btn" onClick={() => openApp('academia', { lesson: c.les })}>📖 Lección {c.les}</button>
          {c.home && <span className="text-xs self-center">📍 {LOCS.find((l) => l.id === c.home)?.name}</span>}
        </div>
      </div>
    </div>
  );
}

function Board({ onOpen, opened, sel }: { onOpen: (id: string) => void; opened: string[]; sel: string | null }) {
  return (
    <div className="flex-1 overflow-auto" style={{ background: 'repeating-linear-gradient(45deg,#b07b45,#b07b45 6px,#a56f3c 6px,#a56f3c 12px)', boxShadow: 'inset 0 0 40px #0006' }}>
      <div className="relative" style={{ width: 14 + 8 * 112, height: 14 + 5 * 150 }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {TIES.map(([a, b, , k], i) => {
            const A = byId[a], B = byId[b], x1 = CX(A) + CW / 2, y1 = CY(A) + 8, x2 = CX(B) + CW / 2, y2 = CY(B) + 8;
            const hot = sel && (sel === a || sel === b), my = Math.max(y1, y2) + 18 + (x1 === x2 ? 20 : 0);
            return <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2},${my} ${x2},${y2}`} fill="none" stroke={k === 'fam' || k === 'love' ? '#d01818' : k === 'friend' ? '#e25c1a' : '#7a1d1d'} strokeWidth={hot ? 3.5 : 1.8} strokeDasharray={k === 'ex' ? '5 4' : undefined} opacity={sel && !hot ? 0.3 : 0.95} />;
          })}
        </svg>
        {CHARS.map((c, i) => (
          <button key={c.id} onClick={() => onOpen(c.id)} className="absolute text-left shadow-lg hover:z-10 hover:scale-105 transition-transform" title={c.name}
            style={{ left: CX(c), top: CY(c), width: CW, height: CH, background: '#fdfdf8', padding: 6, transform: `rotate(${((i * 37) % 7) - 3}deg)`, outline: sel === c.id ? '3px solid #ffeb3b' : undefined }}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: '#d32f2f', boxShadow: '0 2px 2px #0006' }} />
            <div className="h-[68px] flex items-center justify-center text-4xl" style={{ background: FAM[c.fam].color + '44' }}>{c.emoji}</div>
            <div className="mt-1 text-[11px] leading-tight font-bold truncate" style={{ fontFamily: '"Comic Sans MS","Segoe Print",cursive', color: '#222' }}>{c.name.split(' ').slice(0, 2).join(' ')}</div>
            <div className="text-[9px] text-gray-500 truncate">{opened.includes(c.id) ? '✔ abierto' : FAM[c.fam].name.replace('Familia ', '')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Quiz() {
  const solved = useStore((s) => s.solved);
  const [qi, setQi] = useState(() => Math.floor(Math.random() * CHARS.length));
  const [pickId, setPick] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const c = CHARS[qi];
  const opts = useMemo(() => {
    const others = CHARS.filter((x) => x.id !== c.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others, c].sort(() => Math.random() - 0.5);
  }, [qi]);
  const done = CHARS.filter((x) => solved[`detective:quiz:${x.id}`]).length;
  const choose = (o: Char) => {
    if (pickId) return;
    setPick(o.id);
    if (o.id === c.id) { sfx('ding'); useStore.getState().solve(`detective:quiz:${c.id}`); setStreak(streak + 1); } else { sfx('wrong'); setStreak(0); }
  };
  const next = () => { setPick(null); setQi((q) => { let n; do { n = Math.floor(Math.random() * CHARS.length); } while (n === q); return n; }); };
  return (
    <div className="flex-1 overflow-auto p-3" style={{ background: '#2b2b2b', color: '#eee' }}>
      <div className="max-w-xl mx-auto">
        <div className="pixel text-[10px] mb-2" style={{ color: '#ffe600' }}>¿QUIÉN ES? · {done}/{CHARS.length} resueltos · racha {streak}</div>
        <div className="p-3 mb-3 select-text" style={{ background: '#f3e6c0', color: '#2a2113', fontFamily: '"Courier New",monospace' }}>
          <div className="text-xs" style={{ color: '#a00' }}>PISTA DEL CASO</div>
          <div className="text-lg">"{c.clue}" <Speak text={c.clue} /></div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {opts.map((o) => {
            const state = !pickId ? '' : o.id === c.id ? 'right' : o.id === pickId ? 'wrong' : '';
            return <button key={o.id} onClick={() => choose(o)} className="btn text-left" style={{ background: state === 'right' ? '#8fe08f' : state === 'wrong' ? '#f08a8a' : undefined, color: state ? '#000' : undefined }}>{o.emoji} {o.name}</button>;
          })}
        </div>
        {pickId && <div className="mt-3 pop"><b>{pickId === c.id ? '¡Correcto!' : `Era ${c.name}.`}</b> <button className="btn ml-2" autoFocus onClick={next}>Siguiente ▶</button></div>}
      </div>
    </div>
  );
}

export default function DetectiveApp() {
  const xp = useStore((s) => s.xp);
  const opened = (useStore((s) => s.flags['detective:opened']) as string[] | undefined) ?? [];
  const [tab, setTab] = useState<'map' | 'board' | 'quiz'>('map');
  const [file, setFile] = useState<string | null>(null);

  const open = (id: string) => {
    sfx('open'); setFile(id);
    if (!opened.includes(id)) {
      const n = [...opened, id], st = useStore.getState();
      st.setFlag('detective:opened', n);
      st.addXP(2);
      if (n.length >= 10) st.unlock('detective');
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center gap-2 pr-2">
        <Tabs tabs={[['map', '🗺️ Mapa'], ['board', '📌 Corcho'], ['quiz', '❓ ¿Quién es?']]} value={tab} onChange={(t) => { sfx('click'); setTab(t); }} />
        <span className="ml-auto text-xs">Expedientes: <b>{opened.length}</b>/{CHARS.length} · XP {xp}</span>
      </div>
      {tab === 'map' && <Map onPerson={(id) => { setTab('board'); open(id); }} />}
      {tab === 'board' && <Board onOpen={open} opened={opened} sel={file} />}
      {tab === 'quiz' && <Quiz />}
      {file && <File c={byId[file]} xp={xp} onClose={() => setFile(null)} onPerson={open} />}
    </div>
  );
}
