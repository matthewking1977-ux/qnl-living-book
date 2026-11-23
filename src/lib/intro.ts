/**
 * Remembers whether the visitor has been through the intro.
 * - 'always'  (localStorage): they pressed Skip, so they start at the search bar on every visit.
 * - 'session' (sessionStorage): they watched it, so it does not replay within this session.
 * Storage can be unavailable (private mode, blocked site data): every access is guarded
 * and the page simply plays the intro.
 */
const KEY = 'qnl-intro-seen'

export function markIntroSeen(scope: 'always' | 'session') {
  try {
    ;(scope === 'always' ? localStorage : sessionStorage).setItem(KEY, '1')
  } catch { /* storage unavailable */ }
}

export function introSeen() {
  try {
    return localStorage.getItem(KEY) === '1' || sessionStorage.getItem(KEY) === '1'
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
