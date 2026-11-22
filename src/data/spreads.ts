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
      { src: '/popups/spreadA-layer1.svg', base: 0.4, x: 0.08, w: 1.0, ratio: 540 / 880, stand: 86, mobile: true },
      { src: '/popups/spreadA-layer2.svg', base: 0.5, x: 0.2, w: 0.86, ratio: 460 / 720, stand: 82 },
      { src: '/popups/spreadA-layer3.svg', base: 0.6, x: -0.18, w: 0.72, ratio: 230 / 560, stand: 78, mobile: true },
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
      { src: '/popups/spreadB-layer1.svg', base: 0.38, x: 0.1, w: 1.0, ratio: 420 / 880, stand: 86, mobile: true },
      { src: '/popups/spreadB-layer2.svg', base: 0.47, x: -0.12, w: 0.56, ratio: 300 / 440, stand: 76, mobile: true },
      { src: '/popups/spreadB-layer3.svg', base: 0.54, x: 0.2, w: 0.38, ratio: 340 / 320, stand: 72 },
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
      { src: '/popups/spreadC-layer1.svg', base: 0.36, x: 0.1, w: 1.04, ratio: 400 / 900, stand: 86, mobile: true },
      { src: '/popups/spreadC-layer2.svg', base: 0.45, x: 0.06, w: 0.8, ratio: 380 / 700, stand: 82, mobile: true },
      { src: '/popups/spreadC-layer3.svg', base: 0.53, x: 0.08, w: 0.86, ratio: 200 / 700, stand: 76 },
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
      { src: '/popups/spreadD-layer1.svg', base: 0.4, x: 0.17, w: 0.9, ratio: 500 / 860, stand: 84, mobile: true },
      { src: '/popups/spreadD-layer2.svg', base: 0.5, x: 0.24, w: 0.5, ratio: 480 / 440, stand: 74, mobile: true },
      { src: '/popups/spreadD-layer3.svg', base: 0.58, x: -0.14, w: 0.66, ratio: 170 / 620, stand: 78 },
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
