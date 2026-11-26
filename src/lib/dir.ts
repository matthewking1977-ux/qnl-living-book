import { createContext, useContext } from 'react'

export type Lang = 'en' | 'ar'
export type Dir = 'ltr' | 'rtl'

export const dirOf = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr')

/** +1 for LTR, −1 for RTL. Multiply any horizontal offset or Y/Z rotation by this. */
export const sign = (dir: Dir) => (dir === 'rtl' ? -1 : 1)

/** Forward arrow in reading direction. */
export const arrow = (dir: Dir) => (dir === 'rtl' ? '←' : '→')

export function applyLang(lang: Lang) {
  const el = document.documentElement
  el.lang = lang
  el.dir = dirOf(lang)
}

export const LangContext = createContext<Lang>('en')
export const useLang = () => useContext(LangContext)
export const useDir = () => dirOf(useContext(LangContext))

/* ---------- choosing a language ---------- */

const LANG_KEY = 'qnl-lang'

/** The visitor's saved choice, if they have made one. */
export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'ar' || v === 'en' ? v : null
  } catch {
    return null
  }
}

/** Language at load: ?lang= in the address, then the saved choice, then English. */
export function initialLang(): Lang {
  const q = new URLSearchParams(location.search).get('lang')
  if (q === 'ar' || q === 'en') return q
  return savedLang() ?? 'en'
}

/** Saves the choice and puts it in the address, so a shared link opens in that language. */
export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch { /* storage unavailable */ }
  const url = new URL(location.href)
  if (lang === 'ar') url.searchParams.set('lang', 'ar')
  else url.searchParams.delete('lang')
  history.replaceState(history.state, '', url)
}

/** True when the visitor's phone or browser lists Arabic among its languages. */
export const browserPrefersArabic = () => (navigator.languages ?? [navigator.language]).some((l) => l?.toLowerCase().startsWith('ar'))

export const SetLangContext = createContext<(lang: Lang) => void>(() => {})
export const useSetLang = () => useContext(SetLangContext)
