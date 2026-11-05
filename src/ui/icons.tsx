import { ReactNode, useEffect, useRef, useState } from 'react';
import type { AppId } from '../config/apps';

const K = '#000';
const S = { stroke: K, strokeWidth: 1 } as const;

/** Win98-style 32×32 app icons drawn in SVG. */
const ICONS: Record<AppId, ReactNode> = {
  hoy: (
    <>
      <rect x="4.5" y="6.5" width="23" height="21" fill="#fff" {...S} />
      <rect x="4.5" y="6.5" width="23" height="6" fill="#c00000" {...S} />
      <rect x="9" y="3.5" width="2" height="6" fill="#808080" {...S} />
      <rect x="21" y="3.5" width="2" height="6" fill="#808080" {...S} />
      <text x="16" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11" fill="#000080">1</text>
      <circle cx="24" cy="23" r="3.5" fill="#ffd400" {...S} />
    </>
  ),
  bienvenido: (
    <>
      <rect x="6.5" y="4.5" width="19" height="24" fill="#fff" {...S} />
      <rect x="6.5" y="4.5" width="19" height="4" fill="#0050c8" {...S} />
      {[12, 15, 18, 21, 24].map((y) => <line key={y} x1="9" x2={y === 24 ? 17 : 23} y1={y + 0.5} y2={y + 0.5} stroke="#808080" />)}
    </>
  ),
  test: (
    <>
      <rect x="5.5" y="5.5" width="21" height="24" fill="#c8a165" {...S} />
      <rect x="8.5" y="8.5" width="15" height="19" fill="#fff" {...S} />
      <rect x="11.5" y="3.5" width="9" height="5" fill="#a0a0a0" {...S} />
      {[12, 17, 22].map((y) => (
        <g key={y}>
          <path d={`M10 ${y + 1}l1.5 1.5 3-3`} fill="none" stroke="#2a8a2a" strokeWidth="1.6" />
          <line x1="16" x2="22" y1={y + 0.5} y2={y + 0.5} stroke="#606060" />
        </g>
      ))}
    </>
  ),
  palabras: (
    <>
      <rect x="2.5" y="15.5" width="13" height="13" fill="#ffd400" {...S} />
      <rect x="16.5" y="15.5" width="13" height="13" fill="#3cb043" {...S} />
      <rect x="9.5" y="2.5" width="13" height="13" fill="#e8413c" {...S} />
      {[['A', 9, 26], ['Ñ', 23, 26], ['¡', 16, 13]].map(([t, x, y]) => (
        <text key={t} x={x} y={y} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="#fff" stroke="#000" strokeWidth="0.4">{t}</text>
      ))}
    </>
  ),
  academia: (
    <>
      <path d="M5.5 6.5h17l4 3v19h-17l-4-3z" fill="#fffbe0" {...S} />
      <path d="M5.5 6.5h17v19h-17z" fill="#1c3f94" {...S} />
      <rect x="9" y="10" width="10" height="3" fill="#ffd400" />
      <path d="M22.5 25.5l4 3M22.5 6.5l4 3" stroke={K} fill="none" />
    </>
  ),
  glosario: (
    <>
      <path d="M5.5 5.5h18l3 3v20h-18l-3-3z" fill="#fffbe0" {...S} />
      <path d="M5.5 5.5h18v20h-18z" fill="#2a7a2a" {...S} />
      <text x="14.5" y="21" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize="15" fill="#ffd400" stroke="#000" strokeWidth="0.5">?</text>
    </>
  ),
  chismenet: (
    <>
      <path d="M3.5 4.5h17v11h-9l-5 4v-4h-3z" fill="#fff" {...S} />
      <path d="M12.5 13.5h16v11h-3v4l-5-4h-8z" fill="#ffd400" {...S} />
      {[8, 12, 16].map((x) => <rect key={x} x={x - 1} y="9" width="2" height="2" fill="#000080" />)}
      {[17, 21, 25].map((x) => <rect key={x} x={x - 1} y="18" width="2" height="2" fill="#000" />)}
    </>
  ),
  correo: (
    <>
      <rect x="3.5" y="8.5" width="25" height="17" fill="#fff" {...S} />
      <path d="M3.5 8.5l12.5 9 12.5-9" fill="none" {...S} />
      <path d="M3.5 25.5l9.5-8M28.5 25.5l-9.5-8" fill="none" stroke="#808080" />
      <rect x="22.5" y="10.5" width="4" height="5" fill="#c00000" />
    </>
  ),
  telenovela: (
    <>
      <path d="M11 3l5 5 6-6" fill="none" {...S} />
      <rect x="2.5" y="7.5" width="27" height="20" rx="2" fill="#8a6a44" {...S} />
      <rect x="5.5" y="10.5" width="17" height="14" rx="2" fill="#1a3a8a" {...S} />
      <rect x="7" y="12" width="6" height="3" fill="#7aa8ff" opacity=".6" />
      <circle cx="26" cy="13" r="1.5" fill="#ddd" {...S} />
      <circle cx="26" cy="19" r="1.5" fill="#ddd" {...S} />
    </>
  ),
  cupido: (
    <>
      <path d="M16 27.5C6 20 3.5 15 3.5 10.5 3.5 6.5 6.5 4.5 9.5 4.5c3 0 5 2 6.5 4.5 1.5-2.5 3.5-4.5 6.5-4.5 3 0 6 2 6 6 0 4.5-2.5 9.5-12.5 17z" fill="#e83a6b" {...S} />
      <rect x="8" y="8" width="3" height="3" fill="#ffb3c8" />
      <path d="M2 27L30 5" stroke="#8a5a00" strokeWidth="1.5" />
      <path d="M30 5l-5 1 1.5 2.5z" fill="#ccc" {...S} />
    </>
  ),
  conjugator: (
    <>
      <rect x="4.5" y="21.5" width="23" height="7" rx="1" fill="#303030" {...S} />
      <rect x="14.5" y="10" width="3" height="12" fill="#808080" {...S} />
      <circle cx="16" cy="8.5" r="5" fill="#e8413c" {...S} />
      <circle cx="14.5" cy="7" r="1.5" fill="#ffaaaa" />
      <circle cx="23.5" cy="24.5" r="1.8" fill="#ffd400" {...S} />
    </>
  ),
  detective: (
    <>
      <path d="M3.5 8.5h9l2 2h13v16h-24z" fill="#e8c560" {...S} />
      <circle cx="17" cy="16" r="6.5" fill="#bfe3ff" stroke={K} strokeWidth="2" />
      <path d="M21.5 20.5l7 7" stroke="#6a3f12" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M14 13a3 3 0 0 1 3-2" stroke="#fff" fill="none" />
    </>
  ),
  fonetica: (
    <>
      <rect x="11.5" y="3.5" width="9" height="15" rx="4.5" fill="#a8a8a8" {...S} />
      {[8, 11, 14].map((y) => <line key={y} x1="12" x2="20" y1={y + 0.5} y2={y + 0.5} stroke="#555" />)}
      <path d="M8.5 13.5a7.5 7.5 0 0 0 15 0" fill="none" stroke={K} strokeWidth="1.5" />
      <path d="M16 21v5M10.5 27.5h11" stroke={K} strokeWidth="1.5" />
      <circle cx="26" cy="6" r="2.5" fill="#e8413c" {...S} />
    </>
  ),
  control: (
    <>
      <rect x="3.5" y="4.5" width="20" height="15" fill="#c0c0c0" {...S} />
      <rect x="5.5" y="6.5" width="16" height="11" fill="#008080" {...S} />
      <rect x="9.5" y="19.5" width="8" height="3" fill="#a0a0a0" {...S} />
      <g transform="translate(23 23)">
        <circle r="6" fill="#d0d0d0" stroke={K} strokeWidth="1" strokeDasharray="2.4 1.5" />
        <circle r="4.5" fill="#d0d0d0" {...S} />
        <circle r="1.8" fill="#808080" {...S} />
      </g>
    </>
  ),
};

