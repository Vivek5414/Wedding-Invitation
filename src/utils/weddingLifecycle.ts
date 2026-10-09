import { weddingConfig } from '../data/weddingConfig'

export type WeddingChapter = 'BEFORE' | 'WEDDING_DAY' | 'AFTER'

export type WeddingChapterConfig = {
  label: string
  title: string
  subtitle: string
  description: string
  emotionalLine: string
  badge: string
}

export const getWeddingCalendarDay = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: weddingConfig.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))

  return `${values.year}-${values.month}-${values.day}`
}

export function getWeddingChapter(referenceDate = new Date()): WeddingChapter {
  const weddingDay = getWeddingCalendarDay(new Date(weddingConfig.date))
  const currentDay = getWeddingCalendarDay(referenceDate)

  if (currentDay < weddingDay) return 'BEFORE'
  if (currentDay === weddingDay) return 'WEDDING_DAY'
  return 'AFTER'
}

export const weddingChapterConfig: Record<WeddingChapter, WeddingChapterConfig> = {
  BEFORE: {
    label: 'Chapter 1',
    title: 'Our Wedding',
    subtitle: 'Our story is still being written.',
    description: 'A season of anticipation, wonder, and promises still unfolding.',
    emotionalLine: 'We are getting married.',
    badge: 'Before the wedding',
  },
  WEDDING_DAY: {
    label: 'Chapter 2',
    title: 'We’re Getting Married',
    subtitle: 'Today, everything changes.',
    description: 'The story steps into a new chapter, full of joy, memory, and belonging.',
    emotionalLine: 'This is the day we begin our forever.',
    badge: 'Wedding day',
  },
  AFTER: {
    label: 'Chapter 3',
    title: 'We Got Married',
    subtitle: 'And somehow, one little moment led us here.',
    description: 'A beautiful chapter of vows, laughter, and the life we have made together.',
    emotionalLine: 'This is only the beginning.',
    badge: 'After the wedding',
  },
}
