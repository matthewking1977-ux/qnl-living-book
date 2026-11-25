/**
 * Phone controls for the book: a glass "next" pill and a round "back" button. Each tap
 * plays one turn as a smooth timed animation. Labels follow the reader's position.
 */
export function PageControls({ index, last, onNext, onBack }: { index: number; last: number; busy: boolean; onNext: () => void; onBack: () => void }) {
  const label = index <= 0 ? 'Open the book' : index >= last - 1 ? 'Close the book' : 'Next page'
  const done = index >= last
  return (
    <div className="absolute inset-x-0 bottom-[calc(20px+env(safe-area-inset-bottom))] z-20 flex items-center justify-center gap-3 px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Previous page"
        className={`glass grid size-14 place-items-center rounded-full text-[20px] transition-opacity duration-300 ease-(--ease-ui) ${
          index <= 0 || done ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        tabIndex={index <= 0 || done ? -1 : 0}
      >
        <span aria-hidden>←</span>
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`glass flex h-14 min-w-[200px] items-center justify-center gap-3 rounded-full px-7 text-[16px] font-medium transition-opacity duration-300 ease-(--ease-ui) ${
          done ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        tabIndex={done ? -1 : 0}
      >
        {label}
        <span aria-hidden>{index <= 0 ? '↓' : '→'}</span>
      </button>
    </div>
  )
}
