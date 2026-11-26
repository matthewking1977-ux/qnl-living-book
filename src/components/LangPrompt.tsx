import { useState } from 'react'
import { browserPrefersArabic, savedLang, useLang, useSetLang } from '../lib/dir'

/**
 * First visit only: if the visitor's device is set to Arabic and they have not chosen a
 * language yet, offer Arabic, in Arabic, before anything else. Choosing either option
 * (or closing it) is remembered. ?langprompt=1 shows it regardless, for review.
 */
export function LangPrompt() {
  const lang = useLang()
  const setLang = useSetLang()
  const forced = new URLSearchParams(location.search).get('langprompt') === '1'
  const [show, setShow] = useState(() => forced || (lang === 'en' && !savedLang() && browserPrefersArabic()))
  if (!show) return null
  const choose = (l: 'ar' | 'en') => {
    setShow(false)
    setLang(l)
  }
  return (
    <div
      role="dialog"
      aria-labelledby="lp-title"
      className="fixed inset-x-3 top-[76px] z-[45] mx-auto max-w-[440px] rounded-2xl bg-white p-5 text-ink shadow-[0_20px_60px_rgba(0,0,0,.45)] md:top-[100px]"
    >
      <p id="lp-title" lang="ar" dir="rtl" className="text-[18px] font-medium" style={{ fontFamily: 'var(--font-arabic)' }}>
        هل تفضّل تصفّح الموقع باللغة العربية؟
      </p>
      <p className="mt-1 text-[14px] text-g1">Would you like to view this site in Arabic?</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          lang="ar"
          autoFocus
          onClick={() => choose('ar')}
          className="min-h-11 flex-1 rounded-full bg-ink px-5 text-[16px] font-medium text-white"
          style={{ fontFamily: 'var(--font-arabic)' }}
        >
          العربية
        </button>
        <button type="button" onClick={() => choose('en')} className="min-h-11 flex-1 rounded-full border border-ink/30 px-5 text-[15px] font-medium">
          English
        </button>
      </div>
    </div>
  )
}
