import { useMemo, useState } from 'react'
import { CalendarHeart, Check, ChevronRight, Heart, Sparkles } from 'lucide-react'

const attendanceOptions = [
  { id: 'yes', label: 'Yes', description: 'Excited to celebrate with you' },
  { id: 'maybe', label: 'Maybe', description: 'Still deciding' },
  { id: 'no', label: 'Sorry, can\'t make it', description: 'We will celebrate with you from afar' },
]

const foodOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Other']

const eventOptions = ['Mehendi', 'Haldi', 'Wedding', 'Reception']

export function RsvpForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    attendance: 'yes',
    guestName: '',
    contact: '',
    guests: '2',
    food: 'Vegetarian',
    events: ['Wedding', 'Reception'],
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const progress = ((step + 1) / 7) * 100

  const currentStepLabel = useMemo(() => {
    const labels = [
      'Will you join us?',
      'Guest details',
      'Guest count',
      'Food preference',
      'Event attendance',
      'Message for the couple',
      'Confirmation',
    ]
    return labels[step]
  }, [step])

  const nextStep = () => {
    const nextErrors: Record<string, string> = {}

    if (step === 1 && !form.guestName.trim()) nextErrors.guestName = 'Please enter your name.'
    if (step === 2 && (!Number.isInteger(Number(form.guests)) || Number(form.guests) < 1 || Number(form.guests) > 10)) {
      nextErrors.guests = 'Please choose a guest count between 1 and 10.'
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setStep((current) => Math.min(current + 1, 6))
  }

  const previousStep = () => {
    setErrors({})
    setStep((current) => Math.max(current - 1, 0))
  }

  const toggleEvent = (eventName: string) => {
    setForm((current) => {
      const events = current.events.includes(eventName)
        ? current.events.filter((item) => item !== eventName)
        : [...current.events, eventName]

      return { ...current, events }
    })
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-[2.25rem] border border-rose-200 bg-white shadow-[0_30px_80px_rgba(98,48,62,0.12)]">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border border-rose-100" aria-hidden="true" />
        <div className="relative px-6 py-12 text-center md:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 shadow-lg">
            <Heart className="h-8 w-8 fill-rose-200" aria-hidden="true" />
          </div>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-600">With love & gratitude</p>
          <h3 className="mt-2 font-display text-3xl text-slate-900 md:text-4xl">Thank you for celebrating with us.</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            We are so grateful to have you with us. This RSVP is a visual preview and does not send or save your response.
          </p>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Preview only · response not submitted
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[2.25rem] border border-rose-200 bg-white shadow-[0_30px_85px_rgba(98,48,62,0.11)]">
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#9e5a68] via-[#66384e] to-[#352331] px-6 py-6 text-white md:px-9 md:py-7">
        <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-white/15" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-rose-100 backdrop-blur">
              <CalendarHeart className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" /> Smart RSVP
            </span>
            <h3 className="mt-3 font-display text-3xl md:text-4xl">{currentStepLabel}</h3>
            <p className="mt-1 text-sm text-white/70">A few details to help us make your celebration special.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">{String(step + 1).padStart(2, '0')}</span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/60">Your progress</p>
              <p className="mt-0.5 text-sm font-semibold text-white">Step {step + 1} of 7</p>
            </div>
          </div>
        </div>
        <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="RSVP progress" aria-valuemin={1} aria-valuemax={7} aria-valuenow={step + 1}>
          <div className="h-full rounded-full bg-gradient-to-r from-amber-200 to-rose-200 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-[linear-gradient(145deg,#fffdfa,#fff8f5)] p-5 md:p-8">
      {step === 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {attendanceOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setForm((current) => ({ ...current, attendance: option.id }))
                nextStep()
              }}
              aria-pressed={form.attendance === option.id}
              className={`group min-h-36 rounded-[1.5rem] border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                form.attendance === option.id
                  ? 'border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50 shadow-[0_15px_35px_rgba(244,114,182,0.1)]'
                  : 'border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl font-semibold text-slate-900">{option.label}</span>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${form.attendance === option.id ? 'border-rose-400 bg-rose-500 text-white' : 'border-slate-200 bg-white text-transparent'}`}>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-2 text-sm leading-5 text-slate-600">{option.description}</div>
            </button>
          ))}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Guest name
            <input
              type="text"
              value={form.guestName}
              onChange={(event) => setForm((current) => ({ ...current, guestName: event.target.value }))}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100/70"
              placeholder="Your full name"
            />
          </label>
          {errors.guestName ? <p role="alert" className="text-sm text-rose-500">{errors.guestName}</p> : null}

          <label className="block text-sm font-medium text-slate-700">
            Phone or email (optional)
            <input
              type="text"
              value={form.contact}
              onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100/70"
              placeholder="+91 98765 43210"
            />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Number of guests
            <input
              type="number"
              min="1"
              max="10"
              value={form.guests}
              onChange={(event) => setForm((current) => ({ ...current, guests: event.target.value }))}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100/70"
            />
          </label>
          {errors.guests ? <p role="alert" className="mt-2 text-sm text-rose-500">{errors.guests}</p> : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {foodOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setForm((current) => ({ ...current, food: option }))
                nextStep()
              }}
              aria-pressed={form.food === option}
              className={`flex min-h-14 items-center justify-between rounded-[1.25rem] border px-5 py-4 text-left text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                form.food === option
                  ? 'border-rose-300 bg-gradient-to-r from-rose-50 to-amber-50 text-rose-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50/40'
              }`}
            >
              {option}
              {form.food === option ? <Check className="h-4 w-4 text-rose-600" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {eventOptions.map((eventName) => (
            <button
              key={eventName}
              type="button"
              onClick={() => toggleEvent(eventName)}
              aria-pressed={form.events.includes(eventName)}
              className={`flex min-h-14 items-center justify-between rounded-[1.25rem] border px-4 py-4 text-left text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                form.events.includes(eventName)
                  ? 'border-rose-300 bg-gradient-to-r from-rose-50 to-amber-50 text-rose-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50/40'
              }`}
            >
              {eventName}
              {form.events.includes(eventName) ? <Check className="h-4 w-4 text-rose-600" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}

      {step === 5 ? (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Message for the couple
            <textarea
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              rows={5}
              className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100/70"
              placeholder="We are so excited to celebrate with you both."
            />
          </label>
        </div>
      ) : null}

      {step === 6 ? (
        <div className="grid gap-3 rounded-[1.5rem] border border-rose-100 bg-white p-4 sm:grid-cols-2 md:p-5">
          {[
            ['RSVP', form.attendance],
            ['Guest', form.guestName],
            ['Guests', form.guests],
            ['Food', form.food],
            ['Events', form.events.join(', ') || 'None selected'],
            ['Message', form.message || 'No note shared'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[#fff9f6] p-3 text-sm leading-5 text-slate-700">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-rose-600">{label}</span>
              <span className="mt-1 block">{value}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-rose-100 pt-5">
        <button
          type="button"
          onClick={previousStep}
          disabled={step === 0}
          className="min-h-11 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>

        {step < 6 ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#3b2635] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            Continue <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-rose-700 to-[#3b2635] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-rose-950/10 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            Submit RSVP <Heart className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      </div>
    </div>
  )
}
