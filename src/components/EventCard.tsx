import { CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react'

import type { WeddingEvent } from '../data/weddingConfig'

type EventCardProps = {
  event: WeddingEvent
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
      <div className={`h-32 bg-gradient-to-br ${event.accent}`} />
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Event</p>
            <h3 className="mt-2 text-2xl font-medium text-slate-900">{event.name}</h3>
          </div>
          <div className="rounded-full bg-rose-50 p-2 text-rose-500">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-rose-500" /> {event.date}</div>
          <div className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-rose-500" /> {event.time}</div>
          <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-rose-500" /> {event.venue}</div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{event.description}</p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-medium text-slate-800">Dress code</div>
          <div className="mt-1">{event.dressCode}</div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-700">
            Add to calendar
          </button>
          <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Get directions
          </button>
        </div>
      </div>
    </article>
  )
}
