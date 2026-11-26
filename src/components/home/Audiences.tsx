import { Section, SectionHead } from './parts'
import { usePick, useT } from '../../lib/i18n'
import { audiences } from '../../data/library'


export function Audiences() {
  const t = useT()
  const p = usePick()
  return (
    <Section>
      <SectionHead n="03" label={t('forYou')} title={t('forYouTitle')} />
      <ul className="grid border-s border-t border-g3 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a) => (
          <li key={a.id} id={a.id} className="scroll-mt-24 border-b border-e border-g3">
            <a href={`#${a.id}`} className="tile flex min-h-[220px] flex-col justify-between p-6 focus-visible:outline-offset-[-2px]">
              <span aria-hidden className="tile-arrow text-[20px]"><span className="flip-rtl">→</span></span>
              <span>
                <span className="block text-[20px] font-medium">{p(a.title, a.title_ar)}</span>
                <span className="mt-2 block max-w-[30ch] text-[14px] leading-relaxed opacity-70">{p(a.body, a.body_ar)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
