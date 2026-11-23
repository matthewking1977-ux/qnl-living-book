/**
 * First focusable element on the page. Before the search bar it skips the
 * intro; once the intro is over it offers to replay it.
 */
export function SkipIntro({ done, onSkip, onReplay }: { done: boolean; onSkip: () => void; onReplay: () => void }) {
  return (
    <button
      type="button"
      onClick={done ? onReplay : onSkip}
      className="group inline-flex min-h-11 items-center gap-2 px-2 text-[13px] font-medium text-white/85 transition-colors duration-300 ease-(--ease-ui) hover:text-white"
    >
      {done ? 'Replay intro' : 'Skip intro'}
      <span aria-hidden>{done ? '↑' : '→'}</span>
    </button>
  )
}
