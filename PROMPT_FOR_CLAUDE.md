# 🚀 给有 $40 额度的 Claude 的直接指令包 (`PROMPT_FOR_CLAUDE.md`)

这份文档包含了你直接复制粘贴给 Claude（无论是 **Claude Code Web 云端版**、**Claude Code CLI** 还是其他挂载了该仓库的 Claude Agent）的**三段式指令**，以及**额度消耗预估与应对策略**。

---

## 📊 $40 额度燃烧预估表（Token Budget Breakdown）

仓库里已经为你提前把两本厚教材（共 **611 页、60 课**）用 `pdftotext` + Python 切分成了干净的纯文本文件（位于 `textbooks/extracted/book1/` 和 `book2/`），**为你省下了至少 $15–$20 的 PDF 解析与 OCR Token 消耗**！因此你的 $40 可以 100% 花在**高密度的前端交互、复古桌面 OS 细节和 60 课游戏化内容**上：

| 阶段 | 核心任务 | 预估消耗额度 | 累计消耗 | 阶段保底产出（随时停下都能跑） |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 1**<br>脚手架与全量教材编译 | 初始化 React+TS+Vite+Tailwind；写 Python 脚本把 `textbooks/extracted/` 下全部 **60 课**（词汇、语法、练习、答案、文化阅读、口语、词典）编译成结构化 JSON/TS 数据 | **$3 – $5** | ~$5 | 60 课完整题库、词库、语法库 100% 入库，零占位符 |
| **Phase 2**<br>复古 OS 内核 + 核心学习器 | 搭建 **Villa Celeste OS '98** 桌面（多窗口拖拽/缩放、开始菜单、任务栏、CRT 滤镜、Web Audio 98 音效合成器、西语 TTS 发音）+ **`Academia.exe`（60 课学习工作站）** + **`Glosario98.hlp`（词典与 SM-2 记忆卡片）** | **$8 – $10** | ~$15 | **核心可用版完成！** 完整的 60 课学习 OS，随时可打包部署 |
| **Phase 3**<br>并发 Subagents 建造 7 大社区应用 | 开启 **4 个并行 Subagents** 同时开发：<br>1. `ChismeNet.exe`（90年代聊天室 + 20 幕邻居剧情对话）<br>2. `Correo.exe`（Outlook '98 邮件阅读器 + 25 封邻居信件与阅读理解）<br>3. `LaOvejaNegra.exe`（狗血剧播放器）+ `Cupido.exe`（Andrés 相亲记 & Alberto 看房记）<br>4. `Conjugator.exe`（动词变位街机）+ `Detective.exe`（社区地图与人物关系板）+ `Fonética.exe`（口语录音室） | **$16 – $19** | ~$34 | 10 个内置复古桌面 App 全部跑通，教材五大家族宇宙完全活过来 |
| **Phase 4**<br>深度精修、彩蛋与打包部署 | 开机 BIOS 动画、全局双击西语单词查词发音、`Control.exe`（主题切换/存档导入导出/全解锁模式）、GitHub Pages 自动部署配置、全量构建检查 | **$4 – $6** | ~$40 | 工业级作品集水准，零报错 `npm run build` |

---

## 📋 指令一：开局总指令（直接复制发给 Claude 启动全自动开发）

> 💡 **使用方法**：打开你的 Claude 云端环境并连接本仓库后，把下面整个代码块复制发送给它即可。

