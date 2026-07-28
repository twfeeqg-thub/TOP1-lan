'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { getRandomMessage, examHoverMessages } from '@/lib/psych-support'

interface SmartTooltipProps {
  children: ReactNode
  message?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function SmartTooltip({ children, message, position = 'top' }: SmartTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipText, setTooltipText] = useState('')

  const handleShow = () => {
    if (!tooltipText) {
      setTooltipText(message ?? getRandomMessage(examHoverMessages))
    }
    setIsVisible(true)
  }

  const positionClasses: Record<string, string> = {
    top: '-top-2 right-1/2 translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 right-1/2 translate-x-1/2 translate-y-full',
    left: 'top-1/2 -left-2 -translate-x-full -translate-y-1/2',
    right: 'top-1/2 -right-2 translate-x-full -translate-y-1/2',
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleShow}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={handleShow}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && tooltipText && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`absolute ${positionClasses[position]} pointer-events-none z-50`}
            style={{ minWidth: '180px' }}
          >
            <div
              className="whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md text-center"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {tooltipText}
              <div
                className="absolute -bottom-1 right-1/2 translate-x-1/2 rotate-45 w-2 h-2"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderRight: '1px solid var(--card-border)',
                  borderBottom: '1px solid var(--card-border)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
