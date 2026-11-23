import type { ReactNode } from 'react'

/** Responsive AVIF/WebP photo from /public/img (built by `npm run assets`). */
export function Photo({ name, alt = '', className = '', sizes = '(min-width: 768px) 33vw, 100vw' }: { name: string; alt?: string; className?: string; sizes?: string }) {
  const set = (ext: string) => [640, 1280, 1920].map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ')
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img src={`/img/${name}-1280.webp`} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />
    </picture>
  )
}

/** "[ 02 ] Section" label plus the section's one Playfair heading. */
export function SectionHead({ n, label, title, action }: { n: string; label: string; title: string; action?: ReactNode }) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
      <div>
        <p className="label text-g1">[ {n} ] {label}</p>
        <h2 className="font-display mt-4 max-w-[16em] text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.1] tracking-[-0.01em]">{title}</h2>
      </div>
      {action}
    </header>
  )
}

export function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`border-t border-g3 ${className}`}>
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-10 md:py-24">{children}</div>
    </section>
  )
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="group inline-flex min-h-11 items-center gap-2 text-[14px] font-medium underline decoration-1 underline-offset-[6px]">
      {children}
      <span aria-hidden className="transition-transform duration-300 ease-(--ease-ui) group-hover:translate-x-1">→</span>
    </a>
  )
}

export function SampleTag() {
  return <span className="label border border-ink/40 px-2 py-1 text-[10px] text-g1">Sample</span>
}
