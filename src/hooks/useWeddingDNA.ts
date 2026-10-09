import { useEffect, useState } from 'react'

import { defaultWeddingDNA, type WeddingDNAConfig } from '../data/weddingDNA'

const storageKey = 'wedding-os:dna:v1'
const optionValues = {
  relationship: ['romantic', 'playful', 'traditional', 'modern', 'adventurous', 'minimal'],
  celebration: ['royal', 'cozy', 'bollywood', 'traditional', 'modern', 'destination'],
  palette: ['marigold', 'sage', 'rose', 'midnight', 'terracotta'],
  music: ['sufi', 'classical', 'bollywood', 'indie', 'folk'],
  lighting: ['daylight', 'golden-hour', 'after-dark'],
} satisfies Record<keyof WeddingDNAConfig, readonly string[]>

const dnaKeys: (keyof WeddingDNAConfig)[] = ['relationship', 'celebration', 'palette', 'music', 'lighting']

const isWeddingDNAConfig = (value: unknown): value is WeddingDNAConfig => {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<Record<keyof WeddingDNAConfig, unknown>>

  return dnaKeys.every((key) => {
    const selected = candidate[key]
    return typeof selected === 'string' && optionValues[key].includes(selected)
  })
}

export function useWeddingDNA() {
  const [dna, setDNA] = useState<WeddingDNAConfig>(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (!stored) return defaultWeddingDNA

      const parsed: unknown = JSON.parse(stored)
      return isWeddingDNAConfig(parsed) ? parsed : defaultWeddingDNA
    } catch (error) {
      console.warn('Wedding DNA preferences could not be restored.', error)
      return defaultWeddingDNA
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(dna))
    } catch (error) {
      console.warn('Wedding DNA preferences could not be saved.', error)
    }
  }, [dna])

  return { dna, setDNA }
}
