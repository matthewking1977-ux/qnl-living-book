import { useEffect, useRef, useState } from 'react'
import { listen, voiceSupported } from '../lib/voice'
import { useT } from '../lib/i18n'

/**
 * Mic button for search. Shown only where the browser supports speech recognition.
 * While listening it shows a gentle pulse (user-started feedback, not idle motion)
 * and writes the words into the field as they are recognised.
 */
export function VoiceButton({ onText, onFinal, lang = 'en-GB', tone = 'light' }: { onText: (t: string) => void; onFinal?: (t: string) => void; lang?: string; tone?: 'light' | 'dark' }) {
  const t = useT()
  const [supported] = useState(voiceSupported)
  const [on, setOn] = useState(false)
  const [note, setNote] = useState('')
  const stop = useRef<() => void>(() => {})
  useEffect(() => () => stop.current(), [])
  if (!supported) return null

  const toggle = () => {
    if (on) {
      stop.current()
      return
    }
    setNote('')
    setOn(true)
    stop.current = listen({
      lang,
      onText: (t, final) => {
        onText(t)
        if (final) onFinal?.(t)
      },
      onEnd: () => setOn(false),
      onError: (code) => {
        setOn(false)
        setNote(code === 'not-allowed' || code === 'service-not-allowed' ? t('voiceDenied') : code === 'no-speech' ? t('voiceNoSpeech') : '')
      },
    })
  }

  const dark = tone === 'dark'
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? t('voiceStop') : t('voiceStart')}
        className={`relative grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-300 ease-(--ease-ui) md:size-12 ${
          on ? (dark ? 'bg-white text-ink' : 'bg-ink text-white') : dark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-g3'
        }`}
      >
        {on && <span aria-hidden className={`voice-pulse absolute inset-0 rounded-full ${dark ? 'bg-white/40' : 'bg-ink/30'}`} />}
        <svg aria-hidden viewBox="0 0 24 24" className="relative size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
        </svg>
      </button>
      <span role="status" aria-live="polite" className="sr-only">{on ? t('voiceListening') : note}</span>
      {note && (
        <span className={`absolute right-0 top-full mt-2 whitespace-nowrap text-[13px] ${dark ? 'text-white/80' : 'text-g1'}`}>{note}</span>
      )}
    </span>
  )
}
