import { Photo, SampleTag, Section, SectionHead, TextLink } from './parts'

const events = [
  { img: 'hall', kind: 'Talk' },
  { img: 'terraces', kind: 'Workshop' },
  { img: 'mezzanine', kind: 'Exhibition' },
]

/** Three event cards. All content is SAMPLE: no real event names or dates. */
export function WhatsOn() {
  return (
    <Section id="events">
      <SectionHead n="01" label="What's on" title="This week at the library." action={<TextLink href="#events">See all events</TextLink>} />
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">
        {events.map((e, i) => (
          <li key={i}>
            <a href="#events" className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-g3">
                <Photo name={e.img} className="transition-transform duration-400 ease-(--ease-ui) group-hover:scale-[1.03]" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="label text-g1">{e.kind}</p>
                <SampleTag />
              </div>
              <h3 className="mt-3 text-[20px] font-medium leading-snug">Event title placeholder</h3>
              <p className="mt-2 text-[14px] text-g1">Date [TBC] · Location [TBC]</p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
