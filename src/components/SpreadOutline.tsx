import { spreads } from '../data/spreads'
import { usePick, useT } from '../lib/i18n'

/**
 * Visually hidden outline of the book: each spread as a heading, its copy and a
 * real link. This is what assistive technology reads instead of the decorative
 * 3D book. When a link takes keyboard focus the matching spread is brought on
 * screen, and the link itself becomes visible so focus is never lost.
 */
export function SpreadOutline({ onFocusSpread }: { onFocusSpread?: (i: number) => void }) {
  const t = useT()
  const p = usePick()
  return (
    <section aria-label={t('insideBook')} className="absolute inset-x-0 bottom-6 z-20 flex justify-center">
      {spreads.map((sp, i) => (
        <div key={sp.id}>
          <h2 className="sr-only">{p(sp.label_en, sp.label_ar)}: {p(sp.title_en, sp.title_ar)}</h2>
          <p className="sr-only">{p(sp.body_en, sp.body_ar)}</p>
          <a
            href={sp.link.href}
            onFocus={() => onFocusSpread?.(i)}
            className="sr-only focus:not-sr-only focus:absolute focus:bottom-0 focus:left-1/2 focus:inline-flex focus:min-h-11 focus:-translate-x-1/2 focus:items-center focus:bg-white focus:px-5 focus:text-[14px] focus:font-medium focus:whitespace-nowrap focus:text-ink"
          >
            {p(sp.link.label_en, sp.link.label_ar)}
          </a>
        </div>
      ))}
    </section>
  )
}
