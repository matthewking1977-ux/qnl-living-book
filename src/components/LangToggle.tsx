import type { Lang } from '../lib/dir'

/** EN / عربي. Each option carries its own lang so it is read correctly. */
export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const item = (l: Lang, text: string) => (
    <button
      type="button"
      lang={l}
      aria-pressed={lang === l}
      onClick={() => onChange(l)}
      className={`min-h-11 min-w-11 px-2 text-[13px] font-medium transition-opacity duration-300 ease-(--ease-ui) ${
        lang === l ? 'opacity-100 underline underline-offset-8' : 'opacity-70 hover:opacity-100'
      }`}
    >
      {text}
    </button>
  )
  return (
    <div role="group" aria-label="Language" className="flex items-center" dir="ltr">
      {item('en', 'EN')}
      <span aria-hidden className="opacity-40">/</span>
      {item('ar', 'عربي')}
    </div>
  )
}
