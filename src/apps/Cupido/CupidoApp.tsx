import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { openApp } from '../../os/wm';
import { Speak, Tabs } from '../../ui/kit';
import { CLIENTS, DATES, HOUSES, HQS, MAX_PRICE, PROFILES, type Q } from './data';

const Lesson = ({ id }: { id: string }) => (
  <button className="btn !h-auto py-0.5 text-xs" onClick={() => openApp('academia', { lesson: id })}><BookOpen size={11} className="inline" /> Lección {id}</button>
);

function Quiz({ q, qid, onDone }: { q: Q; qid: string; onDone?: () => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const answered = useStore((s) => !!s.solved[qid]);
  const ok = sel === q.ok || (answered && sel === null);
  return (
    <div className="mt-2">
      <div className="text-sm font-bold">{q.q} <Speak text={q.q.replace(/_+/g, '')} /></div>
      <div className="flex flex-wrap gap-1 mt-1">
        {q.opts.map((o, i) => (
          <button key={o} className={`btn !h-auto py-0.5 text-xs ${sel === i ? 'on' : ''}`}
            style={sel === i ? { color: i === q.ok ? '#060' : '#a00' } : undefined}
            onClick={() => { setSel(i); if (i === q.ok) { sfx('ding'); useStore.getState().solve(qid); onDone?.(); } else sfx('wrong'); }}>{o}</button>
        ))}
      </div>
      {sel !== null && <div className="text-xs mt-1 pop" style={{ color: ok ? '#060' : '#a00' }}>{ok ? '✔ ' : '✘ '}{q.why}</div>}
    </div>
  );
}

function DatePlay({ id, onEnd }: { id: string; onEnd: () => void }) {
  const d = DATES.find((x) => x.id === id)!;
  const [step, setStep] = useState(0);
  const [pts, setPts] = useState(0);
  const [react, setReact] = useState<string | null>(null);
  const end = step >= d.steps.length;
  const ending = pts < 3 ? 0 : pts < 5 ? 1 : 2;
  const s = d.steps[step];
  const choose = (o: { t: string; pts: 0 | 1 | 2; react: string }) => {
    if (react) return;
    setReact(o.react); setPts((p) => p + o.pts);
    if (o.pts === 2) { sfx('ding'); useStore.getState().solve(`cupido:date:${id}:${step}`); } else sfx(o.pts ? 'click' : 'wrong');
  };
  const advance = () => {
    const last = step + 1 >= d.steps.length;
    setReact(null); setStep(step + 1);
    if (last && id === 'valeria' && pts >= 3) { useStore.getState().unlock('casamentero'); sfx('levelup'); }
  };
  return (
    <fieldset className="group pop"><legend>💬 {d.title}</legend>
      {!end ? (
        <>
          <div className="inset p-2 text-sm select-text">💬 {s.npc} <Speak text={s.npc} /><div className="text-xs italic opacity-70">{s.en}</div></div>
          <div className="flex flex-col gap-1 mt-2">
            {s.opts.map((o) => <button key={o.t} className="btn !h-auto !text-left py-1 text-sm select-text" disabled={!!react} onClick={() => choose(o)}>{o.t}</button>)}
          </div>
          {react && <div className="mt-2 text-sm pop">🎞️ {react}<div className="mt-1"><button className="btn" onClick={advance}>Continuar ▶</button></div></div>}
        </>
      ) : (
        <div className="pop">
          <div className="text-sm font-bold select-text">{d.endings[ending]}</div>
          <div className="text-xs mt-1">Puntos de química: {pts}/6</div>
          <button className="btn mt-2" onClick={onEnd}>Volver al portal</button>
        </div>
      )}
    </fieldset>
  );
}

function Corazones() {
  const [who, setWho] = useState<'andres' | 'julia'>('andres');
  const [res, setRes] = useState<Record<string, string>>({});
  const [date, setDate] = useState<string | null>(null);
  const c = CLIENTS[who];
  const list = PROFILES.filter((p) => p.for === who);
  const choose = (id: string) => {
    const p = PROFILES.find((x) => x.id === id)!;
    setRes((r) => ({ ...r, [id]: p.verdict }));
    if (p.good) { sfx('ding'); useStore.getState().solve(`cupido:match:${id}`); } else sfx('wrong');
  };
  if (date) return <DatePlay id={date} onEnd={() => setDate(null)} />;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        {(Object.keys(CLIENTS) as ('andres' | 'julia')[]).map((k) => (
          <button key={k} className={`btn ${who === k ? 'on' : ''}`} onClick={() => { sfx('click'); setWho(k); }}>{CLIENTS[k].emoji} {CLIENTS[k].name}</button>
        ))}
        <span className="ml-auto"><Lesson id={c.lesson} /></span>
      </div>
      <div className="p-2 text-sm" style={{ background: '#fffbd0', border: '2px dashed #c06' }}>
        <b>Anuncio de {c.name}:</b> <span className="select-text">"{c.ad}"</span> <Speak text={c.ad} />
        <div className="text-xs italic opacity-70">{c.adEn}</div>
      </div>
      <div className="text-xs">Lee cada perfil, contesta la pregunta y elige a la pareja compatible. Pista: "busco una pareja que <i>sepa</i>..." pide subjuntivo.</div>
      {list.map((p) => (
        <fieldset key={p.id} className="group"><legend>{p.emoji} {p.name}, {p.age}</legend>
          <p className="text-sm select-text">{p.bio} <Speak text={p.bio} /></p>
          <Quiz q={p.q} qid={`cupido:read:${p.id}`} />
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <button className="btn" onClick={() => choose(p.id)}>💘 Elegir a {p.name}</button>
            {DATES.some((d) => d.profile === p.id) && res[p.id] && <button className="btn" onClick={() => { sfx('open'); setDate(p.id); }}>🍷 Tener la cita</button>}
          </div>
          {res[p.id] && <div className="text-sm mt-2 pop" style={{ color: p.good ? '#060' : '#a00' }}>{p.good ? '💘 ' : '💔 '}{p.verdict}</div>}
        </fieldset>
      ))}
    </div>
  );
}

