/**
 * The four spreads of the book. This array is the only place spread content
 * lives, so a CMS can feed it later.
 *
 * Arabic: only copy supplied by the client is filled in. `null` means
 * "[AR – TBC]": the UI shows the English text with a TBC tag. Nothing here is
 * machine-translated.
 *
 * Facts: everything factual is a SAMPLE or [TBC] placeholder.
 */
export interface PopUpLayerDef {
  /** file in /public/popups, one file per layer so artwork can be swapped */
  src: string
  /** distance of the fold line from the page top, 0..1 of page height */
  base: number
  /** horizontal centre relative to the gutter, in page widths (−1..1) */
  x: number
  /** width in page widths, and height / width ratio */
  w: number
  ratio: number
  /** turn of the fold line on the page, degrees. Wings fan outward: negative on the left page, positive on the right */
  yaw?: number
  /** how far the layer stands up from the page, degrees (90 = upright) */
  stand?: number
  /** kept on mobile (2 per spread) */
  mobile?: boolean
}

export interface SpreadSample {
  kind: 'abstract' | 'event'
  /** always rendered with a SAMPLE tag */
  lines_en: string[]
  lines_ar: string[] | null
}

export interface Spread {
  id: 'children' | 'research' | 'events' | 'heritage'
  index: string
  label_en: string
  label_ar: string | null
  title_en: string
  title_ar: string | null
  body_en: string
  body_ar: string | null
  link: { href: string; label_en: string; label_ar: string | null }
  sample?: SpreadSample
  layers: PopUpLayerDef[]
  bgPaper: string
}

/** height / width of each supplied artwork file after trimming (printed by `npm run assets`) */
const R = { A1: 797 / 1200, A2: 519 / 1200, A3: 659 / 660, A4: 900 / 680, A5: 1040 / 780, A6: 214 / 1200 }

export const spreads: Spread[] = [
  {
    id: 'children',
    index: '01',
    label_en: "Children's Library",
    label_ar: null,
    title_en: 'Where small readers begin.',
    title_ar: null,
    body_en: 'Stories to read aloud, to look at, and to grow up with.',
    body_ar: null,
    link: { href: '#children', label_en: "Explore children's books", label_ar: null },
    layers: [
      { src: '/popups/spreadA-layer1.webp', base: 0.45, x: 0.12, w: 1.1, ratio: R.A1, stand: 88, mobile: true },
      { src: '/popups/spreadA-layer2.webp', base: 0.51, x: 0.06, w: 1.26, ratio: R.A2, stand: 84 },
      { src: '/popups/spreadA-layer3.webp', base: 0.58, x: 0.06, w: 0.78, ratio: R.A3, stand: 82, mobile: true },
      { src: '/popups/spreadA-layer4.webp', base: 0.64, x: -0.6, w: 0.36, ratio: R.A4, stand: 80, yaw: -22 },
      { src: '/popups/spreadA-layer5.webp', base: 0.64, x: 0.62, w: 0.38, ratio: R.A5, stand: 80, yaw: 22 },
      { src: '/popups/spreadA-layer6.webp', base: 0.7, x: 0.02, w: 1.2, ratio: R.A6, stand: 58 },
    ],
    bgPaper: '#f4f1ea',
  },
  {
    id: 'research',
    index: '02',
    label_en: 'Research & Learning',
    label_ar: null,
    title_en: 'Ask a harder question.',
    title_ar: null,
    body_en: 'Journals, databases, and people who know where to look.',
    body_ar: null,
    link: { href: '#research', label_en: 'Search research databases', label_ar: null },
    sample: {
      kind: 'abstract',
      lines_en: [
        'Abstract',
        'Placeholder text standing in for a journal abstract. The final snippet will come from the catalogue.',
      ],
      lines_ar: null,
    },
    layers: [
      { src: '/popups/spreadB-layer1.svg', base: 0.45, x: 0.1, w: 1.12, ratio: 420 / 880, stand: 86, mobile: true },
      { src: '/popups/spreadB-layer2.svg', base: 0.54, x: -0.12, w: 0.63, ratio: 300 / 440, stand: 76, mobile: true },
      { src: '/popups/spreadB-layer3.svg', base: 0.61, x: 0.2, w: 0.43, ratio: 340 / 320, stand: 72 },
    ],
    bgPaper: '#f4f1ea',
  },
  {
    id: 'events',
    index: '03',
    label_en: 'Events',
    label_ar: null,
    title_en: 'Something is always on.',
    title_ar: null,
    body_en: 'Talks, workshops and exhibitions for every kind of visitor.',
    body_ar: null,
    link: { href: '#events', label_en: 'See all events', label_ar: null },
    sample: {
      kind: 'event',
      lines_en: ['Event title placeholder', 'Date [TBC]', 'Location [TBC]'],
      lines_ar: null,
    },
    layers: [
      { src: '/popups/spreadC-layer1.svg', base: 0.43, x: 0.1, w: 1.16, ratio: 400 / 900, stand: 86, mobile: true },
      { src: '/popups/spreadC-layer2.svg', base: 0.52, x: 0.06, w: 0.90, ratio: 380 / 700, stand: 82, mobile: true },
      { src: '/popups/spreadC-layer3.svg', base: 0.60, x: 0.08, w: 0.96, ratio: 200 / 700, stand: 76 },
    ],
    bgPaper: '#f4f1ea',
  },
  {
    id: 'heritage',
    index: '04',
    label_en: 'Qatar & Gulf Heritage',
    label_ar: null,
    title_en: 'The region, on paper.',
    title_ar: null,
    body_en: 'Manuscripts, maps and photographs from the heritage collection.',
    body_ar: null,
    link: { href: '#heritage', label_en: 'Explore the heritage collection', label_ar: null },
    layers: [
      { src: '/popups/spreadD-layer1.svg', base: 0.47, x: 0.17, w: 1.01, ratio: 500 / 860, stand: 84, mobile: true },
      { src: '/popups/spreadD-layer2.svg', base: 0.57, x: 0.24, w: 0.56, ratio: 480 / 440, stand: 74, mobile: true },
      { src: '/popups/spreadD-layer3.svg', base: 0.65, x: -0.14, w: 0.74, ratio: 170 / 620, stand: 78 },
    ],
    bgPaper: '#f1ece0',
  },
]

/** UI strings outside the book. Same rule: null = [AR – TBC]. */
export const ui = {
  institution: { en: 'Qatar National Library', ar: null as string | null },
  headline: { en: 'Every story starts here.', ar: 'كل قصة تبدأ هنا' as string | null, arTbc: true },
  cue: { en: 'Scroll to open', ar: null as string | null },
  skip: { en: 'Skip intro', ar: null as string | null },
  searchPlaceholder: {
    en: 'Search books, research, events and heritage…',
    ar: 'ابحث في الكتب والأبحاث والفعاليات والتراث…' as string | null,
    arTbc: true,
  },
}
