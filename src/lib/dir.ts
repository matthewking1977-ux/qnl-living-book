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
