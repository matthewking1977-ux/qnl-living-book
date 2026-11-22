import { dwell, lerp, smoothstep } from '../../lib/easing'
import { H, POSE_CLOSED, POSE_OPEN, T, W, type BookPose } from './geometry'

/**
 * The whole opening sequence as a pure function of scroll progress s (0…1).
 * Each phase is a smoothstep window; page turns use the dwell curve so every
 * spread rests in the centre before the next turn.
 */

/** [start of turn, end of turn, end of spread] for spreads A–D */
export const SPREAD_WINDOWS: [number, number, number][] = [
  [0.18, 0.245, 0.34],
  [0.34, 0.405, 0.5],
  [0.5, 0.565, 0.66],
  [0.66, 0.725, 0.8],
]
/** where the chapter index sends you: the middle of each spread's rest */
export const SPREAD_STOPS = SPREAD_WINDOWS.map(([, b, c]) => (b + c) / 2)

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
}

const fitClosed = (vw: number, vh: number) => Math.min((vh * 0.46) / H, (vw * 0.62) / W)
const fitOpen = (vw: number, vh: number) => Math.min((vw * 0.84) / (2 * W + T), (vh * 0.68) / H)

export function frameAt(s: number, vw: number, vh: number): Frame {
  // ── Phase 0 · Arrival (0.00–0.08): closed book, three-quarter view ──
  const arrival = 1 - smoothstep(0.03, 0.085, s)

  // ── Phase 1 · Open (0.08–0.18): turn to face the camera, cover swings open ──
  const face = smoothstep(0.08, 0.145, s)
  const coverOpen = smoothstep(0.105, 0.18, s)

  // ── Phases 2–5 · Spreads A–D (0.18–0.80): one page turn each, then rest ──
  const turns = SPREAD_WINDOWS.map(([a, b]) => dwell((s - a) / (b - a)))

  // ── Phase 6 · Close (0.80–0.92): pages riffle back, cover closes, book settles ──
  for (let i = 0; i < turns.length; i++) {
    const delay = (turns.length - 1 - i) * 0.009 // last-turned page goes first
    turns[i] *= 1 - smoothstep(0.8 + delay, 0.838 + delay, s)
  }
  const coverClose = smoothstep(0.835, 0.895, s)
  const settle = smoothstep(0.84, 0.92, s)

  // ── Phase 7 · Release (0.92–1.00): pose holds while the stage unpins ──

  const open = coverOpen * (1 - coverClose)
  const pose: BookPose = {
    x: 0,
    y: lerp(-vh * 0.03, vh * 0.03, face) - vh * 0.04 * settle,
    scale: lerp(fitClosed(vw, vh), fitOpen(vw, vh), coverOpen) * lerp(1, 0.72, settle),
    rx: lerp(POSE_CLOSED.rx, POSE_OPEN.rx, face) + 10 * settle,
    ry: lerp(POSE_CLOSED.ry, POSE_OPEN.ry, face),
    rz: lerp(POSE_CLOSED.rz, POSE_OPEN.rz, face),
    open,
    turns,
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
  }
}
