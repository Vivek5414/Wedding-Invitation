import { useEffect, useRef, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import type { FormEvent } from 'react'

import type { CeremonyDefinition } from '../data/ceremonies'
import type { CeremonyUpdate } from '../hooks/useCeremonyConfig'

type CeremonyCreatorProps = {
  ceremony: CeremonyDefinition
  onSave: (update: CeremonyUpdate) => void
  onReset: () => void
  onClose: () => void
}

type Draft = {
  name: string
  tagline: string
  date: string
  startsAt: string
  time: string
  venue: string
  description: string
  dressCode: string
  primaryColor: string
  secondaryColor: string
  heroImage: string
}

const makeDraft = (ceremony: CeremonyDefinition): Draft => ({
  name: ceremony.name,
  tagline: ceremony.tagline,
  date: ceremony.date,
  startsAt: ceremony.startsAt,
  time: ceremony.time,
  venue: ceremony.venue,
  description: ceremony.description,
  dressCode: ceremony.dressCode,
  primaryColor: ceremony.primaryColor,
  secondaryColor: ceremony.secondaryColor,
  heroImage: ceremony.heroImage.src,
})

export function CeremonyCreator({ ceremony, onSave, onReset, onClose }: CeremonyCreatorProps) {
  const [draft, setDraft] = useState<Draft>(() => makeDraft(ceremony))
  const [error, setError] = useState('')
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
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
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus()
    }
  }, [])

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const startsAt = new Date(draft.startsAt)
    const imageUrl = draft.heroImage.trim()

    if (!draft.name.trim() || !draft.tagline.trim() || !draft.venue.trim() || !draft.date.trim() || !draft.time.trim()) {
      setError('Add a name, tagline, date, time, and venue to save this event.')
      return
    }
    if (Number.isNaN(startsAt.getTime())) {
      setError('Choose a valid date and time for the countdown.')
      return
    }
    if (!imageUrl.startsWith('/') && !/^https:\/\//i.test(imageUrl)) {
      setError('Use a secure https image URL or a local path beginning with /.')
      return
    }
    if (!imageUrl.startsWith('/')) {
      try {
        if (new URL(imageUrl).protocol !== 'https:') throw new Error('HTTPS required')
      } catch {
        setError('Enter a valid secure https image URL or a local path beginning with /.')
        return
      }
    }

    onSave({ ...draft, heroImage: imageUrl })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[#171411]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ceremony-creator-title"
        ref={dialogRef}
        className="max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-[1.8rem] bg-[#fbf8f1] p-5 shadow-2xl sm:rounded-[1.8rem] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#8b6d4e]">Wedding OS · Ceremony Creator</p>
            <h2 id="ceremony-creator-title" className="mt-2 font-display text-3xl text-[#2d2923]">Make it yours</h2>
            <p className="mt-2 text-sm text-[#716a60]">Changes save on this device and update the ceremony experience.</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close ceremony creator" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ded8cd] text-[#534c42] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6d4e]">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ceremony name" value={draft.name} onChange={(value) => update('name', value)} required />
            <Field label="Tagline" value={draft.tagline} onChange={(value) => update('tagline', value)} required />
            <Field label="Date label" value={draft.date} onChange={(value) => update('date', value)} required />
            <Field label="Display time" value={draft.time} onChange={(value) => update('time', value)} required />
            <label className="block text-sm font-medium text-[#49433a]">
              Countdown date & time
              <input type="datetime-local" value={toLocalDateTimeValue(draft.startsAt)} onChange={(event) => update('startsAt', event.target.value ? new Date(event.target.value).toISOString() : '')} className="mt-2 min-h-11 w-full rounded-xl border border-[#ded8cd] bg-white px-3 text-sm" required />
            </label>
            <Field label="Venue" value={draft.venue} onChange={(value) => update('venue', value)} required />
          </div>

          <label className="block text-sm font-medium text-[#49433a]">
            Description
            <textarea value={draft.description} onChange={(event) => update('description', event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-[#ded8cd] bg-white px-3 py-2.5 text-sm" />
          </label>
          <Field label="Dress code" value={draft.dressCode} onChange={(value) => update('dressCode', value)} />
          <Field label="Hero photo (https or local path)" value={draft.heroImage} onChange={(value) => update('heroImage', value)} />

          <fieldset>
            <legend className="text-sm font-medium text-[#49433a]">Ceremony colours</legend>
            <div className="mt-2 flex flex-wrap gap-4">
              <ColorField label="Primary" value={draft.primaryColor} onChange={(value) => update('primaryColor', value)} />
              <ColorField label="Accent" value={draft.secondaryColor} onChange={(value) => update('secondaryColor', value)} />
            </div>
          </fieldset>

          {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5dfd4] pt-5">
            <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d9d1c4] px-4 text-xs font-semibold uppercase tracking-[0.13em] text-[#655c50] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6d4e]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset all
            </button>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={onClose} className="min-h-11 rounded-full border border-[#d9d1c4] px-5 text-xs font-semibold uppercase tracking-[0.13em] text-[#655c50] hover:bg-white">Cancel</button>
              <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#332c23] px-5 text-xs font-semibold uppercase tracking-[0.13em] text-white hover:bg-[#514334] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6d4e]">
                <Check className="h-4 w-4" aria-hidden="true" /> Save ceremony
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

function toLocalDateTimeValue(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: 'text'
}) {
  return (
    <label className="block text-sm font-medium text-[#49433a]">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="mt-2 min-h-11 w-full rounded-xl border border-[#ded8cd] bg-white px-3 text-sm" />
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-xl border border-[#ded8cd] bg-white py-2 pl-3 pr-4 text-sm text-[#49433a]">
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} aria-label={`${label} ceremony color`} className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0" />
      {label}
      <span className="font-mono text-xs uppercase text-[#827a70]">{value}</span>
    </label>
  )
}
