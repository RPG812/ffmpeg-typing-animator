import path from 'node:path'

export function buildFfmpegArgs({ cfg, schedule, assPath, outFile }) {
  const {
    width, height, fps, bg,
    soundDir, clickFiles, clickVolume
  } = cfg

  // Audio inputs: one per click
  const audioInputs = []
  const audioChains = []

  let index = 0

  for (const it of schedule.items) {
    if (!it.click) {
      continue
    }

    const f = clickFiles[Math.floor(Math.random() * clickFiles.length)]

    audioInputs.push('-i', path.join(soundDir, f))

    const inLbl = `${index}:a` // ffmpeg auto-label by input order
    const ms = Math.floor(it.at * 1000)
    const vol = (clickVolume + (Math.random() * 0.5 - 0.05)).toFixed(2)

    audioChains.push(`[${inLbl}]adelay=${ms}|${ms},volume=${vol}[ad${index}]`)
    index++
  }

  if (!bg || !width || !height || !fps) {
    throw new Error(`Invalid cfg: ${JSON.stringify({ bg, width, height, fps })}`)
  }

  const amixInputs = index
  const audioMix = amixInputs > 0
    ? `${Array.from({ length: amixInputs }, (_, i) => `[ad${i}]`).join('')}amix=inputs=${amixInputs}:normalize=0[aout]`
    : `anullsrc=channel_layout=stereo:sample_rate=48000[aout]`

  const filterComplex = [
    // base green background
    `color=${bg}:s=${width}x${height}:r=${fps}[base]`,
    // overlay subtitles
    `[base]subtitles='${escapePath(assPath)}'[v]`,
    // audio chains
    ...audioChains,
    // mix audio
    audioMix
  ].join(';')

  return [
    '-y',
    // audio inputs (clicks):
    ...audioInputs,

    '-filter_complex', filterComplex,
    '-map', '[v]',
    '-map', '[aout]',
    '-t', (schedule.total + 0.6).toFixed(2),

    // H.264 MP4
    '-r', String(fps),
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',

    '-c:a', 'aac',
    '-shortest',
    outFile
  ]
}

function escapePath(p) {
  // Escape only colons, not backslashes (Unix uses /)
  return p.replace(/:/g, '\\:')
}
