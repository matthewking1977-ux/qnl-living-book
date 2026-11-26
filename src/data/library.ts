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
  { days: 'Saturday to Thursday', days_ar: 'من السبت إلى الخميس', time: '8:00 AM – 8:00 PM', time_ar: '8:00 ص – 8:00 م' },
  { days: 'Friday', days_ar: 'الجمعة', time: '4:00 PM – 8:00 PM', time_ar: '4:00 م – 8:00 م' },
]
export const childrensNote = "The Children's Library closes at 6:30 PM, except on Friday and Saturday, when it closes at 8:00 PM."
export const childrensNote_ar = 'تُغلق مكتبة الطفل أبوابها الساعة 6:30 مساءً، باستثناء يومي الجمعة والسبت حيث تُغلق الساعة 8:00 مساءً.'

export const gettingHere = [
  {
    mode: 'Metro',
    mode_ar: 'المترو',
    text: 'Doha Metro Green Line to Qatar National Library station (Library side).',
    text_ar: 'الخط الأخضر لمترو الدوحة، محطة مكتبة قطر الوطنية (جهة المكتبة).',
  },
  {
    mode: 'Car',
    mode_ar: 'السيارة',
    text_ar:
      'المواقف القريبة من المكتبة محدودة. يمكنك ركن سيارتك في المواقف تحت الأرضية لحديقة الأكسجين أو في مواقف مسجد المدينة التعليمية، ثم استقلال ترام المدينة التعليمية المجاني إلى محطة الملتقى (مركز الطلاب) التي تخدم المكتبة أيضًا.',
    text:
      'Parking near the Library is limited. Park at the Oxygen Park underground car park or the Education City Mosque parking lots, then take the free Education City tram to Multaqa (Student Center) station, which also serves the Library.',
  },
]
export const drivingNote = 'There is a 40 kph speed limit in Education City, which is subject to the traffic and parking rules of the Ministry of Interior.'
export const drivingNote_ar = 'الحد الأقصى للسرعة في المدينة التعليمية 40 كم/ساعة، وتخضع المنطقة لقواعد المرور والمواقف الصادرة عن وزارة الداخلية.'

export interface StudySpace {
  type: string
  type_ar: string
  zone?: string
  zone_ar?: string
  rooms: string
  capacity: string
  capacity_ar: string
  equipment: string[]
  equipment_ar: string[]
  href: string
}
export const studySpaces: StudySpace[] = [
  { type: 'Group study rooms', type_ar: 'غرف الدراسة الجماعية', rooms: '6', capacity: '13 m², 4–6 people', capacity_ar: '13 م²، من 4 إلى 6 أشخاص', equipment: ['Seating and power sockets'], equipment_ar: ['مقاعد ومقابس كهرباء'], href: '#study' },
  { type: 'Media lounge', type_ar: 'قاعة الوسائط', rooms: '1', capacity: '28 m², up to 6 people', capacity_ar: '28 م²، حتى 6 أشخاص', equipment: ['Presentation screen', 'TV screen', 'Media server', 'Technician support'], equipment_ar: ['شاشة عرض', 'شاشة تلفاز', 'خادم وسائط', 'دعم فني'], href: '#study' },
  { type: 'Media lounge', type_ar: 'قاعة الوسائط', rooms: '2', capacity: '13 m², up to 4 people', capacity_ar: '13 م²، حتى 4 أشخاص', equipment: ['Presentation screen', 'TV screen', 'Media server', 'Technician support'], equipment_ar: ['شاشة عرض', 'شاشة تلفاز', 'خادم وسائط', 'دعم فني'], href: '#study' },
  { type: 'Individual study rooms', type_ar: 'غرف الدراسة الفردية', zone: 'Quiet Zone', zone_ar: 'المنطقة الهادئة', rooms: '28', capacity: 'One person', capacity_ar: 'شخص واحد', equipment: ['Desk, bookcase and power socket'], equipment_ar: ['مكتب وخزانة كتب ومقبس كهرباء'], href: '#study' },
  { type: 'Night Study Space', type_ar: 'مساحة الدراسة الليلية', zone: 'Quiet Zone', zone_ar: 'المنطقة الهادئة', rooms: 'Open area', capacity: 'Up to 70 people', capacity_ar: 'حتى 70 شخصًا', equipment: ['PCs, seating and power sockets'], equipment_ar: ['حواسيب ومقاعد ومقابس كهرباء'], href: '#study' },
]
export const studyNotes = [
  'Group study rooms and media lounges are for Library members and need booking in advance.',
  'Individual study rooms can be booked by anyone aged 15 or over.',
  'Rooms may not be used for paid training or other for-profit activities.',
]
export const studyNotes_ar = [
  'غرف الدراسة الجماعية وقاعات الوسائط مخصّصة لأعضاء المكتبة وتتطلب حجزًا مسبقًا.',
  'يمكن لأي شخص يبلغ 15 عامًا فأكثر حجز غرف الدراسة الفردية.',
  'لا يجوز استخدام الغرف في الدورات التدريبية المدفوعة أو أي أنشطة ربحية.',
]

