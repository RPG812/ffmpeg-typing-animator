import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buildSchedule } from './src/schedule.mjs'
import { buildFfmpegArgs } from './src/buildFfmpegArgs.mjs'
import { writeAss } from './src/writeAss.mjs'

async function main() {
  const raw = process.argv.slice(2).join(' ').trim()

  if (!raw) {
    console.log('Usage: npm run overlay -- "your command text"')
    process.exit(1)
  }

  const cfg = {
    // video
    width: 600,
    height: 120,
    fps: 60,
    bg: '0x00FF00',
    fontPath: path.resolve('assets/fonts/JetBrainsMono-Regular.ttf'),
    fontName: 'JetBrains Mono',
    fontSize: 64,
    paddingX: 80,
    baselineY: 130,
    textColor: 'white',

    // typing
    perCharMin: 0.02,
    perCharMax: 0.25,
    punctBoost: 0.5,
    leadingPrompt: '$ ',

    // audio
    soundDir: path.resolve('assets/sounds'),
    clickFiles: ['click1.wav','click2.wav','click3.wav','click4.wav','click5.wav'],
    clickVolume: 0.35
  }

  await mkdir('out', { recursive: true })

  // build schedule
  const schedule = buildSchedule({
    text: raw,
    perCharMin: cfg.perCharMin,
    perCharMax: cfg.perCharMax,
    punctBoost: cfg.punctBoost,
    leadingPrompt: cfg.leadingPrompt
  })
  await writeFile('out/schedule.json', JSON.stringify(schedule, null, 2), 'utf8')

  // write ASS
  const assPath = path.resolve('out/overlay.ass')
  await writeAss({
    outPath: assPath,
    schedule,
    width: cfg.width,
    height: cfg.height,
    fontName: cfg.fontName,
    fontSize: 42,
    marginL: cfg.paddingX,
    marginV: 40,
    color: '&H00FFFFFF'
  })

  // build ffmpeg args (subtitles + clicks)
  const outFile = path.resolve('out/overlay.mp4')
  const args = buildFfmpegArgs({ cfg, schedule, assPath, outFile })

  console.log('FFMPEG ARGS:\n', args.join(' '))


  await new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args, { stdio: 'inherit' })
    ff.on('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg failed with code ' + code)))
  })

  console.log('Done:', outFile)
}

main('new text').catch(err => {
  console.error(err)
  process.exit(1)
})

