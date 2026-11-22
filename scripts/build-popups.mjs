// Generates the MVP placeholder pop-up cut-outs: flat paper shapes, 1px darker
// edge, feTurbulence paper grain. One file per layer (spreadA-layer1.svg …) so
// each can be replaced by real collection artwork without touching code.
// The bottom edge of every file is the fold line.
import { writeFile, mkdir } from 'node:fs/promises'

const out = 'public/popups'
await mkdir(out, { recursive: true })

const P = { white: '#f7f5ef', paper: '#e6e3dc', mid: '#b9b7b2', dark: '#6b6b6b', ink: '#2b2b2b', edge: '#8f8c84' }
// sepia is allowed inside the heritage artwork only
const SEP = { sheet: '#e9dcc0', light: '#f1e7d0', tone: '#d6c39a', line: '#a98d5c', dark: '#7a6038' }

const wrap = (w, h, body, seed = 3) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .16 0"/><feComposite in2="SourceAlpha" operator="in" result="n"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="n"/></feMerge></filter></defs>
<g filter="url(#g)" stroke="${P.edge}" stroke-width="1" stroke-linejoin="round" stroke-linecap="round">
${body}
</g></svg>
`
const star = (cx, cy, r, fill = P.paper) => {
  const k = r * 0.3
  return `<path fill="${fill}" d="M${cx} ${cy - r}L${cx + k} ${cy - k}L${cx + r} ${cy}L${cx + k} ${cy + k}L${cx} ${cy + r}L${cx - k} ${cy + k}L${cx - r} ${cy}L${cx - k} ${cy - k}Z"/>`
}
const files = {}

/* ───────── Spread A · children ───────── */
files['spreadA-layer1'] = wrap(880, 540, `
<path fill="${P.dark}" d="M30 540V270Q30 30 440 30Q850 30 850 270V540Z"/>
<circle cx="610" cy="200" r="82" fill="${P.white}"/>
<circle cx="646" cy="178" r="70" fill="${P.dark}" stroke="none"/>
${star(250, 170, 16)}${star(380, 110, 10)}${star(170, 300, 9)}${star(470, 250, 12)}${star(740, 330, 11)}${star(330, 330, 7)}${star(540, 90, 8)}
<path fill="${P.mid}" d="M30 540V440q40-46 90-20q30-50 90-24q44-40 96 0q40-22 70 18q50-14 70 30v96Z"/>
<path fill="${P.mid}" d="M850 540V470q-36-40-84-14q-40-34-86 2q-50-12-60 40v42Z"/>`, 2)

files['spreadA-layer2'] = wrap(720, 460, `
<path fill="${P.mid}" d="M428 460C440 380 424 320 440 240L474 240C484 330 470 392 492 460Z"/>
<path fill="${P.mid}" d="M446 300L380 250L390 240L452 280Z"/>
<circle cx="360" cy="222" r="82" fill="${P.paper}"/>
<circle cx="552" cy="226" r="86" fill="${P.paper}"/>
<circle cx="456" cy="168" r="112" fill="${P.white}"/>
<circle cx="420" cy="104" r="66" fill="${P.paper}"/>
<circle cx="530" cy="124" r="62" fill="${P.white}"/>
<path fill="${P.paper}" d="M0 460Q180 410 380 438T720 446V460Z"/>`, 5)

files['spreadA-layer3'] = wrap(560, 230, `
<path fill="${P.mid}" d="M0 230C80 130 220 96 330 124C430 150 500 186 560 230Z"/>
<g fill="${P.ink}" stroke="none">
<circle cx="262" cy="50" r="17"/>
<path d="M246 70C232 88 228 108 236 126L300 126C312 126 314 114 304 110L276 104C274 92 272 80 266 70Z"/>
<path d="M236 126L318 126C330 120 326 108 314 110L250 112Z"/>
</g>
<path fill="${P.white}" d="M272 84L300 74L306 92L279 102Z"/>
<path fill="${P.white}" d="M300 74L324 80L328 97L306 92Z"/>
<rect x="400" y="176" width="70" height="12" fill="${P.white}" transform="rotate(14 400 176)"/>
<rect x="404" y="164" width="60" height="12" fill="${P.paper}" transform="rotate(14 404 164)"/>`, 7)

/* ───────── Spread B · research ───────── */
{
  let x = 24, body = ''
  const hs = [300, 340, 280, 360, 320, 250, 350, 300, 330, 270, 360, 310, 290, 345, 260, 335, 305, 355, 285, 325]
  const ws = [38, 46, 34, 52, 40, 36, 48, 42, 36, 50, 40, 44, 34, 48, 38, 46, 40, 36, 50, 42]
  const fs = [P.paper, P.white, P.mid, P.paper, P.dark, P.white, P.paper, P.mid, P.white, P.paper]
  for (let i = 0; i < 20 && x + ws[i] < 860; i++) {
    const h = hs[i], w = ws[i], y = 400 - h, f = fs[i % fs.length]
    const line = f === P.dark ? P.paper : P.dark
    body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`
    body += `<path stroke="${line}" fill="none" d="M${x + 7} ${y + 30}H${x + w - 7}M${x + 7} ${y + 38}H${x + w - 7}M${x + 7} ${y + h - 34}H${x + w - 7}"/>`
    x += w + 2
  }
  files['spreadB-layer1'] = wrap(880, 420, body + `<rect x="8" y="400" width="864" height="20" fill="${P.mid}"/>`, 4)
}
files['spreadB-layer2'] = wrap(440, 300, `
<rect x="20" y="16" width="400" height="284" rx="3" fill="${P.white}"/>
<rect x="44" y="40" width="74" height="20" fill="none" stroke="${P.dark}"/>
<text x="81" y="54" text-anchor="middle" font-family="Roboto,Arial,sans-serif" font-size="11" font-weight="500" letter-spacing="2" fill="${P.dark}" stroke="none">SAMPLE</text>
<path stroke="${P.ink}" stroke-width="5" fill="none" d="M44 92H330"/>
<path stroke="${P.ink}" stroke-width="5" fill="none" d="M44 112H250"/>
<path stroke="${P.mid}" stroke-width="3" fill="none" d="M44 150H396M44 168H396M44 186H396M44 204H300"/>
<path stroke="${P.dark}" stroke-width="2" fill="none" d="M44 244H180M200 244H260"/>
<path fill="${P.paper}" d="M360 16L420 16L420 76Z"/>`, 6)

