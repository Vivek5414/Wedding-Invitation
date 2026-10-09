import { motion } from 'framer-motion'

import {
  getWeddingDNAPalette,
  weddingDNAOptions,
  weddingDNAPrompts,
  type WeddingDNAConfig,
} from '../data/weddingDNA'

type WeddingDNAProps = {
  value: WeddingDNAConfig
  onChange: (value: WeddingDNAConfig) => void
}

export function WeddingDNA({ value, onChange }: WeddingDNAProps) {
  const palette = getWeddingDNAPalette(value.palette)
  const selectedLabels = {
    relationship: weddingDNAOptions.relationship.find((option) => option.id === value.relationship)?.label,
    celebration: weddingDNAOptions.celebration.find((option) => option.id === value.celebration)?.label,
    palette: weddingDNAOptions.palette.find((option) => option.id === value.palette)?.label,
    music: weddingDNAOptions.music.find((option) => option.id === value.music)?.label,
    lighting: weddingDNAOptions.lighting.find((option) => option.id === value.lighting)?.label,
  }

  const renderChoices = <K extends keyof WeddingDNAConfig>(
    key: K,
    options: readonly { id: WeddingDNAConfig[K]; label: string; note: string; colors?: readonly string[] }[],
  ) => (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const selected = value[key] === option.id

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange({ ...value, [key]: option.id })}
            className={`group min-h-12 rounded-full border px-4 py-2.5 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d7852] focus-visible:ring-offset-2 ${
              selected
                ? 'border-transparent text-white shadow-[0_9px_24px_rgba(40,35,30,0.16)]'
                : 'border-[#dfd9cd] bg-white/70 text-[#5b554c] hover:border-[#9f8061] hover:bg-white'
            }`}
            style={selected ? {
              backgroundColor: palette.colors[0],
              color: value.palette === 'marigold' ? '#2d1c10' : '#fff',
            } : undefined}
          >
            <span className="flex items-center gap-2.5">
              {option.colors ? (
                <span className="flex -space-x-1.5" aria-hidden="true">
                  {option.colors.map((color) => (
                    <span key={color} className="h-4 w-4 rounded-full border border-white/80" style={{ backgroundColor: color }} />
                  ))}
                </span>
              ) : null}
              <span className="text-sm font-medium">{option.label}</span>
            </span>
            <span
              className={`mt-1 block text-[11px] ${selected ? 'text-white/75' : 'text-[#8a8276]'}`}
              style={selected && value.palette === 'marigold' ? { color: 'rgba(45,28,16,0.78)' } : undefined}
            >
              {option.note}
            </span>
          </button>
        )
      })}
    </div>
  )

  return (
    <section id="dna" aria-labelledby="dna-heading" className="royal-wedding-wash relative overflow-hidden bg-[#faf5eb] py-24 md:py-32">
      <div className="pointer-events-none absolute -right-28 top-16 h-80 w-80 rounded-full border border-[#d9cbb1]/60" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full border border-[#d9cbb1]/50" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#8b6d4e]">A little more you</p>
          <h2 id="dna-heading" className="mt-5 max-w-xl font-display text-4xl leading-[1.06] text-[#2e2923] md:text-6xl">
            Your wedding,
            <br />
            in your own <em className="font-normal text-[#8b6d4e]">colour.</em>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#6e675d]">
            Five small choices shape the feeling of your wedding world. Your Wedding DNA is saved on this device and updates the visual signature as you explore.
          </p>

          <div className="mt-10 space-y-8">
            {weddingDNAPrompts.map(({ key, title }) => (
              <fieldset key={key} className="min-w-0">
                <legend className="mb-3 text-sm font-medium text-[#38332c]">{title}</legend>
                {renderChoices(key, weddingDNAOptions[key])}
              </fieldset>
            ))}
          </div>
        </div>

        <motion.aside
          key={`${value.relationship}-${value.celebration}-${value.palette}-${value.lighting}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
          className="relative self-start overflow-hidden rounded-[2rem] border border-white/50 bg-[#24211d] p-6 text-white shadow-[0_32px_90px_rgba(44,36,26,0.18)] md:p-9 lg:sticky lg:top-10"
        >
          <div
            className="absolute inset-0 opacity-70"
            style={{ background: `radial-gradient(ellipse at 82% 5%, ${palette.colors[1]}75, transparent 42%), linear-gradient(150deg, ${palette.colors[0]} 0%, #24211d 67%)` }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/70">Your Wedding DNA</p>
              <span className="rounded-full border border-white/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-white/75">Living profile</span>
            </div>

            <p className="mt-8 font-display text-3xl leading-tight md:text-4xl">
              {selectedLabels.relationship} <span className="text-white/45">×</span>
              <br />
              {selectedLabels.celebration}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              {palette.note}, with a {selectedLabels.music?.toLowerCase()} soundtrack and {selectedLabels.lighting?.toLowerCase()} light.
            </p>

            <div className="mt-8 flex h-28 overflow-hidden rounded-2xl border border-white/10">
              {palette.colors.map((color, index) => (
                <div
                  key={color}
                  className="relative flex-1"
                  style={{ backgroundColor: color, opacity: value.lighting === 'daylight' ? 0.92 : value.lighting === 'after-dark' ? 0.8 : 0.86 }}
                >
                  <span
                    className="absolute bottom-3 left-3 text-[9px] font-medium uppercase tracking-[0.18em] text-white/80"
                    style={value.palette === 'marigold' && index === 0 ? { color: '#2d1c10' } : undefined}
                  >
                    {['01', '02', '03'][index]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-end justify-between gap-4 border-t border-white/20 pt-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">The feeling</p>
                <p className="mt-2 text-sm text-white/90">{selectedLabels.relationship} · {selectedLabels.celebration}</p>
              </div>
              <span className="font-display text-2xl italic text-white/75">R + A</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
