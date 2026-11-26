import { events } from '../../data/library'
import { Photo, SampleTag, Section, SectionHead, TextLink } from './parts'
import { usePick, useT } from '../../lib/i18n'

/** Three event cards. Illustrative SAMPLE content: not real events. */
export function WhatsOn() {
  const t = useT()
  const p = usePick()
  return (
    <Section id="events">
      <SectionHead n="01" label={t('whatsOn')} title={t('whatsOnTitle')} action={<TextLink href="#events">{t('seeAllEvents')}</TextLink>} />
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">
        {events.map((e, i) => (
          <li key={i}>
            <a href="#events" className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-g3">
                <Photo name={e.img} className="transition-transform duration-400 ease-(--ease-ui) group-hover:scale-[1.03]" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="label text-g1">{p(e.kind, e.kind_ar)}</p>
                <SampleTag />
              </div>
              <h3 className="mt-3 text-[20px] font-medium leading-snug">{p(e.title, e.title_ar)}</h3>
              <p className="mt-2 text-[14px] text-g1">
                {p(e.date, e.date_ar)} · {p(e.time, e.time_ar)}
                <br />
                {p(e.place, e.place_ar)}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
