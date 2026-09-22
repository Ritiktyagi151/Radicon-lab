import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Originals are retained. Existing derivatives are skipped, never overwritten.
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg'
for (let index = 1; index <= 4; index++) {
  const input = fileURLToPath(new URL(`../public/video/reel${index}.mp4`, import.meta.url))
  const output = fileURLToPath(new URL(`../public/video/reel${index}-web.mp4`, import.meta.url))
  if (!existsSync(output)) {
    execFileSync(ffmpeg, [
      '-hide_banner', '-loglevel', 'error', '-nostdin', '-n', '-i', input,
      '-map', '0:v:0', '-map', '0:a?', '-vf', "scale='min(720,iw)':-2",
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '27', '-pix_fmt', 'yuv420p',
      '-fpsmax', '30', '-threads', '2', '-c:a', 'aac', '-b:a', '96k',
      '-movflags', '+faststart', output,
    ], { stdio: 'inherit', windowsHide: true })
  }
  execFileSync(ffmpeg, ['-v', 'error', '-i', output, '-f', 'null', '-'], {
    stdio: ['ignore', 'ignore', 'inherit'], windowsHide: true,
  })
  console.log(`reel${index}: ${statSync(input).size} -> ${statSync(output).size} bytes (decoded successfully)`)
}
