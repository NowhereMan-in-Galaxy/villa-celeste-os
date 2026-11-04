# 🖥️ CLAUDE.md — Master Engineering & Curriculum Blueprint for **Villa Celeste OS '98**

> **CRITICAL DIRECTIVE FOR CLAUDE**:
> You have a **~$40 credit budget** expiring soon to build an extraordinary, portfolio-grade, purely frontend Spanish learning web application: **Villa Celeste OS '98**.
> Read this entire specification before writing code. Follow the **Always-Shippable Rule**, **Parallel Subagent Data Pipeline**, and **Phased Execution & Budget Plan** strictly so that at **every single commit**, the project compiles cleanly (`npm run build` exits 0) and is a playable, deeply engaging app.

---

## 1. Project Vision: What We Are Building

**Villa Celeste OS '98** is a nostalgic **Windows 98 / Classic Mac OS 9 Retro Web Desktop OS & Neighborhood Detective RPG** that turns two comprehensive Spanish textbooks (**60 lessons total**, A1 Beginner through B1/B2 Intermediate-Advanced) into an explorable 1998 neighborhood intranet.

Instead of flipping through dry PDF pages, the user boots into a CRT-styled desktop computer hooked up to the community network of **Villa Celeste**. As the user completes lessons, grammar puzzles, and speaking challenges, they unlock neighborhood emails, ICQ/MSN-style chat logs, medical clinic records, travel agency itineraries, telenovela episodes (*La oveja negra*), house-hunting classifieds, and hilarious blind-date profiles belonging to the **5 interconnected families** from the textbooks.

### Why This Works So Well with the Source Textbooks
Both textbooks (*Learning Spanish I* and *Learning Spanish II* by Prof. Bill Worden & Dr. Laura Rojas-Arce) are uniquely written around **continuous soap-opera storylines** set in a Latin American neighborhood!
All raw textbook lessons have **already been pre-extracted for you into clean, small plain-text files** in:
- `textbooks/extracted/MANIFEST.json` — Complete index of all 60 lessons + 11 supplemental reference/glossary files.
- `textbooks/extracted/book1/lesson_01.txt` ... `lesson_30.txt` (Part I: Beginner / Villa Celeste)
- `textbooks/extracted/book2/lesson_01.txt` ... `lesson_30.txt` (Part II: Intermediate / Expanded Universe)
- `textbooks/extracted/book1/` & `book2/` supplemental files: `grammar_reference.txt`, `speaking_activities.txt`, `glossary_by_topic.txt`, `glossary_of_cognates.txt`, `glossary_es_en.txt`, `glossary_en_es.txt`.

> **DO NOT attempt to read or parse `textbooks/raw_pdfs/*.pdf`**. Always read the lightweight `.txt` files inside `textbooks/extracted/`.

---

## 2. Canonical Universe & Character Bible (From Books 1 & 2)

Use these exact canonical characters, relationships, and plot arcs across all OS apps, emails, chats, and exercises:

### Part I Universe: *El Vecindario de Villa Celeste* (Book 1: Lessons 1–30)
1. **La Familia Cortés Ruiz**
   - **Luis Cortés Navarro** (Husband): Owns a busy travel agency (*Agencia de Viajes Cortés*), has friends all over the world (e.g., Juan Manuel Ríos).
   - **Cecilia Ruiz Ramírez** (Wife): Executive secretary at a major bank. Obsessed with watching the daily telenovela ***La oveja negra*** ("The Black Sheep") with her neighbor Alejandra.
   - **Alberto Cortés Ruiz** (Son, 37): Divorced dentist with financial troubles, currently living back with his parents Luis & Cecilia. Desperately house-hunting (*Lesson 20*), allergic to old dusty carpets, picky about kitchens and living rooms.
   - **Diego Cortés Ruiz** (Son, 30): Started an office-supply business (*artículos de oficina*) that went bankrupt when a huge multinational moved into town. Now back in school studying for an **MBA** and secretly crushing on his smart classmate **Ema**.
   - **Javier Cortés Ruiz** (Son, 28): Engineer, married to **Erica Quirós García**. Best friends since childhood with **Ignacio** (who lives in Costa Rica and is always busy). Father of **Diana** (4) and **Mariana** (1), with a third baby on the way.
