import { useStore, dueCount, streak, today, DAILY_GOAL, levelOf } from '../../store';
import { LESSONS } from '../../data/curriculum';
import { openApp } from '../../os/wm';
import type { AppId } from '../../config/apps';
import { Progress } from '../../ui/kit';
import { stageCount, key } from '../Palabras/PalabrasApp';

const TIPS: [string, string][] = [
  ['Poco y a menudo: 15 minutos cada día valen más que dos horas el domingo.', 'Little and often beats cramming.'],
  ['Di las palabras en voz alta. Tu boca también necesita practicar.', 'Say words out loud; your mouth needs practice too.'],
  ['Equivocarte es parte del juego: los errores muestran qué repasar.', 'Mistakes show you what to review.'],
  ['Repasa las tarjetas antes de aprender palabras nuevas.', 'Review before learning new words.'],
  ['Aprende frases, no solo palabras sueltas: «tengo hambre», no solo «hambre».', 'Learn chunks, not isolated words.'],
  ['Lee el texto una vez sin diccionario. Adivinar por contexto es una habilidad.', 'Guessing from context is a skill.'],
  ['Habla contigo mismo en español mientras cocinas o caminas.', 'Narrate your day in Spanish.'],
  ['Los cognados son tus amigos: «hospital», «familia», «importante».', 'Cognates are free vocabulary.'],
];
const STORIES: [AppId, string][] = [
  ['chismenet', 'Chismea con los vecinos en ChismeNet'],
  ['correo', 'Lee el correo del barrio'],
  ['telenovela', 'Mira un episodio de La oveja negra'],
  ['cupido', 'Ayuda a Andrés con su cita'],
  ['conjugator', 'Una partida rápida de Conjugator'],
];

