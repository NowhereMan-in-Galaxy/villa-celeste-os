import { create } from 'zustand';
import { APPS, AppId, AppDef } from '../config/apps';
import { sfx } from '../utils/sound';

export interface Win { id: string; app: AppId; title: string; args?: any; x: number; y: number; w: number; h: number; z: number; min: boolean; max: boolean; }

interface WM {
  wins: Win[]; top: number; active?: string;
  open: (app: AppId, args?: any, title?: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  patch: (id: string, p: Partial<Win>) => void;
}

let seq = 0;
export const useWM = create<WM>((set, get) => ({
  wins: [], top: 10,
  open: (app, args, title) => {
    const def: AppDef = APPS[app];
    const existing = get().wins.find((w) => w.app === app && (def.single !== false));
    if (existing) {
      get().patch(existing.id, { min: false, ...(args !== undefined ? { args } : {}) });
      return get().focus(existing.id);
    }
    sfx('open');
    const mobile = window.innerWidth < 700;
    const [w, h] = mobile ? [window.innerWidth, window.innerHeight - 40] : [Math.min(def.size[0], window.innerWidth - 20), Math.min(def.size[1], window.innerHeight - 60)];
    const n = get().wins.length;
    const win: Win = {
      id: `w${++seq}`, app, args, title: title ?? def.title, w, h, min: false, max: mobile, z: get().top + 1,
      x: mobile ? 0 : Math.max(0, Math.min(80 + n * 28, window.innerWidth - w)), y: mobile ? 0 : Math.max(0, Math.min(30 + n * 24, window.innerHeight - h - 40)),
    };
    set((s) => ({ wins: [...s.wins, win], top: s.top + 1, active: win.id }));
  },
  close: (id) => { sfx('close'); set((s) => ({ wins: s.wins.filter((w) => w.id !== id) })); },
  focus: (id) => set((s) => ({ top: s.top + 1, active: id, wins: s.wins.map((w) => (w.id === id ? { ...w, z: s.top + 1 } : w)) })),
  patch: (id, p) => set((s) => ({ wins: s.wins.map((w) => (w.id === id ? { ...w, ...p } : w)) })),
}));

/** Convenience for apps: open another app, e.g. openApp('academia', { lesson: 'B1-L06' }). */
export const openApp = (app: AppId, args?: any) => useWM.getState().open(app, args);
