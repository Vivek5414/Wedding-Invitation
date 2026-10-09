type MetricCardProps = {
  label: string
  value: string
  delta: string
  tone?: 'rose' | 'amber' | 'emerald' | 'violet'
}

const toneClasses: Record<NonNullable<MetricCardProps['tone']>, string> = {
  rose: 'from-rose-100 to-white text-rose-600',
  amber: 'from-amber-100 to-white text-amber-600',
  emerald: 'from-emerald-100 to-white text-emerald-600',
  violet: 'from-violet-100 to-white text-violet-600',
}

export function MetricCard({ label, value, delta, tone = 'rose' }: MetricCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_15px_40px_rgba(15,23,42,0.06)]">
      <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${toneClasses[tone]}`}>
        {label}
      </div>
      <div className="mt-5 text-3xl font-semibold text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{delta}</div>
    </div>
  )
}
