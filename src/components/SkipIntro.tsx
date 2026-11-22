import { Tx } from './Tx'
import { ui } from '../data/spreads'
import { arrow, useDir } from '../lib/dir'

/** First focusable element on the page. Wired to the timeline in phase 5. */
export function SkipIntro({ onSkip }: { onSkip?: () => void }) {
  const dir = useDir()
  return (
    <button
      type="button"
      onClick={onSkip}
      className="group inline-flex min-h-11 items-center gap-2 px-2 text-[13px] font-medium opacity-80 transition-opacity duration-300 ease-(--ease-ui) hover:opacity-100"
    >
      <Tx en={ui.skip.en} ar={ui.skip.ar} />
      <span aria-hidden>{arrow(dir)}</span>
    </button>
  )
}
