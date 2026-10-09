import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { CSSProperties } from 'react'

import type { CeremonyDefinition } from '../data/ceremonies'
import { weddingJourney } from '../data/weddingJourney'

type WeddingJourneyProps = {
  accentColor: string
  ceremonyData?: CeremonyDefinition[]
  onSelectCeremony: (ceremonyId: string) => void
}

export function WeddingJourney({ accentColor, ceremonyData = [], onSelectCeremony }: WeddingJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const sourceMilestone = weddingJourney[activeIndex]
  const configuredCeremony = sourceMilestone?.ceremonyId
    ? ceremonyData.find((ceremony) => ceremony.id === sourceMilestone.ceremonyId)
    : undefined
  const activeMilestone = sourceMilestone && configuredCeremony
    ? {
      ...sourceMilestone,
      title: configuredCeremony.name,
      date: `${configuredCeremony.date} · ${configuredCeremony.time}`,
      description: configuredCeremony.description,
      location: configuredCeremony.venue,
      image: configuredCeremony.heroImage.src,
      imageAlt: configuredCeremony.heroImage.alt,
    }
    : sourceMilestone ?? weddingJourney[0]
  const headingWords = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.42, delayChildren: 0.15 },
    },
  }
  const wordReveal = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  }

  const goToMilestone = (index: number) => {
    setActiveIndex((index + weddingJourney.length) % weddingJourney.length)
  }

  const exploreActiveCeremony = () => {
    const ceremonyId = activeMilestone.ceremonyId
    if (!ceremonyId) return

    onSelectCeremony(ceremonyId)
    document.getElementById('ceremony-experience')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <section id="story" aria-labelledby="journey-heading" className="royal-wedding-wash overflow-hidden bg-[#faf6ef] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em]" style={{ color: accentColor }}>The story so far</p>
            <motion.h2
              id="journey-heading"
              className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] text-[#28241f] md:text-6xl"
              variants={reduceMotion ? undefined : headingWords}
              initial={reduceMotion ? false : 'hidden'}
              whileInView={reduceMotion ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.7 }}
            >
              <motion.span variants={reduceMotion ? undefined : wordReveal}>One</motion.span>{' '}
              <motion.span variants={reduceMotion ? undefined : wordReveal}>little</motion.span>{' '}
              <motion.span variants={reduceMotion ? undefined : wordReveal}>moment</motion.span>
              <br />
              <em className="font-normal text-[#8b6d4e]"><motion.span variants={reduceMotion ? undefined : wordReveal}>led</motion.span>{' '}
                <motion.span variants={reduceMotion ? undefined : wordReveal}>us</motion.span>{' '}
                <motion.span variants={reduceMotion ? undefined : wordReveal}>here.</motion.span>
              </em>
            </motion.h2>
          </div>
          <p className="max-w-sm pb-1 text-sm leading-6 text-[#716a60]">
            Choose a chapter to travel through the years, from that first hello to the celebrations we cannot wait to share.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            className="absolute left-4 right-4 top-[14px] hidden h-[3px] rounded-full md:block"
            style={{ backgroundColor: '#4a4038' }}
            aria-hidden="true"
          />
          <div
            className="absolute left-4 top-[15px] hidden h-px origin-left transition-transform duration-500 md:block"
            style={{ width: `calc(100% - 2rem)`, backgroundColor: accentColor, transform: `scaleX(${activeIndex / (weddingJourney.length - 1)})` }}
            aria-hidden="true"
          />
          <nav aria-label="Wedding story milestones" className="relative flex snap-x snap-mandatory gap-2 overflow-x-auto pb-4 md:gap-0">
            {weddingJourney.map((milestone, index) => {
              const active = index === activeIndex
              const visited = index < activeIndex

              return (
                <button
                  key={milestone.id}
                  type="button"
                  aria-current={active ? 'step' : undefined}
                  aria-label={`${milestone.title}, ${milestone.date}`}
                  onClick={() => goToMilestone(index)}
                  className="group flex min-w-[7.5rem] snap-start flex-col items-start gap-3 rounded-lg px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 md:min-w-0 md:flex-1 md:items-center md:px-0"
                  style={{ '--tw-ring-color': accentColor } as CSSProperties}
                >
                  <span
                    className={`relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[10px] font-semibold transition duration-300 ${
                      active ? 'scale-110 text-white shadow-md' : 'bg-[#faf6ef] text-[#7e776d] group-hover:scale-105'
                    }`}
                    style={{
                      borderColor: active || visited ? accentColor : '#d8d2c7',
                      backgroundColor: active ? accentColor : undefined,
                    }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`max-w-28 text-xs transition-colors md:text-center ${active ? 'font-semibold text-[#2b2721]' : 'text-[#827a70] group-hover:text-[#39342d]'}`}>
                    {milestone.title}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={activeMilestone.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 grid overflow-hidden rounded-[2rem] border border-[#e8e2d8] bg-white shadow-[0_28px_80px_rgba(45,38,27,0.08)] lg:grid-cols-[1.08fr_0.92fr]"
          >
            <div className="relative min-h-[300px] overflow-hidden bg-[#e7ded0] md:min-h-[450px]">
              <img
                src={activeMilestone.image}
                alt={activeMilestone.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" aria-hidden="true" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white md:bottom-8 md:left-8 md:right-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/80">Chapter {String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="font-display text-2xl italic md:text-3xl">{activeMilestone.date.split(' · ')[0]}</span>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em]" style={{ color: accentColor }}>{activeMilestone.date}</p>
              <h3 className="mt-4 font-display text-3xl text-[#2e2923] md:text-5xl">{activeMilestone.title}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#6c665d] md:text-base">{activeMilestone.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#827a70]">
                <MapPin className="h-3.5 w-3.5" style={{ color: accentColor }} aria-hidden="true" />
                {activeMilestone.location}
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee9e0] pt-5">
                {activeMilestone.ceremonyId ? (
                  <button
                    type="button"
                    onClick={exploreActiveCeremony}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ backgroundColor: accentColor, '--tw-ring-color': accentColor } as CSSProperties}
                  >
                    Explore this ceremony <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : <span />}
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => goToMilestone(activeIndex - 1)}
                    aria-label="Previous story chapter"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ded8cd] text-[#514a41] transition hover:bg-[#f5f1ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ '--tw-ring-color': accentColor } as CSSProperties}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToMilestone(activeIndex + 1)}
                    aria-label="Next story chapter"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ded8cd] text-[#514a41] transition hover:bg-[#f5f1ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ '--tw-ring-color': accentColor } as CSSProperties}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}
