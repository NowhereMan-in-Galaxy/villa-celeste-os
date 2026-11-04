import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card, newCard, review, Rating } from './utils/srs';

export type Theme = 'teal' | 'sunset' | 'vapor' | 'paper';
export interface Settings { theme: Theme; crt: boolean; sound: boolean; volume: number; ttsRate: number; unlockAll: boolean; skipBoot: boolean; lookup: boolean; }

export const LEVELS = [['A1', 0], ['A1+', 500], ['A2', 1200], ['A2+', 2200], ['B1', 3500], ['B1+', 5000], ['B2', 7000]] as const;
export const levelOf = (xp: number) => [...LEVELS].reverse().find(([, n]) => xp >= n)![0];

export interface ToastMsg { id: number; text: string; }

interface State {
  xp: number;
  solved: Record<string, true>;          // question ids answered correctly
  lessons: Record<string, number>;      // lesson id -> best % completed
  cards: Record<string, Card>;
  achievements: Record<string, number>; // id -> timestamp
  flags: Record<string, unknown>;       // free-form per-app progress (namespaced keys e.g. "chisme:ep1")
  settings: Settings;
  toasts: ToastMsg[];
  addXP: (n: number) => void;
  solve: (qid: string, xp?: number) => void;
  setLessonProgress: (id: string, pct: number) => void;
  addCard: (id: string, es: string, en: string) => void;
  removeCard: (id: string) => void;
  rateCard: (id: string, q: Rating) => void;
  unlock: (id: string) => void;
  setFlag: (k: string, v: unknown) => void;
  set: (p: Partial<Settings>) => void;
  toast: (text: string) => void;
  reset: () => void;
}

const defaults = {
  xp: 0, solved: {}, lessons: {}, cards: {}, achievements: {}, flags: {}, toasts: [],
  settings: { theme: 'teal', crt: true, sound: true, volume: 0.7, ttsRate: 0.9, unlockAll: false, skipBoot: false, lookup: true } as Settings,
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...defaults,
      addXP: (n) => set((s) => ({ xp: s.xp + n })),
      solve: (qid, xp = 10) => { if (!get().solved[qid]) set((s) => ({ solved: { ...s.solved, [qid]: true }, xp: s.xp + xp })); },
      setLessonProgress: (id, pct) => set((s) => ({ lessons: { ...s.lessons, [id]: Math.max(pct, s.lessons[id] ?? 0) } })),
      addCard: (id, es, en) => { if (!get().cards[id]) { set((s) => ({ cards: { ...s.cards, [id]: newCard(id, es, en) } })); get().toast(`★ "${es}" → mazo SRS`); } },
      removeCard: (id) => set((s) => { const c = { ...s.cards }; delete c[id]; return { cards: c }; }),
      rateCard: (id, q) => set((s) => ({ cards: { ...s.cards, [id]: review(s.cards[id], q) }, xp: s.xp + 2 })),
      unlock: (id) => { if (!get().achievements[id]) { set((s) => ({ achievements: { ...s.achievements, [id]: Date.now() } })); get().toast(`🏆 ¡Logro desbloqueado!`); } },
      setFlag: (k, v) => set((s) => ({ flags: { ...s.flags, [k]: v } })),
      set: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      toast: (text) => { const id = Date.now() + Math.random(); set((s) => ({ toasts: [...s.toasts, { id, text }] })); setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000); },
      reset: () => set({ ...defaults, settings: { ...defaults.settings, skipBoot: true } }),
    }),
    { name: 'villa_celeste_save_v1', partialize: ({ toasts, ...rest }) => rest as any },
  ),
);

export const dueCount = (cards: Record<string, Card>) => Object.values(cards).filter((c) => c.due <= Date.now()).length;
