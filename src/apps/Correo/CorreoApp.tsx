import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../../store';
import { sfx } from '../../utils/sound';
import { speak } from '../../utils/tts';
import { openApp } from '../../os/wm';
import { FOLDERS, FolderId, MAILS, Mail } from './data';

const sel = 'select-text';

export default function CorreoApp() {
  const xp = useStore((s) => s.xp);
  const flags = useStore((s) => s.flags);
  const solved = useStore((s) => s.solved);
  const [folder, setFolder] = useState<FolderId>('inbox');
  const [openId, setOpenId] = useState<string | null>(null);
  const [view, setView] = useState<'folders' | 'list' | 'read'>('list');
  const [en, setEn] = useState(false);
  const [wide, setWide] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!; const ro = new ResizeObserver(() => setWide(el.clientWidth >= 640));
    ro.observe(el); return () => ro.disconnect();
  }, []);

  const avail = useMemo(() => MAILS.filter((m) => m.xp <= xp), [xp]);
  useEffect(() => {
    const { setFlag, toast } = useStore.getState();
    const seen = useStore.getState().flags['correo:arrived'] as string[] | undefined;
    const ids = avail.map((m) => m.id);
    if (!seen) { setFlag('correo:arrived', ids); return; }
    const fresh = avail.filter((m) => !seen.includes(m.id));
    if (!fresh.length) return;
    setFlag('correo:arrived', ids); sfx('mail');
    toast(`📧 Correo nuevo: ${fresh[0].from}${fresh.length > 1 ? ` (+${fresh.length - 1})` : ''}`);
  }, [avail]);

  const isDel = (m: Mail) => !!flags[`correo:del:${m.id}`];
  const isRead = (m: Mail) => !!flags[`correo:read:${m.id}`];
  const isOk = (m: Mail) => m.qs.every((_, i) => solved[`correo:${m.id}:${i}`]);
  const inFolder = (f: FolderId) => avail.filter((m) =>
    f === 'papelera' ? isDel(m) : f === 'enviados' ? !isDel(m) && isOk(m) : !isDel(m) && m.folder === f).reverse();
  const unread = (f: FolderId) => (f === 'enviados' || f === 'papelera') ? 0 : inFolder(f).filter((m) => !isRead(m)).length;

  useEffect(() => {
    const done = MAILS.filter((m) => m.qs.every((_, i) => solved[`correo:${m.id}:${i}`]));
    const st = useStore.getState();
    done.forEach((m) => { if (!st.flags[`correo:ok:${m.id}`]) st.setFlag(`correo:ok:${m.id}`, true); });
    if (done.length >= 10) st.unlock('cartero');
  }, [solved]);

  const list = inFolder(folder);
  const mail = MAILS.find((m) => m.id === openId && avail.includes(m)) ?? null;

  const open = (m: Mail) => {
    sfx('click'); setOpenId(m.id); setEn(false); setView('read');
    if (!isRead(m)) useStore.getState().setFlag(`correo:read:${m.id}`, true);
  };
  const pickFolder = (f: FolderId) => { sfx('click'); setFolder(f); setOpenId(null); setView('list'); };

  const Folders = (
    <div className="inset overflow-auto h-full p-1 text-sm">
      <div className="px-1 py-1 font-bold">📬 Correo Celeste</div>
      {FOLDERS.map(([id, ic, name]) => {
        const u = unread(id);
        return (
          <div key={id} className={`list-item ml-3 flex gap-1 items-center cursor-pointer ${folder === id ? 'sel' : ''} ${u ? 'font-bold' : ''}`} onClick={() => pickFolder(id)}>
            <span>{ic}</span><span className="truncate">{name}</span>{u > 0 && <span>({u})</span>}
          </div>
        );
      })}
    </div>
  );

  const List = (
    <div className="inset overflow-auto h-full text-sm">
      {!list.length && <div className="p-3 opacity-60">No hay mensajes en esta carpeta.</div>}
      {list.map((m) => (
        <div key={m.id} className={`list-item cursor-pointer flex gap-2 items-baseline ${openId === m.id ? 'sel' : ''} ${isRead(m) ? '' : 'font-bold'}`} onClick={() => open(m)}>
          <span className="w-4 shrink-0">{isRead(m) ? '✉' : '📩'}</span>
          <span className="w-4 shrink-0">{m.clip ? '📎' : ''}</span>
          <span className="w-32 shrink-0 truncate">{folder === 'enviados' ? 'Para: ' + m.from : m.from}</span>
          <span className="flex-1 truncate">{folder === 'enviados' ? 'Re: ' : ''}{m.subject}</span>
          <span className="hidden sm:block shrink-0 opacity-70 text-xs">{m.date.slice(4, 14)}</span>
          {isOk(m) && <span title="Respondido">✔</span>}
        </div>
      ))}
    </div>
  );

  const Reader = !mail ? (
    <div className="inset h-full grid place-items-center opacity-60 text-sm p-4 text-center">Seleccione un mensaje para leerlo.</div>
  ) : (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex flex-wrap gap-1 p-1">
        {!wide && <button className="btn" onClick={() => setView('list')}><ArrowLeft size={12} className="inline" /> Atrás</button>}
        <button className="btn" onClick={() => { sfx('click'); document.getElementById('correo-q')?.scrollIntoView({ behavior: 'smooth' }); }}>↩ Responder</button>
        <button className="btn" onClick={() => { sfx('click'); useStore.getState().toast('➡ Reenviado a Cecilia (ya lo sabía)'); }}>➡ Reenviar</button>
        <button className="btn" onClick={() => { sfx('close'); useStore.getState().setFlag(`correo:del:${mail.id}`, !isDel(mail)); setOpenId(null); setView('list'); }}>{isDel(mail) ? '↺ Restaurar' : '✖ Eliminar'}</button>
        <button className="btn" onClick={() => speak(mail.es)}>🔊 Leer en voz alta</button>
        <button className={`btn ${en ? 'on' : ''}`} onClick={() => { sfx('click'); setEn(!en); }}>{en ? 'EN' : 'ES'} ⇄</button>
        <button className="btn" onClick={() => openApp('academia', { lesson: mail.lesson })}>📖 Lección {mail.lesson}</button>
      </div>
      <div className="inset flex-1 overflow-auto p-3 min-h-0">
        <div className="text-xs mb-2 border-b border-gray-400 pb-1">
          <div><b>De:</b> {mail.from} &lt;{mail.addr}&gt;</div>
          <div><b>Fecha:</b> {mail.date}</div>
          <div><b>Asunto:</b> {mail.subject}</div>
          {mail.clip && <div>📎 <u className="text-blue-800">{mail.clip}</u></div>}
        </div>
        <div className={`whitespace-pre-wrap ${sel} text-sm leading-relaxed`}>{en ? mail.en : mail.es}</div>
        <Quiz key={mail.id} mail={mail} />
      </div>
    </div>
  );

  return (
    <div ref={root} className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 p-1 text-xs border-b border-gray-500">
        {!wide && view !== 'folders' && <button className="btn" onClick={() => setView('folders')}>📁 Carpetas</button>}
        <span className="truncate">{FOLDERS.find((f) => f[0] === folder)![2]} — {list.length} mensajes, {unread(folder)} sin leer</span>
        <span className="ml-auto opacity-70 shrink-0">{MAILS.filter(isOk).length}/10 📬</span>
      </div>
      {wide ? (
        <div className="flex-1 flex min-h-0 p-1 gap-1">
          <div className="w-44 shrink-0">{Folders}</div>
          <div className="flex-1 flex flex-col min-w-0 gap-1">
            <div className="h-2/5 min-h-0">{List}</div>
            <div className="flex-1 min-h-0">{Reader}</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 p-1">{view === 'folders' ? Folders : view === 'list' || !mail ? List : Reader}</div>
      )}
    </div>
  );
}

