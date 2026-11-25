/**
 * Voice input for search, using the browser's own speech recognition (Web Speech API).
 * Progressive enhancement: where the browser has none (e.g. Firefox), no mic is shown.
 *
 * Privacy: browsers may send the audio to their vendor's servers for recognition
 * (Chrome: Google; Safari: Apple). A production build should state this, or use a
 * recognition service QNL controls.
 */
interface Recognition {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}
type RecognitionCtor = new () => Recognition

const ctor = (): RecognitionCtor | undefined =>
  (window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }).SpeechRecognition ??
  (window as unknown as { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition

export const voiceSupported = () => typeof window !== 'undefined' && !!ctor()

/** Starts listening. Calls onText with the words so far; returns a function that stops it. */
export function listen(opts: { lang: string; onText: (text: string, final: boolean) => void; onEnd: () => void; onError: (code: string) => void }) {
  const C = ctor()
  if (!C) {
    opts.onError('unsupported')
    return () => {}
  }
  const r = new C()
  r.lang = opts.lang
  r.interimResults = true
  r.continuous = false
  r.maxAlternatives = 1
  r.onresult = (e) => {
    let text = ''
    let final = false
    for (let i = 0; i < e.results.length; i++) {
      text += e.results[i][0].transcript
      final = e.results[i].isFinal
    }
    opts.onText(text.trim(), final)
  }
  r.onerror = (e) => opts.onError(e.error)
  r.onend = () => opts.onEnd()
  r.start()
  return () => r.stop()
}