files['spreadB-layer3'] = wrap(320, 340, `
<path fill="${P.ink}" stroke="none" d="M214 196L240 180L306 340L262 340Z"/>
<circle cx="150" cy="122" r="96" fill="rgba(255,255,255,.4)" stroke="${P.ink}" stroke-width="18"/>
<path fill="none" stroke="${P.white}" stroke-width="5" d="M96 96A62 62 0 0 1 150 62"/>`, 8)

/* ───────── Spread C · events ───────── */
{
  let fins = ''
  for (let i = 0; i < 13; i++) {
    const x = 70 + i * 18
    fins += `M${x} ${322 - (i * 18 * 0.69)}V${372 - i * 18 * 0.14}`
  }
  files['spreadC-layer1'] = wrap(900, 400, `
<path fill="${P.white}" d="M10 400V330L310 60L890 190V400Z"/>
<path fill="${P.mid}" d="M52 334L296 122V338L52 376Z"/>
<path fill="none" stroke="${P.white}" stroke-width="2" d="${fins}"/>
<path fill="${P.dark}" d="M300 400L470 214L800 400Z"/>
<path fill="${P.mid}" d="M620 190L860 226V330L620 250Z"/>
<rect x="452" y="290" width="18" height="110" fill="${P.white}"/>
<rect x="560" y="316" width="16" height="84" fill="${P.white}"/>
<rect x="650" y="344" width="14" height="56" fill="${P.white}"/>`, 9)
}
files['spreadC-layer2'] = wrap(700, 380, `
<path fill="${P.dark}" fill-rule="evenodd" d="M0 380V60Q0 0 60 0H640Q700 0 700 60V380ZM92 380V160Q350 50 608 160V380Z"/>
<path fill="${P.mid}" d="M92 380V160Q150 132 214 116Q206 270 124 380Z"/>
<path fill="${P.mid}" d="M608 380V160Q550 132 486 116Q494 270 576 380Z"/>
<path fill="${P.paper}" d="M124 380Q350 330 576 380Z"/>
<path fill="none" stroke="${P.paper}" d="M40 40H660"/>`, 10)
{
  let heads = ''
  for (let i = 0; i < 9; i++) {
    const cx = 40 + i * 52 + (i % 2) * 6, top = 132 + (i % 3) * 8
    heads += `<circle cx="${cx}" cy="${top}" r="15"/><path d="M${cx - 24} 200Q${cx - 24} ${top + 20} ${cx} ${top + 20}Q${cx + 24} ${top + 20} ${cx + 24} 200Z"/>`
  }
  files['spreadC-layer3'] = wrap(700, 200, `
<g fill="${P.ink}" stroke="none">${heads}</g>
<g transform="rotate(4 600 100)">
<rect x="520" y="18" width="160" height="182" rx="3" fill="${P.white}"/>
<rect x="520" y="18" width="160" height="34" fill="${P.ink}" stroke="none"/>
<text x="600" y="40" text-anchor="middle" font-family="Roboto,Arial,sans-serif" font-size="12" font-weight="500" letter-spacing="2.4" fill="${P.white}" stroke="none">SAMPLE</text>
<text x="600" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="${P.ink}" stroke="none">Date</text>
<text x="600" y="140" text-anchor="middle" font-family="Roboto,Arial,sans-serif" font-size="14" font-weight="500" letter-spacing="2" fill="${P.dark}" stroke="none">[TBC]</text>
</g>`, 11)
}

