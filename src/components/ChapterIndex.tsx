import { spreads } from '../data/spreads'
import { usePick, useT } from '../lib/i18n'

/** 01–04. Real buttons, so the spreads can be reached without scrolling. */
export function ChapterIndex({ active, onSelect, row = false }: { active: number; onSelect: (i: number) => void; row?: boolean }) {
  const t = useT()
  const p = usePick()
  return (
    <nav aria-label={t('bookChapters')}>
      <ol className={row ? 'flex flex-row gap-1' : 'flex flex-col'}>
        {spreads.map((sp, i) => (
          <li key={sp.id}>
            <button
              type="button"
              aria-current={active === i ? 'step' : undefined}
              aria-label={`${sp.index}, ${p(sp.label_en, sp.label_ar)}`}
              onClick={() => onSelect(i)}
              className={`group flex min-h-11 min-w-11 items-center gap-3 text-[12px] font-medium tracking-[0.14em] transition-opacity duration-300 ease-(--ease-ui) ${
                active === i ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span>{sp.index}</span>
              <span
                className={`hidden origin-left whitespace-nowrap uppercase transition-[opacity,transform] duration-300 ease-(--ease-ui) 2xl:inline rtl:origin-right ${
                  active === i ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                }`}
              >
                {p(sp.label_en, sp.label_ar)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
