import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Book, type BookHandle } from './Book/Book'
import { frameAt, isMobile, SPREAD_STOPS } from './Book/choreography'
import { SearchMorph, type SearchMorphHandle } from './SearchMorph'
import { SiteHeader } from './SiteHeader'
import { useLang } from '../lib/dir'
import { spreads, ui } from '../data/spreads'
import { usePick, useT } from '../lib/i18n'

/**
 * prefers-reduced-motion version of the intro. Nothing is pinned and nothing
 * follows the scroll: the open book is a static illustrated hero and the four
 * spreads are a tabbed carousel that cross-fades. The search bar sits below in
 * its finished state. All spread content is real text and links.
 */
const heroEnd = () => (document.getElementById('rm-hero')?.getBoundingClientRect().bottom ?? 0) + scrollY

export function ReducedMotionHero() {
  const [tab, setTab] = useState(0)
  const [shown, setShown] = useState(0)
  const [size, setSize] = useState({ vw: innerWidth, vh: innerHeight })
  const book = useRef<BookHandle>(null)
  const fade = useRef<HTMLDivElement>(null)
  const search = useRef<SearchMorphHandle>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const mobile = isMobile(size.vw)
  const lang = useLang()
  const t = useT()
  const p = usePick()

  // the same pose the scroll version rests on for this spread
  const poseFor = (i: number) => {
    const p = frameAt(SPREAD_STOPS[i], size.vw, size.vh * 0.74).pose
    return { ...p, y: size.vh * 0.06 }
  }
  const first = useMemo(() => poseFor(0), []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const on = () => setSize({ vw: innerWidth, vh: innerHeight })
    addEventListener('resize', on)
    search.current?.apply(1)
    return () => removeEventListener('resize', on)
  }, [])

  // cross-fade: fade the book out, swap the spread, fade it back in
  useEffect(() => {
    if (tab === shown) {
      book.current?.apply(poseFor(shown))
      return
    }
    fade.current!.style.opacity = '0'
    const t = setTimeout(() => {
      book.current?.apply(poseFor(tab))
      setShown(tab)
      fade.current!.style.opacity = '1'
    }, 200)
    return () => clearTimeout(t)
  }, [tab, size]) // eslint-disable-line react-hooks/exhaustive-deps

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (tab + d + spreads.length) % spreads.length
    setTab(n)
    tabs.current[n]?.focus()
  }

  const sp = spreads[tab]

  return (
    <div id="rm-hero" className="relative bg-ink text-white">
      <picture>
        <source type="image/avif" srcSet="/img/interior-640.avif 640w, /img/interior-1280.avif 1280w, /img/interior-1920.avif 1920w" sizes="100vw" />
        <source type="image/webp" srcSet="/img/interior-640.webp 640w, /img/interior-1280.webp 1280w, /img/interior-1920.webp 1920w" sizes="100vw" />
        <img src="/img/interior-1280.webp" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <div className="absolute inset-0 bg-ink/85" />

      <div className="relative">
        <SiteHeader solidAfter={heroEnd} />
        <div className="h-[72px] md:h-[96px]" />

        <div className="px-6 pt-4 text-center">
          <p className="label text-white/80">{p(ui.institution.en, ui.institution.ar)}</p>
          <h1 className="font-display mt-4 text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.08] tracking-[-0.01em]">{p(ui.headline.en, ui.headline.ar)}</h1>
        </div>

        {/* static open book */}
        <div className="relative h-[74svh] min-h-[420px] overflow-hidden">
          <div ref={fade} className="absolute inset-0 transition-opacity duration-200">
            <Book key={(mobile ? 'm' : 'd') + lang} ref={book} pose={first} loadUpTo={shown} mountFrom={shown} mobile={mobile} />
          </div>
        </div>

        {/* the four spreads as tabs */}
        <div className="mx-auto max-w-[720px] px-4 pb-10 text-center">
          <div role="tablist" aria-label={t('bookChapters')} className="flex flex-wrap justify-center gap-2" onKeyDown={onKey}>
            {spreads.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => { tabs.current[i] = el }}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={tab === i}
                aria-controls={`panel-${s.id}`}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
                className={`min-h-11 border px-4 text-[13px] font-medium transition-colors duration-200 ${
                  tab === i ? 'border-white bg-white text-ink' : 'border-white/45 text-white hover:border-white'
                }`}
              >
                {s.index} · {p(s.label_en, s.label_ar)}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${sp.id}`} aria-labelledby={`tab-${sp.id}`} className="mt-6">
            <h2 className="text-[20px] font-medium">{p(sp.title_en, sp.title_ar)}</h2>
            <p className="mx-auto mt-2 max-w-[60ch] text-[15px] leading-relaxed text-white/85">{p(sp.body_en, sp.body_ar)}</p>
            {sp.sample && (
              <p className="mx-auto mt-3 max-w-[60ch] text-[13px] text-white/75">
                <span className="label me-2 border border-white/50 px-2 py-1 text-[10px]">{t('sample')}</span>
                {p(sp.sample.lines_en, sp.sample.lines_ar).join(' · ')}
              </p>
            )}
            <a href={sp.link.href} className="mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium underline decoration-1 underline-offset-[6px]">
              {p(sp.link.label_en, sp.link.label_ar)} <span aria-hidden className="flip-rtl">→</span>
            </a>
          </div>
        </div>

        {/* the search bar, already in its final state */}
        <div className="relative h-[240px]">
          <SearchMorph ref={search} active />
        </div>
      </div>
    </div>
  )
}
