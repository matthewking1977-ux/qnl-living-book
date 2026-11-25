import { useEffect, useState, type ReactNode } from 'react'
import { openSearch } from './SearchPanel'

/**
 * (DOM order: actions first, so "Skip intro" is the first focusable element; shown
 * logo-left by flex-row-reverse.)
 *
 * Slim header, fixed on every screen: logo, search (a field-like button on desktop,
 * an icon on phones) and an optional action (Skip intro / Open the book). Transparent
 * over the intro; solid once the page has scrolled past it.
 */
export function SiteHeader({ action, solidAfter }: { action?: ReactNode; solidAfter: () => number }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(scrollY > solidAfter() - 72)
    on()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
    }
  }, [solidAfter])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-colors duration-400 ease-(--ease-ui) ${solid ? 'bg-ink' : 'bg-transparent'}`}
    >
      <div className="mx-auto flex max-w-[1440px] flex-row-reverse items-center justify-between gap-3 px-4 py-3 md:px-10 md:py-5">
        <div className="flex items-center gap-1 md:gap-4">
          {action}
          {/* desktop: looks like a short field, opens the search panel */}
          <button
            type="button"
            onClick={openSearch}
            className="hidden min-h-11 w-[260px] items-center gap-3 rounded-full border border-white/35 px-4 text-[13px] text-white/75 transition-colors duration-300 ease-(--ease-ui) hover:border-white hover:text-white md:flex"
          >
            <SearchIcon />
            <span className="flex-1 text-start">Search the library</span>
            <kbd aria-hidden className="rounded border border-white/30 px-1.5 text-[11px] text-white/70">/</kbd>
          </button>
          {/* phones: icon only */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search the library"
            className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10 md:hidden"
          >
            <SearchIcon />
          </button>
        </div>
        <a href="#" aria-label="Qatar National Library, home" className="shrink-0">
          <img src="/img/qnl-logo-white.webp" alt="" width={480} height={250} className="h-11 w-auto md:h-14" />
        </a>
      </div>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}
