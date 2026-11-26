// Builds the Arabic copy review document for the copywriter:
//   docs/QNL-Living-Book_Arabic-copy-review.docx
// plus docs/arabic-copy-map.json (ID -> source file and field) so returned amends can be
// applied by ID. Run: npm run copy:docx
//
// The data files are plain TypeScript with no imports, so Node's built-in type stripping
// loads them directly (Node 22.18+).
import { createRequire } from 'node:module'
import { writeFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const require = createRequire(import.meta.url)
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, HeadingLevel, PageOrientation, Header, Footer, PageNumber, LevelFormat, BorderStyle,
  TableLayoutType, VerticalAlign,
} = require('docx')

const load = (f) => import(pathToFileURL(resolve(f)).href)
const S = (await load('src/data/strings.ts')).strings
const { spreads, ui } = await load('src/data/spreads.ts')
const L = await load('src/data/library.ts')

/* ------------------------------------------------------------------ rows */
// Each row: id, where (visitor-facing context), en, ar, src (file + field), note (limits)
const sections = []
let cur
const section = (title, intro) => sections.push((cur = { title, intro, rows: [] }))
const row = (id, where, en, ar, src, note = '', status = 'Draft') => cur.rows.push({ id, where, en, ar, src, note, status })
const used = new Set()
const s = (key, where, note) => {
  if (!S[key]) throw new Error('unknown string ' + key)
  used.add(key)
  row(`UI.${key}`, where, S[key].en, S[key].ar, `src/data/strings.ts › ${key}`, note)
}
const BTN = 'Button label: keep short (about 2–3 words).'

section('1. First visit: language prompt', 'A card shown once to visitors whose phone or browser is set to Arabic.')
row('INLINE.langPrompt.question', 'Language prompt › question (shown in Arabic, with the English below it)', 'Would you like to view this site in Arabic?', 'هل تفضّل تصفّح الموقع باللغة العربية؟', 'src/components/LangPrompt.tsx › lp-title')

section('2. Header (top of every screen)', 'The fixed bar with the logo, Skip intro, language switch and search.')
s('skipIntro', 'Header › link to jump past the book', BTN)
s('openBook', 'Header › link shown after the intro (and the phone button that opens the book)', BTN)
s('searchLibrary', 'Header › search field label (desktop) and search icon name (phone); also the search panel heading')
s('home', 'Header › logo (read aloud by screen readers)')
row('INLINE.langSwitch.toArabic', 'Header › language switch, spoken label when the site is in English', 'English: view the site in English', 'العربية: عرض الموقع باللغة العربية', 'src/components/LangSwitch.tsx › aria-label', 'Screen readers only. The visible label is simply “العربية”.')

section('3. The book: opening screen', 'The first screen: a closed book with the headline.')
row('BOOK.institution', 'Opening screen › small heading above the book', ui.institution.en, ui.institution.ar, 'src/data/spreads.ts › ui.institution')
row('BOOK.headline', 'Opening screen › main headline', ui.headline.en, ui.headline.ar, 'src/data/spreads.ts › ui.headline', '', 'Supplied by QNL')
s('scrollToOpen', 'Opening screen › cue under the headline (desktop)')
row('BOOK.firstPage', 'Inside cover › words on the first page', 'Qatar National Library', 'مكتبة قطر الوطنية', 'src/components/Book/Book.tsx › first page')

section('4. The book: four spreads', 'Each spread has a small label, a title (large display type), one line of copy and a link. Titles should stay short to fit the page.')
spreads.forEach((sp, i) => {
  const n = sp.index
  row(`BOOK.${n}.label`, `Spread ${n} › small label above the title`, sp.label_en, sp.label_ar, `src/data/spreads.ts › spreads[${i}].label_ar`)
  row(`BOOK.${n}.title`, `Spread ${n} › title`, sp.title_en, sp.title_ar, `src/data/spreads.ts › spreads[${i}].title_ar`, 'Display headline: keep to one short line or two.')
  row(`BOOK.${n}.body`, `Spread ${n} › one line of copy`, sp.body_en, sp.body_ar, `src/data/spreads.ts › spreads[${i}].body_ar`)
  row(`BOOK.${n}.link`, `Spread ${n} › link`, sp.link.label_en, sp.link.label_ar, `src/data/spreads.ts › spreads[${i}].link.label_ar`)
  sp.sample?.lines_en.forEach((l, j) =>
    row(`BOOK.${n}.sample${j + 1}`, `Spread ${n} › sample card, line ${j + 1}`, l, sp.sample.lines_ar?.[j] ?? '', `src/data/spreads.ts › spreads[${i}].sample.lines_ar[${j}]`, 'Placeholder text: will be replaced by real content.'),
  )
})
s('sample', 'Book and event cards › tag marking example content')

