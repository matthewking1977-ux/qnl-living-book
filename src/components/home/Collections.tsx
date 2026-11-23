import { Photo, Section, SectionHead, TextLink } from './parts'

const items = [
  { id: 'books', img: 'aisle', kind: 'Books', title: 'On the shelves', body: 'Borrow from the open collection, in print and online.', link: 'Browse the catalogue' },
  { id: 'research', img: 'interior', kind: 'Research', title: 'Journals and databases', body: 'Search across subscribed research resources.', link: 'Search research databases' },
  { id: 'heritage', img: 'stone', kind: 'Heritage', title: 'Qatar and the Gulf', body: 'Manuscripts, maps and photographs from the heritage collection.', link: 'Explore the heritage collection' },
]

/** Editorial row: one large item and two smaller. */
export function Collections() {
  return (
    <Section>
      <SectionHead n="02" label="From the collections" title="Three ways in." />
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-12">
        {items.map((it, i) => (
          <article key={it.id} id={it.id} className={`scroll-mt-24 ${i === 0 ? 'md:col-span-6' : 'md:col-span-3'}`}>
            <div className={`overflow-hidden bg-g3 ${i === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
              <Photo name={it.img} sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 100vw'} />
            </div>
            <p className="label mt-5 text-g1">{it.kind}</p>
            <h3 className="mt-3 text-[22px] font-medium leading-snug">{it.title}</h3>
            <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-g1">{it.body}</p>
            <div className="mt-3"><TextLink href={`#${it.id}`}>{it.link}</TextLink></div>
          </article>
        ))}
      </div>
    </Section>
  )
}
