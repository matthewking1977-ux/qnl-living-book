import { useLang, useSetLang } from '../lib/dir'

/**
 * One-tap language switch for the header. It always shows the *other* language in its
 * own script (العربية / English), so a reader of that language can find it at a glance.
 */
export function LangSwitch() {
  const lang = useLang()
  const setLang = useSetLang()
  const other = lang === 'ar' ? 'en' : 'ar'
  return (
    <button
      type="button"
      lang={other}
      onClick={() => setLang(other)}
      aria-label={other === 'ar' ? 'العربية: عرض الموقع باللغة العربية' : 'English: view the site in English'}
      className="inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-medium text-white/90 transition-colors duration-300 ease-(--ease-ui) hover:bg-white/10 hover:text-white"
      style={other === 'ar' ? { fontFamily: 'var(--font-arabic)' } : undefined}
    >
      {other === 'ar' ? 'العربية' : 'English'}
    </button>
  )
}
