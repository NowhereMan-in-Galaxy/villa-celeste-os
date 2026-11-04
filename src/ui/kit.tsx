import { ReactNode, useEffect, useState } from 'react';
import { Volume2, Star } from 'lucide-react';
import { speak } from '../utils/tts';
import { useStore } from '../store';
import { sfx } from '../utils/sound';

/** Speaker button: click = normal, shift/right-click = slow. */
export function Speak({ text, className = '' }: { text: string; className?: string }) {
  return (
    <button className={`btn tbtn !w-6 !h-5 inline-grid align-middle ${className}`} title="Escuchar (clic derecho: lento 0.75x)"
      onClick={(e) => { e.stopPropagation(); speak(text, e.shiftKey ? 0.75 : undefined); }}
      onContextMenu={(e) => { e.preventDefault(); speak(text, 0.75); }}>
      <Volume2 size={12} />
    </button>
  );
}

/** Star toggle to add/remove a word in the SRS deck. */
export function SrsStar({ id, es, en }: { id: string; es: string; en: string }) {
  const has = useStore((s) => !!s.cards[id]);
  const { addCard, removeCard } = useStore.getState();
  return (
    <button className="btn tbtn !w-6 !h-5 inline-grid align-middle" title={has ? 'Quitar del mazo SRS' : 'Añadir al mazo SRS'}
      onClick={(e) => { e.stopPropagation(); sfx('click'); has ? removeCard(id) : addCard(id, es, en); }}>
      <Star size={12} fill={has ? '#e6b800' : 'none'} color={has ? '#a07800' : 'currentColor'} />
    </button>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: [T, ReactNode][]; value: T; onChange: (t: T) => void }) {
  return (
    <div className="tabs">
      {tabs.map(([k, label]) => (
        <button key={k} className={`tab ${k === value ? 'on' : ''}`} onClick={() => { sfx('click'); onChange(k); }}>{label}</button>
      ))}
    </div>
  );
}

/** Retro progress bar made of blocks. */
export function Progress({ value }: { value: number }) {
  const n = Math.round(Math.max(0, Math.min(1, value)) * 20);
  return (
    <div className="inset h-5 p-[3px] flex gap-[2px]">
      {Array.from({ length: n }, (_, i) => <div key={i} className="h-full w-[4.6%]" style={{ background: 'var(--sel)' }} />)}
    </div>
  );
}

/** Fallback shown for a module not yet built. */
export function Installing({ name }: { name: string }) {
  const [p, setP] = useState(0);
  useEffect(() => { const t = setInterval(() => setP((x) => (x >= 1 ? 0 : x + 0.05)), 200); return () => clearInterval(t); }, []);
  return (
    <div className="p-6 flex flex-col gap-3 items-center justify-center h-full">
      <div className="text-4xl">💿</div>
      <div>Instalando módulo <b>{name}</b> desde CD-ROM...</div>
      <div className="w-64"><Progress value={p} /></div>
      <div className="text-xs opacity-70">Inserte el disco 2 de 3 cuando se le indique.</div>
    </div>
  );
}