section('5. The book: controls', 'Buttons and labels used while reading the book.')
s('nextPage', 'Phone › button to turn to the next spread', BTN)
s('prevPage', 'Phone › back button (screen-reader name)', BTN)
s('closeBook', 'Phone › button on the last spread', BTN)
s('bookChapters', 'Chapter numbers 01–04 (screen-reader name)')
s('introRegion', 'The whole book area (screen-reader name)')
s('insideBook', 'Hidden list of the spreads for screen readers (heading)')

section('6. Search', 'The search bar the book closes into, and the full-screen search panel opened from the header.')
row('SEARCH.placeholder', 'Search field › placeholder text', ui.searchPlaceholder.en, ui.searchPlaceholder.ar, 'src/data/spreads.ts › ui.searchPlaceholder', '', 'Supplied by QNL')
s('search', 'Search › button', BTN)
s('filterBooks', 'Search › filter chip')
s('filterResearch', 'Search › filter chip')
s('filterEvents', 'Search › filter chip')
s('filterHeritage', 'Search › filter chip')
s('close', 'Search panel › close button', BTN)
s('slashTip1', 'Search panel › tip, first part (before the “/” key)', 'Reads: [part 1] / [part 2]')
s('slashTip2', 'Search panel › tip, second part (after the “/” key)')
s('voiceStart', 'Search › microphone button (screen-reader name)')
s('voiceStop', 'Search › microphone while listening (screen-reader name)')
s('voiceListening', 'Search › status while listening (screen readers)')
s('voiceDenied', 'Search › message if microphone access is blocked')
s('voiceNoSpeech', 'Search › message if nothing was heard')

section('7. Homepage: service shortcuts', 'The four cards directly under the book.')
s('services', 'Shortcuts row (screen-reader name)')
s('becomeMember', 'Shortcut 01 › title')
s('becomeMemberNote', 'Shortcut 01 › line under the title')
s('bookStudy', 'Shortcut 02 › title (also the study-space panel heading)')
s('bookStudyNote', 'Shortcut 02 › line under the title')
s('visitUs', 'Shortcut 03 › title')
s('openNow', 'Shortcut 03 and Plan your visit › status')
s('closedNow', 'Shortcut 03 and Plan your visit › status')
s('today', 'Shortcut 03 › “Today 8:00 AM – 8:00 PM”')
s('askLibrarian', 'Shortcut 04 › title')
s('askLibrarianNote', 'Shortcut 04 › line under the title')

section('8. Homepage: study-space panel', 'Opens from “Book a study space”. Facts (rooms, sizes, capacities) are from QNL’s current website; please check the wording, not the figures.')
s('studyQuestions', 'Panel › contact line (keep the phone number and email as they are)')
L.studySpaces.forEach((sp, i) => {
  row(`STUDY.${i + 1}.type`, `Panel › card ${i + 1} title`, sp.type, sp.type_ar, `src/data/library.ts › studySpaces[${i}].type_ar`)
  if (sp.zone) row(`STUDY.${i + 1}.zone`, `Panel › card ${i + 1} zone label`, sp.zone, sp.zone_ar, `src/data/library.ts › studySpaces[${i}].zone_ar`)
  row(`STUDY.${i + 1}.capacity`, `Panel › card ${i + 1} size and capacity`, sp.capacity, sp.capacity_ar, `src/data/library.ts › studySpaces[${i}].capacity_ar`)
  sp.equipment.forEach((e, j) =>
    row(`STUDY.${i + 1}.equipment${j + 1}`, `Panel › card ${i + 1} equipment`, e, sp.equipment_ar[j], `src/data/library.ts › studySpaces[${i}].equipment_ar[${j}]`),
  )
})
s('room', 'Panel › “1 room”')
s('rooms', 'Panel › “6 rooms”')
s('openArea', 'Panel › Night Study Space room count')
s('bookNow', 'Panel › link on each card', BTN)
L.studyNotes.forEach((n, i) => row(`STUDY.rule${i + 1}`, `Panel › booking rule ${i + 1}`, n, L.studyNotes_ar[i], `src/data/library.ts › studyNotes_ar[${i}]`))
row('INLINE.study.rooms', 'Panel › card detail (screen readers only)', 'Rooms', 'الغرف', 'src/components/home/ServiceStrip.tsx › dt')
row('INLINE.study.capacity', 'Panel › card detail (screen readers only)', 'Size and capacity', 'المساحة والسعة', 'src/components/home/ServiceStrip.tsx › dt')
row('INLINE.study.equipment', 'Panel › card detail (screen readers only)', 'Equipment', 'التجهيزات', 'src/components/home/ServiceStrip.tsx › dt')

