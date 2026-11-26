/**
 * Every interface string on the site, in English and Arabic. Content that belongs to
 * a list (spreads, events, study spaces, footer links…) lives with that list in
 * data/spreads.ts and data/library.ts, also with an `ar` version.
 *
 * ARABIC STATUS: first draft, for review by QNL's copywriter. Only the headline and the
 * search placeholder were supplied by the client. `npm run copy` exports everything to
 * docs/arabic-copy.md for review.
 */
export const strings = {
  // header and intro
  skipIntro: { en: 'Skip intro', ar: 'تخطَّ المقدمة' },
  openBook: { en: 'Open the book', ar: 'افتح الكتاب' },
  nextPage: { en: 'Next page', ar: 'الصفحة التالية' },
  prevPage: { en: 'Previous page', ar: 'الصفحة السابقة' },
  closeBook: { en: 'Close the book', ar: 'أغلق الكتاب' },
  scrollToOpen: { en: 'Scroll to open', ar: 'مرِّر لفتح الكتاب' },
  introRegion: { en: 'Introduction', ar: 'المقدمة' },
  insideBook: { en: 'Inside the book', ar: 'داخل الكتاب' },
  bookChapters: { en: 'Book chapters', ar: 'فصول الكتاب' },
  home: { en: 'Qatar National Library, home', ar: 'مكتبة قطر الوطنية، الصفحة الرئيسية' },
  sample: { en: 'Sample', ar: 'نموذج' },
  libraryName: { en: 'Qatar National Library', ar: 'مكتبة قطر الوطنية' },

  // search
  searchLibrary: { en: 'Search the library', ar: 'ابحث في المكتبة' },
  search: { en: 'Search', ar: 'بحث' },
  close: { en: 'Close', ar: 'إغلاق' },
  filterBooks: { en: 'Books', ar: 'الكتب' },
  filterResearch: { en: 'Research', ar: 'الأبحاث' },
  filterEvents: { en: 'Events', ar: 'الفعاليات' },
  filterHeritage: { en: 'Heritage', ar: 'التراث' },
  slashTip1: { en: 'Tip: press', ar: 'نصيحة: اضغط' },
  slashTip2: { en: 'anywhere on the site to search.', ar: 'في أي مكان من الموقع للبحث.' },
  voiceStart: { en: 'Search by voice', ar: 'البحث بالصوت' },
  voiceStop: { en: 'Stop listening', ar: 'إيقاف الاستماع' },
  voiceListening: { en: 'Listening', ar: 'جارٍ الاستماع' },
  voiceDenied: { en: 'Microphone access is off for this site.', ar: 'الوصول إلى الميكروفون غير مفعّل لهذا الموقع.' },
  voiceNoSpeech: { en: 'Didn’t catch that. Try again.', ar: 'لم نتمكن من سماعك. حاول مرة أخرى.' },

  // service strip
  services: { en: 'Services', ar: 'الخدمات' },
  becomeMember: { en: 'Become a member', ar: 'انضم إلى المكتبة' },
  becomeMemberNote: { en: 'Join online or at the Library', ar: 'سجّل عبر الإنترنت أو في المكتبة' },
  bookStudy: { en: 'Book a study space', ar: 'احجز مساحة للدراسة' },
  bookStudyNote: { en: 'Group rooms, media lounges, quiet rooms', ar: 'غرف جماعية وقاعات وسائط وغرف هادئة' },
  visitUs: { en: 'Visit us', ar: 'زُرنا' },
  openNow: { en: 'Open now', ar: 'مفتوح الآن' },
  closedNow: { en: 'Closed now', ar: 'مغلق الآن' },
  today: { en: 'Today', ar: 'اليوم' },
  askLibrarian: { en: 'Ask a librarian', ar: 'اسأل أمين المكتبة' },
  askLibrarianNote: { en: 'Help with research and borrowing', ar: 'مساعدة في البحث والاستعارة' },
  studyQuestions: { en: 'Questions? Call 4454 2152 or email qnlresourcebooking@qnl.qa', ar: 'لديك استفسار؟ اتصل على 4454 2152 أو راسلنا على qnlresourcebooking@qnl.qa' },
  room: { en: 'room', ar: 'غرفة' },
  rooms: { en: 'rooms', ar: 'غرف' },
  openArea: { en: 'Open area', ar: 'مساحة مفتوحة' },
  bookNow: { en: 'Book now', ar: 'احجز الآن' },

  // what's on
  whatsOn: { en: "What's on", ar: 'الفعاليات' },
  whatsOnTitle: { en: 'This week at the library.', ar: 'هذا الأسبوع في المكتبة.' },
  seeAllEvents: { en: 'See all events', ar: 'عرض جميع الفعاليات' },

  // collections
  collections: { en: 'From the collections', ar: 'من المجموعات' },
  collectionsTitle: { en: 'Three ways in.', ar: 'ثلاثة مداخل إلى المعرفة.' },

  // audiences
  forYou: { en: 'For you', ar: 'لك' },
  forYouTitle: { en: 'A library for every kind of reader.', ar: 'مكتبة لكل قارئ.' },

  // plan your visit
  planVisit: { en: 'Plan your visit', ar: 'خطّط لزيارتك' },
  planVisitTitle: { en: 'Open seven days a week.', ar: 'نستقبلكم طوال أيام الأسبوع.' },
  openingHours: { en: 'Opening hours', ar: 'ساعات العمل' },
  todayLower: { en: 'today', ar: 'اليوم' },
  gettingHere: { en: 'Getting here', ar: 'الوصول إلينا' },
  weAreIn: { en: 'We are in Education City, Al Rayyan.', ar: 'نقع في المدينة التعليمية، الريان.' },
  openInMaps: { en: 'Open in Google Maps', ar: 'افتح في خرائط Google' },
  buildingPhoto: { en: 'Qatar National Library building at dusk', ar: 'مبنى مكتبة قطر الوطنية عند الغروب' },

  // footer
  a11yLine1: { en: 'We aim to meet WCAG 2.2 AA. Read our', ar: 'نسعى إلى استيفاء معايير WCAG 2.2 بمستوى AA. اطّلع على' },
  a11yStatement: { en: 'accessibility statement', ar: 'بيان إمكانية الوصول' },
  a11yOr: { en: 'or', ar: 'أو' },
  a11yBarrier: { en: 'tell us about a barrier', ar: 'أبلغنا عن عائق' },
  findUs: { en: 'Find us', ar: 'موقعنا' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  getApp: { en: 'Get the app', ar: 'حمّل التطبيق' },
  appAndroid: { en: 'Get the Qatar National Library app on Google Play', ar: 'حمّل تطبيق مكتبة قطر الوطنية من Google Play' },
  appIos: { en: 'Download the Qatar National Library app on the App Store', ar: 'حمّل تطبيق مكتبة قطر الوطنية من App Store' },
  followUs: { en: 'Follow us', ar: 'تابعونا' },
  copyright: { en: '© Qatar National Library. A member of Qatar Foundation.', ar: '© مكتبة قطر الوطنية. عضو في مؤسسة قطر.' },
  conceptBy: { en: 'Concept by Vistas Global', ar: 'تصميم مقترح من Vistas Global' },
  draftNote: { en: '', ar: 'النص العربي مسودة أولى قيد المراجعة.' },
} as const

export type StringKey = keyof typeof strings
