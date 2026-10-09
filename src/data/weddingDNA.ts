export type WeddingDNAConfig = {
  relationship: 'romantic' | 'playful' | 'traditional' | 'modern' | 'adventurous' | 'minimal'
  celebration: 'royal' | 'cozy' | 'bollywood' | 'traditional' | 'modern' | 'destination'
  palette: 'marigold' | 'sage' | 'rose' | 'midnight' | 'terracotta'
  music: 'sufi' | 'classical' | 'bollywood' | 'indie' | 'folk'
  lighting: 'daylight' | 'golden-hour' | 'after-dark'
}

export const weddingDNAOptions = {
  relationship: [
    { id: 'romantic', label: 'Romantic', note: 'Soft, heartfelt, timeless' },
    { id: 'playful', label: 'Playful', note: 'Bright, joyful, a little unexpected' },
    { id: 'traditional', label: 'Traditional', note: 'Rooted in rituals and family' },
    { id: 'modern', label: 'Modern', note: 'Clean, considered, contemporary' },
    { id: 'adventurous', label: 'Adventurous', note: 'Curious, spirited, full of stories' },
    { id: 'minimal', label: 'Minimal', note: 'Quiet details, lasting meaning' },
  ],
  celebration: [
    { id: 'royal', label: 'Royal', note: 'Palace-worthy, rich, ceremonial' },
    { id: 'cozy', label: 'Cozy', note: 'Intimate, warm, close to home' },
    { id: 'bollywood', label: 'Bollywood', note: 'A little drama, a lot of heart' },
    { id: 'traditional', label: 'Traditional', note: 'A celebration across generations' },
    { id: 'modern', label: 'Modern', note: 'A fresh take on a meaningful day' },
    { id: 'destination', label: 'Destination', note: 'A weekend away, together' },
  ],
  palette: [
    { id: 'marigold', label: 'Marigold', note: 'Sunlit saffron & warm cream', colors: ['#d16a24', '#e8b647', '#fff6e5'] },
    { id: 'sage', label: 'Sage', note: 'Botanical green & soft peach', colors: ['#3f6b51', '#a8b998', '#f5e2d3'] },
    { id: 'rose', label: 'Rose', note: 'Burgundy, blush & champagne', colors: ['#762e3d', '#bd817c', '#e5d0a8'] },
    { id: 'midnight', label: 'Midnight', note: 'Ink, plum & antique gold', colors: ['#17172d', '#704165', '#d5b46d'] },
    { id: 'terracotta', label: 'Terracotta', note: 'Clay, coral & ivory', colors: ['#a84e37', '#d48b67', '#f7eee4'] },
  ],
  music: [
    { id: 'sufi', label: 'Sufi', note: 'Soulful melodies & quiet magic' },
    { id: 'classical', label: 'Classical', note: 'Graceful ragas & tradition' },
    { id: 'bollywood', label: 'Bollywood', note: 'Beloved songs, all-night dancing' },
    { id: 'indie', label: 'Indie', note: 'A soundtrack that feels like you' },
    { id: 'folk', label: 'Folk', note: 'Local rhythms & family favourites' },
  ],
  lighting: [
    { id: 'daylight', label: 'Daylight', note: 'Open skies & fresh beginnings' },
    { id: 'golden-hour', label: 'Golden hour', note: 'The soft glow just before sunset' },
    { id: 'after-dark', label: 'After dark', note: 'Candlelight, stars & a little sparkle' },
  ],
} as const

export const defaultWeddingDNA: WeddingDNAConfig = {
  relationship: 'romantic',
  celebration: 'royal',
  palette: 'rose',
  music: 'sufi',
  lighting: 'golden-hour',
}

export const weddingDNACopy = {
  relationship: 'What feels most like your story?',
  celebration: 'If your wedding had a feeling, what would it be?',
  palette: 'Choose the colours you want to remember.',
  music: 'What should the soundtrack feel like?',
  lighting: 'When does your kind of magic happen?',
} as const

export const weddingDNAPrompts: { key: keyof WeddingDNAConfig; title: string }[] = [
  { key: 'relationship', title: weddingDNACopy.relationship },
  { key: 'celebration', title: weddingDNACopy.celebration },
  { key: 'palette', title: weddingDNACopy.palette },
  { key: 'music', title: weddingDNACopy.music },
  { key: 'lighting', title: weddingDNACopy.lighting },
]

export const getWeddingDNAPalette = (palette: WeddingDNAConfig['palette']) =>
  weddingDNAOptions.palette.find((option) => option.id === palette) ?? weddingDNAOptions.palette[2]

export const getWeddingDNALighting = (lighting: WeddingDNAConfig['lighting']) => ({
  daylight: { color: '#fff6d9', opacity: 0.055 },
  'golden-hour': { color: '#efa94c', opacity: 0.11 },
  'after-dark': { color: '#19152b', opacity: 0.16 },
}[lighting])

export const getWeddingDNATokens = (config: WeddingDNAConfig) => {
  const palette = getWeddingDNAPalette(config.palette)
  const expressiveMotion = config.relationship === 'playful'
    || config.relationship === 'adventurous'
    || config.celebration === 'bollywood'

  return {
    accent: palette.colors[0],
    secondary: palette.colors[1],
    paper: palette.colors[2],
    fontStyle: config.relationship === 'modern' || config.relationship === 'minimal' ? 'sans' as const : 'serif' as const,
    motionScale: expressiveMotion ? 1.18 : config.relationship === 'minimal' ? 0.78 : 1,
    photoLighting: getWeddingDNALighting(config.lighting),
    surfacePattern: config.celebration === 'royal' || config.celebration === 'traditional' ? 'ornamental' as const : 'organic' as const,
  }
}
