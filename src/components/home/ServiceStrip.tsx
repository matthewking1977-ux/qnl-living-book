import { useEffect, useRef, useState } from 'react'
import { studyNotes, studyNotes_ar, studySpaces } from '../../data/library'
import { usePick, useT } from '../../lib/i18n'
import { useLang } from '../../lib/dir'
import { today } from '../../lib/hours'

const cell =
  'btn-slide light flex min-h-[132px] w-full flex-col justify-between px-0 py-6 text-start transition-[color,padding] duration-400 ease-(--ease-ui) hover:px-5 focus-visible:px-5 lg:px-6'

/** Four service shortcuts, directly under the book. "Book a study space" opens a menu of space types. */
export function ServiceStrip() {
  const [open, setOpen] = useState(false)
  const lang = useLang()
  const tr = useT()
  const p = usePick()
  const t = today(lang)
  const wrap = useRef<HTMLDivElement>(null)

  // close on Escape or a click outside
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false)
    addEventListener('keydown', onKey)
    addEventListener('pointerdown', onDown)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <div ref={wrap} className="mx-auto max-w-[1440px] scroll-mt-24 px-4 pt-[72px] md:px-10 md:pt-[96px]">
      <nav aria-label={tr('services')}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <li className="border-b border-g3 lg:border-b-0 lg:border-e">
            <a href="#membership" className={cell}>
              <span className="label opacity-60">01</span>
              <span>
                <span className="block text-[18px] font-medium">{tr('becomeMember')}</span>
                <span className="mt-1 block text-[14px] opacity-70">{tr('becomeMemberNote')}</span>
              </span>
            </a>
          </li>
          <li className="border-b border-g3 lg:border-b-0 lg:border-e">
            <button type="button" className={cell} aria-expanded={open} aria-controls="study-menu" onClick={() => setOpen(!open)}>
              <span className="label flex w-full items-center justify-between opacity-60">
                02
                <span aria-hidden className={`text-[16px] transition-transform duration-400 ease-(--ease-ui) ${open ? 'rotate-180' : ''}`}>⌄</span>
              </span>
              <span>
                <span className="block text-[18px] font-medium">{tr('bookStudy')}</span>
                <span className="mt-1 block text-[14px] opacity-70">{tr('bookStudyNote')}</span>
              </span>
            </button>
          </li>
          <li className="border-b border-g3 lg:border-b-0 lg:border-e">
            <a href="#visit" className={cell}>
              <span className="label flex items-center gap-2 opacity-60">
                03
                <span className={`inline-block size-1.5 rounded-full ${t.openNow ? 'bg-[#2f7d4f]' : 'bg-g2'}`} aria-hidden />
              </span>
              <span>
                <span className="block text-[18px] font-medium">{tr('visitUs')}</span>
                <span className="mt-1 block text-[14px] opacity-70">
                  {t.openNow ? tr('openNow') : tr('closedNow')} · {tr('today')} {t.range}
                </span>
              </span>
            </a>
          </li>
          <li className="border-b border-g3 lg:border-b-0">
            <a href="#ask" className={cell}>
              <span className="label opacity-60">04</span>
              <span>
                <span className="block text-[18px] font-medium">{tr('askLibrarian')}</span>
                <span className="mt-1 block text-[14px] opacity-70">{tr('askLibrarianNote')}</span>
              </span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Study space menu */}
      <div
        id="study-menu"
        hidden={!open}
        className="border-b border-t border-g3 bg-white py-8 md:px-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[20px] font-medium">{tr('bookStudy')}</h2>
          <p className="text-[13px] text-g1">{tr('studyQuestions')}</p>
        </div>
        <ul className="mt-6 grid gap-px bg-g3 sm:grid-cols-2 lg:grid-cols-5">
          {studySpaces.map((sp, i) => (
            <li key={i} className="flex flex-col bg-white p-5">
              <p className="text-[16px] font-medium leading-snug">{p(sp.type, sp.type_ar)}</p>
              {sp.zone && <p className="label mt-1 text-g1">{p(sp.zone, sp.zone_ar)}</p>}
              <dl className="mt-3 space-y-1 text-[14px] text-g1">
                <div className="flex gap-2"><dt className="sr-only">{lang === 'ar' ? 'الغرف' : 'Rooms'}</dt><dd>{sp.rooms === 'Open area' ? tr('openArea') : `${sp.rooms} ${sp.rooms === '1' ? tr('room') : tr('rooms')}`}</dd></div>
                <div className="flex gap-2"><dt className="sr-only">{lang === 'ar' ? 'المساحة والسعة' : 'Size and capacity'}</dt><dd>{p(sp.capacity, sp.capacity_ar)}</dd></div>
                <div><dt className="sr-only">{lang === 'ar' ? 'التجهيزات' : 'Equipment'}</dt><dd>{p(sp.equipment, sp.equipment_ar).join(' · ')}</dd></div>
              </dl>
              <a
                href={sp.href}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-[14px] font-medium underline decoration-1 underline-offset-[6px]"
              >
                {tr('bookNow')}<span className="sr-only">: {p(sp.type, sp.type_ar)}, {p(sp.capacity, sp.capacity_ar)}</span> <span aria-hidden className="flip-rtl">→</span>
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-5 space-y-1 text-[13px] text-g1">
          {p(studyNotes, studyNotes_ar).map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
    </div>
  )
}
