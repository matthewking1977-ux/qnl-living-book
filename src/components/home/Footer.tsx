/** Footer. Contact and social entries are placeholders until supplied. */
export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-12 md:px-10 md:py-20">
        <div className="md:col-span-5">
          <img src="/img/qnl-logo-white.webp" alt="Qatar National Library" width={480} height={250} loading="lazy" className="h-20 w-auto" />
        </div>
        <div className="md:col-span-3">
          <p className="label text-white/70">Contact</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li>Address [TBC]</li>
            <li>Telephone [TBC]</li>
            <li>Email [TBC]</li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="label text-white/70">Follow</p>
          <ul className="mt-4 text-[15px]">
            {['Social 1 [TBC]', 'Social 2 [TBC]', 'Social 3 [TBC]'].map((s) => (
              <li key={s}><a href="#" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">{s}</a></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="label text-white/70">Language</p>
          <p className="mt-4 text-[15px]">English</p>
          <p className="mt-2 text-[15px] text-white/70">Arabic [TBC]</p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-[1440px] px-4 py-6 text-[13px] text-white/70 md:px-10">
          Concept homepage. Placeholder content is marked SAMPLE or [TBC].
        </p>
      </div>
    </footer>
  )
}
