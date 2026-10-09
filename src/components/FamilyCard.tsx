import type { FamilyMember } from '../data/weddingConfig'

type FamilyCardProps = {
  member: FamilyMember
}

export function FamilyCard({ member }: FamilyCardProps) {
  return (
    <article className="rounded-[2rem] border border-rose-100 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="overflow-hidden rounded-[1.5rem]">
        <img src={member.image} alt={member.name} loading="lazy" decoding="async" className="h-72 w-full object-cover transition duration-500 hover:scale-105" />
      </div>
      <div className="mt-5">
        <h3 className="text-2xl font-medium text-slate-900">{member.name}</h3>
        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-rose-500">{member.relation}</p>
        <p className="mt-4 text-sm leading-6 text-slate-600">“{member.message}”</p>
      </div>
    </article>
  )
}
