# Villa Celeste OS '98 — Progress

## Run / build / deploy
```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + static build into dist/ (base './', works on any static host)
npm run data       # re-run scripts/compile_curriculum.py after editing textbook text
```
GitHub Pages: `.github/workflows/pages.yml` builds and deploys on push to `main` (enable Pages → "GitHub Actions" in repo settings).

## Done
- **Data**: `scripts/compile_curriculum.py` compiles all 60 lessons (vocabulary, grammar sections, activities with answer keys, cultural readings, Book 2 speaking activities) plus ~5,900 glossary entries and both grammar references into `src/data/generated/`. Lessons are lazy-loaded per lesson.
- **Shell**: boot BIOS screen (skippable), draggable/resizable/min/max windows, taskbar, ❖ Inicio menu with lesson quick-jump, tray (SRS due, sound, CRT, level/XP, clock), toasts, 4 themes, CRT filter, Web Audio synth, Spanish TTS, global double-click word lookup → translate/speak/save to SRS, mobile-friendly (windows maximize on phones).
- **Academia.exe**: 60 lessons, vocab list + flashcards, grammar viewer, activities auto-converted into inline inputs/dropdowns graded against the textbook keys (accent-tolerant hinting, context-aware), open-ended items self-checked, answer keys, cultural reading C/F quizzes, speaking prompts; progress gates lessons (sandbox unlock in Control).
- **Glosario98.hlp**: by topic / cognates / ES→EN / EN→ES search, both grammar references, SM-2 SRS review.
- **Control.exe**: themes, effects, TTS speed, sound test, achievements, stats + lesson heatmap, JSON export/import/reset, unlock-all.
- **Bienvenido.txt**: starter guide opened on first load.
