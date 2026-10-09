import { motion } from 'framer-motion'
import {
  CalendarHeart,
  Copy,
  Crown,
  Heart,
  MapPin,
  Menu,
  MessageSquareText,
  Send,
  Shirt,
  Sparkles,
  Star,
  WandSparkles,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { FamilyCard } from '../components/FamilyCard'
import { CeremonySection } from '../components/CeremonySection'
import { KidsCorner } from '../components/KidsCorner'
import { MusicPlayer } from '../components/MusicPlayer'
import { Quiz } from '../components/Quiz'
import { RsvpForm } from '../components/RsvpForm'
import { SectionHeader } from '../components/SectionHeader'
import { VenueCard } from '../components/VenueCard'
import { WeddingDNA } from '../components/WeddingDNA'
import { WeddingHero } from '../components/WeddingHero'
import { WeddingJourney } from '../components/WeddingJourney'
import { WeddingWall } from '../components/WeddingWall'
import { useCeremonyConfig } from '../hooks/useCeremonyConfig'
import { useWeddingDNA } from '../hooks/useWeddingDNA'
import { getWeddingDNAPalette } from '../data/weddingDNA'
import { type GalleryItem, weddingConfig } from '../data/weddingConfig'
import { getWeddingCalendarDay, getWeddingChapter, weddingChapterConfig } from '../utils/weddingLifecycle'

const galleryCategories = ['All', 'Ceremony', 'Bride', 'Groom', 'Family', 'Friends', 'Couple', 'Celebration', 'Details', 'Venue']

const assistantReplies: Record<string, string> = {
  wedding: 'The ceremony begins at The Royal Garden Palace, Jaipur, at 7:00 PM on 18 December 2026.',
  arrive: 'We recommend arriving by 6:30 PM so you can settle in before the ceremony starts.',
  wear: 'For the wedding, think traditional elegance with soft jewel tones, ivory, blush or gold.',
  park: 'Valet parking is available, and guest parking opens 30 minutes before the ceremony.',
  reception: 'The reception follows at Skyline Ballroom on 19 December 2026 at 8:30 PM.',
  contact: 'You can reach our family desk at +91 98765 43210 for any questions or last-minute assistance.',
}

const sectionFade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

const preWeddingGallery = [
  {
    src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    alt: 'Couple standing close under warm evening light',
    caption: 'Where our forever begins.',
    label: '01',
    layout: 'signature',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
    alt: 'Couple walking through a softly lit alley',
    caption: 'A moment worth keeping.',
    label: '02',
    layout: 'film',
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    alt: 'Editorial portrait of the bride and groom in a calm outdoor setting',
    caption: 'Just us, in our own little world.',
    label: '03',
    layout: 'editorial',
  },
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    alt: 'Polaroid inspired portrait of the couple laughing outdoors',
    caption: 'Our favorite kind of ordinary.',
    label: '04',
    layout: 'polaroid',
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
    alt: 'Warm romantic portrait of the couple embracing at golden hour',
    caption: 'Somewhere between a smile and forever.',
    label: '05',
    layout: 'bleed',
  },
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    alt: 'A couple sharing a quiet moment with a bouquet in hand',
    caption: 'Two hearts, one story.',
    label: '06',
    layout: 'diptych',
  },
  {
    src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80',
    alt: 'Panoramic outdoor portrait of the couple walking together in nature',
    caption: 'A little adventure called us.',
    label: '07',
    layout: 'strip',
  },
  {
    src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
    alt: 'Minimal portrait of the couple sitting quietly together',
    caption: 'Nothing extraordinary. Just us.',
    label: '08',
    layout: 'quiet',
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80',
    alt: 'Closing portrait of the couple in an elegant editorial pose',
    caption: 'And this is only the beginning.',
    label: '09',
    layout: 'finale',
  },
] as const