```text
Please read `CLAUDE.md` and `textbooks/extracted/MANIFEST.json` first.

I have ~$40 of cloud credits expiring tomorrow and I want you to go all-out building **Villa Celeste OS '98** — the retro Windows 98 / Classic Desktop Spanish Immersion OS & Neighborhood Detective RPG described in `CLAUDE.md`.

### Critical Execution Rules:
1. **Do NOT read `textbooks/raw_pdfs/*.pdf`**. All 60 lessons and glossaries from both textbooks are already pre-extracted as clean plain text in `textbooks/extracted/book1/` and `textbooks/extracted/book2/`.
2. **Execute Phases 1 → 2 → 3 → 4 autonomously and thoroughly**:
   - In **Phase 1**, write and run `scripts/compile_curriculum.py` to parse ALL 60 lessons (Book 1 Lessons 1–30 and Book 2 Lessons 1–30), including their Vocabulary (`I. Vocabulario nuevo`), Grammar (`II. Repaso general`), Activities (`III. Actividades`), Cultural Readings (`IV. Lectura cultural`), Correct Answers (`Respuestas correctas`), Speaking Activities, and Glossaries into structured JSON/TypeScript under `src/data/generated/`. Every single one of the 60 lessons must be genuinely populated!
   - In **Phase 2**, build the complete **Villa Celeste OS '98** desktop window manager, Web Audio API retro sound synthesizer, Spanish TTS utility, `Academia.exe` (60-lesson workstation with interactive exercise graders), and `Glosario98.hlp` (searchable dictionary + SM-2 spaced repetition flashcards). Verify `npm run build`, commit, and push.
   - In **Phase 3**, use **parallel subagents (`Task` tool)** to simultaneously build the rich neighborhood immersion apps and story datasets (`ChismeNet.exe`, `Correo.exe`, `LaOvejaNegra.exe`, `Cupido.exe`, `Conjugator.exe`, `Detective.exe`, `Fonética.exe`, and `Control.exe`) faithful to the canonical textbook characters (Cortés Ruiz, Quirós García, González Fallas, Valenzuela Palacios, Espinoza Palma, Julia, and Andrés).
   - In **Phase 4**, add the retro BIOS boot screen, global word lookup tooltip, `Bienvenido.txt` starter guide window, theme switcher, and GitHub Pages workflow.
3. **Always-Shippable Checkpoint Rule**: After completing each phase (or major app), run `npm run build` to verify 0 TypeScript/bundle errors, then `git add -A && git commit && git push` so the repository is ALWAYS in a working, deployable state even if my credits run out mid-turn.

Start Phase 1 now and keep going through Phase 4 without waiting for my confirmation between phases!
```

---

## 🔥 指令二：如果 Claude 提前做完但你还有剩余额度（“继续狂烧额度”指令）

如果 Claude 动作很快，花完 $20–$25 就把 4 个阶段都跑通了，而你还剩 $10–$15 额度想继续榨干，复制下面这段发给它：

```text
Great job! I still have cloud credits left to burn before tomorrow. Let's make Villa Celeste OS '98 even deeper and more polished!

Please launch parallel subagents to upgrade the following (and commit + push after each passes `npm run build`):

1. **Deep Interactive Exercise Parser Upgrade**: Inspect `src/data/generated/` across all 60 lessons and enrich the interactive workbook questions (`Actividades`) so that every lesson has at least 15–20 auto-graded interactive prompts (fill-in-the-blank with accent mark helper buttons `á é í ó ú ñ ¿ ¡`, multiple choice, sentence reordering, and dialogue completion) with detailed grammar explanations referencing that lesson's `Repaso general`.
2. **Expand Story Content (`ChismeNet.exe`, `Correo.exe`, `LaOvejaNegra.exe`)**:
   - Add more interactive chat episodes in `ChismeNet.exe` covering key grammar milestones (e.g., Preterite vs. Imperfect in Book 2 Lessons 5–8, Subjunctive in Book 2 Lessons 20–30, Commands with Dr. Esteban Quirós in Book 1 Lesson 24–25).
   - Add 10 full interactive episodes of Cecilia and Alejandra's favorite telenovela *"La oveja negra"* in `LaOvejaNegra.exe` with dramatic plot twists, ASCII/SVG pixel scene illustrations, and "Modo Director" script completion challenges.
3. **Retro OS Polish & Mini-Extras**:
   - Add a Spanish on-screen virtual keyboard bar (`á`, `é`, `í`, `ó`, `ú`, `ü`, `ñ`, `¿`, `¡`) inside every input field so users on English keyboards can type accents effortlessly.
   - Add a `Buscaminas Léxico` (Spanish Vocab Minesweeper / Wordle '98) bonus mini-game on the desktop.
   - Ensure `npm run build` succeeds with 0 errors and push to GitHub.
```

---

## 🛟 指令三：当额度快见底时（剩 $2–$4 时的“紧急安全收尾”指令）

当你看到额度只剩最后 **$2–$4** 时，立即发下面这段话，让它做最后的收尾和部署检查：

```text
STOP starting any new features — my credits are almost exhausted (only ~$2–3 left).
Execute the **Emergency Wrap-Up Protocol** from `CLAUDE.md` right now:
1. Wire up all completed apps cleanly in the desktop shell and hide or gracefully stub anything unfinished.
2. Run `npm run build` and fix ALL TypeScript or Vite build errors until `dist/` builds cleanly with exit code 0.
3. Ensure `vite.config.ts` uses `base: './'` and add a `.github/workflows/deploy.yml` for GitHub Pages static deployment.
4. Update `README.md` with screenshots/feature overview and local run instructions (`npm install && npm run dev`).
5. Run `git status`, commit everything, and `git push origin main`.
```

---

## 💡 如果额度突然归零（$0.00 断电）怎么办？

完全不用担心！因为我们在 `CLAUDE.md` 中强制要求了 **“每完成一个小阶段必须跑通 `npm run build` 并 `git commit && git push`”**：

1. **情况 A：断电时正好在两次 Commit 之间，工作区有一半没写完的文件**
   - 你只需要在本地终端进入项目目录，运行：
     ```bash
     git status
     # 如果看到未完成的报错修改，一键回退到上一个 100% 能编译通过的节点：
     git checkout . && git clean -fd
     npm run build
     ```
2. **情况 B：后续想把仓库从 Private（私密）改成 Public（公开）并部署到 GitHub Pages**
   - 在去 GitHub Settings 将仓库改为 Public 之前，先在本地运行我为你准备好的脱敏脚本：
     ```bash
     bash scripts/prepare-for-public.sh
     ```
   - 这个脚本会自动删掉 `textbooks/` 原始教材提取目录（此时课程数据已经转化为 `src/data/` 下的前端代码了），并重写一个干净无版权教材原文件的 `main` 分支推送到 GitHub，然后你就可以放心地在 GitHub 仓库 `Settings -> Change visibility -> Make public` 公开展示了！
