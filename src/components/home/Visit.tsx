import { childrensNote, drivingNote, gettingHere, hoursSummary } from '../../data/library'
import { today } from '../../lib/hours'
import { Photo, Section, SectionHead, TextLink } from './parts'

/** Opening hours and getting here. */
export function Visit() {
  const t = today()
  return (
    <Section id="visit">
      <SectionHead n="04" label="Plan your visit" title="Open seven days a week." />
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="label text-g1">Opening hours</h3>
          <p className="mt-4 flex items-center gap-2 text-[15px] font-medium">
            <span className={`inline-block size-2 rounded-full ${t.openNow ? 'bg-[#2f7d4f]' : 'bg-g2'}`} aria-hidden />
            {t.openNow ? 'Open now' : 'Closed now'} · today {t.range}
          </p>
          <dl className="mt-5 divide-y divide-g3 border-y border-g3">
            {hoursSummary.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 py-3 text-[15px]">
                <dt>{h.days}</dt>
                <dd className="text-end tabular-nums">{h.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-[40ch] text-[14px] leading-relaxed text-g1">{childrensNote}</p>
        </div>
        <div className="md:col-span-4">
          <h3 className="label text-g1">Getting here</h3>
          <p className="mt-4 text-[15px]">We are in Education City, Al Rayyan.</p>
          <ul className="mt-4 space-y-4">
            {gettingHere.map((g) => (
              <li key={g.mode} className="text-[15px] leading-relaxed">
                <span className="font-medium">{g.mode}. </span>
                <span className="text-g1">{g.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[48ch] text-[13px] leading-relaxed text-g1">{drivingNote}</p>
          <div className="mt-3">
            <TextLink href="https://www.google.com/maps/search/?api=1&query=Qatar+National+Library">Open in Google Maps</TextLink>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden bg-g3 md:col-span-4">
          <Photo name="exterior-dusk" alt="Qatar National Library building at dusk" sizes="(min-width: 768px) 33vw, 100vw" />
        </div>
      </div>
    </Section>
  )
}
