import { hours } from '../data/library'

/** Today's opening hours and whether the Library is open now, in Doha time. */
export function today(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Qatar', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const [open, close] = hours[day]
  const mins = Number(get('hour')) * 60 + Number(get('minute'))
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))
  const fmt = (t: string) => {
    const h = Number(t.slice(0, 2))
    return `${((h + 11) % 12) + 1}:${t.slice(3)} ${h < 12 ? 'AM' : 'PM'}`
  }
  return { range: `${fmt(open)} – ${fmt(close)}`, openNow: mins >= toMin(open) && mins < toMin(close) }
}