function Inmobiliaria() {
  const [res, setRes] = useState<number | null>(null);
  const [sneeze, setSneeze] = useState(false);
  const solved = useStore((s) => s.solved);
  const answered = HQS.filter((_, i) => solved[`cupido:hq:${i}`]).length;
  const pick = (id: number) => {
    const h = HOUSES.find((x) => x.id === id)!;
    setRes(id);
    if (h.id === 3) { sfx('levelup'); useStore.getState().solve('cupido:casa:3', 30); useStore.getState().unlock('alberto'); setSneeze(false); }
    else { sfx('wrong'); setSneeze(h.carpet); }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 flex-wrap">
        <Lesson id="B1-L20" /><Lesson id="B1-L24" /><Lesson id="B1-L26" />
      </div>
      <div className="p-2 text-sm" style={{ background: '#fffbd0', border: '2px dashed #c06' }}>
        <b>Cliente: Alberto Cortés.</b> Dentista divorciado, 37 años, vive con sus papás. Busca una casa <b>sin alfombras</b> (¡alergia!), con <b>buena cocina</b>, <b>sala grande</b> y precio máximo de <b>${MAX_PRICE.toLocaleString('es')}</b>.
      </div>
      {HOUSES.map((h) => (
        <fieldset key={h.id} className="group"><legend>🏠 {h.id}. {h.name}</legend>
          <p className="text-sm select-text">{h.desc} <Speak text={h.desc} /></p>
          <div className="text-xs mt-1 grid grid-cols-2 gap-x-3">
            <span>💲 ${h.price.toLocaleString('es')}</span><span>🛏️ {h.beds} dormitorios</span><span>🚿 {h.baths} baños</span><span>📐 Sala: {h.salaM2} m²</span>
            <span className="col-span-2">🧱 Pisos: {h.floors}. 🍳 Cocina: {h.kitchen}.</span>
          </div>
          <button className="btn mt-2" onClick={() => pick(h.id)}>✅ Esta es la casa para Alberto</button>
          {res === h.id && (
            <div className="mt-2 text-sm pop" style={{ color: h.id === 3 ? '#060' : '#a00' }}>
              {h.id === 3 ? '🎉 ¡Perfecto! ' : sneeze ? '🤧 ¡Achís! ¡Achís! ' : '😕 '}{h.why}
            </div>
          )}
        </fieldset>
      ))}
      <fieldset className="group"><legend>📊 Comparaciones ({answered}/{HQS.length})</legend>
        {HQS.map((q, i) => <Quiz key={i} q={q} qid={`cupido:hq:${i}`} />)}
      </fieldset>
    </div>
  );
}

export default function CupidoApp() {
  const [tab, setTab] = useState<'c' | 'i'>('c');
  return (
    <div className="h-full flex flex-col" style={{ background: '#e8d8f8' }}>
      <div className="px-2 py-1 text-center" style={{ background: 'linear-gradient(90deg,#f0c,#60f,#09f,#0c6)', color: '#fff', textShadow: '2px 2px #000' }}>
        <div className="pixel text-[10px] md:text-xs">★ CupidoDigital & Clasificados '98 ★</div>
        <div className="vt text-base">Visitante nº 000{(1998 + useStore.getState().xp).toString().slice(-3)} · ¡Mejor visto con Netscape 4.0!</div>
      </div>
      <div className="px-2 pt-2"><Tabs tabs={[['c', '💘 Corazones de Villa Celeste'], ['i', '🏠 Inmobiliaria Villa Celeste']]} value={tab} onChange={setTab} /></div>
      <div className="flex-1 overflow-auto p-2 min-h-0">{tab === 'c' ? <Corazones /> : <Inmobiliaria />}</div>
    </div>
  );
}
