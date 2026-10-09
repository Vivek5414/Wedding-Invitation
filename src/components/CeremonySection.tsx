import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'

import { CeremonyCountdown } from './CeremonyCountdown'
import { CeremonyCreator } from './CeremonyCreator'
import type { CeremonyUpdate } from '../hooks/useCeremonyConfig'
import type { WeddingDNAConfig } from '../data/weddingDNA'
import { getWeddingDNALighting, getWeddingDNATokens } from '../data/weddingDNA'
import { ceremonies, type CeremonyDefinition, type CeremonyPhoto } from '../data/ceremonies'

type CeremonySectionProps = {
  initialId?: string
  selectedId?: string
  dna: WeddingDNAConfig
  ceremonyData?: CeremonyDefinition[]
  onUpdateCeremony?: (id: CeremonyDefinition['id'], update: CeremonyUpdate) => void
  onResetCeremonies?: () => void
  onSelectCeremony?: (ceremonyId: string) => void
}

type PhotoButtonProps = {
  photo: CeremonyPhoto
  onOpen: (photo: CeremonyPhoto) => void
  className?: string
  lighting: WeddingDNAConfig['lighting']
}

function PhotoButton({ photo, onOpen, className = '', lighting }: PhotoButtonProps) {
  const lightingTokens = getWeddingDNALighting(lighting)

  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      aria-label={`View photo: ${photo.caption}`}
      className={`group relative block overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c3328] focus-visible:ring-offset-2 ${className}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: lightingTokens.color, opacity: lightingTokens.opacity }}
        aria-hidden="true"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-10 text-xs text-white/90 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        {photo.caption}
      </span>
    </button>
  )
}

function Details({
  ceremony,
  dna,
  onOpen,
}: {
  ceremony: CeremonyDefinition
  dna: WeddingDNAConfig
  onOpen: (photo: CeremonyPhoto) => void
}) {
  const tokens = getWeddingDNATokens(dna)
  const titleFace = tokens.fontStyle === 'sans' ? 'font-sans tracking-tight' : 'font-display'

  return (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color: ceremony.primaryColor }}>
        {ceremony.chapter}
      </p>
      <h3 className={`mt-3 text-4xl leading-[1.03] md:text-5xl ${titleFace}`} style={{ color: ceremony.inkColor }}>
        {ceremony.name}
      </h3>
      <p className="mt-4 font-display text-xl italic" style={{ color: ceremony.primaryColor }}>
        “{ceremony.tagline}”
      </p>
      <p className="mt-4 max-w-xl text-sm leading-7" style={{ color: ceremony.inkColor, opacity: 0.83 }}>
        {ceremony.description}
      </p>
      <div className="my-6 h-px w-16" style={{ backgroundColor: tokens.secondary }} aria-hidden="true" />
      <dl className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
        <div>
          <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-60">Date</dt>
          <dd className="mt-1.5 font-medium">{ceremony.date}</dd>
        </div>
        <div>
          <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-60">Time</dt>
          <dd className="mt-1.5 font-medium">{ceremony.time}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-60">Venue</dt>
          <dd className="mt-1.5 font-medium">{ceremony.venue}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-60">Dress code</dt>
          <dd className="mt-1.5 font-medium">{ceremony.dressCode}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={() => onOpen(ceremony.heroImage)}
        className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          backgroundColor: ceremony.primaryColor,
          color: ceremony.id === 'reception' ? '#241f17' : '#fff',
          '--tw-ring-color': ceremony.primaryColor,
        } as CSSProperties}
      >
        View {ceremony.name} moments <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <CeremonyCountdown ceremony={ceremony} />
    </>
  )
}

function CeremonyGallery({
  ceremony,
  onOpen,
  variant,
  lighting,
}: {
  ceremony: CeremonyDefinition
  onOpen: (photo: CeremonyPhoto) => void
  variant: CeremonyDefinition['layoutStyle']
  lighting: WeddingDNAConfig['lighting']
}) {
  const galleryLayout = {
    'sunlit-editorial': 'grid-cols-[1fr_1fr_1fr]',
    'botanical-collage': 'grid-cols-2 md:grid-cols-[1.15fr_0.85fr_0.85fr]',
    'cinematic-stage': 'grid-cols-[1.2fr_0.8fr_1fr]',
    'royal-cinema': 'grid-cols-[0.9fr_1.1fr_0.9fr]',
    'evening-magazine': 'grid-cols-[1.1fr_0.9fr_1.1fr]',
  } satisfies Record<CeremonyDefinition['layoutStyle'], string>

  return (
    <div
      aria-label={`${ceremony.name} photo gallery`}
      className={`mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:grid md:overflow-visible ${galleryLayout[variant]}`}
    >
      {ceremony.galleryImages.map((photo, index) => (
        <PhotoButton
          key={photo.src}
          photo={photo}
          onOpen={onOpen}
          lighting={lighting}
          className={`h-52 min-w-[78vw] snap-start md:h-56 md:min-w-0 ${
            variant === 'botanical-collage' && index === 0
              ? 'md:col-span-2 md:h-64'
              : variant === 'cinematic-stage' && index === 1
                ? 'md:translate-y-5'
                : variant === 'royal-cinema' && index === 1
                  ? 'md:h-64'
                  : ''
          } ${
            variant === 'sunlit-editorial' ? 'rounded-2xl' :
              variant === 'botanical-collage' ? 'rounded-sm' :
                variant === 'cinematic-stage' ? 'rounded-lg' :
                  variant === 'royal-cinema' ? 'rounded-[1.2rem] ring-1 ring-[#b59054]/40' :
                    'rounded-[0.2rem] border border-[#d0b574]/40'
          }`}
        />
      ))}
    </div>
  )
}

export function CeremonySection({
  initialId = 'haldi',
  selectedId,
  dna,
  ceremonyData = ceremonies,
  onUpdateCeremony,
  onResetCeremonies,
  onSelectCeremony,
}: CeremonySectionProps) {
  const initialCeremony = ceremonyData.find((ceremony) => ceremony.id === initialId) ?? ceremonyData[0]
  const [internalSelectedId, setInternalSelectedId] = useState(initialCeremony.id)
  const [lightboxPhoto, setLightboxPhoto] = useState<CeremonyPhoto | null>(null)
  const [creatorOpen, setCreatorOpen] = useState(false)
  const tabRefs = useRef<HTMLButtonElement[]>([])
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const selected = ceremonyData.find((ceremony) => ceremony.id === (selectedId ?? internalSelectedId)) ?? ceremonyData[0]
  const dnaTokens = getWeddingDNATokens(dna)

  useEffect(() => {
    if (!lightboxPhoto) return

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxPhoto(null)
        return
      }

      if (event.key !== 'Tab') return
      const focusable = lightboxRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      previouslyFocused?.focus()
    }
  }, [lightboxPhoto])

  const selectCeremony = (ceremony: CeremonyDefinition) => {
    setInternalSelectedId(ceremony.id)
    onSelectCeremony?.(ceremony.id)
  }

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextIndex = event.key === 'ArrowRight' ? (index + 1) % ceremonyData.length
      : event.key === 'ArrowLeft' ? (index - 1 + ceremonyData.length) % ceremonyData.length
        : event.key === 'Home' ? 0
          : event.key === 'End' ? ceremonyData.length - 1
            : -1
    if (nextIndex < 0) return

    event.preventDefault()
    const nextCeremony = ceremonyData[nextIndex]
    if (!nextCeremony) return
    tabRefs.current[nextIndex]?.focus()
    selectCeremony(nextCeremony)
  }

  const openHero = () => setLightboxPhoto(selected.heroImage)
  const motionDuration = reduceMotion ? 0.15 : selected.transition.duration / dnaTokens.motionScale
  const motionY = reduceMotion ? 0 : selected.transition.fromY * dnaTokens.motionScale

  return (
    <section id="ceremony-experience" aria-label="Explore our wedding ceremonies" className="relative">
      <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#8b6d4e]">Five ceremonies. Five little worlds.</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-[#29251f] md:text-5xl">
            Every celebration has
            <br className="hidden sm:block" /> its own <em className="font-normal text-[#8b6d4e]">kind of magic.</em>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <p className="max-w-sm text-sm leading-6 text-[#756e63]">Move through the moments and feel the story change with each one.</p>
          {onUpdateCeremony ? (
            <button
              type="button"
              onClick={() => setCreatorOpen(true)}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-[#d9d1c4] bg-white/75 px-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5e5549] transition hover:border-[#8b6d4e] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6d4e] focus-visible:ring-offset-2"
            >
              Customize {selected.name}
            </button>
          ) : null}
        </div>
      </div>

      <div role="tablist" aria-label="Choose a ceremony" className="mb-4 flex snap-x gap-2 overflow-x-auto pb-2">
        {ceremonyData.map((ceremony, index) => {
          const active = ceremony.id === selected.id
          return (
            <button
              key={ceremony.id}
              ref={(element) => {
                if (element) tabRefs.current[index] = element
              }}
              id={`ceremony-tab-${ceremony.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => selectCeremony(ceremony)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className="min-h-11 shrink-0 snap-start rounded-full border px-5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: active ? ceremony.primaryColor : 'rgba(255,255,255,0.76)',
                color: active ? ceremony.id === 'reception' ? '#241f17' : '#fff' : '#655e54',
                borderColor: active ? ceremony.primaryColor : '#e6dfd4',
                boxShadow: active ? `0 10px 25px ${ceremony.primaryColor}30` : undefined,
                '--tw-ring-color': ceremony.primaryColor,
              } as CSSProperties}
            >
              {ceremony.name}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={selected.id}
          id={`ceremony-panel-${selected.id}`}
          role="tabpanel"
          aria-labelledby={`ceremony-tab-${selected.id}`}
          tabIndex={0}
          initial={{ opacity: 0, y: motionY, scale: reduceMotion ? 1 : selected.transition.fromScale }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -motionY * 0.45 }}
          transition={{ duration: motionDuration, ease: [0.22, 1, 0.36, 1] }}
          className={`ceremony-personalization relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${
            selected.layoutStyle === 'sunlit-editorial' ? 'rounded-[2rem]' :
              selected.layoutStyle === 'botanical-collage' ? 'rounded-[0.4rem]' :
                selected.layoutStyle === 'cinematic-stage' ? 'rounded-[1.3rem]' :
                  selected.layoutStyle === 'royal-cinema' ? 'rounded-[2.2rem] border-[6px] border-double border-[#b59054]/70' :
                    'rounded-[0.25rem] border border-[#ba9c5d]/40'
          } ${selected.layoutStyle === 'botanical-collage' ? 'botanical-wash' : ''}`}
          style={{
            background: `radial-gradient(ellipse at 100% 0%, ${selected.primaryColor}2b, transparent 34%), radial-gradient(ellipse at 0% 100%, ${selected.secondaryColor}35, transparent 42%), radial-gradient(ellipse at 100% 0%, ${dnaTokens.secondary}1f, transparent 32%), ${selected.background}`,
            color: selected.inkColor,
            '--tw-ring-color': selected.primaryColor,
          } as CSSProperties}
          data-dna-pattern={dnaTokens.surfacePattern}
        >
          {selected.layoutStyle === 'sunlit-editorial' ? (
            <div className="relative pb-2">
              <div className="relative h-[390px] overflow-hidden md:h-[590px]">
                <PhotoButton photo={selected.heroImage} onOpen={setLightboxPhoto} className="h-full w-full" lighting={dna.lighting} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3e2717]/55 via-transparent to-[#fff8df]/10" aria-hidden="true" />
                <div className="pointer-events-none absolute left-6 top-7 font-display text-5xl text-white/70 md:left-10 md:top-10 md:text-7xl" aria-hidden="true">❋</div>
                <div className="pointer-events-none absolute bottom-8 left-6 right-6 text-white md:bottom-12 md:left-12">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/80">{selected.chapter}</p>
                  <h3 className="mt-2 font-display text-5xl md:text-7xl">{selected.name}</h3>
                  <p className="mt-2 max-w-md font-display text-lg italic md:text-2xl">“{selected.tagline}”</p>
                </div>
              </div>
              <div className="relative z-10 mx-4 -mt-8 rounded-[1.5rem] border border-white/75 bg-[#fffaf0]/95 p-5 shadow-[0_22px_60px_rgba(96,63,24,0.14)] backdrop-blur md:ml-auto md:mr-10 md:mt-[-4.5rem] md:max-w-[39rem] md:p-8">
                <Details ceremony={selected} dna={dna} onOpen={setLightboxPhoto} />
              </div>
              <div className="px-4 pb-4 md:px-10 md:pb-9">
                <CeremonyGallery ceremony={selected} onOpen={setLightboxPhoto} variant={selected.layoutStyle} lighting={dna.lighting} />
              </div>
              <div className="petal-drift pointer-events-none absolute -right-5 top-12 h-24 w-24 rounded-full border-[10px] border-[#e4aa37]/35" aria-hidden="true" />
            </div>
          ) : null}

          {selected.layoutStyle === 'botanical-collage' ? (
            <div className="relative grid gap-7 p-4 md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-12">
              <div className="relative min-h-[430px] overflow-hidden rounded-sm md:min-h-[650px]">
                <PhotoButton photo={selected.heroImage} onOpen={setLightboxPhoto} className="h-full w-full" lighting={dna.lighting} />
                <div className="pointer-events-none absolute inset-0 border-[14px] border-[#f2efe4]/50" aria-hidden="true" />
                <span className="pointer-events-none absolute left-5 top-5 font-display text-5xl italic text-white drop-shadow-lg md:left-8 md:top-8 md:text-7xl">in bloom</span>
                <span className="pointer-events-none absolute bottom-6 right-6 rotate-[-90deg] text-[9px] uppercase tracking-[0.32em] text-white drop-shadow-lg">Jaipur · December</span>
              </div>
              <div className="relative flex flex-col justify-center py-3 md:py-7">
                <div className="pointer-events-none absolute -right-1 top-3 hidden h-28 w-28 rounded-full border border-[#5b785d]/25 md:block" aria-hidden="true" />
                <Details ceremony={selected} dna={dna} onOpen={setLightboxPhoto} />
                <div className="mt-5 text-[9px] font-semibold uppercase tracking-[0.3em] opacity-60">A garden-side gathering</div>
                <CeremonyGallery ceremony={selected} onOpen={setLightboxPhoto} variant={selected.layoutStyle} lighting={dna.lighting} />
              </div>
            </div>
          ) : null}

          {selected.layoutStyle === 'cinematic-stage' ? (
            <div className="relative bg-[#17122c] text-white">
              <div className="relative min-h-[530px] overflow-hidden md:min-h-[720px]">
                <PhotoButton photo={selected.heroImage} onOpen={setLightboxPhoto} className="absolute inset-0 h-full w-full" lighting={dna.lighting} />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(20,13,42,0.92)_0%,rgba(35,17,56,0.48)_55%,rgba(19,17,42,0.32)_100%)]" aria-hidden="true" />
                <div className="stage-beam pointer-events-none absolute inset-x-0 top-0 h-36" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30" aria-hidden="true">
                  <div className="h-[28rem] w-[28rem] rounded-full border border-fuchsia-200/50 shadow-[0_0_90px_rgba(215,71,182,0.4)] md:h-[42rem] md:w-[42rem]" />
                </div>
                <div className="pointer-events-none absolute bottom-8 left-6 max-w-3xl md:bottom-14 md:left-14">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-fuchsia-100/80">{selected.chapter}</p>
                  <h3 className="mt-4 font-display text-6xl leading-[0.88] text-white md:text-8xl">{selected.name}</h3>
                  <p className="mt-5 max-w-lg font-display text-xl italic text-white/85 md:text-3xl">“{selected.tagline}”</p>
                </div>
                <div className="absolute right-5 top-5 hidden w-[22rem] rounded-2xl border border-white/20 bg-[#19142b]/75 p-6 text-white shadow-2xl backdrop-blur-md md:block">
                  <Details ceremony={selected} dna={dna} onOpen={setLightboxPhoto} />
                </div>
              </div>
              <div className="bg-[#19142b] p-5 md:hidden">
                <Details ceremony={selected} dna={dna} onOpen={setLightboxPhoto} />
              </div>
              <div className="grid gap-6 p-5 md:grid-cols-[0.8fr_1.2fr] md:items-center md:px-10 md:py-8">
                <p className="max-w-md font-display text-xl italic text-white/80">{selected.description}</p>
                <CeremonyGallery ceremony={selected} onOpen={setLightboxPhoto} variant={selected.layoutStyle} lighting={dna.lighting} />
              </div>
            </div>
          ) : null}

          {selected.layoutStyle === 'royal-cinema' ? (
            <div className="bg-[#f8f0e5] p-3 md:p-6">
              <div className="relative min-h-[440px] overflow-hidden rounded-[1.25rem] md:min-h-[650px]">
                <PhotoButton photo={selected.heroImage} onOpen={setLightboxPhoto} className="absolute inset-0 h-full w-full" lighting={dna.lighting} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3c1823]/35 via-transparent to-[#2b161b]/55" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-x-5 top-8 text-center text-white md:top-12">
                  <p className="text-[9px] uppercase tracking-[0.43em] text-white/80">{selected.chapter}</p>
                  <h3 className="mt-3 font-display text-4xl md:text-7xl">THE WEDDING</h3>
                  <p className="mx-auto mt-3 max-w-xl font-display text-lg italic md:text-2xl">“{selected.tagline}”</p>
                </div>
                <div className="pointer-events-none absolute inset-x-7 bottom-5 border-y border-[#e4cb93]/70 py-2 text-center text-[9px] uppercase tracking-[0.3em] text-[#fff3d2] md:inset-x-20 md:bottom-8 md:py-4 md:text-[10px]">
                  With the blessings of our families
                </div>
              </div>
              <div className="mx-auto grid max-w-6xl gap-8 px-2 py-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-6 md:py-12">
                <div className="text-center md:text-left">
                  <p className="font-display text-2xl italic text-[#8e6e39]">The beginning of forever</p>
                  <p className="mt-3 text-sm leading-7 text-[#685b4b]">{selected.description}</p>
                  <div className="mt-5 flex justify-center gap-2 md:justify-start">
                    <span className="h-px w-12 self-center bg-[#b59054]" aria-hidden="true" />
                    <span className="text-[#8e6e39]" aria-hidden="true">✦</span>
                    <span className="h-px w-12 self-center bg-[#b59054]" aria-hidden="true" />
                  </div>
                </div>
                <div className="rounded-xl border border-[#b59054]/35 bg-[#fffaf1] p-5 md:p-7">
                  <Details ceremony={selected} dna={dna} onOpen={setLightboxPhoto} />
                </div>
              </div>
              <div className="px-2 pb-5 md:px-7">
                <CeremonyGallery ceremony={selected} onOpen={setLightboxPhoto} variant={selected.layoutStyle} lighting={dna.lighting} />
              </div>
            </div>
          ) : null}

          {selected.layoutStyle === 'evening-magazine' ? (
            <div className="grid min-h-[620px] bg-[#121316] text-[#f7efde] lg:grid-cols-[0.82fr_1.18fr]">
              <div className="flex flex-col justify-center p-6 md:p-10 lg:p-14">
                <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-[#cbb375]">{selected.chapter}</p>
                <h3 className="mt-5 font-sans text-4xl font-light uppercase tracking-[0.15em] md:text-5xl">{selected.name}</h3>
                <p className="mt-5 font-display text-xl italic text-[#e6d7b7]">“{selected.tagline}”</p>
                <p className="mt-5 max-w-md text-sm leading-7 text-white/65">{selected.description}</p>
                <dl className="mt-8 space-y-4 border-t border-[#b99b5f]/35 pt-6 text-sm">
                  <div><dt className="text-[9px] uppercase tracking-[0.25em] text-[#cbb375]">Date & time</dt><dd className="mt-1.5">{selected.date} · {selected.time}</dd></div>
                  <div><dt className="text-[9px] uppercase tracking-[0.25em] text-[#cbb375]">Venue</dt><dd className="mt-1.5">{selected.venue}</dd></div>
                  <div><dt className="text-[9px] uppercase tracking-[0.25em] text-[#cbb375]">Dress code</dt><dd className="mt-1.5">{selected.dressCode}</dd></div>
                </dl>
                <button
                  type="button"
                  onClick={openHero}
                  className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 border-b border-[#c9a85e] pb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f1dfb6] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bd79]"
                >
                  See the evening <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <CeremonyCountdown ceremony={selected} />
              </div>
              <div className="relative min-h-[400px] overflow-hidden lg:min-h-full">
                <PhotoButton photo={selected.heroImage} onOpen={setLightboxPhoto} className="absolute inset-0 h-full w-full" lighting={dna.lighting} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#121316] via-transparent to-[#111215]/20" aria-hidden="true" />
                <span className="pointer-events-none absolute bottom-7 right-7 font-display text-sm italic text-white/80">{selected.heroImage.caption}</span>
              </div>
              <div className="col-span-full px-5 pb-7 md:px-10">
                <CeremonyGallery ceremony={selected} onOpen={setLightboxPhoto} variant={selected.layoutStyle} lighting={dna.lighting} />
              </div>
            </div>
          ) : null}

          <div
            className={`pointer-events-none absolute right-6 top-6 hidden h-12 w-12 md:block ${
              selected.decorations === 'botanical' ? 'rounded-full border border-current/20' :
                selected.decorations === 'ornamental' ? 'rotate-45 border border-[#b59054]/60' :
                  selected.decorations === 'golden-glow' ? 'rounded-full bg-[#d4b978]/20 blur-xl' :
                    selected.decorations === 'stage-lights' ? 'rounded-full bg-fuchsia-400/20 blur-lg' :
                      'rounded-full border-4 border-[#e4aa37]/30'
            }`}
            aria-hidden="true"
          />
        </motion.article>
      </AnimatePresence>

      {creatorOpen && onUpdateCeremony ? (
        <CeremonyCreator
          ceremony={selected}
          onSave={(update) => onUpdateCeremony(selected.id, update)}
          onReset={() => {
            onResetCeremonies?.()
            setCreatorOpen(false)
          }}
          onClose={() => setCreatorOpen(false)}
        />
      ) : null}

      <AnimatePresence>
        {lightboxPhoto ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f1012]/95 p-3 backdrop-blur-md md:p-8"
            onClick={() => setLightboxPhoto(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${selected.name} photograph`}
              ref={lightboxRef}
              className="relative flex max-h-full max-w-6xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setLightboxPhoto(null)}
                aria-label="Close photo viewer"
                className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <img src={lightboxPhoto.src} alt={lightboxPhoto.alt} className="max-h-[78vh] max-w-full rounded-sm object-contain" />
              <p className="mt-4 text-center font-display text-lg italic text-white/85">{lightboxPhoto.caption}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
