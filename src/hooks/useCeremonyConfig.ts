import { useEffect, useMemo, useState } from 'react'

import { ceremonies, type CeremonyDefinition } from '../data/ceremonies'

const storageKey = 'wedding-os:ceremonies:v1'
const editableFields = [
  'name',
  'tagline',
  'date',
  'startsAt',
  'time',
  'venue',
  'description',
  'dressCode',
  'primaryColor',
  'secondaryColor',
  'heroImage',
] as const

type EditableField = (typeof editableFields)[number]
export type CeremonyUpdate = Partial<Omit<Pick<CeremonyDefinition, EditableField>, 'heroImage'>> & {
  heroImage?: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isSafeImageUrl = (value: unknown) =>
  typeof value === 'string' && (value.startsWith('/') || /^https:\/\//i.test(value))

const isValidColor = (value: unknown) =>
  typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)

const isStoredCeremonies = (value: unknown): value is Record<string, Partial<Record<EditableField, unknown>>> => {
  if (!isRecord(value)) return false
  return ceremonies.every((ceremony) => {
    const candidate = value[ceremony.id]
    if (candidate === undefined) return true
    if (!isRecord(candidate)) return false

    return editableFields.every((field) => {
      const fieldValue = candidate[field]
      if (fieldValue === undefined) return true
      if (field === 'primaryColor' || field === 'secondaryColor') return isValidColor(fieldValue)
      if (field === 'heroImage') return isSafeImageUrl(fieldValue)
      if (field === 'startsAt') return typeof fieldValue === 'string' && !Number.isNaN(new Date(fieldValue).getTime())
      return typeof fieldValue === 'string'
    })
  })
}

const readSavedCeremonies = () => {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return {} as Record<string, CeremonyUpdate>
    const parsed: unknown = JSON.parse(stored)
    return isStoredCeremonies(parsed) ? parsed as Record<string, CeremonyUpdate> : {}
  } catch (error) {
    console.warn('Ceremony customizations could not be restored.', error)
    return {} as Record<string, CeremonyUpdate>
  }
}

export function useCeremonyConfig() {
  const [overrides, setOverrides] = useState<Record<string, CeremonyUpdate>>(readSavedCeremonies)
  const configuredCeremonies = useMemo(
    () => ceremonies.map((ceremony) => ({
      ...ceremony,
      ...overrides[ceremony.id],
      heroImage: {
        ...ceremony.heroImage,
        ...(overrides[ceremony.id]?.heroImage ? { src: overrides[ceremony.id]?.heroImage } : {}),
      },
    })),
    [overrides],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(overrides))
    } catch (error) {
      console.warn('Ceremony customizations could not be saved.', error)
    }
  }, [overrides])

  const updateCeremony = (id: CeremonyDefinition['id'], update: CeremonyUpdate) => {
    setOverrides((current) => ({ ...current, [id]: { ...current[id], ...update } }))
  }

  const resetCeremonies = () => setOverrides({})

  return { ceremonies: configuredCeremonies, updateCeremony, resetCeremonies }
}