/** SAMPLE events: illustrative titles, dates and places, not real programming. */
export const events = [
  {
    img: 'hall',
    kind: 'Family', kind_ar: 'للعائلة',
    title: 'Saturday storytime: tales of the sea', title_ar: 'حكايات السبت: قصص من البحر',
    date: 'Sat 5 Dec 2026', date_ar: 'السبت 5 ديسمبر 2026',
    time: '10:30 AM', time_ar: '10:30 ص',
    place: "Children's Library", place_ar: 'مكتبة الطفل',
  },
  {
    img: 'terraces',
    kind: 'Workshop', kind_ar: 'ورشة عمل',
    title: 'Getting started with research databases', title_ar: 'مدخل إلى قواعد البيانات البحثية',
    date: 'Tue 8 Dec 2026', date_ar: 'الثلاثاء 8 ديسمبر 2026',
    time: '6:00 PM', time_ar: '6:00 م',
    place: 'Research and Learning, Level 1', place_ar: 'البحث والتعلّم، الطابق الأول',
  },
  {
    img: 'mezzanine',
    kind: 'Exhibition', kind_ar: 'معرض',
    title: 'Charting the Gulf: maps from the collection', title_ar: 'رسم الخليج: خرائط من المجموعة',
    date: 'From 10 Dec 2026', date_ar: 'ابتداءً من 10 ديسمبر 2026',
    time: 'Library hours', time_ar: 'خلال ساعات العمل',
    place: 'Heritage Library', place_ar: 'مكتبة التراث',
  },
]

/** Footer links. Destinations are placeholders until the full site exists. */
export const footerColumns: { title: string; title_ar: string; links: string[]; links_ar: string[] }[] = [
  {
    title: 'About', title_ar: 'عن المكتبة',
    links: ['About the library', 'Plan your visit', "Children's Library", 'Heritage Library', 'Research and learning'],
    links_ar: ['نبذة عن المكتبة', 'خطّط لزيارتك', 'مكتبة الطفل', 'مكتبة التراث', 'البحث والتعلّم'],
  },
  {
    title: 'Services', title_ar: 'الخدمات',
    links: ['Membership', 'Borrowing and returns', 'Study spaces', 'Printing and scanning'],
    links_ar: ['العضوية', 'الاستعارة والإرجاع', 'مساحات الدراسة', 'الطباعة والمسح الضوئي'],
  },
  {
    title: 'Help', title_ar: 'المساعدة',
    links: ['Ask a librarian', 'Contact us', 'Accessibility services', 'Lost property'],
    links_ar: ['اسأل أمين المكتبة', 'تواصل معنا', 'خدمات إمكانية الوصول', 'المفقودات'],
  },
  {
    title: 'Policies', title_ar: 'السياسات',
    links: ['Library policies', 'Privacy', 'Terms of use', 'Accessibility statement'],
    links_ar: ['سياسات المكتبة', 'الخصوصية', 'شروط الاستخدام', 'بيان إمكانية الوصول'],
  },
]
export const findUs = {
  address: 'Education City, Al Rayyan, Doha, Qatar',
  address_ar: 'المدينة التعليمية، الريان، الدوحة، قطر',
  transit: 'Doha Metro Green Line, Qatar National Library station',
  transit_ar: 'الخط الأخضر لمترو الدوحة، محطة مكتبة قطر الوطنية',
  phone: '+974 1234 5678',
  phoneHref: 'tel:+97412345678',
  email: 'hello@qnl.qa',
}
export const social = ['X', 'Instagram', 'YouTube', 'LinkedIn']
export const social_ar = ['إكس', 'إنستغرام', 'يوتيوب', 'لينكد إن']

/** Homepage collections cards. */
export const collections = [
  {
    id: 'books', img: 'aisle',
    kind: 'Books', kind_ar: 'الكتب',
    title: 'On the shelves', title_ar: 'على الرفوف',
    body: 'Borrow from the open collection, in print and online.', body_ar: 'استعِر من المجموعة المفتوحة، مطبوعةً وإلكترونيًا.',
    link: 'Browse the catalogue', link_ar: 'تصفّح الفهرس',
  },
  {
    id: 'research', img: 'interior',
    kind: 'Research', kind_ar: 'الأبحاث',
    title: 'Journals and databases', title_ar: 'الدوريات وقواعد البيانات',
    body: 'Search across subscribed research resources.', body_ar: 'ابحث في مصادر البحث المشتركة.',
    link: 'Search research databases', link_ar: 'ابحث في قواعد البيانات البحثية',
  },
  {
    id: 'heritage', img: 'stone',
    kind: 'Heritage', kind_ar: 'التراث',
    title: 'Qatar and the Gulf', title_ar: 'قطر والخليج',
    body: 'Manuscripts, maps and photographs from the heritage collection.', body_ar: 'مخطوطات وخرائط وصور فوتوغرافية من مجموعة التراث.',
    link: 'Explore the heritage collection', link_ar: 'استكشف مجموعة التراث',
  },
]

/** Homepage audiences cards. */
export const audiences = [
  { id: 'children', title: 'Children', title_ar: 'الأطفال', body: 'Stories, activities and a library of their own.', body_ar: 'قصص وأنشطة ومكتبة خاصة بهم.' },
  { id: 'students', title: 'Students & researchers', title_ar: 'الطلاب والباحثون', body: 'Study space, databases and expert help.', body_ar: 'مساحات للدراسة وقواعد بيانات ومساعدة متخصصة.' },
  { id: 'visitors', title: 'Visitors', title_ar: 'الزوّار', body: 'Plan a visit to the building and its exhibitions.', body_ar: 'خطّط لزيارة المبنى ومعارضه.' },
  { id: 'professionals', title: 'Professionals', title_ar: 'المهنيون', body: 'Resources and services for work and practice.', body_ar: 'مصادر وخدمات للعمل والممارسة المهنية.' },
]
