# ⌨️ FFmpeg Typing Animator

**FFmpeg Typing Animator** is a CLI tool that creates realistic terminal-style typing effect videos —  
complete with synchronized key click sounds, smooth `.ass` subtitle animation,  
and a **green chroma background** ready for compositing in post-production 🎬

Perfect for:
- 🎥 YouTube intros and developer reels
- 🧑‍💻 Coding tutorials and explainer videos
- 💻 Hacker-style aesthetics and tech visuals

---

## 🚀 Demo

![Demo](assets/demo.gif)

---

## ✨ Features

- 🎬 Generates typing-effect videos
- 🔊 Synchronizes key click sounds
- 📝 Uses `.ass` subtitles for smooth text animation
- ⚡️ Fast rendering via FFmpeg
- 🧩 Fully configurable (speed, font, colors, etc.)
- 🪶 No dependencies — only Node.js + FFmpeg

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/ffmpeg-typing-animator.git
cd ffmpeg-typing-animator
npm install
```

---

## 🧰 Requirements

- **Node.js** ≥ 18
- **FFmpeg** ≥ 6.0 (with `libass`, `aac`, `libx264` support)

Check your FFmpeg installation:

```bash
ffmpeg -version
```

---

## ⚙️ Usage

```bash
npm run overlay -- "npm run 'Hello World'"

```
Just replace the quoted string with the text you want to animate:

```bash
npm run overlay -- "git commit -m 'Initial release'"
npm run overlay -- "Welcome to my channel!"
```



This will generate:

- `out/overlay.ass` — the animated subtitles  
- `out/schedule.json` — typing schedule  
- `out/overlay.mp4` — final rendered video

---

## 🧩 Project Structure

```
.
├── assets/            # Sounds and fonts
├── src/
│   ├── schedule.mjs          # Builds typing schedule
│   ├── writeAss.mjs          # Writes .ass subtitles
│   └── buildFfmpegArgs.mjs   # Builds FFmpeg args
├── cli.mjs             # Main CLI entry point
├── out/                # Output files
├── package.json
└── README.md
```

---

## ⚙️ Configuration

Edit config inside `cli.mjs`:

```js
const cfg = {
  width: 600,
  height: 120,
  fps: 60,
  bg: '0x00FF00', // chroma key background
  fontPath: 'assets/fonts/JetBrainsMono-Regular.ttf',
  fontName: 'JetBrains Mono',
  fontSize: 64,
  clickFiles: ['click1.wav', 'click2.wav'],
  clickVolume: 0.35,
  perCharMin: 0.02,
  perCharMax: 0.25,
  punctBoost: 0.5,
  leadingPrompt: '$ '
}
```

---

## 🧠 How It Works

1. **`buildSchedule()`** — creates a character-by-character timing schedule.  
2. **`writeAss()`** — generates the `.ass` subtitle file with progressive text reveal.  
3. **`buildFfmpegArgs()`** — builds FFmpeg’s complex filter graph (`color + subtitles + audio mix`).  
4. **FFmpeg** — renders the final video.

---

## 🧑‍💻 Example

```bash
npm run overlay -- "echo Hello, World!"
```

🎞 Output: `out/overlay.mp4` — green chroma background, white typing text, click sounds.

---

## 👩‍💻 Author

**Riabinin Pavel**  
GitHub: [RPG812](https://github.com/RPG812)

---

## 🪪 License

[MIT](LICENSE)

---

## ⭐️ Support

If you like it, give it a ⭐️ on GitHub and share your feedback!
