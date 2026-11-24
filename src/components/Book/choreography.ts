import { clamp01, dwell, lerp, smoothstep } from '../../lib/easing'
import { H, POSE_CLOSED, POSE_OPEN, T, W, type BookPose } from './geometry'

/**
 * The whole opening sequence as a pure function of scroll progress s (0…1).
 * Each phase is a smoothstep window; page turns use the dwell curve so every
 * spread rests in the centre before the next turn.
 */

/** [start of turn, end of turn, end of spread] for spreads A–D */
export const SPREAD_WINDOWS: [number, number, number][] = [
  [0.18, 0.232, 0.34],
  [0.34, 0.392, 0.5],
  [0.5, 0.552, 0.66],
  [0.66, 0.712, 0.8],
]
/** pop-up timing relative to a spread window: rise just as the page lands, fold before the next turn */
const POP_RISE: [number, number] = [-0.012, 0.04]
const POP_FOLD: [number, number] = [-0.034, -0.004]
/** scroll progress at which the search bar is fully formed (Skip intro lands here) */
export const SEARCH_STOP = 0.96
/** where the chapter index sends you: the middle of each spread's rest, pop-up standing */
export const SPREAD_STOPS = SPREAD_WINDOWS.map(([, b, c]) => (b + POP_RISE[1] + c + POP_FOLD[0]) / 2)

export const PHASES = [
  [0.0, 'Arrival'],
  [0.08, 'Open'],
  [0.18, 'Spread A'],
  [0.34, 'Spread B'],
  [0.5, 'Spread C'],
  [0.66, 'Spread D'],
  [0.8, 'Close into search'],
  [0.92, 'Release'],
] as const

export function phaseAt(s: number) {
  let i = 0
  while (i < PHASES.length - 1 && s >= PHASES[i + 1][0]) i++
  return i
}

export interface Frame {
  pose: BookPose
  /** arrival copy opacity */
  arrival: number
  /** background darkening, 0…1 */
  dark: number
  /** rail + chapter index opacity */
  chrome: number
  /** active spread, −1 when none */
  chapter: number
  /** 0 book … 1 search bar */
  search: number
  /** book opacity during the cross-fade */
  bookFade: number
}

// portrait (phone): the book is turned 90°, so its height runs across the screen
const fitClosed = (vw: number, vh: number) =>
  isMobile(vw) ? Math.min((vw * 0.78) / H, (vh * 0.34) / W) : Math.min((vh * 0.46) / H, (vw * 0.62) / W)
// the open book is seen from low down, so it is short on screen and can run wide; the pop-ups need the headroom
const fitOpen = (vw: number, vh: number) =>
  isMobile(vw)
    ? // portrait: the open book fills the screen width; the spine runs across the middle
      Math.min((vw * 1.06) / H, (vh * 0.66) / (2 * W + T))
    : Math.min((vw * 0.8) / (2 * W + T), (vh * 0.92) / H)

export const isMobile = (vw: number) => vw < 768

export function frameAt(s: number, vw: number, vh: number): Frame {
  // ── Phase 0 · Arrival (0.00–0.08): closed book, three-quarter view ──
  const arrival = 1 - smoothstep(0.03, 0.085, s)

  // ── Phase 1 · Open (0.08–0.18): turn to face the camera, cover swings open ──
  const face = smoothstep(0.08, 0.145, s)
  const coverOpen = smoothstep(0.105, 0.18, s)

  // ── Phases 2–5 · Spreads A–D (0.18–0.80): one page turn each, then rest ──
  const turns = SPREAD_WINDOWS.map(([a, b]) => dwell((s - a) / (b - a)))

  // Pop-ups: fold up slightly after the page lands, fold flat before the next turn.
  // The value is linear here; Book staggers it by depth and adds the overshoot.
  const pops = SPREAD_WINDOWS.map(
    ([, b, c]) =>
      clamp01((s - (b + POP_RISE[0])) / (POP_RISE[1] - POP_RISE[0])) *
      (1 - clamp01((s - (c + POP_FOLD[0])) / (POP_FOLD[1] - POP_FOLD[0]))),
  )

  // ── Phase 6 · Close (0.80–0.92): pages riffle back, cover closes, book settles ──
  for (let i = 0; i < turns.length; i++) {
    const delay = (turns.length - 1 - i) * 0.009 // last-turned page goes first
    turns[i] *= 1 - smoothstep(0.8 + delay, 0.838 + delay, s)
  }
  const coverClose = smoothstep(0.83, 0.875, s)
  // the closed book lies down and shrinks towards the search bar's position…
  const settle = smoothstep(0.84, 0.9, s)
  // …then cross-fades into the bar as the bar widens out of the book's footprint
  const search = smoothstep(0.875, 0.925, s)

  // ── Phase 7 · Release (0.92–1.00): pose holds while the stage unpins ──

  const open = coverOpen * (1 - coverClose)

  // Camera drift: while a spread rests, the camera keeps travelling slowly with the
  // scroll, sweeping across the scene, dipping lower and pushing in, so the pop-up
  // layers slide against each other. It eases in and out with the pop-up itself, so
  // page turns happen from the same neutral position as before.
  let driftY = 0
  let driftX = 0
  let push = 0
  SPREAD_WINDOWS.forEach(([, b, c], i) => {
    const env = smoothstep(0, 1, pops[i])
    if (env <= 0) return
    const r = clamp01((s - (b + POP_RISE[1])) / (c + POP_FOLD[0] - (b + POP_RISE[1])))
    driftY += env * (r - 0.5) * 2 // −1 … 1 across the rest
    driftX += env * Math.sin(Math.PI * r) // 0 → 1 → 0
    push += env * Math.sin(Math.PI * r)
  })

  const mobile = isMobile(vw)
  // portrait looks a little more down onto the lower page, so its text stays readable
  const rxOpen = mobile ? 45 : POSE_OPEN.rx
  const sweep = mobile ? 3 : 6 // degrees either side
  const pose: BookPose = {
    x: 0,
    y: lerp(-vh * 0.03, mobile ? vh * 0.1 : vh * 0.1, face) - vh * 0.17 * settle + vh * 0.025 * push,
    scale: lerp(fitClosed(vw, vh), fitOpen(vw, vh), coverOpen) * lerp(1, 0.5, settle) * lerp(1, 0.7, search) * (1 + 0.04 * push),
    rx: lerp(mobile ? 10 : POSE_CLOSED.rx, rxOpen, face) + 8 * settle + 3 * driftX,
    ry: lerp(mobile ? -18 : POSE_CLOSED.ry, POSE_OPEN.ry, face) + sweep * driftY,
    rz: lerp(POSE_CLOSED.rz, POSE_OPEN.rz, face),
    open,
    turns,
    pops,
  }

  let chapter = -1
  SPREAD_WINDOWS.forEach(([a, , c], i) => {
    if (s >= a + 0.02 && s < c + 0.02) chapter = i
  })
  if (s >= 0.81) chapter = -1

  return {
    pose,
    arrival,
    dark: smoothstep(0.08, 0.18, s),
    chrome: smoothstep(0.15, 0.19, s) * (1 - smoothstep(0.8, 0.84, s)),
    chapter,
    search,
    bookFade: 1 - smoothstep(0.885, 0.915, s),
  }
}
