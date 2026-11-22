export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Hermite window: 0 before a, 1 after b. */
export function smoothstep(a: number, b: number, s: number) {
  const x = clamp01((s - a) / (b - a))
  return x * x * (3 - 2 * x)
}

/** "Dwell" easing x³(x(6x−15)+10): rests at both ends so a spread sits in the centre. */
export function dwell(x: number) {
  x = clamp01(x)
  return x * x * x * (x * (6 * x - 15) + 10)
}

/** Ease-out with a small overshoot, for paper layers snapping upright. */
export function backOut(x: number, c = 1.25) {
  x = clamp01(x) - 1
  return 1 + (c + 1) * x * x * x + c * x * x
}
