import { Suspense, useRef } from 'react';
import { APPS } from '../config/apps';
import { useWM, Win } from './wm';

export function WindowFrame({ win }: { win: Win }) {
  const { focus, close, patch, active } = useWM();
  const def = APPS[win.app];
  const App = def.component;
  const drag = useRef<{ dx: number; dy: number; mode: 'move' | 'size'; w: number; h: number; sx: number; sy: number } | null>(null);

  const start = (e: React.PointerEvent, mode: 'move' | 'size') => {
    if (win.max || (e.target as HTMLElement).closest('button')) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y, mode, w: win.w, h: win.h, sx: e.clientX, sy: e.clientY };
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (d.mode === 'move') patch(win.id, { x: Math.max(-win.w + 80, Math.min(window.innerWidth - 80, e.clientX - d.dx)), y: Math.max(0, Math.min(window.innerHeight - 70, e.clientY - d.dy)) });
    else patch(win.id, { w: Math.max(300, d.w + e.clientX - d.sx), h: Math.max(200, d.h + e.clientY - d.sy) });
  };
  const end = () => (drag.current = null);

  if (win.min) return null;
  const style = win.max ? { left: 0, top: 0, width: '100%', height: 'calc(100% - var(--taskbar))', zIndex: win.z } : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };
  return (
    <div className="absolute bevel p-[3px] flex flex-col pop" style={style} onPointerDown={() => active !== win.id && focus(win.id)}>
      <div className={`titlebar ${active === win.id ? '' : 'inactive'} flex items-center gap-1 px-1 h-[22px] max-sm:h-[34px] select-none touch-none`}
        onPointerDown={(e) => start(e, 'move')} onPointerMove={move} onPointerUp={end}
        onDoubleClick={() => patch(win.id, { max: !win.max })}>
        <span className="text-[13px] leading-none">{def.icon}</span>
        <span className="flex-1 truncate text-[12px] max-sm:text-[14px]">{win.title}</span>
        <button className="btn tbtn" aria-label="Minimizar" onClick={() => patch(win.id, { min: true })}>_</button>
        <button className="btn tbtn" aria-label="Maximizar" onClick={() => patch(win.id, { max: !win.max })}>{win.max ? '❐' : '□'}</button>
        <button className="btn tbtn ml-[2px]" aria-label="Cerrar" onClick={() => close(win.id)}>✕</button>
      </div>
      <div className="flex-1 min-h-0 mt-[2px] overflow-hidden relative">
        <Suspense fallback={<div className="p-4">Cargando {def.label}...<span className="blink">_</span></div>}>
          <App winId={win.id} args={win.args} />
        </Suspense>
      </div>
      {!win.max && <div className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize touch-none" onPointerDown={(e) => start(e, 'size')} onPointerMove={move} onPointerUp={end}
        style={{ background: 'linear-gradient(135deg, transparent 50%, var(--shadow) 50%, var(--shadow) 60%, transparent 60%, transparent 70%, var(--shadow) 70%, var(--shadow) 80%, transparent 80%)' }} />}
    </div>
  );
}
