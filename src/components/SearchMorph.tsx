import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ui } from '../data/spreads'
import { lerp, smoothstep } from '../lib/easing'
import { VoiceButton } from './VoiceButton'
import { usePick, useT } from '../lib/i18n'
import { useLang } from '../lib/dir'

export interface SearchMorphHandle {
  /** m: 0 book … 1 search bar. Transform and opacity only. */
  apply(m: number): void
}

const FILTERS = ['filterBooks', 'filterResearch', 'filterEvents', 'filterHeritage'] as const

/**
 * The search bar the book turns into. The white pill starts at roughly the
 * closed book's footprint (narrow and tall) and widens to full size while the
 * book fades out underneath; the field and chips fade in once it has its shape.
 * Not wired to a search backend in this concept.
 */
export const SearchMorph = forwardRef<SearchMorphHandle, { active: boolean }>(function SearchMorph({ active }, ref) {
  const t = useT()
  const p = usePick()
  const lang = useLang()
  const wrap = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const around = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    apply(m) {
      wrap.current!.style.opacity = String(smoothstep(0, 0.35, m))
      pill.current!.style.transform = `scale(${lerp(0.3, 1, m)}, ${lerp(2.2, 1, m)})`
      content.current!.style.opacity = String(smoothstep(0.6, 1, m))
      around.current!.style.opacity = String(smoothstep(0.7, 1, m))
      around.current!.style.transform = `translateY(${lerp(12, 0, smoothstep(0.7, 1, m))}px)`
    },
  }))

  const tab = active ? 0 : -1

  return (
    <div
      ref={wrap}
      id="search"
      className="absolute inset-0 z-10 flex items-center justify-center px-4"
      style={{ opacity: 0, pointerEvents: active ? 'auto' : 'none' }}
      aria-hidden={!active}
    >
      <div className="w-full max-w-[760px] -translate-y-[4vh]">
        <form role="search" className="group relative h-16 md:h-[72px]" onSubmit={(e) => e.preventDefault()}>
          {/* the one permitted blur, behind the bar */}
          <div ref={pill} className="absolute inset-0 rounded-full bg-white shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-md transition-shadow duration-300 ease-(--ease-ui) group-focus-within:shadow-[0_0_0_3px_rgba(255,255,255,.5),0_24px_80px_rgba(0,0,0,.55)]" />
          <div ref={content} className="relative flex h-full items-center gap-2 ps-6 pe-2 md:ps-8">
            <label htmlFor="q" className="sr-only">{t('searchLibrary')}</label>
            <input
              ref={field}
              id="q"
              type="search"
              tabIndex={tab}
              placeholder={p(ui.searchPlaceholder.en, ui.searchPlaceholder.ar)}
              className="h-full min-w-0 flex-1 appearance-none rounded-none border-0 bg-transparent text-[16px] text-ink placeholder:text-g1 focus:outline-none md:text-[18px]"
            />
            {active && <VoiceButton lang={lang === 'ar' ? 'ar-QA' : 'en-GB'} onText={(t) => { if (field.current) field.current.value = t }} />}
            <button
              type="submit"
              tabIndex={tab}
              className="btn-slide h-12 shrink-0 rounded-full bg-ink px-6 text-[14px] font-medium text-white md:h-14 md:px-8"
            >
              <span>{t('search')}</span>
            </button>
          </div>
        </form>
        <div ref={around} className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              tabIndex={tab}
              aria-pressed={filter === f}
              onClick={() => setFilter(filter === f ? null : f)}
              className={`min-h-11 rounded-full border px-5 text-[13px] font-medium transition-colors duration-300 ease-(--ease-ui) ${
                filter === f ? 'border-white bg-white text-ink' : 'border-white/45 text-white hover:border-white'
              }`}
            >
              {t(f)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})
