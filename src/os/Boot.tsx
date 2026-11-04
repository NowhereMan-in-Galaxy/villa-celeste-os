import { useEffect, useState } from 'react';
import { sfx } from '../utils/sound';

const LINES = [
  'Villa Celeste BIOS v1.98  (C) 1998 Celeste Megatrends Inc.',
  'CPU: Pentium II 333MHz   Memoria: 65536K OK',
  'Detectando IDE Primario Maestro ... LIBRO_1 (30 lecciones)',
  'Detectando IDE Primario Esclavo ... LIBRO_2 (30 lecciones)',
  'Cargando GLOSARIO.SYS ... 5,889 palabras',
  'Conectando a la intranet del vecindario: Cortés, Quirós, González, Valenzuela, Espinoza ... OK',
  'Sintonizando "La oveja negra" en el canal 4 ... OK',
  '',
  'Iniciando Villa Celeste OS \'98 ...',
];

export function Boot({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [splash, setSplash] = useState(false);
  useEffect(() => {
    if (n < LINES.length) { const t = setTimeout(() => setN(n + 1), 260); return () => clearTimeout(t); }
    const t1 = setTimeout(() => setSplash(true), 400);
    const t2 = setTimeout(onDone, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [n]);
  useEffect(() => { if (splash) sfx('boot'); }, [splash]);
  useEffect(() => { const k = () => onDone(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  return (
    <div className="h-full w-full bg-black text-[#c0c0c0] vt text-[20px] p-6 relative crt" onClick={onDone}>
      {!splash ? (
        <>
          {LINES.slice(0, n).map((l, i) => <div key={i}>{l || ' '}</div>)}
          <span className="blink">_</span>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-6 pop" style={{ background: 'radial-gradient(#1084d0, #000080 70%, #000)' }}>
          <div className="text-[64px] leading-none">🏘️</div>
          <div className="pixel text-white text-[18px] sm:text-[26px] text-center leading-relaxed">Villa Celeste<br /><span className="text-[#ffcc00]">OS '98</span></div>
          <div className="text-white text-[18px]">Edición Vecindario · Español A1 → B2</div>
          <div className="w-48 h-3 bg-black/40 overflow-hidden"><div className="h-full w-1/3 bg-[#ffcc00] animate-[slide_1s_linear_infinite]" style={{ animation: 'slide 1s linear infinite' }} /></div>
        </div>
      )}
      <button className="btn absolute right-4 bottom-4 text-[13px] text-black" style={{ fontFamily: 'var(--font)' }} onClick={onDone}>Saltar ▸▸</button>
      <style>{'@keyframes slide{from{transform:translateX(-100%)}to{transform:translateX(300%)}}'}</style>
    </div>
  );
}