const cache = new Map<string, string>();

/** Rasterize an SVG element to a tiny bitmap with hard alpha edges, for a true pixel-art look. */
function rasterize(svg: SVGSVGElement, res: number) {
  return new Promise<string>((done) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = res;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0, res, res);
      const d = ctx.getImageData(0, 0, res, res);
      for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0;
      ctx.putImageData(d, 0, 0);
      done(c.toDataURL());
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  });
}

function Pixel({ k, size, res, children }: { k: string; size: number; res: number; children: ReactNode }) {
  const ck = `${k}@${res}`;
  const [url, setUrl] = useState(cache.get(ck));
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (url || !ref.current) return;
    rasterize(ref.current, res).then((u) => { cache.set(ck, u); setUrl(u); });
  }, [ck]);
  if (url) return <img src={url} width={size} height={size} className="pixelated shrink-0 inline-block align-middle" alt="" draggable={false} />;
  return <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" className="shrink-0 inline-block align-middle" aria-hidden>{children}</svg>;
}

export function AppIcon({ id, size = 32 }: { id: AppId; size?: number }) {
  return <Pixel k={id} size={size} res={size <= 16 ? 16 : 24}>{ICONS[id]}</Pixel>;
}

export function FolderIcon({ size = 24 }: { size?: number }) {
  return (
    <Pixel k="folder" size={size} res={16}>
      <path d="M2.5 7.5h10l2 3h15v17h-27z" fill="#f5d060" stroke="#000" />
      <path d="M2.5 12.5h27" stroke="#c9a030" />
    </Pixel>
  );
}
