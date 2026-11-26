import { useT } from '../lib/i18n'
/**
 * First focusable element on the page. Before the search bar it skips the
 * intro; once the intro is over (or on a return visit) it offers to open the book again.
 */
export function SkipIntro({ done, onSkip, onReplay }: { done: boolean; onSkip: () => void; onReplay: () => void }) {
  const t = useT()
  return (
    <button
      type="button"
      onClick={done ? onReplay : onSkip}
      className="group inline-flex min-h-11 items-center gap-2 px-2 text-[13px] font-medium text-white/85 transition-colors duration-300 ease-(--ease-ui) hover:text-white"
    >
      {done ? t('openBook') : t('skipIntro')}
      <span aria-hidden className={done ? '' : 'flip-rtl'}>{done ? '↑' : '→'}</span>
    </button>
  )
}
