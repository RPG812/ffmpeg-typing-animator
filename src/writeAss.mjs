import { writeFile } from 'node:fs/promises'

/**
 * Generate an .ass subtitles file with progressive text reveal.
 * Each char gets its own event from previous timestamp to next timestamp.
 */
export async function writeAss({ outPath, schedule, width, height, fontName = 'JetBrains Mono', fontSize = 42, marginL = 80, marginV = 40, color = '&H00FFFFFF' }) {
  // ASS header + styles
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: ${width}
PlayResY: ${height}
Timer: 100.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Overlay,${fontName},${fontSize},${color},&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,1.8,0,7,${marginL},20,${marginV},0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`

  // helper: seconds -> h:mm:ss.cs
  const ts = s => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const cs = Math.round((sec - Math.floor(sec)) * 100)
    const ss = String(Math.floor(sec)).padStart(2, '0')

    return `${h}:${String(m).padStart(2,'0')}:${ss}.${String(cs).padStart(2,'0')}`
  }

  const full = schedule.leadingPrompt + schedule.text
  const items = schedule.items

  if (!items.length) {
    const line = `{\\bord1\\blur0.4}${escapeAss(full)}`
    const ev = `Dialogue: 0,${ts(0)},${ts(1)},Overlay,,0000,0000,0000,,${line}\n`
    await writeFile(outPath, header + ev, 'utf8')
    return
  }

  let body = ''
  let prev = 0

  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const visible = full.slice(0, it.index + 1)
    const txt = `{\\bord1\\blur0.4}${escapeAss(visible)}{\\alpha&H60&}_`
    const start = prev
    const end = it.at
    const endFixed = end > start ? end : start + 0.02

    body += `Dialogue: 0,${ts(start)},${ts(endFixed)},Overlay,,0000,0000,0000,,${txt}\n`
    prev = it.at
  }

  body += `Dialogue: 0,${ts(prev)},${ts(prev + 0.6)},Overlay,,0000,0000,0000,,{\\bord1\\blur0.4}${escapeAss(full)}\n`

  await writeFile(outPath, header + body, 'utf8')
}

function escapeAss(s) {
  return s.replace(/\\/g, '\\\\').replace(/{/g, '\\{').replace(/}/g, '\\}')
}
