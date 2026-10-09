import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'

import { Countdown } from './Countdown'
import { weddingConfig } from '../data/weddingConfig'
import type { WeddingChapter, WeddingChapterConfig } from '../utils/weddingLifecycle'

type WeddingHeroProps = {
  accentColor: string
  chapter: WeddingChapter
  chapterCopy: WeddingChapterConfig
}

export function WeddingHero({ accentColor, chapter, chapterCopy }: WeddingHeroProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#f7f0e3] text-[#49372b] md:min-h-screen" aria-labelledby="wedding-hero-heading">
      <img
        src={weddingConfig.heroImage}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.96)_0%,rgba(255,250,240,0.9)_38%,rgba(255,247,231,0.66)_64%,rgba(52,35,28,0.16)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,250,240,0.4)_0%,transparent_28%,transparent_70%,rgba(255,250,240,0.52)_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-3 z-20 rounded-[2rem] border border-white/65 md:inset-6 md:rounded-[2.5rem]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-1/2 z-20 hidden h-[36rem] w-[36rem] -translate-y-1/2 rounded-full border border-[#c5a96d]/55 md:block" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-4 top-1/2 z-20 hidden h-[27rem] w-[27rem] -translate-y-1/2 rounded-full border border-[#c5a96d]/45 md:block" aria-hidden="true" />

      <div className="relative z-30 mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-24 pt-32 md:min-h-screen md:px-8 md:pb-28">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl rounded-[2rem] border border-[#c7ad76]/70 bg-[#fffaf0]/90 px-6 py-8 shadow-[0_28px_90px_rgba(67,45,32,0.14)] backdrop-blur-md md:rounded-[2.5rem] md:px-12 md:py-11"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9b47d]/70 bg-[#f7f0df] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#826b3e]">
            <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} aria-hidden="true" />
            {chapterCopy.badge}
          </div>
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#8d795f] md:text-xs">{chapterCopy.label}. {chapter === 'AFTER' ? 'A memory we carry forever.' : 'One link. Your entire wedding.'}</p>
          <h1 id="wedding-hero-heading" className="mt-5 font-display text-6xl leading-[0.92] tracking-[-0.055em] text-[#4b2433] md:text-8xl lg:text-[7.5rem]">
            {chapter === 'AFTER' ? 'Forever' : `${weddingConfig.names.groom}`}
            {chapter !== 'AFTER' ? (
              <span className="mx-2 block font-display text-3xl font-normal italic text-[#a88758] md:mx-4 md:inline md:text-6xl">&</span>
            ) : null}
            {chapter === 'AFTER' ? 'Starts Here' : weddingConfig.names.bride}
          </h1>
          <div className="mt-7 flex items-center gap-4">
            <span className="h-px w-12 bg-[#b99a5d]" aria-hidden="true" />
            <p className="font-display text-xl italic text-[#735c48] md:text-2xl">{chapterCopy.emotionalLine}</p>
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#8c744e] md:text-base">{weddingConfig.dateLabel}</p>

          <div className="mt-7 max-w-xl">
            {chapter === 'AFTER' ? (
              <div className="rounded-full border border-[#c9b47d]/70 bg-white/75 px-4 py-3 text-sm uppercase tracking-[0.2em] text-[#735c48]">
                Our love story continues
              </div>
            ) : (
              <Countdown />
            )}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#story"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#632f43] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#fffaf0] shadow-[0_12px_28px_rgba(99,47,67,0.2)] transition hover:bg-[#4b2433] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a5d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]"
            >
              {chapter === 'AFTER' ? 'Relive our story' : 'Enter our story'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#rsvp"
              className="inline-flex min-h-12 items-center rounded-full border border-[#b99a5d]/80 bg-white/65 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#573d31] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a5d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]"
            >
              {chapter === 'AFTER' ? 'View memories' : 'Save your place'}
            </a>
          </div>
        </motion.div>
      </div>

      <a
        href="#story"
        className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 rounded-full px-4 py-2 text-[#725a43] transition hover:text-[#4b2433] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a5d] md:bottom-9"
      >
        <span className="text-[9px] uppercase tracking-[0.36em]">Ten moments. One forever.</span>
        <ArrowDown className={`h-4 w-4 ${reduceMotion ? '' : 'animate-bounce'}`} aria-hidden="true" />
      </a>
    </section>
  )
}
