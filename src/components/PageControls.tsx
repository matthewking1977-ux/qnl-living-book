/**
 * Phone controls for the book: a glass "next" pill, always centred, with a round "back"
 * button beside it that appears once the book is open. Each tap plays one turn as a
 * smooth timed animation. Labels follow the reader's position.
 */
export function PageControls({ index, last, onNext, onBack }: { index: number; last: number; onNext: () => void; onBack: () => void }) {
  const label = index <= 0 ? 'Open the book' : index >= last - 1 ? 'Close the book' : 'Next page'
  const done = index >= last
  const backHidden = index <= 0 || done
  return (
    <div className="absolute inset-x-0 bottom-[calc(20px+env(safe-area-inset-bottom))] z-20 flex justify-center px-4">
      <div className="relative">
        {/* back sits outside the centred pill, so the pill never shifts */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Previous page"
          className={`glass absolute right-full top-0 mr-3 grid size-14 place-items-center rounded-full text-[20px] transition-opacity duration-300 ease-(--ease-ui) ${
            backHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          tabIndex={backHidden ? -1 : 0}
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className={`glass relative flex h-14 min-w-[200px] items-center justify-center gap-3 rounded-full px-7 text-[16px] font-medium transition-opacity duration-300 ease-(--ease-ui) ${
            done ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          tabIndex={done ? -1 : 0}
        >
          {label}
          <span aria-hidden>{index <= 0 ? '↓' : '→'}</span>
        </button>
      </div>
    </div>
  )
}
