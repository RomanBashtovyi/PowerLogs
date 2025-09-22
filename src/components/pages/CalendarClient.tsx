'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/providers'

interface Props {
  session: any
}

export default function CalendarClient(_props: Props) {
  const { t } = useLanguage()
  const [current, setCurrent] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() } // 0-indexed month
  })
  const [workoutCounts, setWorkoutCounts] = useState<Record<string, number>>({})
  const [workoutsByDate, setWorkoutsByDate] = useState<Record<string, any[]>>({})
  const [modalDate, setModalDate] = useState<string | null>(null)

  const firstDayOfMonth = useMemo(() => new Date(current.year, current.month, 1), [current])
  const daysInMonth = useMemo(() => new Date(current.year, current.month + 1, 0).getDate(), [current])
  const startWeekday = useMemo(() => (firstDayOfMonth.getDay() + 6) % 7, [firstDayOfMonth]) // Mon=0

  const monthLabel = useMemo(
    () => new Date(current.year, current.month, 1).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long' }),
    [current]
  )

  useEffect(() => {
    ;(async () => {
      const since = new Date(current.year, current.month, 1).toISOString()
      const until = new Date(current.year, current.month + 1, 0).toISOString()
      // Reuse workouts API; fetch a large page and count per day on client
      const res = await fetch(`/api/workouts?limit=200&offset=0`)
      const data = await res.json()
      const counts: Record<string, number> = {}
      const byDate: Record<string, any[]> = {}
      for (const w of data.workouts || []) {
        const d = new Date(w.date)
        if (d.toISOString() >= since && d.toISOString() <= until) {
          const key = d.toISOString().split('T')[0]
          counts[key] = (counts[key] || 0) + 1
          ;(byDate[key] ||= []).push(w)
        }
      }
      setWorkoutCounts(counts)
      setWorkoutsByDate(byDate)
    })()
  }, [current])

  const prevMonth = () => {
    const m = current.month === 0 ? 11 : current.month - 1
    const y = current.month === 0 ? current.year - 1 : current.year
    setCurrent({ year: y, month: m })
  }
  const nextMonth = () => {
    const m = current.month === 11 ? 0 : current.month + 1
    const y = current.month === 11 ? current.year + 1 : current.year
    setCurrent({ year: y, month: m })
  }

  const days: Array<{ day: number; dateStr: string } | null> = []
  for (let i = 0; i < startWeekday; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(current.year, current.month, d)
    days.push({ day: d, dateStr: date.toISOString().split('T')[0] })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="px-3 py-2 rounded hover:bg-accent">
          ←
        </button>
        <h1 className="text-xl font-semibold text-foreground">{monthLabel}</h1>
        <button onClick={nextMonth} className="px-3 py-2 rounded hover:bg-accent">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((wd) => (
          <div key={wd} className="text-center text-xs text-muted-foreground">
            {wd}
          </div>
        ))}
        {days.map((info, idx) => (
          <div key={idx} className="border rounded min-h-[72px] p-2 bg-background">
            {info && (
              <div className="flex flex-col h-full justify-between">
                <div className="text-sm text-foreground">{info.day}</div>
                <div className="text-right">
                  {workoutCounts[info.dateStr] ? (
                    <button
                      onClick={() => setModalDate(info.dateStr)}
                      className="inline-block text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
                    >
                      {workoutCounts[info.dateStr]}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg w-full max-w-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">{modalDate}</h2>
              <button className="px-2 py-1 text-sm hover:bg-accent rounded" onClick={() => setModalDate(null)}>
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-auto">
              {(workoutsByDate[modalDate] || []).map((w) => {
                return (
                  <div key={w.id} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">{w.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(w.date).toLocaleTimeString('uk-UA')}
                          {w.duration ? ` • ${w.duration} хв` : ''}
                        </p>
                      </div>
                      <Link className="text-primary text-sm hover:underline" href={`/workouts/${w.id}`}>
                        Відкрити
                      </Link>
                    </div>

                    {Array.isArray(w.exercises) && w.exercises.length > 0 && (
                      <div className="mt-2 rounded bg-accent/20">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-muted-foreground">
                              <th className="text-left px-2 py-1">Вправа</th>
                              <th className="text-right px-2 py-1">Підх.</th>
                              <th className="text-right px-2 py-1">Повт.</th>
                              <th className="text-right px-2 py-1">Макс кг</th>
                            </tr>
                          </thead>
                          <tbody>
                            {w.exercises.map((we: any) => {
                              const sets = Array.isArray(we.sets) ? we.sets : []
                              const totalSets = sets.length
                              const totalReps = sets.reduce((s: number, it: any) => s + (it.reps || 0), 0)
                              const maxKg = sets.reduce((m: number, it: any) => Math.max(m, it.weight || 0), 0)
                              return (
                                <tr key={we.id} className="border-t border-border">
                                  <td className="px-2 py-1 text-foreground">{we.exercise?.name || '-'}</td>
                                  <td className="px-2 py-1 text-right">{totalSets}</td>
                                  <td className="px-2 py-1 text-right">{totalReps}</td>
                                  <td className="px-2 py-1 text-right">{maxKg ? Math.round(maxKg) : '—'}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {w.notes && <p className="text-xs text-muted-foreground mt-2">Нотатки: {w.notes}</p>}
                  </div>
                )
              })}
              {(!workoutsByDate[modalDate] || workoutsByDate[modalDate].length === 0) && (
                <p className="text-sm text-muted-foreground">Немає тренувань</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
