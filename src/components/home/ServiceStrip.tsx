const services = [
  { title: 'Become a member', note: 'Join online or at the library' },
  { title: 'Book a study space', note: 'Rooms and desks' },
  { title: 'Visit us', note: 'Hours today: [TBC]' },
  { title: 'Ask a librarian', note: 'Help with research and borrowing' },
]

/** Four service shortcuts, directly under the book. */
export function ServiceStrip() {
  return (
    <nav aria-label="Services" className="mx-auto max-w-[1440px] px-4 md:px-10">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <li key={s.title} className="border-b border-g3 lg:border-b-0 lg:border-e lg:last:border-e-0">
            <a href="#" className="btn-slide light flex min-h-[132px] flex-col justify-between px-0 py-6 transition-[color,padding] duration-400 ease-(--ease-ui) hover:px-5 focus-visible:px-5 lg:px-6">
              <span className="label opacity-60">0{i + 1}</span>
              <span>
                <span className="block text-[18px] font-medium">{s.title}</span>
                <span className="mt-1 block text-[14px] opacity-70">{s.note}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
