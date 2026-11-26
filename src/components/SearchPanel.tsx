import { useEffect, useRef, useState } from 'react'
import { ui } from '../data/spreads'
import { setScrollLocked } from '../lib/scroll'
import { VoiceButton } from './VoiceButton'
import { usePick, useT } from '../lib/i18n'
import { useLang } from '../lib/dir'

const FILTERS = ['filterBooks', 'filterResearch', 'filterEvents', 'filterHeritage'] as const

/** Opens the search panel from anywhere on the page. */
export const openSearch = () => window.dispatchEvent(new Event('qnl:search'))

/**
 * Full-screen search, one tap from the header on every screen (and "/" on desktop),
 * so regular visitors never have to go through the book. Not wired to a search
 * backend in this concept.
 */
export function SearchPanel() {
  const t = useT()
  const p = usePick()
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onOpen = () => {
      returnTo.current = document.activeElement as HTMLElement
      setOpen(true)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement
        if (t.closest('input, textarea, select, [contenteditable]')) return
        e.preventDefault()
        onOpen()
      }
    }
    addEventListener('qnl:search', onOpen)
    addEventListener('keydown', onKey)
    return () => {
      removeEventListener('qnl:search', onOpen)
      removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    setScrollLocked(open)
    // wait a frame so the panel is visible before focusing its field
    if (open) requestAnimationFrame(() => requestAnimationFrame(() => input.current?.focus({ preventScroll: true })))
    else returnTo.current?.focus?.({ preventScroll: true })
  }, [open])

  // keep Tab inside the panel while it is open
  const trap = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const els = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button, input, a[href]')].filter((el) => !el.hasAttribute('disabled'))
    const first = els[0]
    const last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('searchLibrary')}
      aria-hidden={!open}
      onKeyDown={trap}
      className={`fixed inset-0 z-50 bg-ink text-white transition-[opacity,visibility] duration-400 ease-(--ease-ui) ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className={`mx-auto flex h-full max-w-[960px] flex-col px-4 pt-4 transition-transform duration-400 ease-(--ease-ui) md:px-10 md:pt-6 ${open ? 'translate-y-0' : '-translate-y-3'}`}>
        <div className="flex items-center justify-between">
          <img src="/img/qnl-logo-white.webp" alt={lang === 'ar' ? 'مكتبة قطر الوطنية' : 'Qatar National Library'} width={480} height={250} className="h-12 w-auto md:h-14" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center gap-2 px-2 text-[13px] font-medium text-white/85 hover:text-white"
          >
            {t('close')} <span aria-hidden className="text-[18px] leading-none">×</span>
          </button>
        </div>

        <form role="search" className="mt-[12vh]" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="q-panel" className="label text-white/70">{t('searchLibrary')}</label>
          <div className="mt-4 flex items-center gap-2 border-b border-white/40 pb-2 focus-within:border-white">
            <input
              ref={input}
              id="q-panel"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={p(ui.searchPlaceholder.en, ui.searchPlaceholder.ar)}
              tabIndex={open ? 0 : -1}
              className="min-w-0 flex-1 appearance-none rounded-none border-0 bg-transparent py-2 text-[20px] text-white placeholder:text-white/45 md:text-[30px]"
            />
            <VoiceButton tone="dark" lang={lang === 'ar' ? 'ar-QA' : 'en-GB'} onText={setQ} />
            <button
              type="submit"
              tabIndex={open ? 0 : -1}
              className="btn-slide h-11 shrink-0 rounded-full bg-white px-5 text-[14px] font-medium text-ink md:h-12 md:px-7"
            >
              <span className="relative">{t('search')}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              tabIndex={open ? 0 : -1}
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
        <p className="mt-8 hidden text-[13px] text-white/55 md:block">
          {t('slashTip1')} <kbd className="rounded border border-white/30 px-1.5 py-0.5 font-sans text-white/80">/</kbd> {t('slashTip2')}
        </p>
      </div>
    </div>
  )
}