2. **La Familia Quirós García**
   - **Dr. Esteban Quirós Sánchez** (Husband): Physician at the local hospital (*Clínica Villa Celeste*). Gives health commands (`usted` commands in Lesson 24) to patients.
   - **Luisa García Vega** (Wife): Nutritionist who advocates healthy Latin American ingredients (avocados, broccoli, beans, fruit).
   - **Erica Quirós García** (Daughter): Married to Javier Cortés, pregnant with their third child.
   - **Felipe Quirós García** (Son, 22): Threw an infamous, chaotic house party while his parents were away (*Lesson 6*: all doors open, TV broken, house a disaster). His friends are trying to convince him to enroll in night classes at the university.
   - **Elena Quirós García** (Daughter, 20): University student, diligent and social.
3. **La Familia González Fallas**
   - **Carlos González Pérez** (Husband): Wants to learn photography; plays tennis against his wife Alejandra (and always loses).
   - **Alejandra Fallas Ureña** (Wife): Better tennis player than Carlos; best friends with Cecilia (they watch *La oveja negra* together and gossip on the phone).
   - **Pablo González Fallas** (Son): College student, co-coach of a youth soccer team, recently injured his knee, hates organizing surprise parties.
   - **Marisol González Fallas** (Daughter): High school student at *Colegio Miguel de Cervantes*. Always chatting on Skype/Messenger with her friends **Victoria, Gabriela, Pilar, and Carolina**.

### Part II Universe: *Más Allá de Villa Celeste* (Book 2: Lessons 1–30)
4. **La Familia Valenzuela Palacios**
   - **Alejandro Valenzuela Lizano** (Husband): Executive at a software/tech company.
   - **Marcela Palacios Pineda** (Wife): Loving mother keeping the family grounded.
   - **Jimena Valenzuela Palacios** (Daughter): College freshman living 3 hours away from home; teaches yoga, loves her sculpture art class, stressed by her heavy literature reading list.
   - **Álvaro Valenzuela Palacios** (Son): High school senior who got caught sending text messages during his literature exam! Wants to sell his car, buy a motorcycle, and backpack across Europe.
5. **La Familia Espinoza Palma**
   - **Gustavo Espinoza Soto** (Husband): Studied political science at the university.
   - **Leonor Palma Díaz** (Wife): 8 months pregnant with their first child; suffering from back pain, so her doctor prescribed swimming (*la natación*).
6. **Los Amigos Profesionales (Solteros del Vecindario)**
   - **Julia Rivera Ugarte**: Public Relations Director at Alejandro's company. Speaks fluent Italian; divorced from her Italian ex-husband **Pietro** after a chaotic wedding in Cancún (where half the guests got food poisoning or missed flights). Thinking about adopting a child.
   - **Andrés Murillo Blanco**: Unemployed biologist who broke up with his girlfriend 8 months ago. His well-meaning friend **José** keeps setting him up on disastrous blind dates, and Andrés is trying online dating with hilarious results.

---

## 3. Technical Stack & Architecture

- **Framework**: React 18 + TypeScript + Vite (fast builds, zero backend required, static export ready for GitHub Pages / Vercel).
- **Styling**: Tailwind CSS + custom Retro Windows 98 / Mac OS 9 / CRT CSS variables (beveled 3D borders `#dfdfdf` / `#808080` / `#000000`, classic title bars `#000080` → `#1084d0` gradient, pixel/retro fonts via Google Fonts `'VT323'`, `'Press Start 2P'`, `'IBM Plex Sans'`, `'Tahoma'`).
- **State Management & Persistence**: Zustand or React Context backed by `localStorage` (`villa_celeste_save_v1`) with full JSON Import/Export backup in Control Panel.
- **Audio & Speech (100% Zero-Asset / Browser-Native)**:
  - **Retro OS Sound Effects**: Built-in Web Audio API synthesizer (`src/utils/sound.ts`) generating authentic Win98 boot chimes, window clicks, ICQ "Uh-oh!" message alerts, correct/wrong dings, and telenovela dramatic organ chords procedurally (zero external MP3 dependencies to break!).
  - **Spanish Text-to-Speech (TTS)**: Browser `window.speechSynthesis` (`es-MX` / `es-ES`) with speed toggle (`0.75x` slow learner mode / `1.0x` native mode) on every Spanish word, sentence, chat message, and dialogue line.
  - **Speech Recognition**: Browser `webkitSpeechRecognition` / `SpeechRecognition` (with graceful fallback to word-tile assembly if unsupported) for `Speaking Activities`.
