import { useEffect, useState } from 'react'

import { weddingConfig } from '../data/weddingConfig'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const getTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - Date.now()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(new Date(weddingConfig.date)),
  )

  useEffect(() => {
    const targetDate = new Date(weddingConfig.date)
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const hasReached = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div
      className="mt-8 flex flex-wrap items-center justify-start gap-2.5 md:gap-4"
      role="timer"
      aria-label={`Wedding countdown: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
    >
      {hasReached ? (
        <div className="rounded-full border border-rose-200 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-rose-600 shadow-[0_15px_45px_rgba(244,114,182,0.15)]">
          Today is the day! ❤️
        </div>
      ) : (
        Object.entries({
          Days: timeLeft.days,
          Hours: timeLeft.hours,
          Minutes: timeLeft.minutes,
          Seconds: timeLeft.seconds,
        }).map(([label, value]) => (
          <div key={label} className="min-w-[90px] rounded-[1.5rem] border border-[#d5c397] bg-white/85 px-4 py-3 text-center shadow-[0_8px_24px_rgba(101,77,40,0.08)]">
            <div className="text-3xl font-semibold text-[#5a3541] md:text-4xl">{String(value).padStart(2, '0')}</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#927a50]">{label}</div>
          </div>
        ))
      )}
    </div>
  )
}
