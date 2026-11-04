# 🖥️ Villa Celeste OS '98 — Retro Spanish Immersion Desktop

[中文说明](README.zh-CN.md) · **Play online:** https://nowhereman-in-galaxy.github.io/villa-celeste-os/

> **An interactive Windows 98 / Classic Desktop Operating System & Neighborhood Detective RPG for mastering Spanish (A1 → B2, 60 Lessons).**

Welcome to **Villa Celeste OS '98**. Instead of grinding through static textbook PDFs, boot into a nostalgic late-90s computer terminal connected to the neighborhood intranet of **Villa Celeste**. Explore the emails, chat rooms, clinic files, travel agency bookings, telenovela episodes (*La oveja negra*), and dating profiles of five interconnected Latin American families across **60 complete lessons** (Part I: Lessons 1–30 & Part II: Lessons 1–30).

---

## ✨ Core Features & Built-in Desktop Apps

- **📖 `Academia.exe` (60-Lesson Curriculum Hub)** — Complete coverage of Book 1 (Lessons 1–30) and Book 2 (Lessons 1–30): interactive vocabulary decks with Spanish TTS, grammar deep-dives (*Repaso general*), and graded story exercises (*Actividades*) with instant explanations.
- **💬 `ChismeNet.exe` (90s Instant Messenger)** — Chat in Spanish with Marisol, Diego, Alberto, Julia, and Andrés. Includes interactive dialogue trees, *Speaking Activities* roleplay, and hover-to-lookup word tooltips.
- **📧 `Correo.exe` (Outlook Express '98 Inbox)** — Read neighborhood emails, Dr. Esteban Quirós's medical notes, Luis Cortés's travel itineraries, and cultural dispatches (*Lectura cultural*) with reading comprehension quests.
- **📺 `LaOvejaNegra.exe` (CRT Telenovela Player)** — Tune into Cecilia and Alejandra's favorite soap opera *La oveja negra* with dual ES/EN subtitles, grammar freeze-frames, and interactive script-completion challenges.
- **💘 `Cupido.exe` (Villa Celeste Dating & Classifieds)** — Help unemployed biologist Andrés Murillo survive his disastrous blind dates and help divorced dentist Alberto find a new house without dusty carpets.
- **⚡ `Conjugator.exe` (Retro Verb Arcade)** — High-score arcade drills for Present, Preterite, Imperfect, Subjunctive, Commands, and *Por vs. Para*.
- **🗂️ `Glosario98.hlp` (Hypertext Dictionary & SRS Flashcards)** — Searchable glossary (by Topic, Cognates, ES↔EN) with built-in SM-2 Spaced Repetition review.
- **🕵️ `Detective.exe` (Neighborhood Map & Family Tree Corkboard)** — Interactive map and relationship graph of the Cortés Ruiz, Quirós García, González Fallas, Valenzuela Palacios, and Espinoza Palma families.

---

## 🚀 Quick Start (For AI Agent / Claude Code)

Read **[`CLAUDE.md`](./CLAUDE.md)** for the complete technical specification, lore bible, 60-lesson data compilation pipeline, $40 credit budget strategy, and graceful degradation protocol.

Read **[`PROMPT_FOR_CLAUDE.md`](./PROMPT_FOR_CLAUDE.md)** for ready-to-paste prompts to kick off and steer the AI agent.

---

## 🔒 Switching from Private to Public Repository

While developing in private mode, pre-extracted plain-text lesson files live in `textbooks/extracted/` so cloud AI agents can compile the 60 lessons into structured app data (`src/data/`) without parsing raw PDFs.

Before switching this GitHub repository from **Private** to **Public**, run:

```bash
bash scripts/prepare-for-public.sh
```

This removes `textbooks/` and rewrites a clean public branch containing only application code and compiled learning modules.
