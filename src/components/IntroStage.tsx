import { useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react'
import { Book, type BookHandle } from './Book/Book'
import type { BookPose } from './Book/geometry'
import { frameAt, isMobile, POP_RISE, SEARCH_STOP, SPREAD_STOPS, SPREAD_WINDOWS } from './Book/choreography'
import { SpreadOutline } from './SpreadOutline'
import { introSeen, markIntroSeen, clearIntroSeen } from '../lib/intro'
import { ChapterIndex } from './ChapterIndex'
import { DebugHud } from './DebugHud'
import { ProgressRail } from './ProgressRail'
import { SearchMorph, type SearchMorphHandle } from './SearchMorph'
import { SkipIntro } from './SkipIntro'
import { PageControls } from './PageControls'
import { SiteHeader } from './SiteHeader'
import { useLang } from '../lib/dir'
import { Tx } from './Tx'
import { ui } from '../data/spreads'
import gsap from 'gsap'
import { ScrollTrigger, scrollToY } from '../lib/scroll'

const debug = new URLSearchParams(location.search).get('debug') === '1'
/** resting points of the sequence: closed book, the four spreads, the search bar */
const STOPS = [0, ...SPREAD_STOPS, SEARCH_STOP]
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
  const lang = useLang()

  // Tap-driven playback (phones): the sequence plays as timed animation between
  // resting points instead of following the finger.
  const renderRef = useRef<(s: number) => void>(() => {})
  const play = useRef<{ tween: gsap.core.Tween | gsap.core.Timeline | null; state: { s: number }; target: number }>({ tween: null, state: { s: 0 }, target: 0 })
  const [stopIndex, setStopIndex] = useState(0)

  /** play the sequence to progress `target` (phones), or jump there with `instant` */
  const go = (target: number, instant = false) => {
    const pl = play.current
    pl.tween?.kill()
    pl.target = target
    setStopIndex(STOPS.findIndex((x) => Math.abs(x - target) < 0.001))
    pl.state.s = progress.current
    if (instant) {
      pl.state.s = target
      renderRef.current(target)
      return
    }
    // Paced by phase rather than one ease: seconds per unit of progress in each stretch.
    // The page flip is brisk, the pop-up rise slow enough to watch each piece stand up
    // and settle, and everything else (fold-away, cover, closing) in between.
    const from = pl.state.s
    const pace = (x: number) => {
      for (const [a, b] of SPREAD_WINDOWS) {
        if (x >= b + POP_RISE[0] && x < b + POP_RISE[1]) return 32 // rise ≈ 1.7 s
        if (x >= a && x < b) return 19 // page flip ≈ 1 s
      }
      return 10
    }
    const marks = new Set<number>([target])
    for (const [a, b] of SPREAD_WINDOWS) for (const m of [a, b + POP_RISE[0], b + POP_RISE[1]]) {
      if ((m - from) * (target - from) > 0 && Math.abs(m - from) < Math.abs(target - from)) marks.add(m)
    }
    const points = [...marks].sort((x, y) => (target > from ? x - y : y - x))
    const tl = gsap.timeline({ onUpdate: () => renderRef.current(pl.state.s) })
    let at = from
    points.forEach((m, i) => {
      const mid = (at + m) / 2
      const ease = points.length === 1 ? 'sine.inOut' : i === 0 ? 'sine.in' : i === points.length - 1 ? 'sine.out' : 'none'
      tl.to(pl.state, { s: m, duration: Math.max(0.25, Math.abs(m - at) * pace(mid)), ease })
      at = m
    })
    pl.tween = tl
  }
  const step = (dir: 1 | -1) => {
    const from = play.current.target
    const next = dir > 0 ? STOPS.find((x) => x > from + 0.001) : [...STOPS].reverse().find((x) => x < from - 0.001)
    if (next !== undefined) go(next)
  }

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
      if (f.search > 0.9) markIntroSeen() // watched through: start at the search bar for 30 days
      setChapter(f.chapter)
      if (s > 0.004) setLoadUpTo((n) => Math.max(n, f.chapter + 1, 0))
      if (f.chapter >= 0) setFocus(f.chapter)
      setChromeOn(f.chrome > 0.5)
    }
    renderRef.current = render

    // Desktop: the scroll position drives the sequence. Phones: taps and swipes play it.
    const st = mobile
      ? null
      : ScrollTrigger.create({
          trigger: track.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => render(self.progress),
        })
    if (mobile) {
      play.current.tween?.kill()
      render(play.current.target)
    }

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
    // at the top it sways ±2° on a 6 s loop, fading out as soon as the book opens.
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
    if (!force && introSeen() && scrollY < 4 && !location.hash) {
      if (mobile) go(SEARCH_STOP, true)
      else yAt(SEARCH_STOP, true)
    }

    const onResize = () => setMobile(isMobile(innerWidth))
    addEventListener('resize', onResize)

    // Keyboard: arrows and Page Up/Down step between the resting points of the
    // sequence. Outside the sequence (or past its ends) the keys scroll natively,
    // so there is never a trap.
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown'
      const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp'
      if (!fwd && !back) return
      const r = track.current!.getBoundingClientRect()
      if (mobile) {
        if (r.bottom < innerHeight * 0.5) return // stage scrolled away
        const t0 = play.current.target
        if ((fwd && t0 >= SEARCH_STOP) || (back && t0 <= 0)) return
        e.preventDefault()
        step(fwd ? 1 : -1)
        return
      }
      if (r.top > 1 || r.bottom < innerHeight - 1) return // stage not pinned
      const s = progress.current
      const next = fwd ? STOPS.find((x) => x > s + 0.004) : [...STOPS].reverse().find((x) => x < s - 0.004)
      if (next === undefined) return
      e.preventDefault()
      yAt(next)
    }
    addEventListener('keydown', onKey)

    return () => {
      st?.kill()
      gsap.ticker.remove(tick)
      removeEventListener('pointermove', onPointer)
      removeEventListener('resize', onResize)
      removeEventListener('keydown', onKey)
      clearTimeout(warmTimer)
    }
  }, [mobile]) // eslint-disable-line react-hooks/exhaustive-deps

  // Phones: a sideways swipe on the stage turns the page (left = next). Vertical swipes
  // are left to the browser, so the page below always scrolls normally.
  const swipe = useRef({ x: 0, y: 0, t: 0 })
  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0]
    swipe.current = { x: t.clientX, y: t.clientY, t: performance.now() }
  }
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (!mobile) return
    const t = e.changedTouches[0]
    const dx = t.clientX - swipe.current.x
    const dy = t.clientY - swipe.current.y
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4 || performance.now() - swipe.current.t > 700) return
    step(dx < 0 ? 1 : -1)
  }

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
  const goTo = (i: number) => (mobile ? go(SPREAD_STOPS[i]) : yAt(SPREAD_STOPS[i]))

  const introEnd = useMemo(() => () => {
    const el = track.current
    return el ? el.getBoundingClientRect().bottom + scrollY : innerHeight
  }, [])

  const skip = () => {
    markIntroSeen()
    if (mobile) go(SEARCH_STOP, true)
    else yAt(SEARCH_STOP, true)
    // hand focus to the search field the user skipped to
    requestAnimationFrame(() => document.getElementById('q')?.focus({ preventScroll: true }))
  }
  const replay = () => {
    clearIntroSeen()
    if (mobile) go(0, true)
    else yAt(0)
  }

  return (
    <div ref={track} className="relative h-svh min-h-[560px] md:h-[500vh]">
      <section
        className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-ink text-white"
        aria-label="Introduction"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* LCP: poster still, darkened */}
        <picture>
          <source type="image/avif" srcSet="/img/interior-640.avif 640w, /img/interior-1280.avif 1280w, /img/interior-1920.avif 1920w" sizes="100vw" />
          <source type="image/webp" srcSet="/img/interior-640.webp 640w, /img/interior-1280.webp 1280w, /img/interior-1920.webp 1920w" sizes="100vw" />
          <img src="/img/interior-1280.webp" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <div ref={dark} className="absolute inset-0 bg-ink" style={{ opacity: 0.66 }} />

        {/* fixed site header; Skip intro is the first focusable element on the page */}
        <SiteHeader action={<SkipIntro done={searchOn} onSkip={skip} onReplay={replay} />} solidAfter={introEnd} />

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
            key={(mobile ? 'm' : 'd') + lang}
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
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-6 pb-[calc(110px+env(safe-area-inset-bottom))] pt-[15vh] text-center md:pb-[9vh]"
        >
          <p className="label text-white/80">
            <Tx en={ui.institution.en} ar={ui.institution.ar} />
          </p>
          <div>
            <h1 className="font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.08] tracking-[-0.01em]">
              <Tx en={ui.headline.en} ar={ui.headline.ar} tbc={ui.headline.arTbc} />
            </h1>
            {/* phones open the book with the button below instead */}
            {!mobile && (
              <p className="label mt-5 text-white/80">
                <Tx en={ui.cue.en} ar={ui.cue.ar} /> <span aria-hidden>↓</span>
              </p>
            )}
          </div>
        </div>

        {/* progress rail + chapter index; on phones a row along the bottom, clear of the book */}
        <div
          ref={chrome}
          className={
            mobile
              ? 'absolute inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-10 flex justify-center focus-within:opacity-100!'
              : 'absolute inset-y-0 start-10 z-10 flex items-center gap-4 focus-within:opacity-100!'
          }
          style={{ opacity: 0, pointerEvents: chromeOn ? 'auto' : 'none' }}
        >
          <div className={mobile ? 'hidden' : 'h-[34vh]'}>
            <ProgressRail ref={railFill} />
          </div>
          <ChapterIndex active={chapter} onSelect={goTo} row={mobile} />
        </div>

        {/* Phones: glass controls that play the next or previous turn */}
        {mobile && (
          <PageControls
            index={stopIndex}
            last={STOPS.length - 1}
            onNext={() => step(1)}
            onBack={() => step(-1)}
          />
        )}
      </section>
      {debug && <DebugHud progress={progress} />}
    </div>
  )
}
