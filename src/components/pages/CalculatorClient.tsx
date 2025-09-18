'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/providers'
import { useEffect } from 'react'
import { useToast, ToastContainer } from '@/components/ui/Toast'

type FormulaKey = 'epley' | 'brzycki' | 'lombardi'

function calculateOneRepMax(weight: number, reps: number, formula: FormulaKey): number {
  if (weight <= 0 || reps <= 0) return 0
  switch (formula) {
    case 'epley':
      return weight * (1 + reps / 30)
    case 'brzycki':
      return reps >= 37 ? 0 : weight * (36 / (37 - reps))
    case 'lombardi':
      return weight * Math.pow(reps, 0.1)
    default:
      return 0
  }
}

function generatePercentages(oneRepMax: number): Array<{ percent: number; weight: number }> {
  const rows: Array<{ percent: number; weight: number }> = []
  for (let p = 50; p <= 100; p += 5) {
    const w = Math.round((oneRepMax * p) / 100)
    rows.push({ percent: p, weight: w })
  }
  return rows
}

interface Props {
  session: unknown
}

export default function CalculatorClient(_props: Props) {
  const { t } = useLanguage()
  const [weight, setWeight] = useState<string>('')
  const [reps, setReps] = useState<string>('')
  const [formula, setFormula] = useState<FormulaKey>('epley')
  const [exercises, setExercises] = useState<Array<{ id: string; name: string }>>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const { toasts, showSuccess, showError, removeToast } = useToast()

  const parsedWeight = Number(weight)
  const parsedReps = Number(reps)
  const oneRepMax = useMemo(
    () => calculateOneRepMax(parsedWeight, parsedReps, formula),
    [parsedWeight, parsedReps, formula]
  )
  const rows = useMemo(() => generatePercentages(oneRepMax), [oneRepMax])

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/exercises?limit=200')
        if (!res.ok) return
        const data = await res.json()
        const list = (data.exercises || []).map((e: any) => ({ id: e.id, name: e.name }))
        if (isMounted) setExercises(list)
      } catch (_) {
        // ignore
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const onSetAsPR = async () => {
    if (!selectedExerciseId || !oneRepMax || oneRepMax <= 0) return
    setSaving(true)
    try {
      const res = await fetch('/api/personal-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: selectedExerciseId,
          recordType: 'weight',
          oneRepMax: Math.round(oneRepMax),
          unit: 'kg',
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        showError(err?.error || 'Failed to save PR')
      } else {
        showSuccess('Personal record saved')
      }
    } catch (e) {
      showError('Failed to save PR')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <h1 className="text-2xl font-semibold">1RM Calculator</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1 text-foreground">{t('weight') ?? 'Weight'}</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 bg-background text-foreground"
            min={0}
            value={weight}
            placeholder="0"
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-foreground">{t('reps') ?? 'Reps'}</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 bg-background text-foreground"
            min={1}
            value={reps}
            placeholder="0"
            onChange={(e) => setReps(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-foreground">{t('formula') ?? 'Formula'}</label>
          <select
            className="w-full border rounded px-3 py-2 bg-background text-foreground"
            value={formula}
            onChange={(e) => setFormula(e.target.value as FormulaKey)}
          >
            <option value="epley">Epley</option>
            <option value="brzycki">Brzycki</option>
            <option value="lombardi">Lombardi</option>
          </select>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground">Estimated 1RM:</span>
          <span className="text-2xl font-bold text-foreground">{Math.round(oneRepMax) || 0}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead>
              <tr className="bg-accent">
                <th className="text-left px-3 py-2 border">%</th>
                <th className="text-left px-3 py-2 border">{t('weight') ?? 'Weight'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.percent} className="bg-background text-foreground">
                  <td className="px-3 py-2 border">{r.percent}%</td>
                  <td className="px-3 py-2 border">{r.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm mb-1 text-foreground">{t('exercise') ?? 'Exercise'}</label>
          <select
            className="w-full border rounded px-3 py-2 bg-background text-foreground"
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
          >
            <option value="">{t('exercise') ?? 'Exercise'}</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="fitness"
            onClick={() => navigator.clipboard.writeText(String(Math.round(oneRepMax) || 0))}
            disabled={!oneRepMax}
          >
            {t('copy1RM') ?? 'Copy 1RM'}
          </Button>
          <Button variant="fitness" onClick={onSetAsPR} disabled={!selectedExerciseId || !oneRepMax || saving}>
            {saving ? (t('saving') ?? 'Saving…') : (t('setAsPR') ?? 'Set as PR')}
          </Button>
        </div>
      </section>
    </main>
  )
}
