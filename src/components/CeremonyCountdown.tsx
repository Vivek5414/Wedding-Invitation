import { useEffect, useState } from 'react'

import type { CeremonyDefinition } from '../data/ceremonies'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CeremonyCountdown({ ceremony }: { ceremony: CeremonyDefinition }) {
  const [now, setNow] = useState(() => Date.now())
  const targetTime = new Date(ceremony.startsAt).getTime()
  const difference = targetTime - now
  const timeLeft = getTimeLeftAt(ceremony.startsAt, now)

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [ceremony.startsAt])

  const hasStarted = difference <= 0

  return (
    <div
      className="mt-6 border-t border-current/15 pt-5"
      role="timer"
      aria-live="off"
      aria-label={hasStarted
        ? `${ceremony.name} has started`
        : `Countdown to ${ceremony.name}: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] opacity-65">
        {hasStarted ? 'The celebration is underway' : `Counting down to ${ceremony.name}`}
      </p>
      {hasStarted ? (
        <p className="mt-2 font-display text-lg italic">The moment is here.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {([
            ['Days', timeLeft.days],
            ['Hours', timeLeft.hours],
            ['Minutes', timeLeft.minutes],
            ['Seconds', timeLeft.seconds],
          ] as const).map(([label, value]) => (
            <div key={label} className="min-w-12">
              <span className="block font-display text-2xl tabular-nums">{String(value).padStart(2, '0')}</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.18em] opacity-60">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const getTimeLeftAt = (startsAt: string, now: number): TimeLeft => {
  const difference = new Date(startsAt).getTime() - now
  if (difference <= 0 || Number.isNaN(difference)) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}
