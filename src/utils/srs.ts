// SM-2 spaced repetition.
export interface Card { id: string; es: string; en: string; ef: number; interval: number; reps: number; due: number; }
export type Rating = 0 | 3 | 4 | 5; // again, hard, good, easy
const DAY = 86400000;

export const newCard = (id: string, es: string, en: string): Card => ({ id, es, en, ef: 2.5, interval: 0, reps: 0, due: Date.now() });

export function review(c: Card, q: Rating): Card {
  let { ef, interval, reps } = c;
  if (q < 3) { reps = 0; interval = 0; }
  else {
    reps += 1;
    interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(interval * ef);
    if (q === 3) interval = Math.max(1, Math.round(interval * 0.8));
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const due = interval === 0 ? Date.now() + 60_000 : Date.now() + interval * DAY;
  return { ...c, ef, interval, reps, due };
}