- **Icons**: `lucide-react` styled inside classic 32×32 retro pixel-bevel frames + custom SVG retro computer/folder/app icons.

---

## 4. The Desktop Environment & 10 Built-in Retro Apps

The main screen is a full **Villa Celeste OS '98 Desktop** featuring:
- **Desktop Wallpaper & Icons**: Switchable retro wallpapers (Teal `#008080`, Villa Celeste Sunset Vaporwave, CRT Night Mode) with double-clickable desktop shortcuts.
- **Multi-Window Manager**: Draggable, resizable, minimizable, maximizable windows with z-index focus, active/inactive title bars, and status bars.
- **Taskbar & Start Menu (`❖ Inicio`)**:
  - `❖ Inicio` menu launching all apps, quick-jumping to any Lesson (B1-L01 to B2-L30), toggling Spanish-English hover dictionary, and viewing user stats.
  - System tray with **Global Vocabulary Lookup Widget**, **SRS Due Counter**, **Audio/CRT Toggle**, **XP / Nivel Badge (A1 → B2)**, and **1998 Clock**.
- **Global Hover-to-Translate & Click-to-Save Word Tooltip**: Anywhere in the OS, clicking or hovering a Spanish word can speak it aloud via TTS and add it to the user's personal SRS Flashcard Deck!

### The 10 Built-in Applications

1. **📖 `Academia.exe` — Academia Villa Celeste (60-Lesson Master Curriculum Hub)**
   - Browse **Book 1 (Lessons 1–30)** and **Book 2 (Lessons 1–30)** with search, filter by grammar topic, and completion badges.
   - Each Lesson opens a rich 4-tab learning workstation faithfully compiled from the textbook lesson:
     - **Tab 1: `I. Vocabulario Nuevo`**: Categorized vocabulary cards from that lesson with 1-click Spanish TTS (Normal & Slow `0.75x`), gender/stem-change badges (`e → ie`, `o → ue`), example usage, and "Add to SRS" star button.
     - **Tab 2: `II. Repaso General (Gramática y Cultura)`**: Clean, visual grammar explanations, conjugation tables, pronunciation tips, and cultural notes from the lesson.
     - **Tab 3: `III. Actividades del Vecindario`**: Interactive workbook exercises directly based on the lesson's story activities (fill-in-the-blank conjugation, multiple choice, sentence transformation, dialogue completion, true/false reading) with **instant answer checking**, hints, and full answer keys (`IV. Respuestas correctas`).
     - **Tab 4: `IV. Lectura Cultural & Reto Oral`**: Cultural readings (food, geography, textile industry, colonial history, etc.) + the lesson's speaking prompt.

2. **💬 `ChismeNet.exe` — ChismeNet Messenger '98 (ICQ / MSN Neighborhood Chat)**
   - Live 1998 instant messenger with buddy list grouped by family (*Familia Cortés*, *Familia Quirós*, *Familia González*, *Familia Valenzuela*, *Solteros*).
   - Includes **guided interactive chat episodes** tied to lessons (e.g., Marisol on Skype with Pilar & Carolina in B1-L07; Alberto complaining to Cecilia about the 5th house he toured in B1-L20; Javier asking Erica for a 6:00 AM airport ride in B1-L21; Álvaro texting during his exam in B2; José interrogating Andrés about his blind date in B2).
   - Player responds by selecting the grammatically correct Spanish reply or typing/speaking the response, earning relationship hearts & XP.