/* ───────── Spread D · heritage (sepia inside the artwork only) ───────── */
{
  let grid = ''
  for (let x = 110; x < 800; x += 86) grid += `M${x} 44V500`
  for (let y = 110; y < 480; y += 78) grid += `M36 ${y}H824`
  files['spreadD-layer1'] = wrap(860, 500, `
<g stroke="${SEP.line}">
<path fill="${SEP.sheet}" d="M12 500V30Q200 8 430 24T848 18V500Z"/>
<rect x="36" y="44" width="788" height="456" fill="none"/>
<path fill="none" stroke-width=".6" d="${grid}"/>
<path fill="${SEP.tone}" stroke="${SEP.dark}" d="M36 300C120 280 150 220 230 228C300 236 300 300 370 290C420 282 410 210 470 190C500 150 548 150 540 200C534 240 560 262 620 250C700 236 720 300 824 280V500H36Z"/>
<path fill="${SEP.light}" stroke="${SEP.dark}" d="M440 310C470 290 520 300 512 336C506 362 460 366 444 344Z"/>
<g fill="${SEP.dark}" stroke="none"><circle cx="232" cy="330" r="4"/><circle cx="486" cy="330" r="4"/><circle cx="650" cy="350" r="4"/></g>
<path fill="none" stroke-dasharray="3 5" d="M232 330Q360 420 486 330T650 350"/>
<g transform="translate(700 130)"><circle r="44" fill="${SEP.light}"/><path fill="${SEP.dark}" stroke="none" d="M0-40L7 0L0 40L-7 0Z"/><path fill="${SEP.line}" stroke="none" d="M-40 0L0-7L40 0L0 7Z"/></g>
</g>`, 12)
}
{
  let lines = '', diamonds = ''
  for (let i = 0; i < 11; i++) {
    const y = 150 + i * 26
    const short = i % 4 === 3 ? 90 : 0
    lines += `M${70 + short} ${y}H370`
  }
  for (let i = 0; i < 9; i++) diamonds += `<path d="M${88 + i * 33} 84l12-14l12 14l-12 14Z"/>`
  files['spreadD-layer2'] = wrap(440, 480, `
<g stroke="${SEP.line}">
<path fill="${SEP.light}" d="M24 480V22Q220 8 416 22V480Z"/>
<rect x="46" y="44" width="348" height="436" fill="none"/>
<rect x="54" y="52" width="332" height="428" fill="none" stroke-width=".6"/>
<rect x="70" y="64" width="300" height="40" fill="${SEP.tone}"/>
<g fill="${SEP.dark}" stroke="none">${diamonds}</g>
<path fill="none" stroke="${SEP.dark}" stroke-width="2.4" d="${lines}"/>
<circle cx="220" cy="452" r="9" fill="${SEP.tone}"/>
</g>`, 13)
}
files['spreadD-layer3'] = wrap(620, 170, `
<g stroke="${SEP.dark}">
<rect x="20" y="118" width="250" height="26" fill="${SEP.tone}"/>
<rect x="34" y="92" width="226" height="26" fill="${SEP.sheet}"/>
<rect x="26" y="144" width="238" height="26" fill="${SEP.light}"/>
<path fill="none" d="M60 92V118M230 92V118M50 118V144M240 118V144"/>
<path fill="${SEP.light}" d="M360 170V70Q360 40 390 40H560Q590 40 590 70V170Z"/>
<path fill="none" d="M392 80H558M392 100H558M392 120H500"/>
<circle cx="344" cy="66" r="26" fill="${SEP.sheet}"/><circle cx="344" cy="66" r="12" fill="${SEP.tone}"/>
</g>`, 14)

for (const [name, svg] of Object.entries(files)) {
  await writeFile(`${out}/${name}.svg`, svg)
}
console.log(Object.keys(files).length, 'pop-up layers written')
