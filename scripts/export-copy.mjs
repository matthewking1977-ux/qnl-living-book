// Exports every bilingual string to docs/arabic-copy.md for copywriter review.
// Run: npm run copy
// The data files are plain TypeScript with no imports, so Node's built-in type
// stripping can load them directly (Node 22.18+).
import { writeFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const load = (f) => import(pathToFileURL(resolve(f)).href)
const d = { ...(await load('src/data/strings.ts')), ...(await load('src/data/spreads.ts')), ...(await load('src/data/library.ts')) }

const rows = []
const add = (section, where, en, ar, status = 'Draft') => rows.push({ section, where, en, ar, status })
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')

// interface
for (const [k, v] of Object.entries(d.strings)) if (v.en || v.ar) add('Interface', k, v.en, v.ar)
// book
add('Book', 'headline', d.ui.headline.en, d.ui.headline.ar, 'Supplied by QNL')
add('Book', 'search placeholder', d.ui.searchPlaceholder.en, d.ui.searchPlaceholder.ar, 'Supplied by QNL')
for (const s of d.spreads) {
  add('Book', `${s.index} label`, s.label_en, s.label_ar)
  add('Book', `${s.index} title`, s.title_en, s.title_ar)
  add('Book', `${s.index} body`, s.body_en, s.body_ar)
  add('Book', `${s.index} link`, s.link.label_en, s.link.label_ar)
  s.sample?.lines_en.forEach((l, i) => add('Book', `${s.index} sample ${i + 1}`, l, s.sample.lines_ar?.[i]))
}
// homepage data
for (const e of d.events) for (const f of ['kind', 'title', 'date', 'time', 'place']) add("What's on (SAMPLE)", f, e[f], e[f + '_ar'])
for (const sp of d.studySpaces) {
  add('Study spaces', 'type', sp.type, sp.type_ar)
  if (sp.zone) add('Study spaces', 'zone', sp.zone, sp.zone_ar)
  add('Study spaces', 'capacity', sp.capacity, sp.capacity_ar)
  sp.equipment.forEach((x, i) => add('Study spaces', 'equipment', x, sp.equipment_ar[i]))
}
d.studyNotes.forEach((n, i) => add('Study spaces', 'note', n, d.studyNotes_ar[i]))
for (const h of d.hoursSummary) { add('Opening hours', 'days', h.days, h.days_ar); add('Opening hours', 'time', h.time, h.time_ar) }
add('Opening hours', "children's note", d.childrensNote, d.childrensNote_ar)
for (const g of d.gettingHere) { add('Getting here', 'mode', g.mode, g.mode_ar); add('Getting here', 'text', g.text, g.text_ar) }
add('Getting here', 'driving note', d.drivingNote, d.drivingNote_ar)
for (const c of d.footerColumns) { add('Footer', 'column', c.title, c.title_ar); c.links.forEach((l, i) => add('Footer', 'link', l, c.links_ar[i])) }
add('Footer', 'address', d.findUs.address, d.findUs.address_ar)
add('Footer', 'transit', d.findUs.transit, d.findUs.transit_ar)
d.social.forEach((s, i) => add('Footer', 'social', s, d.social_ar[i]))
for (const c of d.collections) for (const f of ['kind', 'title', 'body', 'link']) add('Collections', f, c[f], c[f + '_ar'])
for (const a of d.audiences) for (const f of ['title', 'body']) add('Audiences', f, a[f], a[f + '_ar'])

const out = [
  '# Arabic copy for review',
  '',
  'Every Arabic string on the QNL Living Book concept, generated from the source by `npm run copy`.',
  'Status "Draft" means a first draft written for this concept: please review and correct it.',
  'Edit the Arabic in `src/data/strings.ts`, `src/data/spreads.ts` and `src/data/library.ts` (or send corrections and they will be applied there).',
  '',
  'Notes for the reviewer:',
    '- Times use Western digits with ص / م, as is common on Qatari websites. Change to Arabic-Indic digits if QNL prefers.',
  '- Brand names (Google, App Store, WCAG) are kept in Latin script.',
  '',
  `${rows.length} strings.`,
  '',
  '| # | Section | Key | English | Arabic | Status |',
  '|---|---|---|---|---|---|',
  ...rows.map((r, i) => `| ${i + 1} | ${r.section} | ${esc(r.where)} | ${esc(r.en)} | ${esc(r.ar) || '**missing**'} | ${r.status} |`),
  '',
]
await mkdir('docs', { recursive: true })
await writeFile('docs/arabic-copy.md', out.join('\n'))
console.log(`docs/arabic-copy.md: ${rows.length} strings`)