export function HomePage() {
  const { dna, setDNA } = useWeddingDNA()
  const { ceremonies, updateCeremony, resetCeremonies } = useCeremonyConfig()
  const [activeGalleryCategory, setActiveGalleryCategory] = useState('All')
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null)
  const [selectedPreWeddingImage, setSelectedPreWeddingImage] = useState<(typeof preWeddingGallery)[number] | null>(null)
  const galleryDialogRef = useRef<HTMLDialogElement>(null)
  const galleryTriggerRef = useRef<HTMLButtonElement | null>(null)
  const preWeddingDialogRef = useRef<HTMLDialogElement>(null)
  const [preWeddingLightboxIndex, setPreWeddingLightboxIndex] = useState<number>(0)
  const [activeCeremonyId, setActiveCeremonyId] = useState('haldi')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const [mode, setMode] = useState<'pre' | 'post'>('pre')
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantQuestion, setAssistantQuestion] = useState('')
  const [assistantMessages, setAssistantMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help with venue, timing, dress code, and travel details.' },
  ])
  const [secretPassword, setSecretPassword] = useState('')
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [secretFeedback, setSecretFeedback] = useState('')
  const [shareFeedback, setShareFeedback] = useState('')

  const filteredGallery =
    activeGalleryCategory === 'All'
      ? weddingConfig.gallery
      : weddingConfig.gallery.filter((item) => item.category === activeGalleryCategory)
  const scheduleItems = ceremonies.flatMap((ceremony) => [
    ceremony,
    ...(ceremony.id === 'sangeet'
      ? [{
          ...ceremony,
          id: 'dancing-session',
          name: 'Dancing Session',
          time: 'After Sangeet',
          heroImage: {
            ...ceremony.heroImage,
            ...(ceremony.galleryImages[1]
              ? {
                  src: ceremony.galleryImages[1].src,
                  alt: ceremony.galleryImages[1].alt,
                }
              : {}),
          },
        }]
      : []),
  ])
  const chapter = getWeddingChapter()
  const chapterCopy = weddingChapterConfig[chapter]
  const weddingPalette = getWeddingDNAPalette(dna.palette)
  const [currentWeddingDay] = useState(() => getWeddingCalendarDay(new Date()))
  const invitationMessage = `We're getting married ❤️\n\nWe would love for you to celebrate this special day with us.\n\n${weddingConfig.names.combined}\n${weddingConfig.dateLabel}\n\nView our wedding: ${weddingConfig.shareLink}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(invitationMessage)}`

  useEffect(() => {
    const dialog = galleryDialogRef.current
    if (selectedGalleryImage && dialog && !dialog.open) dialog.showModal()
    if (!selectedGalleryImage && dialog?.open) dialog.close()
  }, [selectedGalleryImage])

  useEffect(() => {
    const dialog = preWeddingDialogRef.current
    if (selectedPreWeddingImage && dialog && !dialog.open) dialog.showModal()
    if (!selectedPreWeddingImage && dialog?.open) dialog.close()
  }, [selectedPreWeddingImage])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isGalleryDialogOpen = selectedGalleryImage && galleryDialogRef.current?.open
      const isPreWeddingDialogOpen = selectedPreWeddingImage && preWeddingDialogRef.current?.open

      if (!isGalleryDialogOpen && !isPreWeddingDialogOpen) return

      if (event.key === 'Escape') {
        event.preventDefault()
        if (isPreWeddingDialogOpen) {
          setSelectedPreWeddingImage(null)
          return
        }
        setSelectedGalleryImage(null)
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (isPreWeddingDialogOpen) {
          setPreWeddingLightboxIndex((current) => {
            const next = (current + 1) % preWeddingGallery.length
            setSelectedPreWeddingImage(preWeddingGallery[next])
            return next
          })
          return
        }
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (isPreWeddingDialogOpen) {
          setPreWeddingLightboxIndex((current) => {
            const next = (current - 1 + preWeddingGallery.length) % preWeddingGallery.length
            setSelectedPreWeddingImage(preWeddingGallery[next])
            return next
          })
          return
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedGalleryImage, selectedPreWeddingImage])

  const openPreWeddingItem = (item: (typeof preWeddingGallery)[number], index: number) => {
    setPreWeddingLightboxIndex(index)
    setSelectedPreWeddingImage(item)
  }

  const goToPreWeddingItem = (direction: 'next' | 'prev') => {
    setPreWeddingLightboxIndex((current) => {
      const nextIndex = direction === 'next' ? (current + 1) % preWeddingGallery.length : (current - 1 + preWeddingGallery.length) % preWeddingGallery.length
      const nextItem = preWeddingGallery[nextIndex]
      setSelectedPreWeddingImage(nextItem)
      return nextIndex
    })
  }

  const handleAssistantSubmit = () => {
    const trimmedQuestion = assistantQuestion.trim()
    if (!trimmedQuestion) return

    const normalizedQuestion = trimmedQuestion.toLowerCase()
    const fallbackReply = 'We are excited to celebrate with you. Please check the event details or contact our family desk for support.'
    const reply =
      assistantReplies[normalizedQuestion] ??
      (normalizedQuestion.includes('where')
        ? assistantReplies.wedding
        : normalizedQuestion.includes('time')
          ? assistantReplies.arrive
          : normalizedQuestion.includes('arrive')
            ? assistantReplies.arrive
          : normalizedQuestion.includes('wear')
            ? assistantReplies.wear
            : normalizedQuestion.includes('park')
              ? assistantReplies.park
              : normalizedQuestion.includes('reception')
                ? assistantReplies.reception
                : fallbackReply)

    setAssistantMessages((current) => [
      ...current,
      { role: 'user', text: trimmedQuestion },
      { role: 'assistant', text: reply },
    ])
    setAssistantQuestion('')
  }

  const handleShare = async () => {
    if (!navigator.clipboard?.writeText) {
      setShareFeedback('Link copying is not available in this browser.')
      return
    }

    try {
      await navigator.clipboard.writeText(weddingConfig.shareLink)
      setShareFeedback('Wedding link copied to your clipboard.')
    } catch {
      setShareFeedback('The link could not be copied. Please copy it from the invitation.')
    }
  }

  const handleSecretUnlock = () => {
    const trimmedPassword = secretPassword.trim()
    if (!trimmedPassword) {
      setSecretUnlocked(false)
      setSecretFeedback('Enter the demo code to preview this section.')
      return
    }

    const isUnlocked = trimmedPassword.toLowerCase() === 'forever'
    setSecretUnlocked(isUnlocked)
    setSecretFeedback(
      isUnlocked
        ? 'Preview unlocked. This content is not private or securely protected.'
        : 'That demo code did not match. Try “forever”.',
    )
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-slate-800">
      <header className="absolute inset-x-0 top-0 z-30">
        <nav
          className="relative mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-2xl border border-[#d7c69c]/80 bg-[#fffaf0]/90 px-4 py-3 shadow-[0_12px_36px_rgba(74,51,37,0.12)] backdrop-blur-md sm:mt-4 sm:px-5 md:mt-5 md:px-8"
          onKeyDown={(event) => {
            if (event.key === 'Escape' && mobileMenuOpen) {
              setMobileMenuOpen(false)
              mobileMenuButtonRef.current?.focus()
            }
          }}
        >
          <div className="flex min-w-0 items-center gap-2 text-[#4b2433] sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b99a5d]/70 bg-[#f6edda] text-xs font-semibold uppercase tracking-[0.3em] text-[#6b4b38]">
              {weddingConfig.names.groom.charAt(0)} {weddingConfig.names.bride.charAt(0)}
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b7c45] sm:text-xs sm:tracking-[0.4em]">Wedding OS</div>
              <div className="text-xs font-medium text-[#4b2433] sm:text-sm">{weddingConfig.names.combined}</div>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-[13px] font-medium text-[#745d48] lg:gap-6 lg:text-sm md:flex">
            <a href="#story" className="transition hover:text-[#8d6930]">Story</a>
            <a href="#dna" className="transition hover:text-[#8d6930]">Wedding DNA</a>
            <a href="#gallery" className="transition hover:text-[#8d6930]">Gallery</a>
            <a href="#rsvp" className="transition hover:text-[#8d6930]">RSVP</a>
          </div>
          <a href="#rsvp" className="hidden rounded-full border border-[#b99a5d]/80 bg-[#6b3448] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#fffaf0] transition hover:bg-[#4b2433] md:inline-flex">
            View Invitation
          </a>
          <button
            ref={mobileMenuButtonRef}
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-site-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b99a5d]/70 bg-[#f6edda] text-[#6b3448] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a5d] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
          {mobileMenuOpen ? (
            <div id="mobile-site-navigation" className="absolute inset-x-4 top-full mt-2 rounded-3xl border border-[#e8ddd2] bg-[#fffaf5]/98 p-3 text-[#3b332b] shadow-[0_20px_60px_rgba(15,23,42,0.2)] sm:inset-x-5">
              {[
                ['Our Story', '#story'],
                ['Wedding DNA', '#dna'],
                ['Gallery', '#gallery'],
                ['RSVP', '#rsvp'],
              ].map(([label, destination]) => (
                <a
                  key={destination}
                  href={destination}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-medium transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  {label}
                </a>
              ))}
            </div>
          ) : null}
        </nav>
      </header>

      <main>
        <WeddingHero
          accentColor={weddingPalette.colors[1]}
          chapter={chapter}
          chapterCopy={chapterCopy}
        />

        <WeddingJourney
          accentColor={weddingPalette.colors[0]}
          ceremonyData={ceremonies}
          onSelectCeremony={setActiveCeremonyId}
        />

        <div className="royal-wedding-wash bg-[#faf6ef] px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <CeremonySection
              dna={dna}
              ceremonyData={ceremonies}
              selectedId={activeCeremonyId}
              onSelectCeremony={setActiveCeremonyId}
              onUpdateCeremony={updateCeremony}
              onResetCeremonies={resetCeremonies}
            />
          </div>
        </div>

        <WeddingDNA value={dna} onChange={setDNA} />

        <section className="royal-wedding-wash bg-gradient-to-b from-[#fffaf5] to-[#fff3ee] py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="The Couple" title="Two hearts, one beautiful story." description="Our favorite place is together — and our favorite memories are the ones we make side by side." />
            </motion.div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <motion.article {...sectionFade} className="overflow-hidden rounded-[2.25rem] border border-rose-100 bg-white p-4 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
                <img src={weddingConfig.couple.groom.image} alt={weddingConfig.couple.groom.name} loading="lazy" decoding="async" className="h-[520px] w-full rounded-[1.75rem] object-cover" />
                <div className="mt-6 px-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">The Groom</p>
                  <h3 className="mt-3 text-4xl text-slate-900">{weddingConfig.couple.groom.name}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{weddingConfig.couple.groom.bio}</p>
                  <blockquote className="mt-5 border-l-2 border-rose-200 pl-4 text-lg italic text-slate-700">“{weddingConfig.couple.groom.quote}”</blockquote>
                  <div className="mt-6 flex gap-3 text-sm text-slate-500">
                    <span className="rounded-full border border-slate-200 px-3 py-2">Instagram</span>
                    <span className="rounded-full border border-slate-200 px-3 py-2">X</span>
                  </div>
                </div>
              </motion.article>

              <motion.article {...sectionFade} className="overflow-hidden rounded-[2.25rem] border border-rose-100 bg-white p-4 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
                <img src={weddingConfig.couple.bride.image} alt={weddingConfig.couple.bride.name} loading="lazy" decoding="async" className="h-[520px] w-full rounded-[1.75rem] object-cover" />
                <div className="mt-6 px-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">The Bride</p>
                  <h3 className="mt-3 text-4xl text-slate-900">{weddingConfig.couple.bride.name}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{weddingConfig.couple.bride.bio}</p>
                  <blockquote className="mt-5 border-l-2 border-rose-200 pl-4 text-lg italic text-slate-700">“{weddingConfig.couple.bride.quote}”</blockquote>
                  <div className="mt-6 flex gap-3 text-sm text-slate-500">
                    <span className="rounded-full border border-slate-200 px-3 py-2">Instagram</span>
                    <span className="rounded-full border border-slate-200 px-3 py-2">X</span>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="people" className="royal-wedding-wash mx-auto max-w-7xl px-5 py-24 md:px-8">
          <motion.div {...sectionFade}>
            <SectionHeader eyebrow="Our People" title="We didn’t get here alone." description="Our families have been the quiet strength behind our love, our laughter, and our dreams." />
          </motion.div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-2xl text-slate-900">Bride's Family</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {weddingConfig.families.bride.map((member) => (
                  <FamilyCard key={member.name} member={member} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-6 text-2xl text-slate-900">Groom's Family</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {weddingConfig.families.groom.map((member) => (
                  <FamilyCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="wedding-day" className="royal-wedding-wash mx-auto max-w-7xl px-5 py-24 md:px-8">
          <motion.div {...sectionFade}>
            <SectionHeader eyebrow="Celebration schedule" title="The moments we’re looking forward to sharing." description="A date-led guide to each celebration. Event timing is shown in the wedding’s local time zone." />
          </motion.div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {scheduleItems.map((item) => {
              const eventDay = getWeddingCalendarDay(new Date(item.startsAt))
              const status = currentWeddingDay > eventDay ? 'Completed' : currentWeddingDay === eventDay ? 'Today' : 'Upcoming'
              const statusColor = status === 'Completed' ? 'bg-emerald-500' : status === 'Today' ? 'bg-amber-400' : 'bg-slate-300'

              return (
                <div key={item.name} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.06)]">
                  <img src={item.heroImage.src} alt={item.heroImage.alt} loading="lazy" decoding="async" className="h-40 w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xl font-medium text-slate-900">{item.name}</div>
                      <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
                        {status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">{item.date} · {item.time}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.venue}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section id="rsvp" className="royal-wedding-wash bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_40%),linear-gradient(180deg,#fff8ed,#fffaf5)] py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="Smart RSVP" title="We would love to celebrate with you." description="Your reply helps us plan every special detail of our day." />
            </motion.div>
            <div className="mt-12">
              <RsvpForm />
            </div>
          </div>
        </section>

        <section className="royal-wedding-wash mx-auto max-w-7xl px-5 py-24 md:px-8">
          <motion.div {...sectionFade}>
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">Our Wedding Story Quiz</p>
              <p className="text-base text-slate-600 md:text-lg">A lighthearted challenge for the people who know us best.</p>
            </div>
          </motion.div>
          <div className="mt-12">
            <Quiz />
          </div>
        </section>

        <section id="wedding-wall" className="royal-wedding-wash relative overflow-hidden bg-[linear-gradient(145deg,#fff8f3_0%,#fff3f1_48%,#fcf4e9_100%)] py-24">
          <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 bottom-8 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="The Wedding Wall · local preview" title="A wall full of love, from you." description="Leave a wish, react to a message, and celebrate with us. Notes and reactions are only temporary in this browser preview." />
            </motion.div>
            <div className="mt-12">
              <WeddingWall />
            </div>
          </div>
        </section>

        <section className="royal-wedding-wash relative overflow-hidden bg-[#fff9f5] py-24">
          <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="A little love goes a long way" title="Leave a little piece of your heart." description="A kind message is the sweetest keepsake. Add your note to our temporary Wedding Wall preview." />
            </motion.div>

            <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-7">
              <motion.article {...sectionFade} className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-rose-200 bg-white shadow-[0_25px_70px_rgba(98,48,62,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(98,48,62,0.15)]">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#703d50] via-[#a45c68] to-[#df9b8c] px-7 pb-7 pt-6 text-white md:px-8">
                  <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border border-white/20 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                  <div className="pointer-events-none absolute right-7 top-7 h-28 w-28 rounded-full border border-white/15" aria-hidden="true" />
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" /> Capture this moment
                    </span>
                    <MessageSquareText className="h-6 w-6 text-rose-100" aria-hidden="true" />
                  </div>
                  <h3 className="relative mt-7 max-w-md font-display text-3xl leading-tight md:text-4xl">Leave a little note for us.</h3>
                  <p className="relative mt-3 max-w-lg text-sm leading-6 text-white/80">Share a wish, a favorite memory, or a few words for the couple on our Wedding Wall.</p>
                </div>

                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
                        <Heart className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">A few heartfelt words are perfect.</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">Notes are temporary in this browser preview and disappear after you leave or refresh.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <a href="#wedding-wall" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3b2635] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                      Leave a note on the Wedding Wall <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.article>

              <motion.article {...sectionFade} className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-[0_25px_70px_rgba(98,48,62,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(98,48,62,0.15)]">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#f8e8d2] via-[#fff4e8] to-[#f8dfe1] px-7 pb-7 pt-6 md:px-8">
                  <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/70 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-800">
                      <Heart className="h-3.5 w-3.5" aria-hidden="true" /> A note from you
                    </span>
                    <span className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">Text only · preview</span>
                  </div>
                  <h3 className="relative mt-7 max-w-md font-display text-3xl leading-tight text-slate-900 md:text-4xl">Your words, gathered in one place.</h3>
                  <p className="relative mt-3 max-w-lg text-sm leading-6 text-slate-700">Write your name and a short message. You can also react to the notes shared on the Wedding Wall.</p>
                </div>

                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <div className="relative rounded-2xl border border-amber-100 bg-[linear-gradient(135deg,#fffdf9,#fff7ed)] p-5 shadow-inner">
                    <span className="absolute right-4 top-3 font-display text-5xl leading-none text-rose-200" aria-hidden="true">“</span>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-rose-600">Your message will appear here</p>
                    <p className="mt-3 max-w-sm font-display text-xl italic leading-7 text-slate-700">A little note can become a memory we keep forever.</p>
                    <div className="mt-4 border-t border-amber-200/70 pt-3 text-xs font-medium text-slate-500">Your name · local preview</div>
                  </div>
                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                    Messages and reactions stay in your browser only. No photo, voice, or video uploads; no camera or microphone permissions.
                  </div>
                  <div className="mt-auto pt-6">
                    <a href="#wedding-wall" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-800 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                      Write your message <Heart className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="gallery" className="royal-wedding-wash bg-[#fffaf5] py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="Gallery" title="A collection of the moments that shaped our story." description="A visual diary of our journey — from first smiles to unforgettable celebrations." />
            </motion.div>

            <div className="mt-12 rounded-[2rem] border border-rose-100 bg-[#fffaf5] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.38em] text-rose-500">Our pre-wedding story</p>
                  <h3 className="mt-3 text-4xl text-slate-900 md:text-5xl">Before the vows, there were a thousand little moments.</h3>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                  A quiet collection of the faces, glances, and everyday magic that led us here.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
                {preWeddingGallery.map((item, index) => (
                  <button
                    key={`${item.caption}-${item.src}`}
                    type="button"
                    onClick={() => openPreWeddingItem(item, index)}
                    aria-label={`Open pre-wedding photo ${item.label}`}
                    className={`group relative overflow-hidden rounded-[1.8rem] border border-[#f4e8e3] bg-white text-left shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                      item.layout === 'signature' ? 'md:col-span-5 md:row-span-2 xl:col-span-5 xl:row-span-2' :
                      item.layout === 'film' ? 'md:col-span-3 xl:col-span-3' :
                      item.layout === 'editorial' ? 'md:col-span-4 xl:col-span-4' :
                      item.layout === 'polaroid' ? 'md:col-span-3 xl:col-span-3' :
                      item.layout === 'bleed' ? 'md:col-span-6 xl:col-span-6' :
                      item.layout === 'diptych' ? 'md:col-span-4 xl:col-span-4' :
                      item.layout === 'strip' ? 'md:col-span-6 xl:col-span-6' :
                      item.layout === 'quiet' ? 'md:col-span-3 xl:col-span-3' : 'md:col-span-5 xl:col-span-5'
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${item.layout === 'signature' || item.layout === 'bleed' || item.layout === 'strip' || item.layout === 'finale' ? 'h-[420px]' : item.layout === 'film' || item.layout === 'polaroid' || item.layout === 'quiet' ? 'h-[280px]' : item.layout === 'diptych' ? 'h-[320px]' : 'h-[360px]'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a1a]/55 via-transparent to-transparent" />
                      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-white/80">{item.label}</p>
                          <p className="mt-2 text-lg font-medium leading-snug md:text-xl">{item.caption}</p>
                        </div>
                        <span className="rounded-full border border-white/50 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.25em] backdrop-blur-sm">
                          View
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {galleryCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveGalleryCategory(category)}
                  aria-pressed={activeGalleryCategory === category}
                  className={`min-h-11 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                    activeGalleryCategory === category
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {filteredGallery.map((item) => (
                <button
                  key={`${item.alt}-${item.src}`}
                  ref={(element) => {
                    if (selectedGalleryImage?.src === item.src) galleryTriggerRef.current = element
                  }}
                  type="button"
                  aria-label={`View photo: ${item.alt}`}
                  onClick={(event) => {
                    galleryTriggerRef.current = event.currentTarget
                    setSelectedGalleryImage(item)
                  }}
                  className="block w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white text-left shadow-[0_15px_40px_rgba(15,23,42,0.04)] transition hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                  <img src={item.src} alt="" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
                  <span className="flex items-center justify-between px-4 py-3 text-sm text-slate-700">
                    <span>{item.category}</span>
                    <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-rose-500">View</span>
                  </span>
                </button>
              ))}
            </div>
            <dialog
              ref={galleryDialogRef}
              aria-labelledby="gallery-dialog-title"
              onClose={() => {
                setSelectedGalleryImage(null)
                window.requestAnimationFrame(() => galleryTriggerRef.current?.focus())
              }}
              onCancel={(event) => {
                event.preventDefault()
                setSelectedGalleryImage(null)
                window.requestAnimationFrame(() => galleryTriggerRef.current?.focus())
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) setSelectedGalleryImage(null)
              }}
              className="m-auto max-h-[90dvh] w-[min(92vw,60rem)] max-w-none overflow-auto rounded-[1.5rem] bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/75"
            >
              {selectedGalleryImage && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryImage(null)}
                    aria-label="Close photo viewer"
                    className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <img src={selectedGalleryImage.src} alt={selectedGalleryImage.alt} className="max-h-[76dvh] w-full bg-slate-100 object-contain" />
                  <div className="p-5">
                    <h2 id="gallery-dialog-title" className="text-lg font-medium">{selectedGalleryImage.alt}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedGalleryImage.category}</p>
                  </div>
                </div>
              )}
            </dialog>
            <dialog
              ref={preWeddingDialogRef}
              aria-labelledby="pre-wedding-dialog-title"
              onClose={() => {
                setSelectedPreWeddingImage(null)
              }}
              onCancel={(event) => {
                event.preventDefault()
                setSelectedPreWeddingImage(null)
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) setSelectedPreWeddingImage(null)
              }}
              className="m-auto max-h-[90dvh] w-[min(92vw,68rem)] max-w-none overflow-hidden rounded-[1.75rem] bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/75"
            >
              {selectedPreWeddingImage && (
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-rose-500">Pre-wedding story</p>
                      <h2 id="pre-wedding-dialog-title" className="mt-2 text-2xl text-slate-900">{selectedPreWeddingImage.caption}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPreWeddingImage(null)}
                      aria-label="Close pre-wedding viewer"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="relative bg-[#f8f5f2] p-4 sm:p-6">
                    <button
                      type="button"
                      onClick={() => goToPreWeddingItem('prev')}
                      aria-label="Previous photo"
                      className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <span aria-hidden="true" className="text-xl">←</span>
                    </button>
                    <img src={selectedPreWeddingImage.src} alt={selectedPreWeddingImage.alt} className="mx-auto max-h-[68dvh] w-full rounded-[1.2rem] bg-slate-100 object-cover shadow-[0_30px_80px_rgba(15,23,42,0.08)]" />
                    <button
                      type="button"
                      onClick={() => goToPreWeddingItem('next')}
                      aria-label="Next photo"
                      className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <span aria-hidden="true" className="text-xl">→</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-sm text-slate-600">{selectedPreWeddingImage.alt}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{String(preWeddingLightboxIndex + 1).padStart(2, '0')} / {String(preWeddingGallery.length).padStart(2, '0')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => goToPreWeddingItem('prev')}
                        className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        onClick={() => goToPreWeddingItem('next')}
                        className="min-h-11 rounded-full bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </dialog>
          </div>
        </section>

        <section className="royal-wedding-wash mx-auto max-w-7xl px-5 py-24 md:px-8">
          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div {...sectionFade} className="min-w-0">
              <VenueCard />
            </motion.div>

            <motion.div {...sectionFade} className="flex min-w-0 flex-col">
              <SectionHeader eyebrow="What should I wear?" title="Dress code for every celebration." />
              <div className="mt-6 grid flex-1 auto-rows-fr gap-4 sm:grid-cols-2">
                {Object.entries(weddingConfig.dressCode).map(([title, values], index) => {
                  const accents = [
                    'from-amber-100 via-yellow-50 to-white text-amber-800 border-amber-200',
                    'from-rose-100 via-pink-50 to-white text-rose-800 border-rose-200',
                    'from-fuchsia-100 via-rose-50 to-white text-rose-900 border-rose-200',
                    'from-violet-100 via-purple-50 to-white text-violet-900 border-violet-200',
                  ]

                  return (
                    <article
                      key={title}
                      className={`overflow-hidden rounded-[1.6rem] border bg-gradient-to-br ${accents[index % accents.length]} shadow-[0_18px_45px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]`}
                    >
                      <div className="flex items-center justify-between px-5 pt-5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-70">The celebration edit</span>
                        <span className="rounded-full border border-current/15 bg-white/70 p-2">
                          <Shirt className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="px-5 pb-5 pt-3">
                        <h3 className="text-2xl font-medium text-slate-900">{title}</h3>
                        <div className="mt-4 rounded-xl border border-white/80 bg-white/75 p-3.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Color story
                          </div>
                          <p className="mt-1.5 text-sm font-semibold leading-5 text-slate-800">{values.palette}</p>
                        </div>
                        <div className="mt-4 space-y-3 text-sm leading-5 text-slate-700">
                          <p><span className="font-semibold text-slate-900">Style:</span> {values.style}</p>
                          <p className="border-t border-current/10 pt-3 text-slate-600">{values.note}</p>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="royal-wedding-wash relative overflow-hidden bg-[#fff8f3] py-24">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="Your wedding concierge" title="A little help, right on time." description="From what to wear to when to arrive, find the little details that make the day feel effortless." />
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#9b5960] via-[#572c3e] to-[#271d29] p-7 text-white shadow-[0_30px_80px_rgba(61,36,49,0.22)] md:p-9">
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-2 -top-6 h-36 w-36 rounded-full border border-white/10" aria-hidden="true" />
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-rose-100 shadow-lg backdrop-blur">
                    <WandSparkles className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.34em] text-rose-100/75">Here for every little detail</p>
                  <h3 className="mt-3 max-w-md font-display text-4xl leading-tight md:text-5xl">Your celebration, made simple.</h3>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/75">Ask a question or choose a prompt. We’ll point you to the details you need, so you can focus on the fun part.</p>
                </div>
                <div className="mt-8">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Popular questions</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Find the venue', icon: MapPin, question: 'Where is the wedding?' },
                      { label: 'What to wear', icon: Shirt, question: 'What should I wear?' },
                      { label: 'Arrival time', icon: CalendarHeart, question: 'What time should I arrive?' },
                    ].map(({ label, icon: PromptIcon, question }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setAssistantQuestion(question)
                          setAssistantOpen(true)
                        }}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <PromptIcon className="h-3.5 w-3.5 text-rose-200" aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-rose-100/80 bg-white/95 shadow-[0_25px_70px_rgba(91,50,67,0.1)] backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 bg-white px-5 py-4 md:px-7">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700">
                      <WandSparkles className="h-5 w-5" aria-hidden="true" />
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Wedding concierge</div>
                      <div className="mt-0.5 text-xs text-slate-500">A friendly guide to the weekend</div>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-800">Preview · answers in this browser</span>
                </div>

                {assistantOpen ? (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-5 md:p-7">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-500">How can we make your day easier?</p>
                      <button
                        type="button"
                        onClick={() => setAssistantOpen(false)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        Close
                      </button>
                    </div>
                    <div aria-live="polite" className="max-h-64 space-y-4 overflow-y-auto rounded-2xl bg-[#fcf9f7] p-4 md:p-5">
                      {assistantMessages.map((message, index) => (
                        <div key={`${message.role}-${index}`} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.role === 'assistant' ? 'rounded-tl-sm border border-rose-100 bg-white text-slate-700' : 'rounded-tr-sm bg-[#3b2635] text-white'}`}>
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <form className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pl-4 shadow-sm transition focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-100/70" onSubmit={(event) => {
                      event.preventDefault()
                      handleAssistantSubmit()
                    }}>
                      <input
                        value={assistantQuestion}
                        onChange={(event) => setAssistantQuestion(event.target.value)}
                        placeholder="Ask about the wedding..."
                        aria-label="Ask our wedding concierge"
                        className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={!assistantQuestion.trim()}
                        aria-label="Send question"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3b2635] text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </form>
                    <p className="mt-3 text-center text-[10px] text-slate-400">This preview replies to common wedding questions. Nothing is sent or saved.</p>
                  </motion.div>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-9 text-center md:px-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 shadow-inner">
                      <MessageSquareText className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-display text-3xl text-slate-900">Let’s find your answer.</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Get quick help with the venue, schedule, dress code, parking, and more.</p>
                    <button
                      type="button"
                      onClick={() => setAssistantOpen(true)}
                      className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#3b2635] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                    >
                      Open the concierge <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="royal-wedding-wash relative overflow-hidden bg-[#fbf6ed] py-24">
          <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-rose-200/25 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="Wedding Mode · two chapters" title="The countdown, then the keepsakes." description="Step into the anticipation before the celebration, or revisit the memories once the day has become part of your story." />
            </motion.div>

            <div className="overflow-hidden rounded-[2rem] border border-[#e7dac8] bg-white/75 p-4 shadow-[0_25px_70px_rgba(81,57,46,0.08)] backdrop-blur md:p-7">
              <div className="flex flex-col justify-between gap-5 border-b border-[#eee4d8] pb-5 md:flex-row md:items-center">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-600">Choose your chapter</p>
                  <p className="mt-1 text-sm text-slate-600">One celebration. Two ways to remember it.</p>
                </div>
                <div role="group" aria-label="Choose wedding mode" className="grid grid-cols-2 gap-1 rounded-full border border-[#eadfD1] bg-[#f7f2eb] p-1">
                  <button
                    type="button"
                    aria-pressed={mode === 'pre'}
                    onClick={() => setMode('pre')}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${mode === 'pre' ? 'bg-[#3b2635] text-white shadow-md' : 'text-slate-600 hover:bg-white'}`}
                  >
                    <CalendarHeart className="h-4 w-4" aria-hidden="true" /> Before
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === 'post'}
                    onClick={() => setMode('post')}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${mode === 'post' ? 'bg-[#3b2635] text-white shadow-md' : 'text-slate-600 hover:bg-white'}`}
                  >
                    <Heart className="h-4 w-4" aria-hidden="true" /> After
                  </button>
                </div>
              </div>

              <div className="mb-5 mt-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-600">{mode === 'pre' ? 'Chapter one · the anticipation' : 'Chapter two · the afterglow'}</p>
                  <h3 className="mt-1 font-display text-3xl text-slate-900">{mode === 'pre' ? 'The days leading to forever.' : 'The memories that stay with us.'}</h3>
                </div>
                <span className="rounded-full border border-[#e8dccd] bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{mode === 'pre' ? 'The celebration is ahead' : 'A story to keep close'}</span>
              </div>

              {(() => {
                const modeCards = mode === 'pre'
                  ? [
                      { label: 'Countdown', detail: 'The days until we say “I do.”', icon: CalendarHeart, tone: 'from-rose-100 to-pink-50 text-rose-700', number: '01' },
                      { label: 'RSVP', detail: 'Let us know you’ll be there.', icon: MessageSquareText, tone: 'from-amber-100 to-orange-50 text-amber-700', number: '02' },
                      { label: 'Travel', detail: 'Plan your journey to Jaipur.', icon: MapPin, tone: 'from-emerald-100 to-teal-50 text-emerald-700', number: '03' },
                      { label: 'Dress code', detail: 'Find your look for each celebration.', icon: Shirt, tone: 'from-violet-100 to-fuchsia-50 text-violet-700', number: '04' },
                    ]
                  : [
                      { label: 'Wedding memories', detail: 'A little look back at our day.', icon: Heart, tone: 'from-rose-100 to-pink-50 text-rose-700', number: '01' },
                      { label: 'Photo moments', detail: 'The smiles we want to remember.', icon: Star, tone: 'from-amber-100 to-yellow-50 text-amber-700', number: '02' },
                      { label: 'Little films', detail: 'The sounds and scenes of the day.', icon: CalendarHeart, tone: 'from-sky-100 to-cyan-50 text-sky-700', number: '03' },
                      { label: 'Guest wishes', detail: 'Kind words from our favorite people.', icon: MessageSquareText, tone: 'from-violet-100 to-fuchsia-50 text-violet-700', number: '04' },
                    ]

                return (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {modeCards.map(({ label, detail, icon: ModeIcon, tone, number }) => (
                      <article key={label} className="group relative min-h-48 overflow-hidden rounded-[1.5rem] border border-[#eee4d8] bg-white p-5 shadow-[0_12px_30px_rgba(58,39,29,0.04)] transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_20px_45px_rgba(58,39,29,0.1)]">
                        <span className="absolute right-4 top-4 font-display text-4xl text-slate-100 transition group-hover:text-rose-100">{number}</span>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}>
                          <ModeIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <h4 className="mt-5 text-lg font-semibold text-slate-900">{label}</h4>
                        <p className="mt-1 text-sm leading-5 text-slate-500">{detail}</p>
                        <div className="mt-4 h-0.5 w-8 rounded-full bg-rose-200 transition-all group-hover:w-14 group-hover:bg-rose-400" />
                      </article>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        </section>

        <section className="royal-wedding-wash relative overflow-hidden bg-[#fcf7f1] py-24">
          <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-12 bottom-0 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...sectionFade}>
              <SectionHeader eyebrow="A little extra · just for you" title="A tiny surprise for our favorite people." description="A playful peek behind the scenes. This preview uses a browser-only demo code—please don’t enter anything private." />
            </motion.div>

            {!secretUnlocked ? (
              <div className="grid overflow-hidden rounded-[2.2rem] border border-[#e8d8ca] bg-white shadow-[0_30px_80px_rgba(72,45,44,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#a66a70] via-[#63354a] to-[#2d202a] p-7 text-white md:p-10">
                  <div className="pointer-events-none absolute -right-14 -top-16 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
                  <div className="pointer-events-none absolute -right-2 -top-4 h-40 w-40 rounded-full border border-white/10" aria-hidden="true" />
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-rose-100 shadow-lg backdrop-blur">
                      <Heart className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.34em] text-rose-100/75">A note from us</p>
                    <h3 className="mt-3 max-w-lg font-display text-4xl leading-tight md:text-5xl">The best celebrations have little secrets.</h3>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/75">Unlock a few just-for-fun placeholders: the candid moments, the happy chaos, and the notes we’ll treasure.</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {['Little laughs', 'Happy tears', 'Forever memories'].map((label) => (
                      <span key={label} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/85">{label}</span>
                    ))}
                  </div>
                </div>

                <form
                  className="flex flex-col justify-center p-7 md:p-10"
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleSecretUnlock()
                  }}
                >
                  <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700">
                    <Star className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-600">A little door to open</p>
                  <h3 className="mt-2 font-display text-3xl text-slate-900">Ready for your peek?</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Enter the demo word to reveal this playful preview.</p>
                  <label className="mt-7 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                    Demo passcode
                    <input
                      type="password"
                      value={secretPassword}
                      onChange={(event) => {
                        setSecretPassword(event.target.value)
                        setSecretFeedback('')
                      }}
                      aria-label="Demo passcode"
                      className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-normal tracking-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/70"
                      placeholder="Enter the demo code"
                    />
                  </label>
                  <button type="submit" disabled={!secretPassword.trim()} className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#3b2635] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                    Open the surprise <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <p className="mt-4 text-xs leading-5 text-slate-500">For this preview, enter “forever”. Nothing is private or saved.</p>
                  <p className="mt-2 min-h-5 text-sm text-rose-700" role="status" aria-live="polite">{secretFeedback}</p>
                </form>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[2.2rem] border border-rose-200 bg-white shadow-[0_30px_80px_rgba(72,45,44,0.12)]">
                <div className="bg-gradient-to-r from-[#3b2635] via-[#63354a] to-[#9b5960] px-6 py-8 text-white md:px-9">
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-100/75">You found the little extras</p>
                      <h3 className="mt-2 font-display text-3xl md:text-4xl">A few moments to make you smile.</h3>
                    </div>
                    <Heart className="h-10 w-10 text-rose-200" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-5 md:p-8">
                  <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="status">
                    This is a visual preview only. The passcode is visible in the website code, and this content is not private or saved.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { label: 'Funny moments', detail: 'The candid laughs we hope to remember.', icon: Sparkles, tone: 'from-amber-100 to-yellow-50 text-amber-700' },
                      { label: 'Behind the scenes', detail: 'All the lovely little moments before “I do.”', icon: Star, tone: 'from-rose-100 to-pink-50 text-rose-700' },
                      { label: 'Guest wishes', detail: 'Sweet words from our favorite people.', icon: Heart, tone: 'from-violet-100 to-fuchsia-50 text-violet-700' },
                    ].map(({ label, detail, icon: ExtraIcon, tone }) => (
                      <article key={label} className="rounded-[1.5rem] border border-rose-100 bg-gradient-to-br from-white to-rose-50/70 p-5 shadow-[0_14px_35px_rgba(72,45,44,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(72,45,44,0.1)]">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}>
                          <ExtraIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <h4 className="mt-5 text-xl font-medium text-slate-900">{label}</h4>
                        <p className="mt-2 text-sm leading-5 text-slate-600">{detail}</p>
                        <p className="mt-4 border-t border-rose-100 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-600">A placeholder for a future collection</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <KidsCorner />

        <section className="royal-wedding-wash mx-auto max-w-7xl px-5 py-24 md:px-8">
          <motion.div {...sectionFade}>
            <SectionHeader eyebrow="Digital Invitation" title="A keepsake card for the celebration." description="A polished digital invitation ready to share with the people we care about most." />
          </motion.div>

          <div className="mt-12 overflow-hidden rounded-[2.8rem] border border-[#cbb375] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,1)_0%,_rgba(255,251,241,0.98)_46%,_rgba(248,238,216,0.95)_100%)] p-3 shadow-[0_30px_80px_rgba(101,77,40,0.14)] md:p-5 xl:p-6">
            <div className="flex flex-col gap-8 rounded-[2.35rem] border border-[#dfd0a7] bg-white/35 p-4 md:p-6 xl:flex-row xl:items-stretch xl:gap-7">
              <div className="relative flex-1 overflow-hidden rounded-[1.9rem] border border-[#e6d8b2] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.98),_rgba(255,252,244,0.98)_54%,_rgba(250,244,231,0.98))] px-6 py-9 text-center shadow-[inset_0_0_0_5px_rgba(255,255,255,0.8),inset_0_0_0_6px_rgba(203,179,117,0.26)] md:px-10 md:py-12">
                <div className="pointer-events-none absolute left-0 top-0 h-28 w-28 rounded-br-full border-b border-r border-[#d7c18b]/60" aria-hidden="true" />
                <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-full border-b border-l border-[#d7c18b]/60" aria-hidden="true" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-tr-full border-r border-t border-[#d7c18b]/60" aria-hidden="true" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 rounded-tl-full border-l border-t border-[#d7c18b]/60" aria-hidden="true" />
                <div className="relative mx-auto flex max-w-2xl flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#cbb375] bg-white/85 text-[#a88a4d] shadow-[0_8px_22px_rgba(147,117,58,0.12)]">
                    <Crown className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.42em] text-[#9b7c3e]">Together with our families</p>
                  <p className="mt-4 font-display text-base italic text-slate-600 md:text-lg">Request the pleasure of your company</p>
                  <div className="mt-4 flex w-full items-center justify-center gap-3 text-[#b69c63]" aria-hidden="true">
                    <span className="h-px w-12 bg-[#d7c18b]" />
                    <Sparkles className="h-4 w-4" />
                    <span className="h-px w-12 bg-[#d7c18b]" />
                  </div>
                  <h3 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-[#44362a] md:text-5xl xl:text-6xl">{weddingConfig.names.combined}</h3>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#9b7c3e]">Are celebrating their wedding</p>
                  <p className="mt-5 max-w-xl font-display text-base italic leading-7 text-slate-600 md:text-lg">
                    You are invited to share a day of family, laughter, and a little bit of magic.
                  </p>

                  <div className="mt-7 flex w-full max-w-lg flex-col items-center gap-4 border-y border-[#e7dcc0] py-5 sm:flex-row sm:justify-center sm:gap-7">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9b7c3e]">The date</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-800">{weddingConfig.dateLabel}</p>
                    </div>
                    <span className="hidden h-8 w-px bg-[#dfd0a7] sm:block" aria-hidden="true" />
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9b7c3e]">The celebration</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-800">{weddingConfig.venueLocation}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7c18b] bg-white/80 text-xs font-semibold text-[#9b7c3e]">{weddingConfig.names.groom.charAt(0)}</span>
                    <Heart className="h-4 w-4 fill-rose-200 text-rose-400" aria-hidden="true" />
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7c18b] bg-white/80 text-xs font-semibold text-[#9b7c3e]">{weddingConfig.names.bride.charAt(0)}</span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md self-center rounded-[2rem] border border-[#e4d7b6] bg-white/95 p-5 shadow-[0_20px_50px_rgba(101,77,40,0.08)] backdrop-blur-sm xl:self-center">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9b7c3e]">Share the joy</div>
                    <div className="mt-2 text-xl font-medium text-slate-900">Send the invitation</div>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-rose-100 bg-gradient-to-br from-[#fffdfd] to-[#fff4f2] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Guest message</div>
                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-slate-700">{invitationMessage}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={handleShare} className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)] transition hover:bg-slate-700 sm:tracking-[0.2em]">
                    Copy link
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300 sm:tracking-[0.2em]">
                    <MessageSquareText className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
                <p className="mt-4 text-xs text-slate-600" role="status" aria-live="polite">{shareFeedback}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="royal-wedding-wash relative overflow-hidden bg-[linear-gradient(145deg,#fffaf5_0%,#fff4f1_52%,#faf3e7_100%)] py-24">
          <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-rose-200/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
              <motion.div {...sectionFade} className="flex min-w-0 flex-col">
                <header className="min-h-[176px] pb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-rose-600">Quick access · your wedding weekend</p>
                  <h2 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl">Everything, one tap away.</h2>
                  <p className="mt-4 max-w-lg text-base leading-6 text-slate-600">A quick path to the details and moments you’ll want to find.</p>
                </header>
                <div className="flex flex-1 flex-col gap-4 rounded-[2rem] border border-rose-200 bg-white/90 p-5 shadow-[0_25px_70px_rgba(98,48,62,0.09)] backdrop-blur md:p-6">
                  <a href="#rsvp" className="group flex min-h-[96px] items-center gap-4 rounded-[1.5rem] border border-rose-100 bg-gradient-to-r from-white to-rose-50/70 p-5 text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 text-rose-700">
                      <CalendarHeart className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold text-slate-900">RSVP</span>
                      <span className="mt-1 block text-sm text-slate-500">Let us know you’ll be celebrating with us.</span>
                    </span>
                    <span className="text-xl text-rose-400 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </a>
                  <a href="#wedding-wall" className="group flex min-h-[96px] items-center gap-4 rounded-[1.5rem] border border-amber-100 bg-gradient-to-r from-white to-amber-50/70 p-5 text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 text-amber-800">
                      <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold text-slate-900">Wedding Wall</span>
                      <span className="mt-1 block text-sm text-slate-500">Leave a wish or react to a guest note.</span>
                    </span>
                    <span className="text-xl text-amber-600 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </a>
                  <p className="mt-auto flex items-center gap-2 border-t border-rose-100 pt-4 text-xs text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                    Made with love for our favorite people.
                  </p>
                </div>
              </motion.div>

              <motion.div {...sectionFade} className="flex min-w-0 flex-col">
                <header className="min-h-[176px] pb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-[#9b7c3e]">Share · pass the joy along</p>
                  <h2 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl">Invite them beautifully.</h2>
                  <p className="mt-4 max-w-lg text-base leading-6 text-slate-600">Send our invitation to the people who make every celebration brighter.</p>
                </header>
                <div className="flex flex-1 flex-col rounded-[2rem] border border-[#e4d7b6] bg-white/95 p-5 shadow-[0_25px_70px_rgba(101,77,40,0.09)] backdrop-blur md:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e4d7b6] bg-[#fffaf0] text-[#9b7c3e]">
                      <Heart className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b7c3e]">A message from us</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">Ready to share</p>
                    </div>
                  </div>
                  <div className="mt-4 flex-1 rounded-[1.5rem] border border-[#eee4d0] bg-[linear-gradient(135deg,#fffdf8,#fff7f2)] p-5">
                    <p className="whitespace-pre-line break-words font-display text-base leading-7 text-slate-700">{invitationMessage}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#168a62] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(22,138,98,0.18)] transition hover:-translate-y-0.5 hover:bg-[#117653] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                      <MessageSquareText className="h-4 w-4" aria-hidden="true" /> WhatsApp
                    </a>
                    <button type="button" onClick={handleShare} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#3b2635] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(59,38,53,0.16)] transition hover:-translate-y-0.5 hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                      <Copy className="h-4 w-4" aria-hidden="true" /> Copy invitation
                    </button>
                  </div>
                  <p className="mt-3 min-h-5 text-xs text-slate-600" role="status" aria-live="polite">{shareFeedback}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <MusicPlayer />
    </div>
  )
}
