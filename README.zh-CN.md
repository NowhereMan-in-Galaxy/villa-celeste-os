# 🖥️ Villa Celeste OS '98 —— 复古 Windows 98 西班牙语沉浸式桌面

[English](README.md) | 中文

**在线试玩：** https://nowhereman-in-galaxy.github.io/villa-celeste-os/

开机后你会进入一台 1998 年的电脑，它连接着拉美小区 **Villa Celeste** 的社区内网。五个家庭的邮件、聊天记录、诊所病历、旅行社行程、电视剧《La oveja negra》和相亲资料都藏在里面，而解锁它们的方法就是学西班牙语。内容来自两本教材，共 **60 课**，从 A1 一直到 B1+。

## 怎么玩

1. 双击桌面图标打开程序（手机上单击）。第一次进入会自动打开 `Bienvenido.txt` 新手指南。
2. **在任何窗口里双击一个西班牙语单词**：显示英文释义、朗读发音，还能一键加入记忆卡片。
3. 🔊 按钮朗读西语；在 🔊 上**右键**是慢速（0.75x）。
4. 答对题目获得 XP，等级从 A1 一路升到 B2，并解锁成就。
5. 进度自动保存在浏览器里；在「控制面板」里可以导出/导入存档，也可以开启「解锁全部课程」。

## 内置程序

| 程序 | 内容 |
|---|---|
| 📖 `Academia.exe` | 60 课完整课程：词汇（朗读 + 闪卡）、语法、练习题自动批改（对照课本答案，口音错误会提示）、文化阅读、口语任务 |
| 🗂️ `Glosario98.hlp` | 按主题 / 同源词 / 西→英 / 英→西 查词，两本书的语法速查表，SM-2 间隔重复记忆卡片 |
| 💬 `ChismeNet.exe` | 90 年代即时通讯：16 段邻居八卦聊天，选对语法正确的回复来提升好感 |
| 📧 `Correo.exe` | Outlook 风格邮箱：22 封邮件（医生医嘱、旅行社机票、学校通知……）附阅读理解题 |
| 📺 `LaOvejaNegra.exe` | CRT 电视播放肥皂剧，西英双字幕；「导演模式」中要选对台词剧情才能继续 |
| 💘 `Cupido.exe` | 帮失业生物学家 Andrés 相亲，帮对地毯过敏的牙医 Alberto 买房 |
| ⚡ `Conjugator.exe` | 街机动词变位游戏 + por/para、ser/estar 快问快答 |
| 🕵️ `Detective.exe` | 小区地图 + 人物关系软木板，XP 越高能解锁的秘密越多 |
| 🎙️ `Fonética.exe` | 发音练习：语音识别打分（不支持时可录音自评） |
| ⚙️ `Control.exe` | 主题、CRT 滤镜、音量、语速、成就、学习统计、存档管理 |

> 语音朗读和语音识别依赖浏览器。推荐使用 Chrome / Edge；系统里需要装有西班牙语语音。

## 本地运行

```bash
npm install
npm run dev
```

其他命令：`npm run build` 生成静态网站到 `dist/`（可部署到任何静态托管）；`npm run data` 从 `textbooks/extracted/` 重新编译课程数据。

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 `gh-pages` 分支。如果网页没有出现，到仓库 **Settings → Pages**，把 Source 设为 `gh-pages` 分支的根目录即可。

## 技术栈

React 18 + TypeScript + Vite + Tailwind + Zustand。音效全部由 Web Audio API 实时合成，没有音频文件；朗读使用浏览器自带的 `speechSynthesis`，不需要任何后端。
