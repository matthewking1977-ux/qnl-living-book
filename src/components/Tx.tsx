import { useLang } from '../lib/dir'

/**
 * Bilingual text. Arabic is a first draft pending copywriter review (status is
 * tracked in the data and docs/arabic-copy.md, not shown on screen).
 */
export function Tx({ en, ar }: { en: string; ar: string | null; tbc?: boolean }) {
  const lang = useLang()
  if (lang === 'en') return <>{en}</>
  if (ar) return <>{ar}</>
  // no Arabic version: show the English, marked as English
  return (
    <span lang="en" dir="ltr" className="inline-block">
      {en}
    </span>
  )
}
