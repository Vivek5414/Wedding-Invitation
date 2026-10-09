export type WeddingEvent = {
  name: string
  date: string
  time: string
  venue: string
  address: string
  dressCode: string
  description: string
  accent: string
}

export type StoryMoment = {
  date: string
  title: string
  description: string
  location: string
  image: string
}

export type FamilyMember = {
  name: string
  relation: string
  message: string
  image: string
}

export type GalleryItem = {
  src: string
  category: 'Bride' | 'Groom' | 'Family' | 'Friends' | 'Ceremony' | 'Couple' | 'Celebration' | 'Details' | 'Venue' | 'Behind the Scenes'
  alt: string
}

export const weddingConfig = {
  names: {
    bride: 'Aliya',
    groom: 'Rohit',
    combined: 'Rohit & Aliya',
  },
  tagline: 'One Link. Your Entire Wedding Story.',
  altTagline: "More Than an Invitation. Your Wedding's Digital Home.",
  date: '2026-12-18T18:00:00+05:30',
  timeZone: 'Asia/Kolkata',
  dateLabel: '18 December 2026',
  venue: 'The Royal Garden Palace',
  venueLocation: 'Jaipur, Rajasthan',
  heroImage:
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80',
  shareLink: 'https://foreverwedding.com/rohit-aliya',
  story: [
    {
      date: '2019',
      title: 'First Meeting',
      description:
        'A chance introduction that felt like destiny, with an instant connection that neither of us could ignore.',
      location: 'Cafe Lumiere, Mumbai',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    },
    {
      date: '2021',
      title: 'First Trip',
      description:
        'Our first getaway turned into a thousand memories, beautiful sunsets, and endless laughter.',
      location: 'Alleppey, Kerala',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    },
    {
      date: '2024',
      title: 'We Said Yes',
      description:
        'A moment we will cherish forever — the beginning of a life written with love, trust, and joy.',
      location: 'Udaipur Lake',
      image:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    },
    {
      date: '2026',
      title: 'Our Forever Begins',
      description:
        'The day we celebrate the love we have built, with the people we love most around us.',
      location: 'Jaipur, Rajasthan',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    },
  ] as StoryMoment[],
  couple: {
    groom: {
      name: 'Rohit Sharma',
      bio: 'A grounded and thoughtful man whose calm presence makes every day feel gentle and full of warmth.',
      quote: 'The best chapters are the ones we build together, one memory at a time.',
      socials: { instagram: '@rohitsharma', x: '@rohitsharma' },
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    },
    bride: {
      name: 'Aliya Mehta',
      bio: 'A radiant dreamer with a generous heart, bringing light, grace, and joy into every part of our life together.',
      quote: 'Love turns ordinary moments into memories we want to keep forever.',
      socials: { instagram: '@aliyamehta', x: '@aliyamehta' },
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    },
  },
  families: {
    bride: [
      {
        name: 'Meena Mehta',
        relation: 'Mother of the Bride',
        message: 'Our daughter found her forever home in the gentlest heart.',
        image:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80',
      },
      {
        name: 'Rakesh Mehta',
        relation: 'Father of the Bride',
        message: 'We are so proud to welcome a wonderful family into ours.',
        image:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
      },
    ] as FamilyMember[],
    groom: [
      {
        name: 'Sonal Sharma',
        relation: 'Mother of the Groom',
        message: 'We are grateful to welcome Aliya into our family with so much love.',
        image:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
      },
      {
        name: 'Amit Sharma',
        relation: 'Father of the Groom',
        message: 'To see our son find such joy and peace is a blessing beyond words.',
        image:
          'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=700&q=80',
      },
    ] as FamilyMember[],
  },
  events: [
    {
      name: 'Mehendi',
      date: '16 December 2026',
      time: '11:00 AM',
      venue: 'Garden Courtyard',
      address: '21 Rose Lane, Jaipur, Rajasthan',
      dressCode: 'Bright, cheerful & colorful pastels',
      description: 'A joyful, vibrant celebration filled with laughter, floral hues, and happy memories.',
      accent: 'from-amber-200 via-yellow-100 to-rose-100',
    },
    {
      name: 'Haldi',
      date: '17 December 2026',
      time: '9:00 AM',
      venue: 'Sunset Lawn',
      address: '18 Indigo Avenue, Jaipur, Rajasthan',
      dressCode: 'Yellow, white, and light festive outfits',
      description: 'A warm, sunlit ritual of blessings, family, laughter, and heartfelt wishes.',
      accent: 'from-yellow-200 via-amber-100 to-orange-100',
    },
    {
      name: 'Wedding',
      date: '18 December 2026',
      time: '7:00 PM',
      venue: 'The Royal Garden Palace',
      address: '7 Palace Road, Jaipur, Rajasthan',
      dressCode: 'Traditional Indian elegance with a modern touch',
      description: 'Our sacred celebration of love, rooted in tradition and wrapped in timeless romance.',
      accent: 'from-rose-200 via-fuchsia-100 to-amber-50',
    },
    {
      name: 'Reception',
      date: '19 December 2026',
      time: '8:30 PM',
      venue: 'Skyline Ballroom',
      address: '44 Horizon Road, Jaipur, Rajasthan',
      dressCode: 'Elegant evening attire',
      description: 'A night of music, dancing, and celebration with all the people we love most.',
      accent: 'from-violet-200 via-fuchsia-100 to-rose-50',
    },
  ] as WeddingEvent[],
  dressCode: {
    Haldi: {
      palette: 'Sunshine yellow, ivory, and citrus greens',
      style: 'Light fabrics, floral silhouettes, and festive comfort.',
      note: 'Keep it easy, bright, and playful. Comfort is key for a joyful morning.',
    },
    Mehendi: {
      palette: 'Pastels, pinks, greens, and vibrant floral prints',
      style: 'Traditional lehengas, kurtis, and colorful fusion looks.',
      note: 'Add a little sparkle and embrace the festive color palette.',
    },
    Wedding: {
      palette: 'Ivory, blush, gold, maroon, and jewel tones',
      style: 'Traditional Indian wear with a refined, elegant finish.',
      note: 'We would love for you to arrive in your finest traditional or formal celebration attire.',
    },
    Reception: {
      palette: 'Black, gold, navy, and polished evening shades',
      style: 'Modern elegance with a touch of glamour.',
      note: 'Dress to impress for an evening of music, dance, and celebration.',
    },
  },
  gallery: [
    { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80', category: 'Ceremony', alt: 'Couple portrait' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', category: 'Bride', alt: 'Bride smiling' },
    { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80', category: 'Groom', alt: 'Groom portrait' },
    { src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80', category: 'Family', alt: 'Family together' },
    { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85', category: 'Friends', alt: 'Friends sitting together by the water with their arms around one another' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85', category: 'Couple', alt: 'A couple sharing a quiet wedding-day moment with a bouquet' },
    { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1100&q=85', category: 'Celebration', alt: 'A lively celebration crowd dancing beneath colorful lights' },
    { src: '/images/mehendi-henna-ceremony.jpg', category: 'Details', alt: 'Intricate henna being applied to a bride’s hand' },
    { src: '/images/reception-floral-stage.jpg', category: 'Venue', alt: 'The reception venue’s floral stage glowing with warm golden lights' },
  ] as GalleryItem[],
  weddingWallPosts: [
    {
      guest: 'Ananya',
      message: 'We are so happy for you both. The love and laughter in this story is beautiful!',
      timestamp: '2h ago',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
      reactions: { '❤️': 18, '🎉': 7, '🥰': 14 },
    },
    {
      guest: 'Rohit',
      message: 'Seeing this journey has made us believe in love stories all over again.',
      timestamp: '5h ago',
      image: '',
      reactions: { '❤️': 22, '✨': 11, '😂': 3 },
    },
  ],
  quizQuestions: [
    { question: 'Who proposed first?', options: ['Rohit', 'Aliya', 'They both did together'], correct: 'Aliya' },
    { question: 'Who is more punctual?', options: ['Rohit', 'Aliya', 'Neither'], correct: 'Rohit' },
    { question: 'Who says sorry first?', options: ['Rohit', 'Aliya', 'They never argue'], correct: 'Aliya' },
    { question: 'Who takes longer to get ready?', options: ['Rohit', 'Aliya', 'They are equally slow'], correct: 'Aliya' },
  ],
  adminGuests: [
    { name: 'Ananya Kapoor', side: 'Bride', guests: 2, rsvp: 'Confirmed', events: 'All', food: 'Vegetarian', status: 'Approved' },
    { name: 'Rohit Sharma', side: 'Groom', guests: 3, rsvp: 'Maybe', events: 'Wedding + Reception', food: 'Non-Vegetarian', status: 'Pending' },
    { name: 'Nisha Sen', side: 'Bride', guests: 1, rsvp: 'Not Attending', events: 'None', food: 'Vegan', status: 'Rejected' },
  ],
}
