import { findUs, footerColumns, social, social_ar } from '../../data/library'
import { usePick, useT } from '../../lib/i18n'
import { useLang, useSetLang } from '../../lib/dir'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const link = 'inline-flex min-h-11 items-center text-[15px] text-white/85 underline-offset-4 hover:text-white hover:underline md:min-h-9'

/** Site footer. Link destinations are placeholders until the full site exists. */
export function Footer() {
  const lang = useLang()
  const setLang = useSetLang()
  const t = useT()
  const p = usePick()
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        {/* accessibility commitment */}
        <p className="border-b border-white/15 py-6 text-[15px] text-white/85">
          {t('a11yLine1')}{' '}
          <a href="#accessibility-statement" className="text-white underline underline-offset-4">{t('a11yStatement')}</a> {t('a11yOr')}{' '}
          <a href="#report-a-barrier" className="text-white underline underline-offset-4">{t('a11yBarrier')}</a>.
          {lang === 'ar' && <span className="ms-2 text-white/55">{t('draftNote')}</span>}
        </p>

        <div className="grid gap-x-6 gap-y-10 py-14 sm:grid-cols-2 md:grid-cols-12 md:py-16">
          <div className="sm:col-span-2 md:col-span-4">
            <img src="/img/qnl-logo-white.webp" alt={lang === 'ar' ? 'مكتبة قطر الوطنية' : 'Qatar National Library'} width={480} height={250} loading="lazy" className="h-20 w-auto" />
            <h2 className="label mt-10 text-white/70">{t('findUs')}</h2>
            <address className="mt-4 space-y-1 text-[15px] not-italic leading-relaxed text-white/85">
              <p>{p(findUs.address, findUs.address_ar)}</p>
              <p>{p(findUs.transit, findUs.transit_ar)}</p>
              <p className="pt-2">
                {t('phone')}: <a dir="ltr" href={findUs.phoneHref} className="text-white underline-offset-4 hover:underline">{findUs.phone}</a>
              </p>
              <p>
                {t('email')}: <a href={`mailto:${findUs.email}`} className="text-white underline-offset-4 hover:underline">{findUs.email}</a>
              </p>
            </address>
            <h2 className="label mt-8 text-white/70">{t('getApp')}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#app-android" aria-label={t('appAndroid')}>
                <img src="/img/badges/google-play.webp" alt="" width={365} height={120} loading="lazy" className="h-11 w-auto" />
              </a>
              <a href="#app-ios" aria-label={t('appIos')}>
                <img src="/img/badges/app-store.webp" alt="" width={385} height={120} loading="lazy" className="h-11 w-auto" />
              </a>
            </div>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={p(col.title, col.title_ar)} className="md:col-span-2">
              <h2 className="label text-white/70">{p(col.title, col.title_ar)}</h2>
              <ul className="mt-4">
                {col.links.map((l, i) => (
                  <li key={l}>
                    <a href={`#${slug(l)}`} className={link}>{p(l, col.links_ar[i])}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-white/15 py-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label={t('followUs')} className="flex flex-wrap items-center gap-x-5">
            <h2 className="label me-1 text-white/70">{t('followUs')}</h2>
            {social.map((s, i) => (
              <a key={s} href={`#${slug(s)}`} className={link}>{p(s, social_ar[i])}</a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/70">
            <p>{t('copyright')}</p>
            <button
              type="button"
              lang={lang === 'ar' ? 'en' : 'ar'}
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="inline-flex min-h-11 items-center text-[15px] text-white hover:underline"
              style={lang === 'ar' ? undefined : { fontFamily: 'var(--font-arabic)' }}
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <p>{t('conceptBy')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
