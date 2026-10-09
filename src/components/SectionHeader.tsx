type SectionHeaderProps = {
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-slate-600 md:text-lg">{description}</p> : null}
    </div>
  )
}
