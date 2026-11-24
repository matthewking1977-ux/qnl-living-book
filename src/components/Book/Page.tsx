import { forwardRef, useContext, type ReactNode } from 'react'
import { FaceContent, PortraitContext, Slab } from './Slab'
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
export function PaperFace({ gutter, children, bg, cast }: { gutter: 'left' | 'right'; children?: ReactNode; bg?: string; cast?: string }) {
  return (
    <div className="paper grain absolute inset-0" style={bg ? { backgroundColor: bg } : undefined}>
      <FaceContent>{children}</FaceContent>
      <Gutter side={gutter} />
      {/* turn shading, driven by the timeline */}
      <div data-shade className="pointer-events-none absolute inset-0 bg-black opacity-0" />
      {/* shadow cast onto this page by the page turning above it: deepest at the gutter */}
      {cast && (
        <div
          data-cast={cast}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: `linear-gradient(to ${gutter === 'left' ? 'right' : 'left'}, rgba(20,14,4,.5), rgba(20,14,4,.18) 45%, transparent 85%)` }}
        />
      )}
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

/** First page in reading order: chapter label and the one Playfair title, kept low so the pop-up has the page. */
export function SpreadLead({ spread }: { spread: Spread }) {
  // portrait: this page stands behind the pop-up, so everything is on the lower page
  if (useContext(PortraitContext)) return null
  return (
    <div className="flex h-full flex-col justify-end gap-4 pb-8 pt-9 pe-11 ps-9">
      <p className="sp-label label text-g1">
        <span lang="en">{spread.index}</span>
        <span className="mx-2">·</span>
        <Tx en={spread.label_en} ar={spread.label_ar} />
      </p>
      <h3 className="sp-title font-display max-w-[11em] text-[30px] leading-[1.12] tracking-[-0.01em]">
        <Tx en={spread.title_en} ar={spread.title_ar} />
      </h3>
    </div>
  )
}

/** Second page: one line of copy, optional SAMPLE card, and a real link. */
export function SpreadTrail({ spread }: { spread: Spread }) {
  if (useContext(PortraitContext)) return <SpreadCard spread={spread} />
  const dir = useDir()
  return (
    <div className="flex h-full flex-col justify-end gap-2 pb-6 pt-9 pe-9 ps-11">
      {spread.sample && (
        <div className="sp-sample border-t border-ink/25 pt-2">
          <p className="label mb-0.5 text-g1" style={{ fontSize: 9 }} lang="en">Sample</p>
          {spread.sample.lines_en.map((l, i) => (
            <p key={i} className={i === 0 ? 'text-[12px] font-medium' : 'text-[10.5px] leading-snug text-g1'}>
              <Tx en={l} ar={spread.sample!.lines_ar?.[i] ?? null} />
            </p>
          ))}
        </div>
      )}
      <p className="sp-body text-[12px] leading-[1.45]">
        <Tx en={spread.body_en} ar={spread.body_ar} />
      </p>
      <a
        href={spread.link.href}
        tabIndex={-1}
        className="sp-link group pointer-events-auto inline-flex min-h-11 items-center gap-2 self-start text-[12px] font-medium underline decoration-1 underline-offset-[5px]"
      >
        <Tx en={spread.link.label_en} ar={spread.link.label_ar} />
        <span aria-hidden className="transition-transform duration-300 ease-(--ease-ui) group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
          {arrow(dir)}
        </span>
      </a>
    </div>
  )
}

/**
 * Portrait (phone) lower page: label, the Playfair title, one line of copy and the
 * link, set low on the page so the pop-up stands clear above it.
 */
function SpreadCard({ spread }: { spread: Spread }) {
  return (
    <div className="flex h-full flex-col justify-end px-10 pb-9">
      <p className="label text-g1" style={{ fontSize: 17, letterSpacing: '0.16em' }}>
        <span lang="en">{spread.index}</span>
        <span className="mx-2">·</span>
        <Tx en={spread.label_en} ar={spread.label_ar} />
      </p>
      <h3 className="font-display mt-3 leading-[1.08] tracking-[-0.01em]" style={{ fontSize: 50 }}>
        <Tx en={spread.title_en} ar={spread.title_ar} />
      </h3>
      <p className="mt-3 leading-[1.35]" style={{ fontSize: 25 }}>
        <Tx en={spread.body_en} ar={spread.body_ar} />
      </p>
      <a
        href={spread.link.href}
        tabIndex={-1}
        className="pointer-events-auto mt-4 inline-flex items-center gap-3 self-start font-medium underline decoration-2 underline-offset-[8px]"
        style={{ fontSize: 25 }}
      >
        <Tx en={spread.link.label_en} ar={spread.link.label_ar} />
        <span aria-hidden>→</span>
      </a>
    </div>
  )
}
