// Converts source assets in /assets into responsive WebP/AVIF in /public/img.
// Re-run with `npm run assets` whenever /assets changes.
import sharp from 'sharp'
import { mkdir, readdir, stat } from 'node:fs/promises'

/** true when dest exists and is newer than src */
const fresh = async (src, dest) => {
  try { return (await stat(dest)).mtimeMs >= (await stat(src)).mtimeMs } catch { return false }
}

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
  if (await fresh(src, `${out}/${name}-1920.avif`)) continue
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
await mkdir('public/popups', { recursive: true })
for (const f of await readdir('assets/popups')) {
  if (!/\.(png|webp)$/i.test(f)) continue
  const name = f.replace(/\.\w+$/, '')
  const dest = `public/popups/${name}.webp`
  if (await fresh(`assets/popups/${f}`, dest)) {
    const m = await sharp(dest).metadata()
    console.log(`${name}: ${m.width}x${m.height} (unchanged)`)
    continue
  }
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

// Phone versions of the pop-up artwork (public/popups/m/). The desktop applies drop
// shadows and depth shading as live CSS filters; on phones those filters cost far too
// much graphics memory (iOS kills the page), so here they are baked into the files:
// a soft shadow cast downwards inside the cut-out's own canvas, and darker shading for
// pieces further back. Same dimensions as the desktop files, so layouts are unchanged.
await mkdir('public/popups/m', { recursive: true })
const supplied = (await readdir('public/popups')).filter((f) => /^spread[A-D]-layer\d+\.webp$/.test(f))
for (const f of supplied) {
  const [, spread, n] = f.match(/^spread([A-D])-layer(\d+)\.webp$/)
  const count = supplied.filter((g) => g.startsWith(`spread${spread}-`)).length
  const depth = count > 1 ? (Number(n) - 1) / (count - 1) : 1
  const src = `public/popups/${f}`
  const dest = `public/popups/m/${f}`
  if (await fresh(src, dest)) continue
  const base = sharp(src)
  const { width, height } = await base.metadata()
  const side = Math.min(900, Math.max(width, height))
  const scale = side / Math.max(width, height)
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)
  const art = await base.clone().resize(w, h).modulate({ brightness: 0.66 + 0.34 * depth }).png().toBuffer()
  const alpha = await sharp(src).resize(w, h).extractChannel('alpha').toBuffer()
  const blur = Math.max(2, Math.round(w / 70))
  const shadow = await sharp({ create: { width: w, height: h, channels: 3, background: { r: 12, g: 8, b: 2 } } })
    .joinChannel(await sharp(alpha).linear(0.5, 0).blur(blur).toBuffer())
    .png()
    .toBuffer()
  const dy = Math.round(h * 0.03)
  await sharp({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: shadow, left: 0, top: dy },
      { input: art, left: 0, top: 0 },
    ])
    .webp({ quality: 72, alphaQuality: 85 })
    .toFile(dest)
  console.log(`m/${f}: ${w}x${h}, ${Math.round((await stat(dest)).size / 1024)} KB`)
}

// App store badges, cut from the supplied artwork (assets/badges/store-badges.webp).
await mkdir('public/img/badges', { recursive: true })
{
  const src = 'assets/badges/store-badges.webp'
  for (const [name, top, height] of [['google-play', 30, 655], ['app-store', 795, 625]]) {
    const dest = `public/img/badges/${name}.webp`
    if (await fresh(src, dest)) continue
    const piece = await sharp(src).extract({ left: 30, top, width: 1950, height }).png().toBuffer()
    await sharp(piece).trim({ threshold: 10 }).resize({ height: 120 }).webp({ quality: 90 }).toFile(dest)
    const m = await sharp(dest).metadata()
    console.log(`badges/${name}: ${m.width}x${m.height}`)
  }
}
