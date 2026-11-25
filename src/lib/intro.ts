/**
 * Remembers that the visitor has been through the book, for 30 days. It is set when
 * they press "Skip intro" or watch the book through to the search bar; within that
 * time they start at the search bar, with "Open the book" to see it again.
 * Storage can be unavailable (private mode, blocked site data): every access is
 * guarded and the page simply plays the intro.
 */
const KEY = 'qnl-intro-seen'
const DAYS = 30

export function markIntroSeen() {
  try {
    localStorage.setItem(KEY, String(Date.now()))
  } catch { /* storage unavailable */ }
}

export function introSeen() {
  try {
    const t = Number(localStorage.getItem(KEY))
    return t > 0 && Date.now() - t < DAYS * 86_400_000
  } catch {
    return false
  }
}

export function clearIntroSeen() {
  try {
    localStorage.removeItem(KEY)
    sessionStorage.removeItem(KEY)
  } catch { /* storage unavailable */ }
}
