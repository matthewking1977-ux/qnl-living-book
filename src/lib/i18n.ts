import { useLang } from './dir'
import { strings, type StringKey } from '../data/strings'

/** t('key') → the string in the current language. */
export function useT() {
  const lang = useLang()
  return (k: StringKey) => strings[k][lang]
}

/** Picks the current language from any { en, ar } pair (falls back to English). */
export function usePick() {
  const lang = useLang()
  return <T,>(en: T, ar: T | null | undefined): T => (lang === 'ar' && ar != null ? ar : en)
}
