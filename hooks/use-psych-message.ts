'use client'

import { useId } from 'react'

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash
}

function pick(messages: string[], seed: number): string {
  if (messages.length === 0) return ''
  return messages[seed % messages.length]
}

export function usePsychMessage(messages: string[]): string {
  const seed = useId()
  return pick(messages, hashSeed(seed))
}

export function usePsychMessages(messages: string[], count: number): string[] {
  const seed = useId()
  const base = hashSeed(seed)
  return Array.from({ length: count }, (_, i) => pick(messages, base + i * 7))
}
