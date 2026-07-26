'use client'

import { useState, useEffect } from 'react'

export function usePsychMessage(messages: string[]): string {
  const [message, setMessage] = useState('')
  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)])
  }, [messages])
  return message
}

export function usePsychMessages(messages: string[], count: number): string[] {
  const [selected, setSelected] = useState<string[]>(Array.from({ length: count }, () => ''))
  useEffect(() => {
    setSelected(
      Array.from({ length: count }, () =>
        messages[Math.floor(Math.random() * messages.length)]
      )
    )
  }, [messages, count])
  return selected
}