section('9. Homepage: What’s on', 'Three example events. These are invented samples (marked “Sample” on the site) and will be replaced by real events.')
s('whatsOn', 'Section › small label')
s('whatsOnTitle', 'Section › heading (large display type)')
s('seeAllEvents', 'Section › link')
L.events.forEach((e, i) => {
  for (const f of ['kind', 'title', 'date', 'time', 'place'])
    row(`EVENT.${i + 1}.${f}`, `Event ${i + 1} › ${{ kind: 'category', title: 'title', date: 'date', time: 'time', place: 'place' }[f]}`, e[f], e[f + '_ar'], `src/data/library.ts › events[${i}].${f}_ar`, 'Sample content.')
})

section('10. Homepage: From the collections', 'Three editorial cards.')
s('collections', 'Section › small label')
s('collectionsTitle', 'Section › heading (large display type)')
L.collections.forEach((c, i) => {
  for (const f of ['kind', 'title', 'body', 'link'])
    row(`COLL.${i + 1}.${f}`, `Card ${i + 1} › ${{ kind: 'category', title: 'title', body: 'text', link: 'link' }[f]}`, c[f], c[f + '_ar'], `src/data/library.ts › collections[${i}].${f}_ar`)
})

section('11. Homepage: For you', 'Four cards for different visitors.')
s('forYou', 'Section › small label')
s('forYouTitle', 'Section › heading (large display type)')
L.audiences.forEach((a, i) => {
  row(`AUD.${i + 1}.title`, `Card ${i + 1} › title`, a.title, a.title_ar, `src/data/library.ts › audiences[${i}].title_ar`)
  row(`AUD.${i + 1}.body`, `Card ${i + 1} › text`, a.body, a.body_ar, `src/data/library.ts › audiences[${i}].body_ar`)
})

section('12. Homepage: Plan your visit', 'Opening hours and directions. The facts are from QNL’s current website; please check the wording.')
s('planVisit', 'Section › small label')
s('planVisitTitle', 'Section › heading (large display type)')
s('openingHours', 'Column heading')
s('todayLower', '“Open now · today 8:00 AM – 8:00 PM”')
L.hoursSummary.forEach((h, i) => {
  row(`HOURS.${i + 1}.days`, 'Opening hours › days', h.days, h.days_ar, `src/data/library.ts › hoursSummary[${i}].days_ar`)
  row(`HOURS.${i + 1}.time`, 'Opening hours › times', h.time, h.time_ar, `src/data/library.ts › hoursSummary[${i}].time_ar`, 'Times use Western digits with ص / م.')
})
row('HOURS.childrensNote', 'Opening hours › Children’s Library note', L.childrensNote, L.childrensNote_ar, 'src/data/library.ts › childrensNote_ar')
s('gettingHere', 'Column heading')
s('weAreIn', 'Getting here › first line')
L.gettingHere.forEach((g, i) => {
  row(`TRAVEL.${i + 1}.mode`, 'Getting here › mode of travel', g.mode, g.mode_ar, `src/data/library.ts › gettingHere[${i}].mode_ar`)
  row(`TRAVEL.${i + 1}.text`, 'Getting here › directions', g.text, g.text_ar, `src/data/library.ts › gettingHere[${i}].text_ar`)
})
row('TRAVEL.drivingNote', 'Getting here › speed limit note', L.drivingNote, L.drivingNote_ar, 'src/data/library.ts › drivingNote_ar')
s('openInMaps', 'Getting here › link')
s('buildingPhoto', 'Photo of the building (description read by screen readers)')

