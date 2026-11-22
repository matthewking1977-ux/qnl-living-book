import { useEffect, useMemo, useRef, useState } from 'react'
import { Book, type BookHandle } from './Book/Book'
import { frameAt, SPREAD_STOPS } from './Book/choreography'
import { ChapterIndex } from './ChapterIndex'
import { DebugHud } from './DebugHud'
import { ProgressRail } from './ProgressRail'
import { SkipIntro } from './SkipIntro'
import { Tx } from './Tx'
import { ui } from '../data/spreads'
import { ScrollTrigger, scrollToY } from '../lib/scroll'

const debug = new URLSearchParams(location.search).get('debug') === '1'

/**
 * The opening sequence: a tall track with a sticky stage. ScrollTrigger turns
 * the track's scroll position into one progress value s, and `frameAt(s)`
 * (Book/choreography.ts, commented phase by phase) decides everything else.
 * The scrub writes transform and opacity only.
 */
export function IntroStage() {
  const track = useRef<HTMLDivElement>(null)
  const book = useRef<BookHandle>(null)
  const arrival = useRef<HTMLDivElement>(null)
  const dark = useRef<HTMLDivElement>(null)
  const chrome = useRef<HTMLDivElement>(null)
  const railFill = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [chapter, setChapter] = useState(-1)
  const [chromeOn, setChromeOn] = useState(false)
  // pop-up artwork is loaded one spread ahead of the reader
  const [loadUpTo, setLoadUpTo] = useState(0)
  const first = useMemo(() => frameAt(0, innerWidth, innerHeight), [])

  useEffect(() => {
    const render = (s: number) => {
      progress.current = s
      const f = frameAt(s, innerWidth, innerHeight)
      book.current?.apply(f.pose)
      arrival.current!.style.opacity = String(f.arrival)
      dark.current!.style.opacity = String(0.66 + 0.22 * f.dark)
      chrome.current!.style.opacity = String(f.chrome)
      railFill.current!.style.transform = `scaleY(${s})`
      setChapter(f.chapter)
      setLoadUpTo((n) => Math.max(n, f.chapter + 1))
      setChromeOn(f.chrome > 0.5)
    }
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    })
    return () => st.kill()
  }, [])

  const goTo = (i: number) => {
    const el = track.current!
    const top = el.getBoundingClientRect().top + scrollY
    scrollToY(top + SPREAD_STOPS[i] * (el.offsetHeight - innerHeight))
  }

  return (
    <div ref={track} className="relative h-[500vh]">
      <section className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-ink text-white" aria-label="Introduction">
        {/* LCP: poster still, darkened */}
        <picture>
          <source type="image/avif" srcSet="/img/interior-640.avif 640w, /img/interior-1280.avif 1280w, /img/interior-1920.avif 1920w" sizes="100vw" />
          <source type="image/webp" srcSet="/img/interior-640.webp 640w, /img/interior-1280.webp 1280w, /img/interior-1920.webp 1920w" sizes="100vw" />
          <img src="/img/interior-1280.webp" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <div ref={dark} className="absolute inset-0 bg-ink" style={{ opacity: 0.66 }} />

        {/* Skip intro comes first in the DOM so it is the first focusable element */}
        <header className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1440px] flex-row-reverse items-center justify-between px-4 py-4 md:px-10 md:py-6">
          <SkipIntro />
          <img src="/img/qnl-logo-white.webp" alt="Qatar National Library" width={480} height={250} className="h-12 w-auto md:h-14" />
        </header>

        <Book ref={book} pose={first.pose} loadUpTo={loadUpTo} />

        {/* Phase 0 copy */}
        <div
          ref={arrival}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-6 pb-[9vh] pt-[15vh] text-center"
        >
          <p className="label text-white/80">
            <Tx en={ui.institution.en} ar={ui.institution.ar} />
          </p>
          <div>
            <h1 className="font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.08] tracking-[-0.01em]">
              <Tx en={ui.headline.en} ar={ui.headline.ar} tbc={ui.headline.arTbc} />
            </h1>
            <p className="label mt-5 text-white/80">
              <Tx en={ui.cue.en} ar={ui.cue.ar} /> <span aria-hidden>↓</span>
            </p>
          </div>
        </div>

        {/* progress rail + chapter index */}
        <div
          ref={chrome}
          className="absolute inset-y-0 start-4 z-10 flex items-center gap-4 md:start-10"
          style={{ opacity: 0, pointerEvents: chromeOn ? 'auto' : 'none' }}
        >
          <div className="h-[34vh]">
            <ProgressRail ref={railFill} />
          </div>
          <ChapterIndex active={chapter} onSelect={goTo} disabled={!chromeOn} />
        </div>
      </section>
      {debug && <DebugHud progress={progress} />}
    </div>
  )
}
