import { useStore } from '../store';

let voice: SpeechSynthesisVoice | null | undefined;
function pickVoice() {
  if (voice !== undefined && voice) return voice;
  const vs = window.speechSynthesis?.getVoices() ?? [];
  voice = vs.find((v) => v.lang === 'es-MX') ?? vs.find((v) => v.lang.startsWith('es')) ?? null;
  return voice;
}
if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => { voice = undefined; };

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/** Speak Spanish text. rate defaults to the user's setting (0.75 slow / 1 native). */
export function speak(text: string, rate?: number) {
  if (!ttsSupported()) return;
  const u = new SpeechSynthesisUtterance(text.replace(/_+/g, ' … '));
  u.lang = 'es-MX';
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = rate ?? useStore.getState().settings.ttsRate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
