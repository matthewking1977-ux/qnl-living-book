import { useLang } from '../lib/dir'

/**
 * Bilingual text. If Arabic has not been supplied (null) the English shows with
 * an "[AR – TBC]" tag, so nothing unapproved is passed off as final copy.
 */
export function Tx({ en, ar, tbc }: { en: string; ar: string | null; tbc?: boolean }) {
  const lang = useLang()
  if (lang === 'en') return <>{en}</>
  if (ar) return <>{ar}{tbc && <TbcTag text="AR – TBC review" />}</>
  return (
    <>
      <span lang="en" dir="ltr" className="inline-block">{en}</span>
      <TbcTag text="AR – TBC" />
    </>
  )
}

function TbcTag({ text }: { text: string }) {
  return (
    <span
      lang="en"
      dir="ltr"
      className="mx-2 inline-block align-middle text-[9px] font-medium tracking-[0.08em] opacity-60"
      style={{ fontFamily: 'var(--font-sans)', textTransform: 'none', lineHeight: 1 }}
    >
      [{text}]
    </span>
  )
}
