import { Section, SectionHead } from './parts'

const audiences = [
  { id: 'children', title: 'Children', body: 'Stories, activities and a library of their own.' },
  { id: 'students', title: 'Students & researchers', body: 'Study space, databases and expert help.' },
  { id: 'visitors', title: 'Visitors', body: 'Plan a visit to the building and its exhibitions.' },
  { id: 'professionals', title: 'Professionals', body: 'Resources and services for work and practice.' },
]

export function Audiences() {
  return (
    <Section>
      <SectionHead n="03" label="For you" title="A library for every kind of reader." />
      <ul className="grid border-s border-t border-g3 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a) => (
          <li key={a.id} id={a.id} className="scroll-mt-24 border-b border-e border-g3">
            <a href={`#${a.id}`} className="btn-slide light flex min-h-[220px] flex-col justify-between p-6 transition-colors duration-400 ease-(--ease-ui)">
              <span aria-hidden className="text-[20px]">→</span>
              <span>
                <span className="block text-[20px] font-medium">{a.title}</span>
                <span className="mt-2 block max-w-[30ch] text-[14px] leading-relaxed opacity-70">{a.body}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
