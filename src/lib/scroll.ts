import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Lenis smooth scroll driven by the GSAP ticker, so ScrollTrigger and Lenis
 * share one clock. Lenis scrolls the real document (no wrapper), which leaves
 * native scroll restoration, anchors and keyboard scrolling intact.
 * Skipped entirely under prefers-reduced-motion.
 */
export function initScroll() {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({ anchors: true, lerp: 0.11 })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToY(y: number, immediate = false, duration = 1.4) {
  if (lenis) lenis.scrollTo(y, { immediate, duration: immediate ? 0 : duration })
  else window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' })
}

export { ScrollTrigger }

/** Freezes page scrolling (e.g. while the search panel is open). */
export function setScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}