export default function HoyApp() {
  const { xp, days, cards, flags, lessons, settings } = useStore();
  const due = dueCount(cards);
  const todayXp = days[today()] ?? 0;
  const st = streak(days);
  const dayNum = Math.floor(Date.now() / 86400000);
  const [tipEs, tipEn] = TIPS[dayNum % TIPS.length];
  const story = STORIES[dayNum % STORIES.length];

  // Next vocabulary level: first stage without a star.
  let nextGame: { lesson: string; title: string; stage: number } | null = null;
  for (const l of LESSONS) {
    const n = stageCount(l.vocabCount);
    const s = Array.from({ length: n }, (_, i) => i).find((i) => !flags[key(l.id, i)]);
    if (s !== undefined) { nextGame = { lesson: l.id, title: `${l.book === 2 ? 'Libro 2 · ' : ''}${l.lessonNumber}. ${l.title}`, stage: s }; break; }
  }
  const lastId = (flags['academia:last'] as string) ?? LESSONS.find((l) => (lessons[l.id] ?? 0) < 80)?.id ?? 'B1-L01';
  const last = LESSONS.find((l) => l.id === lastId)!;
  const hour = new Date().getHours();
  const hello = hour < 12 ? '¡Buenos días!' : hour < 20 ? '¡Buenas tardes!' : '¡Buenas noches!';
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { k: today(d), l: d.toLocaleDateString('es-MX', { weekday: 'narrow' }), v: days[today(d)] ?? 0 }; });
  const maxW = Math.max(DAILY_GOAL, ...week.map((w) => w.v));
  const steps: { done: boolean; title: string; sub: string; go: () => void }[] = [
    { done: due === 0, title: due ? `Repasa ${due} tarjeta${due > 1 ? 's' : ''}` : 'Tarjetas al día', sub: due ? 'Recordar lo de ayer vale más que aprender algo nuevo.' : Object.keys(cards).length ? 'No hay repasos pendientes. ¡Bien!' : 'Las palabras que falles en los juegos aparecerán aquí.', go: () => openApp('glosario', { tab: 'srs' }) },
    nextGame
      ? { done: false, title: `Palabras: nivel ${nextGame.stage + 1}`, sub: nextGame.title, go: () => openApp('palabras', { lesson: nextGame!.lesson }) }
      : { done: true, title: 'Todas las palabras superadas', sub: '¡Increíble!', go: () => openApp('palabras') },
    { done: (lessons[last.id] ?? 0) >= 80, title: `Lección: ${last.title}`, sub: `${last.book === 1 ? 'Libro 1' : 'Libro 2'}, lección ${last.lessonNumber} · ${lessons[last.id] ?? 0}% de las actividades`, go: () => openApp('academia', { lesson: last.id }) },
  ];

  return (
    <div className="h-full overflow-auto p-3 flex flex-col gap-3 text-[14px]" style={{ background: '#fbfaf5' }}>
      <div className="flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="text-[20px] font-bold">{hello}</div>
          <div className="opacity-75">{xp === 0 ? 'Bienvenido a Villa Celeste. Empieza por el paso 2: tus primeras palabras.' : `Nivel ${levelOf(xp)} · ${xp} XP en total`}</div>
        </div>
        <div className="text-center px-3">
          <div className="text-[26px] leading-none">{st > 0 ? '🔥' : '🌱'}</div>
          <div className="font-bold">{st} día{st === 1 ? '' : 's'}</div>
          <div className="text-[11px] opacity-70">seguidos</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[12px] mb-1"><span>Meta de hoy</span><span>{Math.min(todayXp, DAILY_GOAL)} / {DAILY_GOAL} XP {todayXp >= DAILY_GOAL && '✅'}</span></div>
        <Progress value={todayXp / DAILY_GOAL} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-bold">Tu sesión de hoy</div>
        {steps.map((s, i) => (
          <button key={i} onClick={s.go} className="bevel text-left p-3 flex items-center gap-3 border-none cursor-pointer hover:brightness-105">
            <span className={`w-8 h-8 shrink-0 rounded-full grid place-items-center font-bold text-white`} style={{ background: s.done ? '#2a8a2a' : 'var(--title-a)' }}>{s.done ? '✓' : i + 1}</span>
            <span className="flex-1 min-w-0"><span className="block font-bold truncate">{s.title}</span><span className="block text-[12px] opacity-75 truncate">{s.sub}</span></span>
            <span className="text-[18px]">▶</span>
          </button>
        ))}
        <button onClick={() => openApp(story[0])} className="text-left text-[13px] underline text-[#0000aa] bg-transparent border-none cursor-pointer p-1">¿Te queda tiempo? {story[1]} →</button>
      </div>

      <div>
        <div className="text-[12px] mb-1">Esta semana</div>
        <div className="flex items-end gap-2 h-16">
          {week.map((w) => (
            <div key={w.k} className="flex-1 flex flex-col items-center justify-end h-full" title={`${w.v} XP`}>
              <div className="w-full sunken" style={{ height: `${Math.max(3, (w.v / maxW) * 100)}%`, background: w.v >= DAILY_GOAL ? '#2a8a2a' : w.v ? 'var(--title-b)' : '#ddd' }} />
              <div className="text-[10px] mt-1">{w.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="inset p-3 text-[13px]" style={{ background: '#ffffe1' }}>
        💡 <b>{tipEs}</b><br /><span className="opacity-70">{tipEn}</span>
      </div>

      <div className="text-[12px] opacity-70 flex gap-3 flex-wrap">
        <a href="#" className="underline" onClick={(e) => { e.preventDefault(); openApp('bienvenido'); }}>Guía de inicio</a>
        <a href="#" className="underline" onClick={(e) => { e.preventDefault(); openApp('control'); }}>Ajustes</a>
        <a href="#" className="underline" onClick={(e) => { e.preventDefault(); useStore.getState().set({ pixelApps: !settings.pixelApps }); }}>{settings.pixelApps ? 'Letra cómoda' : 'Modo píxel'}</a>
        {!settings.sound && <span>🔇 sonido apagado</span>}
      </div>
    </div>
  );
}