section('13. Footer', 'The dark footer at the bottom of the page.')
s('a11yLine1', 'Accessibility line, part 1', 'Reads: [part 1] [link: statement] [or] [link: barrier].')
s('a11yStatement', 'Accessibility line › link')
s('a11yOr', 'Accessibility line › joining word')
s('a11yBarrier', 'Accessibility line › link')
s('draftNote', 'Accessibility line › note shown only in Arabic', 'Remove once the Arabic is approved: write “REMOVE” in your revision.')
s('libraryName', 'Logo (description read by screen readers)')
s('findUs', 'Column heading')
row('FOOTER.address', 'Find us › address', L.findUs.address, L.findUs.address_ar, 'src/data/library.ts › findUs.address_ar')
row('FOOTER.transit', 'Find us › Metro', L.findUs.transit, L.findUs.transit_ar, 'src/data/library.ts › findUs.transit_ar')
s('phone', 'Find us › label before the phone number')
s('email', 'Find us › label before the email address')
s('getApp', 'Heading above the app store badges')
s('appAndroid', 'Google Play badge (screen-reader name)')
s('appIos', 'App Store badge (screen-reader name)')
L.footerColumns.forEach((c, i) => {
  row(`FOOTER.col${i + 1}`, 'Link column › heading', c.title, c.title_ar, `src/data/library.ts › footerColumns[${i}].title_ar`)
  c.links.forEach((l, j) => row(`FOOTER.col${i + 1}.link${j + 1}`, `Link column “${c.title}” › link`, l, c.links_ar[j], `src/data/library.ts › footerColumns[${i}].links_ar[${j}]`))
})
s('followUs', 'Social links › heading')
L.social.forEach((x, i) => row(`FOOTER.social${i + 1}`, 'Social links › network name', x, L.social_ar[i], `src/data/library.ts › social_ar[${i}]`, 'Decide whether to keep brand names in Latin script.'))
s('copyright', 'Bottom line › copyright')
s('conceptBy', 'Bottom line › concept credit')

// every interface string must appear somewhere above
const missed = Object.keys(S).filter((k) => !used.has(k) && (S[k].en || S[k].ar))
if (missed.length) throw new Error('strings not placed in a section: ' + missed.join(', '))

/* -------------------------------------------------------------- document */
const FONT = 'Arial'
const AR = { ascii: FONT, hAnsi: FONT, cs: FONT, eastAsia: FONT }
const W = { id: 1500, en: 3500, ar: 3500, rev: 3700, note: 2478 } // landscape A4, 0.75" margins: 14678
const TOTAL = Object.values(W).reduce((a, b) => a + b, 0)
const border = { style: BorderStyle.SINGLE, size: 4, color: 'B9B7B2' }
const borders = { top: border, bottom: border, left: border, right: border }
const pad = { top: 80, bottom: 80, left: 100, right: 100 }

const en = (text, opts = {}) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text, font: FONT, size: 20, ...opts })] })
const ar = (text, opts = {}) =>
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 40 },
    children: [new TextRun({ text, font: AR, size: 24, sizeComplexScript: 24, rightToLeft: true, ...opts })],
  })
const cell = (width, children, fill) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    margins: pad,
    verticalAlign: VerticalAlign.TOP,
    shading: fill ? { fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    children,
  })

const headRow = new TableRow({
  tableHeader: true,
  cantSplit: true,
  children: [
    cell(W.id, [en('ID', { bold: true, color: 'FFFFFF', size: 18 })], '0B0B0B'),
    cell(W.en, [en('English (for reference)', { bold: true, color: 'FFFFFF', size: 18 })], '0B0B0B'),
    cell(W.ar, [en('Current Arabic on the site', { bold: true, color: 'FFFFFF', size: 18 })], '0B0B0B'),
    cell(W.rev, [en('YOUR REVISED ARABIC', { bold: true, color: '0B0B0B', size: 18 }), en('Leave empty if the current Arabic is fine', { color: '0B0B0B', size: 16 })], 'FFE89A'),
    cell(W.note, [en('Notes / questions', { bold: true, color: 'FFFFFF', size: 18 })], '0B0B0B'),
  ],
})

const tableFor = (rows) =>
  new Table({
    width: { size: TOTAL, type: WidthType.DXA },
    columnWidths: [W.id, W.en, W.ar, W.rev, W.note],
    layout: TableLayoutType.FIXED,
    rows: [
      headRow,
      ...rows.map(
        (r) =>
          new TableRow({
            cantSplit: true,
            children: [
              cell(W.id, [
                en(r.id, { bold: true, size: 16 }),
                ...(r.status !== 'Draft' ? [en(r.status, { size: 14, color: '2F7D4F', bold: true })] : []),
              ], 'F4F1EA'),
              cell(W.en, [en(r.en || '(no English version: this line appears only on the Arabic site)', r.en ? {} : { color: '6B6B6B' }), en(r.where, { italics: true, color: '6B6B6B', size: 16 })]),
              cell(W.ar, [ar(r.ar || '—')]),
              cell(W.rev, [ar('')], 'FFF8DC'),
              cell(W.note, [...(r.note ? [en(r.note, { color: '6B6B6B', size: 16 })] : [en('')])]),
            ],
          }),
      ),
    ],
  })