3. **📧 `Correo.exe` — Correo Celeste Express (Outlook '98 Inbox & Mystery Reader)**
   - 3-pane retro email client (Folders, Message List, Reading Pane with inline dual-language toggle).
   - Contains **30+ neighborhood emails, clinic prescriptions, travel agency tickets, and cultural newsletters** derived from the textbooks' *Lectura cultural* and story exercises.
   - Each email has 2–3 comprehension questions at the bottom ("Reply to Sender") to verify reading comprehension and unlock neighborhood secrets.

4. **📺 `LaOvejaNegra.exe` — TeleNovela CRT Player (*"La Oveja Negra"* & Drama Clips)**
   - Retro CRT television & VHS player where Cecilia and Alejandra watch episodes of *La oveja negra* and neighborhood drama scenes play out with animated character portraits, dramatic Web Audio synth stings, and synchronized dual ES/EN subtitles.
   - **"Modo Director" (Interactive Script Mode)**: Key verbs or object pronouns (`me lo dice`, `se la compró`, preterite vs. imperfect, subjunctive triggers) pause the scene and challenge the user to pick the right line so the episode can continue!

5. **💘 `Cupido.exe` — CupidoDigital & Clasificados '98 (Dating & Real Estate Sim)**
   - Two hilarious neighborhood portals straight from the books:
     - **Corazones de Villa Celeste**: Help **Andrés Murillo** (unemployed biologist) and **Julia Rivera** navigate blind dates and profiles using `gustar`, `ser` vs `estar`, preterite/imperfect past stories, and subjunctive clauses (*"Busco una pareja que sepa cocinar y no tenga gatos"*).
     - **Inmobiliaria Villa Celeste**: Help divorced dentist **Alberto** inspect houses (rooms, furniture, comparisons of inequality/superlatives from B1-L20, L24–26) without triggering his carpet allergy!

6. **⚡ `Conjugator.exe` — Conjugator 2000 (Retro Verb & Grammar Arcade)**
   - High-octane retro arcade mini-games:
     - **Verb Invaders / Defensor de Verbos**: Conjugate verbs against the clock across selectable tenses (Present Regular, Stem-Changing `e→ie`/`o→ue`/`e→i`, Ir/Ser/Estar/Tener, Preterite, Imperfect, Preterite vs. Imperfect, Formal/Informal Commands, Present Perfect, Future, Conditional, Present/Imperfect Subjunctive).
     - **Duelo de Por vs. Para & Ser vs. Estar**: Rapid-fire context sentences from the books with instant rule explanations.

7. **🗂️ `Glosario98.hlp` — WinHelp '98 Dictionary, Grammar Encyclopedia & SRS Deck**
   - Styled like a classic yellow-and-green Windows `.HLP` hypertext reference manual.
   - **4 Searchable Dictionary Views**: By Topic (*Glosario por tema*), Cognates (*Glosario de cognados* — great for instant confidence!), Spanish→English, English→Spanish.
   - **Master Grammar Reference**: Quick-reference conjugation matrices and rule summaries across Book 1 and Book 2.
   - **Built-in SM-2 Spaced Repetition Flashcard Engine**: Reviews due cards daily with Easy / Good / Hard / Again ratings persisted in `localStorage`.

8. **🕵️ `Detective.exe` — Mapa y Expedientes de Villa Celeste (Interactive Neighborhood Map & Corkboard)**
   - Visual map of Villa Celeste (Casa Cortés, Casa Quirós, Casa González, Clínica del Dr. Esteban, Agencia de Viajes de Luis, Colegio Miguel de Cervantes, Casa Valenzuela, Casa Espinoza) + red-string detective corkboard showing all 20+ canonical characters, their biographies in Spanish, family ties, and unlocked story secrets.

9. **🎙️ `Fonética.exe` — Grabadora de Voz '98 (Speaking & Pronunciation Studio)**
   - Built around the textbooks' **`Speaking Activities`** sections (`textbooks/extracted/book1/speaking_activities.txt` & `book2/speaking_activities.txt`) plus pronunciation guides (rolled `rr`, unaspirated `p/t/k`, `b/v`, `ce/ci/z`, diphthongs).
   - Displays prompt + model audio via TTS + microphone recording / speech-to-text comparison (with click-to-reveal transcript and self-grading fallback if microphone permission isn't granted).

10. **⚙️ `Control.exe` — Panel de Control, Logros y Estadísticas**
    - Switch desktop themes (Windows 98 Classic Teal, Madrid '98 Sunset, Vaporwave Cibercafé, High-Contrast Paper Study Mode).
    - CRT scanline & retro sound synthesizer volume controls.
    - Achievement Badges (*"Vecino Nuevo"*, *"Sobreviviente de la Fiesta de Felipe"*, *"Fanático de La Oveja Negra"*, *"Casamentero de Andrés"*, *"Maestro del Subjuntivo"*).
    - **Study Progress Dashboard** + **JSON Save Import / Export / Reset** + **"Unlock All Lessons" Sandbox Toggle** (so any reviewer can test Lesson 60 immediately!).

---

## 5. Data Architecture & How to Compile All 60 Lessons cleanly

> **NON-NEGOTIABLE QUALITY RULE**:
> Do **NOT** hardcode only 2 or 3 sample lessons and leave the other 57 lessons as "Coming Soon" placeholders!
> All 60 lessons exist right now in `textbooks/extracted/book1/lesson_01.txt`..`lesson_30.txt` and `textbooks/extracted/book2/lesson_01.txt`..`lesson_30.txt`.
> Use **automated Python/Node scripts + parallel Claude subagents** to compile all 60 lessons into structured TypeScript/JSON files!

### Recommended Hybrid Strategy (Fastest, Cheapest, 100% Complete)

1. **Step 1A — Deterministic Parser Script (`scripts/compile_curriculum.py`)**:
   Write a smart Python parser script FIRST that parses all 60 `textbooks/extracted/book{1,2}/lesson_XX.txt` files into structured JSON (`src/data/generated/lessons_raw.json`) by splitting on the standard textbook section headers:
   - `I. Vocabulario nuevo / New Vocabulary` → extracts Spanish–English pairs (`spanish`, `english`, `category`).
   - `II. Repaso general / General Review` → extracts grammar subheadings (`A. ...`, `B. ...`) and explanation paragraphs/tables.
   - `III. Actividades / Activities` → extracts exercises (`a.`, `b.`, `c.`, `d.`), prompts, and items.
   - `IV. Lectura cultural / Cultural Reading` (when present) → extracts reading text and questions.
   - `IV. Respuestas correctas / Correct Answers` (or `V. Respuestas correctas`) → extracts the exact answer keys for each activity!
   - Also parse `glossary_by_topic.txt` and `glossary_of_cognates.txt` into `src/data/generated/glossary.json`, and `speaking_activities.txt` into `src/data/generated/speaking.json`.

2. **Step 1B — Subagent Enrichment Waves**:
   Once the Python script gives you 100% coverage of all 60 lessons' vocabulary, grammar notes, activities, readings, and answer keys in seconds (for almost $0 in tokens!), dispatch **parallel subagents** to create rich interactive quizzes, bilingual grammar summaries, neighborhood chat scripts (`ChismeNet`), emails (`Correo`), and telenovela episodes (`LaOvejaNegra`) mapped across the 60 lessons!

### Core TypeScript Schema (`src/types/curriculum.ts`)
```ts
export interface VocabItem {
  id: string;
  es: string;
  en: string;
  category?: string;
  notes?: string; // e.g. "e -> ie", "masc. noun"
}

export interface GrammarSection {
  id: string;
  title: string;
  content: string; // Markdown / structured text
  tables?: Array<{ headers: string[]; rows: string[][] }>;
  keyTakeaways?: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  instructionsEs: string;
  instructionsEn: string;
  type: 'fill-blank' | 'multiple-choice' | 'true-false' | 'qa' | 'dialogue' | 'workbook-text';
  storyContext?: string; // e.g. "Felipe's messy house after the party"
  questions?: Array<{
    id: string;
    prompt: string;
    options?: string[];
    answer: string;
     acceptableAnswers?: string[];
    explanation?: string;
  }>;
  rawText?: string;
  rawAnswerKey?: string;
}

export interface CulturalReading {
  title: string;
  textEs: string;
  textEnSummary?: string;
  questions: Array<{
    prompt: string;
    answer: string;
    explanation?: string;
  }>;
}

export interface LessonData {
  id: string;            // "B1-L01" .. "B1-L30", "B2-L01" .. "B2-L30"
  book: 1 | 2;
  lessonNumber: number;  // 1 .. 30
  globalIndex: number;   // 1 .. 60
  title: string;
  cefrLevel: 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1' | 'B1+';
  neighborhoodFocus: string[]; // Characters featured in this lesson
  vocabulary: VocabItem[];
  grammar: GrammarSection[];
  activities: ActivityItem[];
  culturalReading?: CulturalReading;
  speakingPrompt?: {
    title: string;
    scenario: string;
    modelDialogueEs: string;
    modelDialogueEn: string;
  };
}
```

---

## 6. How to Spend the $40 Credit Budget Wisely (Phased Execution Plan)

To maximize output quality while ensuring the project never breaks if credits run out early, execute in **4 strict phases** with a `git commit` + `npm run build` check at the end of every phase.

### Phase 1: Project Scaffolding & Automated 60-Lesson Data Compiler (~$4–$6 Budget)
1. Initialize Vite + React + TypeScript + Tailwind CSS (`npm install lucide-react canvas-confetti` etc.).
2. Write and run `scripts/compile_curriculum.py` to deterministically extract **all 60 lessons** (`textbooks/extracted/book1/lesson_01.txt`..`30.txt` and `book2/lesson_01.txt`..`30.txt`), plus glossaries and speaking activities, into `src/data/generated/`.
3. Verify that all 60 lessons have vocabulary, grammar sections, activities, and answer keys populated.
4. **Checkpoint 1**: Run `npm run build` and `git commit -m "feat(data): scaffold project and compile all 60 textbook lessons"`.

### Phase 2: Retro OS Shell + Core Learning Workstation (`Academia.exe` & `Glosario98.hlp`) (~$8–$10 Budget)
1. Build the **Villa Celeste OS '98 Desktop Shell**:
   - Draggable/resizable multi-window manager (`WindowFrame.tsx`), Desktop icons, Start Menu (`❖ Inicio`), Taskbar, System Tray, CRT Scanline filter, Theme switcher, and Web Audio API retro sound synthesizer (`src/utils/sound.ts`) + Spanish TTS helper (`src/utils/tts.ts`).
2. Build **`Academia.exe`** (60-Lesson Curriculum Hub):
   - Full sidebar navigation for Book 1 (L1–30) and Book 2 (L1–30).
   - Interactive flashcards/list for `Vocabulario nuevo` with TTS & SRS bookmarking.
   - Formatted `Repaso general` grammar viewer with interactive conjugation tables.
   - Interactive `Actividades` solver (auto-converting fill-in-the-blanks, Cierto/Falso, and multiple choice into clickable/typable interactive widgets, plus expandable full workbook text & answer key so zero textbook content is ever lost!).
   - `Lectura cultural` & `Speaking Activity` tab.
3. Build **`Glosario98.hlp`** (Searchable Dictionary, Cognates, Grammar Reference & SM-2 Spaced Repetition Flashcard Engine).
4. **Checkpoint 2 (MVP Guaranteed!)**: Run `npm run build` and commit. *At this point (~$14 spent), the user already has a 100% functional, 60-lesson Spanish OS!*

### Phase 3: Parallel Subagent Wave — Neighborhood Immersion Apps (~$16–$18 Budget)
Use Claude Code's **`Task` / Subagent tool in parallel** to build independent apps and rich story content datasets without polluting the main context window:
- **Subagent A (`ChismeNet.exe` + Chat Scripts)**: Build the 90s ICQ/MSN Messenger app + 20 branching neighborhood chat episodes across Book 1 & Book 2 characters (Marisol, Diego & Ema, Alberto & Cecilia, Felipe, Javier & Erica, Álvaro, Julia, Andrés & José).
- **Subagent B (`Correo.exe` + Neighborhood Inbox)**: Build the Outlook Express '98 email client + 25 rich Spanish emails/clinic reports/travel itineraries/cultural letters with interactive reading comprehension questions.
- **Subagent C (`LaOvejaNegra.exe` + `Cupido.exe`)**: Build the CRT Telenovela Player (*La oveja negra* episodes with interactive "Director's Cut" grammar challenges) AND the CupidoDigital / Inmobiliaria simulator (Andrés's blind dates + Alberto's allergic house-hunting).
- **Subagent D (`Conjugator.exe` + `Detective.exe` + `Fonética.exe`)**: Build the retro verb conjugation arcade mini-game (covering all tenses from L1 to L60), the interactive Villa Celeste neighborhood map & family tree corkboard, and the Sound Recorder '98 speaking studio.
- Integrate all apps into the Desktop App Registry (`src/config/apps.ts`) and run `npm run build` + `git commit`.

### Phase 4: Gamification, Polish, Guided Tour & Final Verification (~$4–$6 Budget)
1. Build **`Control.exe`** (Themes, Sound/CRT toggles, Achievements, Study Stats, JSON Save Import/Export, "Unlock All" sandbox mode).
2. Add a nostalgic **Windows 98 Boot Screen ("Villa Celeste BIOS v1.98")** on first load (with an instant "Skip Boot" button) and a **"Welcome Tour / Guía de Inicio" (`Bienvenido.txt` in Notepad '98)** open by default so new visitors immediately understand how to play and learn.
3. Add **Global Word Lookup** (double-click any Spanish word in any window to hear TTS pronunciation, see English translation from the 5,000-word glossary, and save to SRS).
4. Run full TypeScript check (`tsc -b`), production build (`npm run build`), and push to `origin`.

---

## 7. Credit Exhaustion & Graceful Degradation Protocol ("What to Do When Credits Run Low")

Because the user is burning a fixed **$40 cloud credit balance**, you MUST protect the repository against sudden credit exhaustion at all times:

1. **The "Always-Shippable" Rule**:
   - Never leave half-written files or broken imports across steps.
   - Register desktop apps via a central registry (`src/config/apps.ts`). If an app isn't built yet, either hide it or render a clean retro `"Instalando módulo desde CD-ROM..."` modal rather than crashing.
   - Commit and push after **every completed feature or phase** (`git add -A && git commit -m "..." && git push`).

2. **Token Hygiene Rules (Don't Waste Credits!)**:
   - **Never read `textbooks/raw_pdfs/*.pdf`** — they are binary PDFs and will burn huge context or fail.
   - **Never cat all 60 `.txt` lesson files into your main conversation context at once!** Write a Python script (`scripts/compile_curriculum.py`) to parse all 60 `.txt` files into structured JSON in 2 seconds for $0.05 of tokens, and only inspect individual lesson `.txt` files when verifying or delegating to subagents.
   - When spawning subagents (`Task`), give each subagent a self-contained file path to write to (e.g. `src/apps/ChismeNet/ChismeNetApp.tsx` and `src/data/chismenetEpisodes.ts`) so subagents don't conflict on the same file.

3. **Emergency Wrap-Up Protocol (When ~$3–$4 Remains or User Signals Low Credit)**:
   If you notice you are in the final stretch or the user sends the wrap-up command:
   1. Immediately stop starting new experimental features.
   2. Wire up all completed components in `src/App.tsx`.
   3. Run `npm run build` and fix any TypeScript or bundler errors until `dist/` compiles with 0 errors.
   4. Configure `vite.config.ts` with `base: './'` so static deployment works anywhere (GitHub Pages / Vercel / local preview).
   5. Commit and push everything to GitHub (`git push origin main`).
   6. Update `PROGRESS.md` summarizing what is complete and how to run/deploy.
