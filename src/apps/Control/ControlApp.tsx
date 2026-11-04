import { useRef, useState } from 'react';
import { useStore, levelOf, LEVELS, Theme } from '../../store';
import { ACHIEVEMENTS } from '../../config/achievements';
import { LESSONS } from '../../data/curriculum';
import { Tabs, Progress } from '../../ui/kit';
import { sfx } from '../../utils/sound';
import { speak } from '../../utils/tts';

type Tab = 'pantalla' | 'sonido' | 'logros' | 'stats' | 'datos';
const THEMES: [Theme, string, string][] = [
  ['teal', 'Windows 98 Clásico', '#008080'],
  ['sunset', 'Madrid \'98 Atardecer', 'linear-gradient(180deg,#2b1055,#d53369,#ffb347)'],
  ['vapor', 'Cibercafé Vaporwave', 'linear-gradient(160deg,#0f0c29,#302b63,#ff00cc)'],
  ['paper', 'Papel (alto contraste)', '#f4efe1'],
];

export default function ControlApp() {
  const [tab, setTab] = useState<Tab>('pantalla');
  const s = useStore();
  const st = s.settings;
  const file = useRef<HTMLInputElement>(null);

  const exportSave = () => {
    const { xp, solved, lessons, cards, achievements, flags, settings } = useStore.getState();
    const blob = new Blob([JSON.stringify({ v: 1, xp, solved, lessons, cards, achievements, flags, settings }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `villa_celeste_save_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  const importSave = async (f: File) => {
    try {
      const d = JSON.parse(await f.text());
      if (typeof d.xp !== 'number') throw new Error();
      useStore.setState({ xp: d.xp, solved: d.solved ?? {}, lessons: d.lessons ?? {}, cards: d.cards ?? {}, achievements: d.achievements ?? {}, flags: d.flags ?? {}, settings: { ...st, ...d.settings } });
      sfx('ding'); s.toast('💾 Partida cargada');
    } catch { sfx('error'); s.toast('❌ Archivo no válido'); }
  };

  const lvl = levelOf(s.xp);
  const li = LEVELS.findIndex(([l]) => l === lvl);
  const next = LEVELS[li + 1];
  const done = (b: number) => LESSONS.filter((l) => l.book === b && (s.lessons[l.id] ?? 0) >= 80).length;

  return (
    <div className="h-full flex flex-col p-1">
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[['pantalla', '🖥️ Pantalla'], ['sonido', '🔊 Sonido y voz'], ['logros', '🏆 Logros'], ['stats', '📊 Estadísticas'], ['datos', '💾 Datos']]} />
      <div className="panel flex-1 min-h-0 overflow-auto p-3">
        {tab === 'pantalla' && (
          <>
            <fieldset className="group"><legend>Tema del escritorio</legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {THEMES.map(([id, name, bg]) => (
                  <button key={id} className={`btn flex flex-col items-center gap-1 p-2 ${st.theme === id ? 'on' : ''}`} onClick={() => { s.set({ theme: id }); sfx('click'); }}>
                    <div className="w-full h-14 sunken" style={{ background: bg }} /><span className="text-[12px]">{name}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="group"><legend>Efectos</legend>
              <Check label="Filtro CRT (líneas de escaneo)" v={st.crt} on={(crt) => s.set({ crt })} />
              <Check label="Traducción con doble clic en cualquier palabra" v={st.lookup} on={(lookup) => s.set({ lookup })} />
              <Check label="Saltar la pantalla de arranque (BIOS)" v={st.skipBoot} on={(skipBoot) => s.set({ skipBoot })} />
            </fieldset>
            <fieldset className="group"><legend>Modo sandbox</legend>
              <Check label="🔓 Desbloquear todos los niveles de Palabras.exe" v={st.unlockAll} on={(unlockAll) => s.set({ unlockAll })} />
            </fieldset>
          </>
        )}
        {tab === 'sonido' && (
          <>
            <fieldset className="group"><legend>Sintetizador retro</legend>
              <Check label="Efectos de sonido" v={st.sound} on={(sound) => s.set({ sound })} />
              <label className="flex items-center gap-2 mt-2">Volumen <input type="range" min={0} max={1} step={0.05} value={st.volume} onChange={(e) => s.set({ volume: +e.target.value })} onPointerUp={() => sfx('ding')} /></label>
              <div className="flex gap-1 flex-wrap mt-2">{(['boot', 'uhoh', 'mail', 'ding', 'wrong', 'drama', 'levelup'] as const).map((n) => <button key={n} className="btn text-[12px]" onClick={() => sfx(n)}>{n}</button>)}</div>
            </fieldset>
            <fieldset className="group"><legend>Voz en español (TTS)</legend>
              <div className="flex gap-2 items-center flex-wrap">
                {[[0.75, '🐢 Lento 0.75x'], [0.9, 'Aprendiz 0.9x'], [1, '🗣️ Nativo 1.0x']].map(([r, l]) => (
                  <button key={r} className={`btn ${st.ttsRate === r ? 'on' : ''}`} onClick={() => { s.set({ ttsRate: r as number }); speak('Hola, vecino. Bienvenido a Villa Celeste.', r as number); }}>{l}</button>
                ))}
              </div>
              {!('speechSynthesis' in window) && <div className="text-[12px] mt-2">⚠️ Tu navegador no soporta síntesis de voz.</div>}
            </fieldset>
          </>
        )}
        {tab === 'logros' && (
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
              const got = s.achievements[id];
              return (
                <div key={id} className={`inset p-2 flex gap-2 items-center ${got ? '' : 'opacity-50 grayscale'}`}>
                  <span className="text-[28px]">{got ? a.icon : '🔒'}</span>
                  <div className="text-[12px]"><b>{a.name}</b><br />{a.desc}{got && <div className="opacity-60">{new Date(got).toLocaleDateString('es-MX')}</div>}</div>
                </div>
              );
            })}
          </div>
        )}
        {tab === 'stats' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="pixel text-[28px]" style={{ color: 'var(--title-a)' }}>{lvl}</div>
              <div className="flex-1 min-w-[200px]">
                <div className="text-[12px]">{s.xp} XP {next ? `· ${next[1] - s.xp} XP para ${next[0]}` : '· ¡Nivel máximo!'}</div>
                <Progress value={next ? (s.xp - LEVELS[li][1]) / (next[1] - LEVELS[li][1]) : 1} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {[['Libro 1', `${done(1)}/30`], ['Libro 2', `${done(2)}/30`], ['Respuestas', Object.keys(s.solved).length], ['Tarjetas SRS', Object.keys(s.cards).length]].map(([k, v]) => (
                <div key={k} className="inset p-2"><div className="text-[20px] font-bold">{v}</div><div className="text-[11px]">{k}</div></div>
              ))}
            </div>
            <fieldset className="group"><legend>Mapa de lecciones (≥80% = completa)</legend>
              {[1, 2].map((b) => (
                <div key={b} className="flex gap-[2px] flex-wrap mb-1 items-center"><span className="w-14 text-[11px]">Libro {b}</span>
                  {LESSONS.filter((l) => l.book === b).map((l) => {
                    const p = s.lessons[l.id] ?? 0;
                    return <div key={l.id} title={`${l.id} ${l.title}: ${p}%`} className="w-4 h-4 sunken" style={{ background: p >= 80 ? '#0a0' : p > 0 ? `rgba(0,0,128,${0.2 + p / 120})` : '#fff' }} />;
                  })}
                </div>
              ))}
            </fieldset>
          </div>
        )}
        {tab === 'datos' && (
          <div className="flex flex-col gap-3 items-start">
            <div className="text-[13px]">Tu partida se guarda automáticamente en este navegador (<code>villa_celeste_save_v1</code>).</div>
            <button className="btn" onClick={exportSave}>💾 Exportar partida (.json)</button>
            <button className="btn" onClick={() => file.current?.click()}>📂 Importar partida...</button>
            <input ref={file} type="file" accept=".json,application/json" hidden onChange={(e) => e.target.files?.[0] && importSave(e.target.files[0])} />
            <button className="btn" onClick={() => { if (confirm('¿Borrar TODO tu progreso? Esta acción no se puede deshacer.')) { s.reset(); sfx('close'); } }}>🗑️ Reiniciar partida</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Check({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) {
  return <label className="flex items-center gap-2 py-[2px] cursor-pointer"><input type="checkbox" checked={v} onChange={(e) => { on(e.target.checked); sfx('click'); }} />{label}</label>;
}
