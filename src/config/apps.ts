import { lazy, ComponentType, LazyExoticComponent } from 'react';

export interface AppProps { winId: string; args?: any; }
export interface AppDef {
  title: string; icon: string; label: string; size: [number, number];
  component: LazyExoticComponent<ComponentType<AppProps>>; single?: boolean; desktop?: boolean;
}

const L = (f: () => Promise<{ default: ComponentType<AppProps> }>) => lazy(f);

export const APPS = {
  hoy: { title: 'Hoy - Mi plan de estudio', label: 'Hoy.exe', icon: '☀️', size: [620, 600], component: L(() => import('../apps/Hoy/HoyApp')) },
  bienvenido: { title: 'Bienvenido.txt - Bloc de notas', label: 'Bienvenido.txt', icon: '📝', size: [560, 480], component: L(() => import('../apps/Notepad/NotepadApp')) },
  palabras: { title: 'Palabras en Juego', label: 'Palabras.exe', icon: '🎮', size: [720, 600], component: L(() => import('../apps/Palabras/PalabrasApp')) },
  academia: { title: 'Academia Villa Celeste', label: 'Academia.exe', icon: '📖', size: [980, 680], component: L(() => import('../apps/Academia/AcademiaApp')) },
  glosario: { title: 'Glosario98.hlp', label: 'Glosario98.hlp', icon: '🗂️', size: [820, 600], component: L(() => import('../apps/Glosario/GlosarioApp')) },
  chismenet: { title: 'ChismeNet Messenger \'98', label: 'ChismeNet.exe', icon: '💬', size: [760, 560], component: L(() => import('../apps/ChismeNet/ChismeNetApp')) },
  correo: { title: 'Correo Celeste Express', label: 'Correo.exe', icon: '📧', size: [900, 600], component: L(() => import('../apps/Correo/CorreoApp')) },
  telenovela: { title: 'La Oveja Negra - TeleNovela CRT', label: 'LaOvejaNegra.exe', icon: '📺', size: [820, 620], component: L(() => import('../apps/LaOvejaNegra/LaOvejaNegraApp')) },
  cupido: { title: 'CupidoDigital & Clasificados \'98', label: 'Cupido.exe', icon: '💘', size: [860, 600], component: L(() => import('../apps/Cupido/CupidoApp')) },
  conjugator: { title: 'Conjugator 2000', label: 'Conjugator.exe', icon: '⚡', size: [760, 580], component: L(() => import('../apps/Conjugator/ConjugatorApp')) },
  detective: { title: 'Mapa y Expedientes de Villa Celeste', label: 'Detective.exe', icon: '🕵️', size: [940, 640], component: L(() => import('../apps/Detective/DetectiveApp')) },
  fonetica: { title: 'Grabadora de Voz \'98', label: 'Fonética.exe', icon: '🎙️', size: [760, 580], component: L(() => import('../apps/Fonetica/FoneticaApp')) },
  control: { title: 'Panel de Control', label: 'Control.exe', icon: '⚙️', size: [720, 560], component: L(() => import('../apps/Control/ControlApp')) },
} satisfies Record<string, AppDef>;

export type AppId = keyof typeof APPS;
export const APP_IDS = Object.keys(APPS) as AppId[];
