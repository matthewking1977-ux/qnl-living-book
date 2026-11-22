import { forwardRef, type ReactNode } from 'react'
import { FaceContent, Slab } from './Slab'
import { LEAF, M, PH, PW } from './geometry'
import type { Spread } from '../../data/spreads'
import { Tx } from '../Tx'
import { arrow, useDir } from '../../lib/dir'

/** Soft shadow running into the gutter. `side` is where the gutter is on this face. */
function Gutter({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 w-16"
      style={{
        [side]: 0,
        background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, rgba(40,30,10,.22), rgba(40,30,10,.06) 35%, transparent)`,
      }}
    />
  )
}

/** A paper face. Shading sits on the face (and mirrors); text sits in FaceContent (and does not). */
export function PaperFace({ gutter, children, bg }: { gutter: 'left' | 'right'; children?: ReactNode; bg?: string }) {
  return (
    <div className="paper grain absolute inset-0" style={bg ? { backgroundColor: bg } : undefined}>
      <FaceContent>{children}</FaceContent>
      <Gutter side={gutter} />
      {/* turn shading, driven by the timeline */}
      <div data-shade className="pointer-events-none absolute inset-0 bg-black opacity-0" />
    </div>
  )
}

/**
 * Two-sided turning page with real thickness, hinged at the gutter.
 * The wrapper is what the timeline rotates.
 */
export const Page = forwardRef<HTMLDivElement, { front: ReactNode; back: ReactNode }>(function Page(
  { front, back },
  ref,
) {
  return (
    <div ref={ref} className="b3d absolute left-0" style={{ top: M, width: PW, height: PH, transformOrigin: 'left center' }}>
      <Slab w={PW} h={PH} t={LEAF} style={{ transform: `translateZ(${-LEAF / 2}px)` }} front={front} back={back} edgeX="leaf-edge" edgeY="leaf-edge" noHingeEdge />
    </div>
  )
})

/* ---------- spread content ---------- */

/** First page in reading order: chapter label and the one Playfair title. */
export function SpreadLead({ spread }: { spread: Spread }) {
  return (
    <div className="flex h-full flex-col justify-between pb-10 pt-9 pe-11 ps-9">
      <p className="label text-g1">
        <span lang="en">{spread.index}</span>
        <span className="mx-2">·</span>
        <Tx en={spread.label_en} ar={spread.label_ar} />
      </p>
      <h3 className="font-display max-w-[11em] text-[34px] leading-[1.12] tracking-[-0.01em]">
        <Tx en={spread.title_en} ar={spread.title_ar} />
      </h3>
    </div>
  )
}

/** Second page: one line of copy, optional SAMPLE card, and a real link. */
export function SpreadTrail({ spread }: { spread: Spread }) {
  const dir = useDir()
  return (
    <div className="flex h-full flex-col justify-end gap-2 pb-6 pt-9 pe-9 ps-11">
      {spread.sample && (
        <div className="border-t border-ink/25 pt-2">
          <p className="label mb-0.5 text-g1" style={{ fontSize: 9 }} lang="en">Sample</p>
          {spread.sample.lines_en.map((l, i) => (
            <p key={i} className={i === 0 ? 'text-[12px] font-medium' : 'text-[10.5px] leading-snug text-g1'}>
              <Tx en={l} ar={spread.sample!.lines_ar?.[i] ?? null} />
            </p>
          ))}
        </div>
      )}
      <p className="text-[12px] leading-[1.45]">
        <Tx en={spread.body_en} ar={spread.body_ar} />
      </p>
      <a
        href={spread.link.href}
        tabIndex={-1}
        className="group inline-flex min-h-11 items-center gap-2 self-start text-[12px] font-medium underline decoration-1 underline-offset-[5px]"
      >
        <Tx en={spread.link.label_en} ar={spread.link.label_ar} />
        <span aria-hidden className="transition-transform duration-300 ease-(--ease-ui) group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
          {arrow(dir)}
        </span>
      </a>
    </div>
  )
}
