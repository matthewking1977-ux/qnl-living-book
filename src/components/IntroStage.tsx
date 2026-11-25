import { useEffect, useMemo, useRef, useState } from 'react'
import { Book, type BookHandle } from './Book/Book'
import type { BookPose } from './Book/geometry'
import { frameAt, isMobile, SEARCH_STOP, SPREAD_STOPS } from './Book/choreography'
import { SpreadOutline } from './SpreadOutline'
import { introSeen, markIntroSeen, clearIntroSeen } from '../lib/intro'
import { ChapterIndex } from './ChapterIndex'
import { DebugHud } from './DebugHud'
import { ProgressRail } from './ProgressRail'
import { SearchMorph, type SearchMorphHandle } from './SearchMorph'
import { SkipIntro } from './SkipIntro'
import { Tx } from './Tx'
import { ui } from '../data/spreads'
import gsap from 'gsap'
import { ScrollTrigger, scrollToY } from '../lib/scroll'

const debug = new URLSearchParams(location.search).get('debug') === '1'
const first0 = () => frameAt(0, innerWidth, innerHeight).pose

/** smoothed pointer position, −1…1 on each axis (x, y) and its target (tx, ty) */
const pointer = { x: 0, y: 0, tx: 0, ty: 0, reach: 4 }
/** the scroll pose plus the pointer's pull: up to ±4° of turn and ±2.5° of tilt (±14° turn on a drag) */
const withPointer = (p: BookPose): BookPose => ({ ...p, ry: p.ry + pointer.x * pointer.reach, rx: p.rx - pointer.y * 2.5 })

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
  const bookWrap = useRef<HTMLDivElement>(null)
  const lightPool = useRef<HTMLDivElement>(null)
  const vignette = useRef<HTMLDivElement>(null)
  const base = useRef(first0())
  const search = useRef<SearchMorphHandle>(null)
  const [searchOn, setSearchOn] = useState(false)
  const progress = useRef(0)
  const [chapter, setChapter] = useState(-1)
  const [chromeOn, setChromeOn] = useState(false)
  // Pop-up artwork is loaded one spread ahead of the reader. Nothing is fetched until
  // the visitor starts scrolling or the page has settled, so it never competes with
  // the first paint (the closed book needs none of it).
  const [loadUpTo, setLoadUpTo] = useState(-1)
  // the spread the reader is on (or last was); phones keep only it and the next one built
  const [focus, setFocus] = useState(0)
  const first = useMemo(() => frameAt(0, innerWidth, innerHeight), [])
  const [mobile, setMobile] = useState(() => isMobile(innerWidth))

  useEffect(() => {
    const render = (s: number) => {
      progress.current = s
      const f = frameAt(s, innerWidth, innerHeight)
      base.current = f.pose
      book.current?.apply(withPointer(f.pose))
      // stage lighting: a warm pool behind the open book, darker edges around it
      lightPool.current!.style.opacity = String(f.chrome)
      vignette.current!.style.opacity = String(f.chrome)
      arrival.current!.style.opacity = String(f.arrival)
      dark.current!.style.opacity = String(0.66 + 0.22 * f.dark)
      chrome.current!.style.opacity = String(f.chrome)
      railFill.current!.style.transform = `scaleY(${s})`
      bookWrap.current!.style.opacity = String(f.bookFade)
      search.current?.apply(f.search)
      setSearchOn(f.search > 0.9)
      if (f.search > 0.9) markIntroSeen('session') // the intro plays once per session
      setChapter(f.chapter)
      if (s > 0.004) setLoadUpTo((n) => Math.max(n, f.chapter + 1, 0))
      if (f.chapter >= 0) setFocus(f.chapter)
      setChromeOn(f.chrome > 0.5)
    }
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    })
    // Pointer: on desktop the open book turns a few degrees towards the mouse, so the
    // pop-up layers shift against each other. It follows the visitor, it never moves
    // by itself. Smoothed here and applied to the book's root transform only.
    const fine = matchMedia('(pointer: fine)').matches
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / innerWidth) * 2 - 1
      pointer.ty = (e.clientY / innerHeight) * 2 - 1
    }
    if (fine) addEventListener('pointermove', onPointer, { passive: true })

    // Idle breath: the only thing that moves on its own. While the closed book waits
    // at the top it sways ±2° on a 6 s loop, fading out as soon as the scroll begins.
    const tick = (time: number) => {
      const s = progress.current
      const dx = pointer.tx - pointer.x
      const dy = pointer.ty - pointer.y
      const moving = Math.abs(dx) + Math.abs(dy) > 0.0005
      if (moving) {
        pointer.x += dx * 0.08
        pointer.y += dy * 0.08
      }
      const breathing = s < 0.04
      if (!moving && !breathing) return
      const pose = withPointer(base.current)
      if (breathing) {
        const k = 1 - s / 0.04
        const a = (time / 6) * Math.PI * 2
        pose.ry += 2 * Math.sin(a) * k
        pose.rx += 0.7 * Math.sin(a + 1.3) * k
      }
      book.current?.applyRoot(pose)
    }
    gsap.ticker.add(tick)

    const warm = () => setLoadUpTo((n) => Math.max(n, 0))
    const warmTimer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 2000 })
      else warm()
    }, 2500)

    // Returning visitors (skipped before, or already watched this session) start at the
    // search bar. Only when the page loads at the very top: a restored scroll position
    // or an anchor link always wins. ?intro=1 forces the intro.
    const force = new URLSearchParams(location.search).get('intro') === '1'
    if (!force && introSeen() && scrollY < 4 && !location.hash) yAt(SEARCH_STOP, true)

    const onResize = () => setMobile(isMobile(innerWidth))
    addEventListener('resize', onResize)

    // Keyboard: arrows and Page Up/Down step between the resting points of the
    // sequence. Outside the sequence (or past its ends) the keys scroll natively,
    // so there is never a trap.
    const stops = [0, ...SPREAD_STOPS, SEARCH_STOP]
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown'
      const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp'
      if (!fwd && !back) return
      const s = progress.current
      const r = track.current!.getBoundingClientRect()
      if (r.top > 1 || r.bottom < innerHeight - 1) return // stage not pinned
      const next = fwd ? stops.find((x) => x > s + 0.004) : [...stops].reverse().find((x) => x < s - 0.004)
      if (next === undefined) return
      e.preventDefault()
      yAt(next)
    }
    addEventListener('keydown', onKey)

    // Touch snapping (phones): when a swipe comes to rest inside the sequence, glide on
    // to the next resting point in the direction of the swipe, or back to the nearest
    // one after a small nudge. Past the search bar the page scrolls freely.
    let touching = false
    let startS = 0
    let settle = 0
    const snapNow = () => {
      if (touching || !isMobile(innerWidth)) return
      const s = progress.current
      if (s <= 0.002 || s >= SEARCH_STOP - 0.002) return
      if (stops.some((x) => Math.abs(x - s) < 0.004)) return
      const moved = s - startS
      let target: number
      if (Math.abs(moved) < 0.01) target = stops.reduce((a, b) => (Math.abs(b - s) < Math.abs(a - s) ? b : a))
      else if (moved > 0) target = stops.find((x) => x >= s) ?? SEARCH_STOP
      else target = [...stops].reverse().find((x) => x <= s) ?? 0
      yAt(target, false, Math.min(1.1, 0.45 + Math.abs(target - s) * 2.5))
    }
    const onScroll = () => {
      clearTimeout(settle)
      settle = window.setTimeout(snapNow, 140)
    }
    // A sideways drag on a spread turns the book (up to ±14°) so the layers slide
    // against each other; it springs back on release. Vertical drags scroll as normal.
    let tx0 = 0
    let ty0 = 0
    const onTouchStart = (e: TouchEvent) => {
      touching = true
      startS = progress.current
      clearTimeout(settle)
      tx0 = e.touches[0]?.clientX ?? 0
      ty0 = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t || frameAt(progress.current, innerWidth, innerHeight).chapter < 0) return
      const dx = t.clientX - tx0
      if (Math.abs(dx) < Math.abs(t.clientY - ty0)) return
      pointer.reach = 14
      pointer.tx = Math.max(-1, Math.min(1, dx / (innerWidth * 0.45)))
    }
    const onTouchEnd = () => {
      pointer.tx = 0
      touching = false
      clearTimeout(settle)
      settle = window.setTimeout(snapNow, 140)
    }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('touchstart', onTouchStart, { passive: true })
    addEventListener('touchmove', onTouchMove, { passive: true })
    addEventListener('touchend', onTouchEnd, { passive: true })
    addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      st.kill()
      gsap.ticker.remove(tick)
      removeEventListener('pointermove', onPointer)
      removeEventListener('resize', onResize)
      removeEventListener('keydown', onKey)
      clearTimeout(settle)
      clearTimeout(warmTimer)
      removeEventListener('scroll', onScroll)
      removeEventListener('touchstart', onTouchStart)
      removeEventListener('touchmove', onTouchMove)
      removeEventListener('touchend', onTouchEnd)
      removeEventListener('touchcancel', onTouchEnd)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // newly built pop-up pieces start hidden; draw them in the current pose
  useEffect(() => {
    if (loadUpTo < 0) return
    book.current?.apply(withPointer(frameAt(progress.current, innerWidth, innerHeight).pose))
  }, [loadUpTo, focus])

  /** scroll so the sequence sits at progress s */
  const yAt = (s: number, immediate = false, duration?: number) => {
    const el = track.current!
    const top = el.getBoundingClientRect().top + scrollY
    scrollToY(top + s * (el.offsetHeight - innerHeight), immediate, duration)
  }
  const goTo = (i: number) => yAt(SPREAD_STOPS[i])

  const skip = () => {
    markIntroSeen('always')
    yAt(SEARCH_STOP, true)
    // hand focus to the search field the user skipped to
    requestAnimationFrame(() => document.getElementById('q')?.focus({ preventScroll: true }))
  }
  const replay = () => {
    clearIntroSeen()
    yAt(0)
  }

  return (
    <div ref={track} className="relative h-[350vh] md:h-[500vh]">
      <section className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-ink text-white" aria-label="Introduction">
        {/* LCP: poster still, darkened */}
        <picture>
          <source type="image/avif" srcSet="/img/interior-640.avif 640w, /img/interior-1280.avif 1280w, /img/interior-1920.avif 1920w" sizes="100vw" />
          <source type="image/webp" srcSet="/img/interior-640.webp 640w, /img/interior-1280.webp 1280w, /img/interior-1920.webp 1920w" sizes="100vw" />
          <img src="/img/interior-1280.webp" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <div ref={dark} className="absolute inset-0 bg-ink" style={{ opacity: 0.66 }} />

        {/* Skip intro comes first in the DOM so it is the first focusable element */}
        <header className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[1440px] flex-row-reverse items-center justify-between px-4 py-4 md:px-10 md:py-6">
          <SkipIntro done={searchOn} onSkip={skip} onReplay={replay} />
          <img src="/img/qnl-logo-white.webp" alt="Qatar National Library" width={480} height={250} className="h-12 w-auto md:h-14" />
        </header>

        {/* For screen readers and keyboard users: the four spreads as headings and links.
            Focusing a link brings its spread on screen. The book itself is decorative. */}
        <SpreadOutline onFocusSpread={goTo} />

        {/* warm pool of light behind the open book */}
        <div
          ref={lightPool}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0, background: 'radial-gradient(ellipse 42% 46% at 50% 48%, rgba(255,226,176,.17), rgba(255,226,176,.05) 55%, transparent 75%)' }}
        />

        <div ref={bookWrap} className="absolute inset-0">
          <Book
            key={mobile ? 'm' : 'd'}
            ref={book}
            pose={first.pose}
            loadUpTo={mobile ? (loadUpTo < 0 ? -1 : focus + 1) : loadUpTo}
            mountFrom={mobile ? focus : 0}
            mobile={mobile}
          />
        </div>

        {/* vignette: pulls the eye to the centre of the spread */}
        <div
          ref={vignette}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0, background: 'radial-gradient(ellipse 70% 72% at 50% 50%, transparent 52%, rgba(0,0,0,.5) 86%, rgba(0,0,0,.72) 100%)' }}
        />

        {/* Phase 6: the book becomes the search bar */}
        <SearchMorph ref={search} active={searchOn} />

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

        {/* progress rail + chapter index; on phones a row along the bottom, clear of the book */}
        <div
          ref={chrome}
          className={
            mobile
              ? 'absolute inset-x-0 bottom-3 z-10 flex justify-center focus-within:opacity-100!'
              : 'absolute inset-y-0 start-10 z-10 flex items-center gap-4 focus-within:opacity-100!'
          }
          style={{ opacity: 0, pointerEvents: chromeOn ? 'auto' : 'none' }}
        >
          <div className={mobile ? 'hidden' : 'h-[34vh]'}>
            <ProgressRail ref={railFill} />
          </div>
          <ChapterIndex active={chapter} onSelect={goTo} row={mobile} />
        </div>
      </section>
      {debug && <DebugHud progress={progress} />}
    </div>
  )
}
