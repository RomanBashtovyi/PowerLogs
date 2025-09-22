'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from './button'

interface RestTimerProps {
  initialSeconds?: number
  onComplete?: () => void
  className?: string
}

export default function RestTimer({ initialSeconds = 90, onComplete, className = '' }: RestTimerProps) {
  const [seconds, setSeconds] = useState<number>(initialSeconds)
  const [running, setRunning] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear()
          onComplete?.()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clear()
  }, [running])

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const toggle = () => setRunning((r) => !r)
  const reset = (val?: number) => {
    clear()
    setRunning(false)
    setSeconds(typeof val === 'number' ? val : initialSeconds)
  }

  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60
  const label = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono text-lg text-foreground tabular-nums">{label}</span>
      <Button size="sm" variant="fitness" onClick={toggle}>
        {running ? 'Pause' : 'Start'}
      </Button>
      <Button size="sm" variant="outline" onClick={() => reset()}>
        Reset
      </Button>
      <div className="flex items-center gap-1">
        {[60, 90, 120].map((p) => (
          <Button key={p} size="sm" variant="ghost" onClick={() => reset(p)}>
            {Math.round(p / 60)}m
          </Button>
        ))}
      </div>
    </div>
  )
}
