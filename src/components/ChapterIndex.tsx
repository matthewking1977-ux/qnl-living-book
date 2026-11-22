import { spreads } from '../data/spreads'

/** 01–04. Real buttons, so the spreads can be reached without scrolling. */
export function ChapterIndex({ active, onSelect, disabled }: { active: number; onSelect: (i: number) => void; disabled?: boolean }) {
  return (
    <nav aria-label="Book chapters">
      <ol className="flex flex-col">
        {spreads.map((sp, i) => (
          <li key={sp.id}>
            <button
              type="button"
              tabIndex={disabled ? -1 : 0}
              aria-current={active === i ? 'step' : undefined}
              aria-label={`${sp.index}, ${sp.label_en}`}
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
                {sp.label_en}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
