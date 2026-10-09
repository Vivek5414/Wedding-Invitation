export type CeremonyPhoto = {
  src: string
  alt: string
  caption: string
}

export type CeremonyDefinition = {
  id: 'haldi' | 'mehndi' | 'sangeet' | 'wedding' | 'reception'
  name: string
  chapter: string
  tagline: string
  date: string
  startsAt: string
  time: string
  venue: string
  description: string
  dressCode: string
  primaryColor: string
  secondaryColor: string
  inkColor: string
  background: string
  heroImage: CeremonyPhoto
  galleryImages: CeremonyPhoto[]
  decorations: 'marigold' | 'botanical' | 'stage-lights' | 'ornamental' | 'golden-glow'
  animationStyle: 'warm' | 'floral' | 'energetic' | 'royal' | 'luxury'
  layoutStyle: 'sunlit-editorial' | 'botanical-collage' | 'cinematic-stage' | 'royal-cinema' | 'evening-magazine'
  transition: { duration: number; fromY: number; fromScale: number }
}

export const ceremonies: CeremonyDefinition[] = [
  {
    id: 'haldi',
    name: 'Haldi',
    chapter: '01 · The morning of joy',
    tagline: 'Let the celebrations begin.',
    date: '16 December 2026',
    startsAt: '2026-12-16T11:00:00+05:30',
    time: '11:00 AM',
    venue: 'Garden Courtyard, Jaipur',
    description: 'A warm, joyful morning of marigolds, family blessings, laughter, and sunshine.',
    dressCode: 'Yellow · Floral · Traditional',
    primaryColor: '#b85b20',
    secondaryColor: '#e8ad36',
    inkColor: '#452b20',
    background: 'linear-gradient(128deg, #fff6d9 0%, #f9e9b9 52%, #fffaf0 100%)',
    heroImage: {
      src: '/images/haldi-turmeric-ceremony.jpg',
      alt: 'Groom arranging turmeric into seven lines during a traditional Haldi ceremony',
      caption: 'A little sunshine, a lot of laughter.',
    },
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85', alt: 'Marigold-inspired festival styling in warm natural light', caption: 'Flowers in the morning sun' },
      { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85', alt: 'Family gathering celebrating a joyful haldi ritual', caption: 'Our favourite people, all together' },
      { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85', alt: 'Warm haldi portrait in soft sunlight', caption: 'Golden-hour kind of joy' },
    ],
    decorations: 'marigold',
    animationStyle: 'warm',
    layoutStyle: 'sunlit-editorial',
    transition: { duration: 0.55, fromY: 22, fromScale: 0.985 },
  },
  {
    id: 'mehndi',
    name: 'Mehndi',
    chapter: '02 · In full bloom',
    tagline: 'Painted in joy.',
    date: '17 December 2026',
    startsAt: '2026-12-17T16:00:00+05:30',
    time: '4:00 PM',
    venue: 'The Courtyard, Jaipur',
    description: 'An intimate garden-side afternoon of intricate mehndi, soft music, and unhurried conversations.',
    dressCode: 'Sage · Peach · Traditional',
    primaryColor: '#416a50',
    secondaryColor: '#d98f78',
    inkColor: '#294235',
    background: 'linear-gradient(130deg, #f3f4e8 0%, #e3ebd8 54%, #fae6d9 100%)',
    heroImage: {
      src: '/images/mehendi-henna-ceremony.jpg',
      alt: 'Bride having an intricate henna design applied during a Mehendi ceremony',
      caption: 'Every detail, drawn with love.',
    },
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=85', alt: 'Close-up floral and mehendi-inspired celebration styling', caption: 'A little garden romance' },
      { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85', alt: 'Couple portrait with warm festive styling', caption: 'The little details' },
      { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85', alt: 'Mehendi celebration surrounded by loved ones', caption: 'Together, in full bloom' },
    ],
    decorations: 'botanical',
    animationStyle: 'floral',
    layoutStyle: 'botanical-collage',
    transition: { duration: 0.7, fromY: 15, fromScale: 0.99 },
  },
  {
    id: 'sangeet',
    name: 'Sangeet',
    chapter: '03 · After the lights come on',
    tagline: 'One night. Countless memories.',
    date: '17 December 2026',
    startsAt: '2026-12-17T20:30:00+05:30',
    time: '8:30 PM',
    venue: 'Skyview Pavilion, Jaipur',
    description: 'A cinematic night of music, dance, big-hearted performances, and a dance floor for everyone.',
    dressCode: 'Jewel tones · Festive · A little sparkle',
    primaryColor: '#d84caa',
    secondaryColor: '#7453c8',
    inkColor: '#fff7ff',
    background: 'radial-gradient(ellipse at 82% 4%, rgba(207, 53, 150, .48), transparent 40%), linear-gradient(140deg, #17122c 0%, #281647 56%, #1a1637 100%)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=88',
      alt: 'A performer under vivid purple and magenta stage lights',
      caption: 'All our favourite people, on one dance floor.',
    },
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85', alt: 'A live performance under electric stage lighting', caption: 'Turn the music up' },
      { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=85', alt: 'A packed dance floor at a concert', caption: 'A night made for dancing' },
      { src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85', alt: 'A crowd celebrating beneath stage lights', caption: 'The energy is everything' },
    ],
    decorations: 'stage-lights',
    animationStyle: 'energetic',
    layoutStyle: 'cinematic-stage',
    transition: { duration: 0.45, fromY: 32, fromScale: 0.97 },
  },
  {
    id: 'wedding',
    name: 'Wedding',
    chapter: '04 · The promise',
    tagline: 'Two families. Two hearts. One forever.',
    date: '18 December 2026',
    startsAt: '2026-12-18T19:00:00+05:30',
    time: '7:00 PM',
    venue: 'The Royal Garden Palace, Jaipur',
    description: 'A sacred celebration of love, family, and the rituals that make this promise ours.',
    dressCode: 'Ivory · Burgundy · Heirloom gold',
    primaryColor: '#762e3d',
    secondaryColor: '#d4b978',
    inkColor: '#442129',
    background: 'linear-gradient(135deg, #fbf5ec 0%, #f0e2cf 64%, #f7eeee 100%)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2000&q=90',
      alt: 'A romantic wedding ceremony surrounded by family',
      caption: 'The beginning of our forever.',
    },
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85', alt: 'A romantic ceremony with warm lights', caption: 'A promise made together' },
      { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1100&q=85', alt: 'A wedding celebration with loved ones', caption: 'A day held close' },
      { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1100&q=85', alt: 'A couple sharing a quiet moment', caption: 'Two hearts, one home' },
    ],
    decorations: 'ornamental',
    animationStyle: 'royal',
    layoutStyle: 'royal-cinema',
    transition: { duration: 0.8, fromY: 12, fromScale: 0.992 },
  },
  {
    id: 'reception',
    name: 'Reception',
    chapter: '05 · Into the night',
    tagline: 'A celebration to remember.',
    date: '19 December 2026',
    startsAt: '2026-12-19T20:30:00+05:30',
    time: '8:30 PM',
    venue: 'Skyline Ballroom, Jaipur',
    description: 'An elegant evening of candlelight, dinner, heartfelt toasts, and one more dance.',
    dressCode: 'Black tie · Champagne · Evening glamour',
    primaryColor: '#c9a85e',
    secondaryColor: '#f2dfb4',
    inkColor: '#fff8e9',
    background: 'radial-gradient(ellipse at 86% 38%, rgba(177, 139, 64, .18), transparent 40%), linear-gradient(135deg, #101115 0%, #17181c 58%, #25201a 100%)',
    heroImage: {
      src: '/images/reception-floral-stage.jpg',
      alt: 'Reception stage decorated with a floral arch and golden accents',
      caption: 'One last toast before forever begins.',
    },
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85', alt: 'A candlelit dinner table set for an evening celebration', caption: 'Every detail, in its own light' },
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85', alt: 'A warmly lit celebration space', caption: 'Champagne and candlelight' },
      { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=85', alt: 'Guests celebrating together beneath warm lights', caption: 'And then, one more dance' },
    ],
    decorations: 'golden-glow',
    animationStyle: 'luxury',
    layoutStyle: 'evening-magazine',
    transition: { duration: 0.68, fromY: 18, fromScale: 0.985 },
  },
]
