import { Clock3, MapPin, Navigation } from 'lucide-react'

import { weddingConfig } from '../data/weddingConfig'

type VenueCardProps = {
  title?: string
}

export function VenueCard({ title = 'How to Reach Us' }: VenueCardProps) {
  const venueQuery = encodeURIComponent(`${weddingConfig.venue}, ${weddingConfig.venueLocation}`)
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${venueQuery}`
  const directionsQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&data=${encodeURIComponent(directionsUrl)}`
  const hotelsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hotels near ${weddingConfig.venue}, ${weddingConfig.venueLocation}`)}`

  return (
    <div className="flex h-full flex-col">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">Venue & travel</p>
        <h2 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl">{title}</h2>
        <p className="mt-4 text-base text-slate-600 md:text-lg">Everything you need to find your way to the celebration.</p>
      </header>
      <article className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-rose-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.1)] transition duration-300 hover:shadow-[0_35px_90px_rgba(15,23,42,0.14)]">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
            alt="Wedding venue"
            loading="lazy"
            className="h-56 w-full object-cover"
          />
          <span className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-800 shadow-lg backdrop-blur">
            Jaipur, Rajasthan
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div>
                <div className="font-semibold text-slate-900">{weddingConfig.venue}</div>
                <div className="mt-1 text-slate-600">{weddingConfig.venueLocation}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-slate-700">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <div className="font-semibold text-slate-900">Arrive by 6:30 PM</div>
                <div className="mt-1 text-slate-600">Welcome drinks & live music</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Parking & travel</div>
            <div className="mt-1.5 leading-6">Private valet parking is available for all guests. The venue is 25 minutes from Jaipur airport.</div>
          </div>

          <div className="mt-auto flex flex-col gap-4 border-t border-rose-100 pt-5">
            <div className="flex flex-wrap gap-3">
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                <Navigation className="h-4 w-4" /> Get directions
              </a>
              <a href={hotelsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                Nearby hotels
              </a>
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-4 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 p-3 transition hover:border-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              aria-label={`Open Google Maps directions to ${weddingConfig.venue}`}
            >
              <img
                src={directionsQrUrl}
                alt={`QR code for Google Maps directions to ${weddingConfig.venue}`}
                loading="lazy"
                className="h-32 w-32 rounded-lg bg-white p-1"
              />
              <span className="max-w-32 text-sm leading-relaxed text-slate-600">
                <span className="block font-semibold uppercase tracking-[0.16em] text-slate-900">Scan to navigate</span>
                <span className="mt-1 block">Open this location in Google Maps</span>
              </span>
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}