function Quiz({ mail }: { mail: Mail }) {
  const solved = useStore((s) => s.solved);
  const [tries, setTries] = useState<Record<number, number>>({});
  const done = mail.qs.filter((_, i) => solved[`correo:${mail.id}:${i}`]).length;
  const answer = (i: number, o: number) => {
    if (o === mail.qs[i].a) { sfx('ding'); useStore.getState().solve(`correo:${mail.id}:${i}`); }
    else { sfx('wrong'); }
    setTries((t) => ({ ...t, [i]: o }));
  };
  return (
    <fieldset id="correo-q" className="group mt-4">
      <legend>Responder al remitente ({done}/{mail.qs.length})</legend>
      {mail.qs.map((q, i) => {
        const ok = !!solved[`correo:${mail.id}:${i}`];
        const picked = tries[i];
        return (
          <div key={i} className="mb-3 text-sm">
            <div className="font-bold">{i + 1}. {q.q}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {q.opts.map((o, j) => (
                <button key={j} disabled={ok} className={`btn ${ok && j === q.a ? 'on' : ''}`}
                  style={ok && j === q.a ? { color: '#006400' } : picked === j && !ok ? { color: '#a00000' } : undefined} onClick={() => answer(i, j)}>{o}</button>
              ))}
            </div>
            {ok && <div style={{ color: '#006400' }}>✔ ¡Correcto! +XP — {q.why}</div>}
            {!ok && picked !== undefined && <div style={{ color: '#a00000' }}>✖ {q.why}</div>}
          </div>
        );
      })}
      {done === mail.qs.length && <div className="pop font-bold">📤 Respuesta enviada a {mail.from}.</div>}
    </fieldset>
  );
}
