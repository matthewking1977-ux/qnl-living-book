import { Photo, Section, SectionHead, TextLink } from './parts'
import { usePick, useT } from '../../lib/i18n'
import { collections } from '../../data/library'


/** Editorial row: one large item and two smaller. */
export function Collections() {
  const t = useT()
  const p = usePick()
  return (
    <Section>
      <SectionHead n="02" label={t('collections')} title={t('collectionsTitle')} />
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-12">
        {collections.map((it, i) => (
          <article key={it.id} id={it.id} className={`scroll-mt-24 ${i === 0 ? 'md:col-span-6' : 'md:col-span-3'}`}>
            <div className={`overflow-hidden bg-g3 ${i === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
              <Photo name={it.img} sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 100vw'} />
            </div>
            <p className="label mt-5 text-g1">{p(it.kind, it.kind_ar)}</p>
            <h3 className="mt-3 text-[22px] font-medium leading-snug">{p(it.title, it.title_ar)}</h3>
            <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-g1">{p(it.body, it.body_ar)}</p>
            <div className="mt-3"><TextLink href={`#${it.id}`}>{p(it.link, it.link_ar)}</TextLink></div>
          </article>
        ))}
      </div>
    </Section>
  )
}
