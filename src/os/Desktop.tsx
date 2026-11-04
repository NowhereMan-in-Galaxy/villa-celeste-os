import { useEffect, useRef, useState } from 'react';
import { APPS, APP_IDS, AppId } from '../config/apps';
import { useWM } from './wm';
import { WindowFrame } from './WindowFrame';
import { useStore, levelOf, dueCount } from '../store';
import { sfx } from '../utils/sound';
import { LESSONS } from '../data/curriculum';
import { WordLookup } from './WordLookup';
import { AppIcon, FolderIcon } from '../ui/icons';
import { Layers, Volume2, VolumeX, Monitor, Star } from 'lucide-react';

function Clock() {
  const [d, setD] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setD(new Date()), 15000); return () => clearInterval(t); }, []);
  return <span title={d.toLocaleDateString('es-MX', { dateStyle: 'full' }).replace(/\d{4}/, '1998')}>{d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>;
}

function StartMenu({ onClose }: { onClose: () => void }) {
  const open = useWM((s) => s.open);
  const [sub, setSub] = useState<0 | 1 | 2>(0);
  const go = (a: AppId, args?: any) => { open(a, args); onClose(); };
  return (
    <div className="absolute bottom-[var(--taskbar)] left-0 bevel p-[3px] flex z-[100000] pop shell-font text-[15px]" onPointerDown={(e) => e.stopPropagation()}>
      <div className="w-7 flex items-end justify-center pb-2" style={{ background: 'linear-gradient(0deg, var(--title-a), var(--title-b))' }}>
        <span className="text-white font-bold [writing-mode:vertical-rl] rotate-180 tracking-wider">Villa Celeste <span className="font-normal">OS '98</span></span>
      </div>
      <div className="w-56 relative">
        {APP_IDS.map((id) => (
          <div key={id} className="row-item flex items-center gap-2 py-1" onClick={() => go(id)}>
            <AppIcon id={id} size={24} />{APPS[id].label}
          </div>
        ))}
        <hr className="my-1 border-[var(--shadow)]" />
        {([1, 2] as const).map((b) => (
          <div key={b} className={`row-item flex items-center gap-2 py-1 ${sub === b ? 'sel' : ''}`} onMouseEnter={() => setSub(b)} onClick={() => setSub(b)}>
            <FolderIcon />Libro {b}: Lecciones ▸
          </div>
        ))}
        {sub > 0 && (
          <div className="absolute left-full bottom-0 max-sm:left-0 max-sm:bottom-auto max-sm:top-0 max-sm:-translate-y-full max-sm:w-[90vw] bevel p-[3px] w-72 max-h-[70vh] overflow-auto">
            {LESSONS.filter((l) => l.book === sub).map((l) => (
              <div key={l.id} className="row-item text-[12px]" onClick={() => go('academia', { lesson: l.id })}>{l.id.slice(3)} · {l.title}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Desktop() {
  const { wins, open, focus, patch, active } = useWM();
  const { xp, cards, settings } = useStore();
  const [start, setStart] = useState(false);
  const [sel, setSel] = useState<AppId | null>(null);
  useEffect(() => { if (!useWM.getState().wins.length) open('hoy'); }, []);
  const lvl = levelOf(xp);
  const prevLvl = useRef(lvl);
  useEffect(() => {
    if (prevLvl.current !== lvl) { sfx('levelup'); useStore.getState().toast(`⭐ ¡Subiste de nivel! Ahora eres ${lvl}`); if (lvl !== 'A1+') useStore.getState().unlock('nivel'); }
    prevLvl.current = lvl;
  }, [lvl]);

  return (
    <div className={`desktop theme-${settings.theme} ${settings.crt ? 'crt' : ''} ${settings.pixelApps ? 'pixel-all' : ''} h-full w-full relative select-none`} onPointerDown={() => { setStart(false); setSel(null); }}>
      <div className="absolute inset-0 bottom-[var(--taskbar)] p-2 flex flex-col flex-wrap content-start gap-1">
        {APP_IDS.map((id) => (
          <button key={id} className="w-[88px] h-[66px] flex flex-col items-center gap-1 text-white text-[12px] leading-tight text-center [overflow-wrap:anywhere] shell-font bg-transparent border-none cursor-pointer"
            onPointerDown={(e) => { e.stopPropagation(); setSel(id); }} onDoubleClick={() => open(id)} onKeyDown={(e) => e.key === 'Enter' && open(id)}
            onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches) open(id); e.stopPropagation(); }}>
            <AppIcon id={id} size={32} />
            <span className={`px-[2px] ${sel === id ? 'bg-[var(--sel)] outline-dotted outline-1' : ''}`} style={{ textShadow: sel === id ? 'none' : '1px 1px #000' }}>{APPS[id].label.replace(/\.(exe|txt|hlp)$/, '')}</span>
          </button>
        ))}
      </div>
      {wins.map((w) => <WindowFrame key={w.id} win={w} />)}
      {start && <StartMenu onClose={() => setStart(false)} />}
      <div className="absolute bottom-0 left-0 right-0 h-[var(--taskbar)] bevel flex items-center gap-1 px-[2px] z-[99999] shell-font text-[14px]" onPointerDown={(e) => e.stopPropagation()}>
        <button className={`btn font-bold flex items-center gap-1 ${start ? 'on' : ''}`} onClick={() => { sfx('click'); setStart(!start); }}>❖ Inicio</button>
        <div className="w-[2px] h-5 sunken mx-1" />
        <div className="flex-1 flex gap-1 overflow-hidden">
          {wins.map((w) => (
            <button key={w.id} className={`btn truncate max-w-[160px] max-sm:max-w-[48px] min-w-0 text-left text-[12px] ${active === w.id && !w.min ? 'on font-bold' : ''}`}
              onClick={() => (active === w.id && !w.min ? patch(w.id, { min: true }) : (patch(w.id, { min: false }), focus(w.id)))}>
              <span className="inline-flex items-center gap-1"><AppIcon id={w.app} size={16} /><span className="max-sm:hidden">{APPS[w.app].label}</span></span>
            </button>
          ))}
        </div>
        <div className="sunken h-[24px] flex items-center gap-2 px-2 text-[12px] whitespace-nowrap">
          <button className="bg-transparent border-none cursor-pointer p-0" title="Tarjetas SRS pendientes" onClick={() => open('glosario', { tab: 'srs' })}><span className="inline-flex items-center gap-1"><Layers size={14} />{dueCount(cards)}</span></button>
          <button className="bg-transparent border-none cursor-pointer p-0" title="Sonido" onClick={() => useStore.getState().set({ sound: !settings.sound })}>{settings.sound ? <Volume2 size={15} /> : <VolumeX size={15} />}</button>
          <button className="bg-transparent border-none cursor-pointer p-0 hidden sm:inline" title="CRT" onClick={() => useStore.getState().set({ crt: !settings.crt })}><Monitor size={15} strokeWidth={settings.crt ? 2.5 : 1.5} /></button>
          <span className="font-bold hidden sm:inline" title={`${xp} XP`}><span className="inline-flex items-center gap-1"><Star size={13} fill="#e6b800" />{levelOf(xp)} · {xp}</span></span>
          <Clock />
        </div>
      </div>
      <WordLookup />
      <Toasts />
    </div>
  );
}

function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="absolute right-2 bottom-[36px] flex flex-col gap-1 z-[100001] pointer-events-none">
      {toasts.map((t) => <div key={t.id} className="bevel px-3 py-2 pop text-[12px] max-w-xs" style={{ background: '#ffffe1' }}>{t.text}</div>)}
    </div>
  );
}
