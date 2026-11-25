import { useEffect, useState } from 'react'
import { ReducedMotionHero } from './components/ReducedMotionHero'
import { IntroStage } from './components/IntroStage'
import { applyLang, LangContext, type Lang } from './lib/dir'
import { initScroll } from './lib/scroll'
import { ServiceStrip } from './components/home/ServiceStrip'
import { WhatsOn } from './components/home/WhatsOn'
import { Collections } from './components/home/Collections'
import { Audiences } from './components/home/Audiences'
import { Footer } from './components/home/Footer'
import { SearchPanel } from './components/SearchPanel'

/**
 * English only for now. The RTL book is still built in (mirrored hinge, turn
 * direction and layout) and can be previewed with ?lang=ar; the toggle
 * (components/LangToggle.tsx) returns once Arabic copy is supplied.
 */
const lang: Lang = new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en'

export default function App() {
  // prefers-reduced-motion: no smooth scroll, no pinned sequence. Follows the setting live.
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    applyLang(lang)
    return initScroll()
  }, [reduced])

  return (
    <LangContext.Provider value={lang}>
      <main>
        {reduced ? <ReducedMotionHero /> : <IntroStage />}
        {/* the normal homepage: the book is an entrance, not the whole site */}
        <div className="bg-[#fcfcfc] text-ink">
          <ServiceStrip />
          <WhatsOn />
          <Collections />
          <Audiences />
        </div>
      </main>
      <Footer />
      <SearchPanel />
    </LangContext.Provider>
  )
}
