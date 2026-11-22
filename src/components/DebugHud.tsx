import { useEffect, useRef } from 'react'
import { PHASES, phaseAt } from './Book/choreography'

/** ?debug=1 — shows s, the active phase and FPS. */
export function DebugHud({ progress }: { progress: { current: number } }) {
  const el = useRef<HTMLPreElement>(null)
  useEffect(() => {
    let raf = 0
    let frames = 0
    let last = performance.now()
    let fps = 0
    const tick = (now: number) => {
      frames++
      if (now - last >= 500) {
        fps = Math.round((frames * 1000) / (now - last))
        frames = 0
        last = now
      }
      const s = progress.current
      if (el.current) el.current.textContent = `s     ${s.toFixed(3)}\nphase ${phaseAt(s)} · ${PHASES[phaseAt(s)][1]}\nfps   ${fps}`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress])
  return (
    <pre ref={el} dir="ltr" className="fixed bottom-3 left-3 z-50 bg-ink/90 px-3 py-2 font-mono text-[11px] leading-5 text-white" />
  )
}
