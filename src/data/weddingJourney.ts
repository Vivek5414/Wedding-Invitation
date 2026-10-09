export type WeddingJourneyMilestone = {
  id: string
  title: string
  date: string
  description: string
  location: string
  image: string
  imageAlt: string
  ceremonyId?: string
}

export const weddingJourney: WeddingJourneyMilestone[] = [
  {
    id: 'first-meeting',
    title: 'First meeting',
    date: '2019',
    description: 'A chance introduction that felt like destiny, and the first page of everything that followed.',
    location: 'Cafe Lumiere, Mumbai',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Friends sharing a warm, candid moment together',
  },
  {
    id: 'first-trip',
    title: 'First trip',
    date: '2021',
    description: 'One little getaway became a thousand memories, beautiful sunsets, and a lifetime of inside jokes.',
    location: 'Alleppey, Kerala',
    image: '/images/first-trip-airplane-couple.jpeg',
    imageAlt: 'A couple in floral shirts and sunglasses sitting together on an airplane',
  },
  {
    id: 'proposal',
    title: 'Proposal',
    date: '2024',
    description: 'A moment to keep forever — and the beginning of a future written together.',
    location: 'Udaipur Lake',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'A joyful portrait capturing a life-changing moment',
  },
  {
    id: 'engagement',
    title: 'Engagement',
    date: 'A promise for forever',
    description: 'Two families, one promise, and all the happy anticipation of the celebrations to come.',
    location: 'With our favourite people',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'An intimate celebration surrounded by warm lights',
  },
  {
    id: 'haldi',
    title: 'Haldi',
    date: '16 December 2026 · 11:00 AM',
    description: 'Sunshine, marigolds, blessings, and the happiest beginning to our wedding celebrations.',
    location: 'Garden Courtyard, Jaipur',
    image: '/images/haldi-turmeric-ceremony.jpg',
    imageAlt: 'Groom arranging turmeric into seven lines during a traditional Haldi ceremony',
    ceremonyId: 'haldi',
  },
  {
    id: 'mehndi',
    title: 'Mehndi',
    date: '17 December 2026 · 4:00 PM',
    description: 'A garden-side afternoon of intricate mehndi, soft music, and the people who feel like home.',
    location: 'The Courtyard, Jaipur',
    image: '/images/mehendi-henna-ceremony.jpg',
    imageAlt: 'Bride having an intricate henna design applied during a Mehendi ceremony',
    ceremonyId: 'mehndi',
  },
  {
    id: 'sangeet',
    title: 'Sangeet',
    date: '17 December 2026 · 8:30 PM',
    description: 'One night, all our favourite people, and a dance floor full of stories.',
    location: 'Skyview Pavilion, Jaipur',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'A performer beneath vivid celebration lights',
    ceremonyId: 'sangeet',
  },
  {
    id: 'wedding',
    title: 'The wedding',
    date: '18 December 2026 · 7:00 PM',
    description: 'Two hearts, two families, and the beginning of a forever we cannot wait to share.',
    location: 'The Royal Garden Palace, Jaipur',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'A romantic wedding celebration with family and friends',
    ceremonyId: 'wedding',
  },
  {
    id: 'reception',
    title: 'Reception',
    date: '19 December 2026 · 8:30 PM',
    description: 'An evening of toasts, music, dinner, and one more chance to celebrate together.',
    location: 'Skyline Ballroom, Jaipur',
    image: '/images/reception-floral-stage.jpg',
    imageAlt: 'Reception stage decorated with a floral arch and golden accents',
    ceremonyId: 'reception',
  },
  {
    id: 'forever',
    title: 'Forever',
    date: 'The next chapter',
    description: 'The best part of the story is still ahead — and it is even better with you in it.',
    location: 'Wherever life takes us',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'A couple walking together into a new chapter',
  },
]
