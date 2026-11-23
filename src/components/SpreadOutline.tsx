import { spreads } from '../data/spreads'

/**
 * Visually hidden outline of the book: each spread as a heading, its copy and a
 * real link. This is what assistive technology reads instead of the decorative
 * 3D book. When a link takes keyboard focus the matching spread is brought on
 * screen, and the link itself becomes visible so focus is never lost.
 */
export function SpreadOutline({ onFocusSpread }: { onFocusSpread?: (i: number) => void }) {
  return (
    <section aria-label="Inside the book" className="absolute inset-x-0 bottom-6 z-20 flex justify-center">
      {spreads.map((sp, i) => (
        <div key={sp.id}>
          <h2 className="sr-only">{sp.label_en}: {sp.title_en}</h2>
          <p className="sr-only">{sp.body_en}</p>
          <a
            href={sp.link.href}
            onFocus={() => onFocusSpread?.(i)}
            className="sr-only focus:not-sr-only focus:absolute focus:bottom-0 focus:left-1/2 focus:inline-flex focus:min-h-11 focus:-translate-x-1/2 focus:items-center focus:bg-white focus:px-5 focus:text-[14px] focus:font-medium focus:whitespace-nowrap focus:text-ink"
          >
            {sp.link.label_en} →
          </a>
        </div>
      ))}
    </section>
  )
}
