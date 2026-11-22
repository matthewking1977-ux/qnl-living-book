import { forwardRef } from 'react'

/** Thin side rail. The fill is scaled by the timeline (transform only). */
export const ProgressRail = forwardRef<HTMLDivElement>(function ProgressRail(_, fillRef) {
  return (
    <div aria-hidden className="relative h-full w-px bg-white/25">
      <div ref={fillRef} className="absolute inset-0 origin-top bg-white" style={{ transform: 'scaleY(0)' }} />
    </div>
  )
})
