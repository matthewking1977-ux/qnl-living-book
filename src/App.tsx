import { useEffect } from 'react'
import { IntroStage } from './components/IntroStage'
import { applyLang, LangContext, type Lang } from './lib/dir'
import { initScroll } from './lib/scroll'

/**
 * English only for now. The RTL book is still built in (mirrored hinge, turn
 * direction and layout) and can be previewed with ?lang=ar; the toggle
 * (components/LangToggle.tsx) returns once Arabic copy is supplied.
 */
const lang: Lang = new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en'

export default function App() {
  useEffect(() => {
    applyLang(lang)
    return initScroll()
  }, [])

  return (
    <LangContext.Provider value={lang}>
      <main>
        <IntroStage />
        {/* placeholder: the homepage sections arrive in phase 4 */}
        <section className="bg-[#fcfcfc] text-ink">
          <div className="mx-auto max-w-[1440px] px-4 py-32 md:px-10">
            <p className="label text-g1">[ 01 ] Homepage</p>
            <p className="font-display mt-6 max-w-[18em] text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1]">
              The homepage continues here.
            </p>
            <p className="mt-6 max-w-[60ch] text-g1">
              Service shortcuts, what's on, collections, audiences and footer are built in phase 4.
            </p>
          </div>
        </section>
      </main>
    </LangContext.Provider>
  )
}
