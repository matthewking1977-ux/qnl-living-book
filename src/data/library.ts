/**
 * Visitor information shown on the homepage and in the footer. Kept in one place so a
 * CMS can feed it later.
 *
 * Opening hours, study spaces and travel notes are taken from QNL's current website.
 * Events are SAMPLE content. Footer contact details are as supplied for the concept.
 */

/** Opening hours by weekday (0 = Sunday … 6 = Saturday), 24 h "HH:MM", Doha time. */
export const hours: Record<number, [string, string]> = {
  0: ['08:00', '20:00'],
  1: ['08:00', '20:00'],
  2: ['08:00', '20:00'],
  3: ['08:00', '20:00'],
  4: ['08:00', '20:00'],
  5: ['16:00', '20:00'], // Friday
  6: ['08:00', '20:00'],
}

export const hoursSummary = [
  { days: 'Saturday to Thursday', time: '8:00 AM – 8:00 PM' },
  { days: 'Friday', time: '4:00 PM – 8:00 PM' },
]
export const childrensNote = "The Children's Library closes at 6:30 PM, except on Friday and Saturday, when it closes at 8:00 PM."

export const gettingHere = [
  { mode: 'Metro', text: 'Doha Metro Green Line to Qatar National Library station (Library side).' },
  {
    mode: 'Car',
    text:
      'Parking near the Library is limited. Park at the Oxygen Park underground car park or the Education City Mosque parking lots, then take the free Education City tram to Multaqa (Student Center) station, which also serves the Library.',
  },
]
export const drivingNote = 'There is a 40 kph speed limit in Education City, which is subject to the traffic and parking rules of the Ministry of Interior.'

export interface StudySpace {
  type: string
  zone?: string
  rooms: string
  capacity: string
  equipment: string[]
  href: string
}
export const studySpaces: StudySpace[] = [
  { type: 'Group study rooms', rooms: '6', capacity: '13 m², 4–6 people', equipment: ['Seating and power sockets'], href: '#study' },
  { type: 'Media lounge', rooms: '1', capacity: '28 m², up to 6 people', equipment: ['Presentation screen', 'TV screen', 'Media server', 'Technician support'], href: '#study' },
  { type: 'Media lounge', rooms: '2', capacity: '13 m², up to 4 people', equipment: ['Presentation screen', 'TV screen', 'Media server', 'Technician support'], href: '#study' },
  { type: 'Individual study rooms', zone: 'Quiet Zone', rooms: '28', capacity: 'One person', equipment: ['Desk, bookcase and power socket'], href: '#study' },
  { type: 'Night Study Space', zone: 'Quiet Zone', rooms: 'Open area', capacity: 'Up to 70 people', equipment: ['PCs, seating and power sockets'], href: '#study' },
]
export const studyNotes = [
  'Group study rooms and media lounges are for Library members and need booking in advance.',
  'Individual study rooms can be booked by anyone aged 15 or over.',
  'Rooms may not be used for paid training or other for-profit activities.',
]

/** SAMPLE events: illustrative titles, dates and places, not real programming. */
export const events = [
  { img: 'hall', kind: 'Family', title: 'Saturday storytime: tales of the sea', date: 'Sat 5 Dec 2026', time: '10:30 AM', place: "Children's Library" },
  { img: 'terraces', kind: 'Workshop', title: 'Getting started with research databases', date: 'Tue 8 Dec 2026', time: '6:00 PM', place: 'Research and Learning, Level 1' },
  { img: 'mezzanine', kind: 'Exhibition', title: 'Charting the Gulf: maps from the collection', date: 'From 10 Dec 2026', time: 'Library hours', place: 'Heritage Library' },
]

/** Footer links. Destinations are placeholders until the full site exists. */
export const footerColumns: { title: string; links: string[] }[] = [
  { title: 'About', links: ['About the library', 'Plan your visit', "Children's Library", 'Heritage Library', 'Research and learning'] },
  { title: 'Services', links: ['Membership', 'Borrowing and returns', 'Study spaces', 'Printing and scanning'] },
  { title: 'Help', links: ['Ask a librarian', 'Contact us', 'Accessibility services', 'Lost property'] },
  { title: 'Policies', links: ['Library policies', 'Privacy', 'Terms of use', 'Accessibility statement'] },
]
export const findUs = {
  address: 'Education City, Al Rayyan, Doha, Qatar',
  transit: 'Doha Metro Green Line, Qatar National Library station',
  phone: '+974 1234 5678',
  phoneHref: 'tel:+97412345678',
  email: 'hello@qnl.qa',
}
export const social = ['X', 'Instagram', 'YouTube', 'LinkedIn']
