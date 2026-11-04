// Procedural Web Audio retro sound effects: no audio assets.
import { useStore } from '../store';

export type Sfx = 'click' | 'open' | 'close' | 'error' | 'ding' | 'wrong' | 'uhoh' | 'boot' | 'drama' | 'levelup' | 'mail' | 'type';

let ctx: AudioContext | null = null;
const ac = () => (ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)());

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'square', vol = 0.15, slideTo?: number) {
  const c = ac(), o = c.createOscillator(), g = c.createGain();
  const t = c.currentTime + start, v = vol * useStore.getState().settings.volume;
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const SEQ: Record<Sfx, () => void> = {
  click: () => tone(1200, 0, 0.03, 'square', 0.05),
  type: () => tone(2400 + Math.random() * 400, 0, 0.015, 'square', 0.03),
  open: () => { tone(523, 0, 0.08, 'triangle'); tone(784, 0.06, 0.1, 'triangle'); },
  close: () => { tone(784, 0, 0.06, 'triangle'); tone(392, 0.05, 0.1, 'triangle'); },
  error: () => { tone(220, 0, 0.18, 'square', 0.12); tone(196, 0.15, 0.25, 'square', 0.12); },
  ding: () => { tone(1318, 0, 0.12, 'sine', 0.2); tone(1760, 0.08, 0.3, 'sine', 0.2); },
  wrong: () => tone(300, 0, 0.25, 'sawtooth', 0.08, 120),
  uhoh: () => { tone(660, 0, 0.12, 'sine', 0.2); tone(440, 0.16, 0.2, 'sine', 0.2); },
  mail: () => { tone(988, 0, 0.1, 'sine', 0.15); tone(1319, 0.1, 0.2, 'sine', 0.15); },
  levelup: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.18, 'square', 0.08)),
  boot: () => {
    [[392, 0], [523, 0.35], [659, 0.7], [784, 1.05]].forEach(([f, s]) => tone(f, s, 1.6, 'sine', 0.12));
    [196, 262].forEach((f) => tone(f, 1.05, 2, 'triangle', 0.08));
  },
  drama: () => [[146.8, 174.6, 220], [138.6, 164.8, 207.7]].forEach((ch, i) => ch.forEach((f) => tone(f, i * 0.7, 1.2, 'sawtooth', 0.05))),
};

export function sfx(name: Sfx) {
  if (!useStore.getState().settings.sound) return;
  try { SEQ[name](); } catch { /* audio unavailable */ }
}
