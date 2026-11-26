import { findUs, footerColumns, social } from '../../data/library'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const link = 'inline-flex min-h-11 items-center text-[15px] text-white/85 underline-offset-4 hover:text-white hover:underline md:min-h-9'

/** Site footer. Link destinations are placeholders until the full site exists. */
export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        {/* accessibility commitment */}
        <p className="border-b border-white/15 py-6 text-[15px] text-white/85">
          We aim to meet WCAG 2.2 AA. Read our{' '}
          <a href="#accessibility-statement" className="text-white underline underline-offset-4">accessibility statement</a> or{' '}
          <a href="#report-a-barrier" className="text-white underline underline-offset-4">tell us about a barrier</a>.
        </p>

        <div className="grid gap-x-6 gap-y-10 py-14 sm:grid-cols-2 md:grid-cols-12 md:py-16">
          <div className="sm:col-span-2 md:col-span-4">
            <img src="/img/qnl-logo-white.webp" alt="Qatar National Library" width={480} height={250} loading="lazy" className="h-20 w-auto" />
            <h2 className="label mt-10 text-white/70">Find us</h2>
            <address className="mt-4 space-y-1 text-[15px] not-italic leading-relaxed text-white/85">
              <p>{findUs.address}</p>
              <p>{findUs.transit}</p>
              <p className="pt-2">
                Phone: <a href={findUs.phoneHref} className="text-white underline-offset-4 hover:underline">{findUs.phone}</a>
              </p>
              <p>
                Email: <a href={`mailto:${findUs.email}`} className="text-white underline-offset-4 hover:underline">{findUs.email}</a>
              </p>
            </address>
            <h2 className="label mt-8 text-white/70">Get the app</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#app-android" aria-label="Get the Qatar National Library app on Google Play">
                <img src="/img/badges/google-play.webp" alt="" width={365} height={120} loading="lazy" className="h-11 w-auto" />
              </a>
              <a href="#app-ios" aria-label="Download the Qatar National Library app on the App Store">
                <img src="/img/badges/app-store.webp" alt="" width={385} height={120} loading="lazy" className="h-11 w-auto" />
              </a>
            </div>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-2">
              <h2 className="label text-white/70">{col.title}</h2>
              <ul className="mt-4">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href={`#${slug(l)}`} className={link}>{l}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-white/15 py-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Follow us" className="flex flex-wrap items-center gap-x-5">
            <h2 className="label me-1 text-white/70">Follow us</h2>
            {social.map((s) => (
              <a key={s} href={`#${slug(s)}`} className={link}>{s}</a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/70">
            <p>© Qatar National Library. A member of Qatar Foundation.</p>
            <a href="#ar" lang="ar" dir="rtl" className="inline-flex min-h-11 items-center text-[15px] text-white hover:underline" style={{ fontFamily: 'var(--font-arabic)' }}>
              العربية
            </a>
            <p>Concept by Vistas Global</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
