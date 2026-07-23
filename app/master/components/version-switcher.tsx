'use client'

import { cn } from '@/lib/utils'

export type MasterVersion = 'v1' | 'v2' | 'v3'

interface VersionSwitcherProps {
  version: MasterVersion
  onChange: (v: MasterVersion) => void
}

export function VersionSwitcher({ version, onChange }: VersionSwitcherProps) {
  const versions: MasterVersion[] = ['v1', 'v2', 'v3']

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 rounded-full px-1 py-1 backdrop-blur-xl bg-black/60 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {versions.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            'px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-300',
            version === v
              ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
              : 'text-white/40 hover:text-white/70'
          )}
        >
          {v.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