const total = sections.reduce((n, x) => n + x.rows.length, 0)
const bullet = (text) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text, font: FONT, size: 22 })] })
const p = (text, opts = {}) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, font: FONT, size: 22, ...opts })] })

const intro = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: 'Qatar National Library: The Living Book', font: FONT })] }),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: 'Arabic copy review', font: FONT })] }),
  p(`This document contains every piece of written text on the homepage concept (https://qnl-living-book.vercel.app/), in English and Arabic, side by side: ${total} items in ${sections.length} sections, in the order a visitor meets them.`),
  p('Status of the Arabic: two lines were supplied by QNL (marked “Supplied by QNL”: the headline and the search placeholder). Everything else is a first draft written for this concept and needs your review.'),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'How to review', font: FONT })] }),
  bullet('Read the English (column 2) for meaning and the current Arabic (column 3).'),
  bullet('If the Arabic needs changing, write the full corrected Arabic in the yellow column “YOUR REVISED ARABIC”. Write the whole line, not only the changed words.'),
  bullet('If the current Arabic is fine, leave the yellow cell empty.'),
  bullet('Use the last column for questions or comments (in English or Arabic).'),
  bullet('Please do not change the ID or the English columns, add or delete rows, or re-order the tables: the IDs are used to put your text back into the website automatically.'),
  bullet('Track Changes is not needed. Save the file under the same name with your initials added (for example …_review_AB.docx) and send it back.'),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Things to keep in mind', font: FONT })] }),
  bullet('Tone: QNL’s national library voice: warm, clear, welcoming to all ages; Modern Standard Arabic.'),
  bullet('Length: button labels and the book titles must stay short to fit the design. Notes in the last column flag where length matters.'),
  bullet('“Screen-reader” items are not shown on screen; they are read aloud to blind and partially sighted visitors. Please translate them naturally all the same.'),
  bullet('Numbers and times currently use Western digits (8:00) with ص / م. If QNL prefers Arabic-Indic digits (٨:٠٠), please say so in the Notes column of row HOURS.1.time and we will change them site-wide.'),
  bullet('Brand and product names (Google Play, App Store, WCAG, X, Instagram, YouTube, LinkedIn) are kept in Latin script except where noted; tell us if QNL’s style differs.'),
  bullet('Events and the research abstract are invented samples and will be replaced; a light check is enough.'),
  bullet('Opening hours, study-space details and directions are factual and come from QNL’s current website: please check the wording, and flag any fact you know to be wrong.'),
  p(`Generated ${new Date().toISOString().slice(0, 10)} from the website source.`, { color: '6B6B6B', size: 18 }),
]

const body = []
sections.forEach((sec, i) => {
  body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: i === 0, children: [new TextRun({ text: sec.title, font: FONT })] }))
  if (sec.intro) body.push(p(sec.intro, { color: '6B6B6B', size: 20 }))
  body.push(tableFor(sec.rows))
  body.push(new Paragraph({ spacing: { after: 200 }, children: [] }))
})

const doc = new Document({
  creator: 'QNL Living Book concept',
  title: 'QNL Living Book: Arabic copy review',
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 40, bold: true }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 30, bold: true }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true }, paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
        },
      },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'QNL Living Book · Arabic copy review', font: FONT, size: 16, color: '6B6B6B' })] })] }) },
      footers: {
        default: new Footer({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ font: FONT, size: 16, color: '6B6B6B', children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES] })] })],
        }),
      },
      children: [...intro, ...body],
    },
  ],
})

await mkdir('docs', { recursive: true })
const out = 'docs/QNL-Living-Book_Arabic-copy-review.docx'
await writeFile(out, await Packer.toBuffer(doc))
const map = Object.fromEntries(sections.flatMap((x) => x.rows.map((r) => [r.id, { source: r.src, en: r.en, ar: r.ar }])))
await writeFile('docs/arabic-copy-map.json', JSON.stringify(map, null, 2))
console.log(`${out}: ${total} rows in ${sections.length} sections; map: docs/arabic-copy-map.json`)
