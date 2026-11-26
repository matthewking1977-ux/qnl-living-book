import { childrensNote, childrensNote_ar, drivingNote, drivingNote_ar, gettingHere, hoursSummary } from '../../data/library'
import { usePick, useT } from '../../lib/i18n'
import { useLang } from '../../lib/dir'
import { today } from '../../lib/hours'
import { Photo, Section, SectionHead, TextLink } from './parts'

/** Opening hours and getting here. */
export function Visit() {
  const lang = useLang()
  const tr = useT()
  const p = usePick()
  const t = today(lang)
  return (
    <Section id="visit">
      <SectionHead n="04" label={tr('planVisit')} title={tr('planVisitTitle')} />
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="label text-g1">{tr('openingHours')}</h3>
          <p className="mt-4 flex items-center gap-2 text-[15px] font-medium">
            <span className={`inline-block size-2 rounded-full ${t.openNow ? 'bg-[#2f7d4f]' : 'bg-g2'}`} aria-hidden />
            {t.openNow ? tr('openNow') : tr('closedNow')} · {tr('todayLower')} {t.range}
          </p>
          <dl className="mt-5 divide-y divide-g3 border-y border-g3">
            {hoursSummary.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 py-3 text-[15px]">
                <dt>{p(h.days, h.days_ar)}</dt>
                <dd className="text-end tabular-nums">{p(h.time, h.time_ar)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-[40ch] text-[14px] leading-relaxed text-g1">{p(childrensNote, childrensNote_ar)}</p>
        </div>
        <div className="md:col-span-4">
          <h3 className="label text-g1">{tr('gettingHere')}</h3>
          <p className="mt-4 text-[15px]">{tr('weAreIn')}</p>
          <ul className="mt-4 space-y-4">
            {gettingHere.map((g) => (
              <li key={g.mode} className="text-[15px] leading-relaxed">
                <span className="font-medium">{p(g.mode, g.mode_ar)}. </span>
                <span className="text-g1">{p(g.text, g.text_ar)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[48ch] text-[13px] leading-relaxed text-g1">{p(drivingNote, drivingNote_ar)}</p>
          <div className="mt-3">
            <TextLink href="https://www.google.com/maps/search/?api=1&query=Qatar+National+Library">{tr('openInMaps')}</TextLink>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden bg-g3 md:col-span-4">
          <Photo name="exterior-dusk" alt={tr('buildingPhoto')} sizes="(min-width: 768px) 33vw, 100vw" />
        </div>
      </div>
    </Section>
  )
}
