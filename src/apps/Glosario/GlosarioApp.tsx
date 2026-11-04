import { useEffect, useMemo, useState } from 'react';
import type { AppProps } from '../../config/apps';
import { loadGlossary } from '../../data/curriculum';
import type { Glossary, GlossEntry } from '../../types/curriculum';
import { useStore, dueCount } from '../../store';
import { Speak, SrsStar, Tabs } from '../../ui/kit';
import { fold } from '../../utils/text';
import { sfx } from '../../utils/sound';
import { speak } from '../../utils/tts';
import type { Rating } from '../../utils/srs';

type Tab = 'srs' | 'topic' | 'cog' | 'es' | 'en' | 'gram';
const HLP_BG = '#ffffe8';

export default function GlosarioApp({ args }: AppProps) {
  const [tab, setTab] = useState<Tab>(args?.tab ?? 'srs');
  const [g, setG] = useState<Glossary | null>(null);
  useEffect(() => { loadGlossary().then(setG); }, []);
  useEffect(() => { if (args?.tab) setTab(args.tab); }, [args?.tab]);
  const due = dueCount(useStore((s) => s.cards));
  return (
    <div className="h-full flex flex-col p-1">
      <div className="flex gap-1 mb-1 text-[12px]">
        {['Contenido', 'Índice', 'Buscar', 'Atrás', 'Imprimir'].map((b) => <button key={b} className="btn text-[12px]" onClick={() => sfx('click')}>{b}</button>)}
      </div>
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[['srs', `🃏 Repaso SRS (${due})`], ['topic', 'Por tema'], ['cog', 'Cognados'], ['es', 'Español→Inglés'], ['en', 'Inglés→Español'], ['gram', 'Gramática']]} />
      <div className="panel flex-1 min-h-0 p-2 flex flex-col">
        {!g ? <div>Cargando GLOSARIO.HLP...</div> : tab === 'srs' ? <Srs /> : tab === 'gram' ? <GrammarRef g={g} /> : <Dict list={tab === 'topic' ? g.topic : tab === 'cog' ? g.cognates : g.es} en={tab === 'en'} grouped={tab === 'topic'} />}
      </div>
    </div>
  );
}

function Dict({ list, en, grouped }: { list: GlossEntry[]; en: boolean; grouped: boolean }) {
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(200);
  const rows = useMemo(() => {
    const f = fold(q);
    let r = f ? list.filter((e) => fold(e.es).includes(f) || fold(e.en).includes(f) || (e.category && fold(e.category).includes(f))) : list;
    if (en) r = [...r].sort((a, b) => a.en.localeCompare(b.en));
    return r;
  }, [q, list, en]);
  useEffect(() => setLimit(200), [q, list]);
  let lastCat = '';
  return (
    <>
      <input className="field mb-2" placeholder="Escriba la palabra que desea buscar..." value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      <div className="inset flex-1 overflow-auto p-1" style={{ background: HLP_BG }} onScroll={(e) => { const t = e.currentTarget; if (t.scrollTop + t.clientHeight > t.scrollHeight - 200) setLimit((l) => l + 200); }}>
        {rows.slice(0, limit).map((e, i) => {
          const head = grouped && e.category !== lastCat ? (lastCat = e.category ?? '') : null;
          return (
            <div key={i}>
              {head && <div className="font-bold text-[#006400] mt-2 border-b border-[#006400]">{head}</div>}
              <div className="flex items-center gap-1 px-1 hover:bg-[#ffff99]">
                <div className="flex-1 select-text">{en ? <><span className="text-[#006400]">{e.en}</span> → <b>{e.es}</b></> : <><b className="text-[#006400]">{e.es}</b> – {e.en}</>}{e.notes && <i className="opacity-60"> [{e.notes}]</i>}</div>
                <Speak text={e.es} /><SrsStar id={`g-${e.es}`} es={e.es} en={e.en} />
              </div>
            </div>
          );
        })}
        {!rows.length && <div className="p-2">No se encontró "{q}".</div>}
      </div>
      <div className="text-[11px] mt-1">{rows.length} entradas</div>
    </>
  );
}

function GrammarRef({ g }: { g: Glossary }) {
  const [b, setB] = useState(0);
  return (
    <>
      <div className="flex gap-1 mb-1">{[0, 1].map((i) => <button key={i} className={`btn ${b === i ? 'on font-bold' : ''}`} onClick={() => setB(i)}>Referencia gramatical · Libro {i + 1}</button>)}</div>
      <div className="inset flex-1 overflow-auto p-3 mono text-[12.5px] leading-relaxed select-text" style={{ background: HLP_BG }}>{g.grammar[b]}</div>
    </>
  );
}

function Srs() {
  const cards = useStore((s) => s.cards);
  const due = useMemo(() => Object.values(cards).filter((c) => c.due <= Date.now()).sort((a, b) => a.due - b.due), [cards]);
  const [flip, setFlip] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const c = due[0];
  const rate = (q: Rating) => {
    useStore.getState().rateCard(c.id, q);
    sfx(q >= 3 ? 'ding' : 'wrong');
    setFlip(false);
    const n = ((useStore.getState().flags['srs:reviews'] as number) ?? 0) + 1;
    useStore.getState().setFlag('srs:reviews', n);
    if (n >= 50) useStore.getState().unlock('srs');
    setReviewed((r) => r + 1);
  };
  const total = Object.keys(cards).length;
  if (!total) return <div className="p-4 leading-relaxed">Tu mazo está vacío.<br />Pulsa ★ junto a cualquier palabra (en Academia, el Glosario o con doble clic en cualquier ventana) para añadirla.</div>;
  if (!c) return <div className="p-4 text-center leading-relaxed">🎉 ¡No hay tarjetas pendientes!<br />{reviewed > 0 && `Repasaste ${reviewed} tarjetas. `}Total en el mazo: {total}.<br />Vuelve mañana.</div>;
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="text-[12px]">Pendientes: {due.length} · Mazo: {total} · Repasadas hoy: {reviewed}</div>
      <div className="inset w-[380px] max-w-full h-[200px] flex flex-col items-center justify-center text-center p-4 cursor-pointer" style={{ background: HLP_BG }}
        onClick={() => { if (!flip) { setFlip(true); speak(c.es); } }}>
        <div className="text-[26px] font-bold text-[#006400]">{c.es}</div>
        {flip ? <div className="text-[18px] mt-2">{c.en}</div> : <div className="text-[11px] opacity-60 mt-3">Clic (o Espacio) para ver la respuesta</div>}
      </div>
      <div className="flex gap-2 items-center"><Speak text={c.es} /></div>
      {flip && (
        <div className="flex gap-2 flex-wrap justify-center">
          <button className="btn" onClick={() => rate(0)}>🔁 Otra vez</button>
          <button className="btn" onClick={() => rate(3)}>😓 Difícil</button>
          <button className="btn font-bold" onClick={() => rate(4)}>🙂 Bien</button>
          <button className="btn" onClick={() => rate(5)}>😎 Fácil</button>
        </div>
      )}
    </div>
  );
}
