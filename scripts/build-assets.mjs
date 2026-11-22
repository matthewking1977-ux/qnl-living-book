// Converts source assets in /assets into responsive WebP/AVIF in /public/img.
// Re-run with `npm run assets` whenever /assets changes.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const out = 'public/img'
await mkdir(out, { recursive: true })

const photos = [
  ['assets/photos/QNL 0001.jpg', 'exterior-day'],
  ['assets/photos/QNL 0002.jpg', 'exterior-dusk'],
  ['assets/photos/QNL 0003.jpg', 'interior'],
  ['assets/photos/QNL 0004.jpg', 'aisle'],
  ['assets/photos/QNL 0005.jpg', 'mezzanine'],
  ['assets/photos/QNL 0006.jpg', 'terraces'],
  ['assets/photos/QNL 0007.jpg', 'hall'],
  ['assets/photos/QNL 0008.jpg', 'stone'],
]
for (const [src, name] of photos) {
  for (const w of [640, 1280, 1920]) {
    const img = sharp(src).resize({ width: w, withoutEnlargement: true })
    await img.clone().webp({ quality: 68 }).toFile(`${out}/${name}-${w}.webp`)
    await img.clone().avif({ quality: 48 }).toFile(`${out}/${name}-${w}.avif`)
  }
}
// Logos: resized only, never recoloured.
for (const tone of ['white', 'black']) {
  await sharp(`assets/logo/qnl-logo-${tone}.png`)
    .resize({ width: 480 })
    .webp({ lossless: true })
    .toFile(`${out}/qnl-logo-${tone}.webp`)
}
console.log('assets built')

// Supplied pop-up artwork: /assets/popups/spreadX-layerN.(png|webp) replaces the
// placeholder SVG of the same name. Trimmed to the cut-out so the bottom edge is
// the fold line, then saved as WebP (budget: 120 KB per layer).
import { readdir, stat } from 'node:fs/promises'
await mkdir('public/popups', { recursive: true })
for (const f of await readdir('assets/popups')) {
  if (!/\.(png|webp)$/i.test(f)) continue
  const name = f.replace(/\.\w+$/, '')
  const dest = `public/popups/${name}.webp`
  // step the long side down until the layer fits the 120 KB budget
  let info
  for (const side of [1200, 1040, 900, 780, 660]) {
    info = await sharp(`assets/popups/${f}`)
      .trim({ threshold: 40 })
      .resize({ width: side, height: side, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 70, alphaQuality: 85 })
      .toFile(dest)
    if (info.size <= 120 * 1024) break
  }
  console.log(`${name}: ${info.width}x${info.height}, ${Math.round((await stat(dest)).size / 1024)} KB`)
}
