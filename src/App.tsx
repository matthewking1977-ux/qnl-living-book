import { useEffect, useState } from 'react'
import { ReducedMotionHero } from './components/ReducedMotionHero'
import { IntroStage } from './components/IntroStage'
import { applyLang, initialLang, LangContext, rememberLang, SetLangContext, type Lang } from './lib/dir'
import { LangPrompt } from './components/LangPrompt'
import { initScroll } from './lib/scroll'
import { ServiceStrip } from './components/home/ServiceStrip'
import { WhatsOn } from './components/home/WhatsOn'
import { Collections } from './components/home/Collections'
import { Audiences } from './components/home/Audiences'
import { Visit } from './components/home/Visit'
import { Footer } from './components/home/Footer'
import { SearchPanel } from './components/SearchPanel'

/**
 * Language: switched from the header (or the first-visit prompt / footer), remembered
 * on the device and reflected in the address (?lang=ar). Arabic mode mirrors the book
 * and layout; copy without an approved Arabic version is marked [AR – TBC].
 */
export default function App() {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = (l: Lang) => {
    rememberLang(l)
    setLangState(l)
  }

  // prefers-reduced-motion: no smooth scroll, no pinned sequence. Follows the setting live.
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => applyLang(lang), [lang])
  useEffect(() => initScroll(), [reduced])

  return (
    <LangContext.Provider value={lang}>
    <SetLangContext.Provider value={setLang}>
      <main>
        {reduced ? <ReducedMotionHero /> : <IntroStage />}
        {/* the normal homepage: the book is an entrance, not the whole site */}
        <div className="bg-[#fcfcfc] text-ink">
          <ServiceStrip />
          <WhatsOn />
          <Collections />
          <Audiences />
          <Visit />
        </div>
      </main>
      <Footer />
      <SearchPanel />
      <LangPrompt />
    </SetLangContext.Provider>
    </LangContext.Provider>
  )
}
