import { useEffect, useState } from 'react';
import { lookupWord } from '../data/curriculum';
import { useStore } from '../store';
import type { GlossEntry } from '../types/curriculum';
import { Speak, SrsStar } from '../ui/kit';
import { speak } from '../utils/tts';

/** Global double-click word lookup: TTS + glossary translation + save to SRS. */
export function WordLookup() {
  const enabled = useStore((s) => s.settings.lookup);
  const [pop, setPop] = useState<{ x: number; y: number; word: string; e: GlossEntry | null } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const onDbl = async (ev: MouseEvent) => {
      const t = ev.target as HTMLElement;
      if (t.closest('input,textarea,button,.titlebar,[data-nolookup]')) return;
      const word = window.getSelection()?.toString().trim().replace(/^[¿¡"“(]+|[.,;:!?"”)]+$/g, '');
      if (!word || word.length > 30 || !/^[a-záéíóúüñ]+$/i.test(word)) return;
      speak(word);
      const e = await lookupWord(word);
      setPop({ x: Math.min(ev.clientX, window.innerWidth - 260), y: Math.min(ev.clientY + 14, window.innerHeight - 120), word, e });
    };
    const onDown = (ev: PointerEvent) => !(ev.target as HTMLElement).closest('[data-lookup]') && setPop(null);
    document.addEventListener('dblclick', onDbl);
    document.addEventListener('pointerdown', onDown, true);
    return () => { document.removeEventListener('dblclick', onDbl); document.removeEventListener('pointerdown', onDown, true); };
  }, [enabled]);
  if (!pop) return null;
  const es = pop.e?.es ?? pop.word, en = pop.e?.en ?? '(no está en el glosario)';
  return (
    <div data-lookup className="fixed z-[100002] bevel p-2 w-[250px] pop text-[12px]" style={{ left: pop.x, top: pop.y, background: '#ffffe1' }}>
      <div className="flex items-center gap-1 font-bold text-[14px]"><span className="flex-1">{es}</span><Speak text={es} /><SrsStar id={`lookup-${es}`} es={es} en={en} /></div>
      <div className="mt-1">{en}{pop.e?.notes ? <i className="opacity-70"> [{pop.e.notes}]</i> : null}</div>
      {pop.e?.category && <div className="opacity-60 mt-1">{pop.e.category}</div>}
    </div>
  );
}
