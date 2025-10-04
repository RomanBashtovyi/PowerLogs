'use client'

import Image from 'next/image'
import { useTranslations } from '@/hooks'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  session: any
}

export default function ProfileClient({ session }: Props) {
  const { t } = useTranslations()

  const [prSearch, setPrSearch] = useState('')
  const [prs, setPrs] = useState<any[]>([])
  const [loadingPrs, setLoadingPrs] = useState(true)
  // Training preferences (local)
  const [rpeMin, setRpeMin] = useState(6)
  const [rpeMax, setRpeMax] = useState(9)
  const [restSec, setRestSec] = useState(90)
  const [rounding, setRounding] = useState(2.5)
  const [autoTrackBase, setAutoTrackBase] = useState(true)
  // Tracking manager state
  const [trackingSearch, setTrackingSearch] = useState('')
  const [tracking, setTracking] = useState<any[]>([])
  const [loadingTracking, setLoadingTracking] =
    useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/personal-records')
        const data = await res.json()
        if (mounted) setPrs(Array.isArray(data) ? data : [])
      } catch (_) {
      } finally {
        if (mounted) setLoadingPrs(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Load prefs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('trainingPrefs')
      if (raw) {
        const p = JSON.parse(raw)
        if (typeof p.rpeMin === 'number')
          setRpeMin(p.rpeMin)
        if (typeof p.rpeMax === 'number')
          setRpeMax(p.rpeMax)
        if (typeof p.restSec === 'number')
          setRestSec(p.restSec)
        if (typeof p.rounding === 'number')
          setRounding(p.rounding)
        if (typeof p.autoTrackBase === 'boolean')
          setAutoTrackBase(p.autoTrackBase)
      }
    } catch {}
  }, [])

  // Save prefs
  useEffect(() => {
    const prefs = {
      rpeMin,
      rpeMax,
      restSec,
      rounding,
      autoTrackBase,
    }
    localStorage.setItem(
      'trainingPrefs',
      JSON.stringify(prefs)
    )
  }, [rpeMin, rpeMax, restSec, rounding, autoTrackBase])

  // Tracking list
  const loadTracking = async () => {
    try {
      setLoadingTracking(true)
      const res = await fetch('/api/user/exercise-tracking')
      const data = await res.json()
      setTracking(
        Array.isArray(data.exercises) ? data.exercises : []
      )
    } catch {
    } finally {
      setLoadingTracking(false)
    }
  }

  useEffect(() => {
    loadTracking()
  }, [])

  const filteredTracking = useMemo(() => {
    const q = trackingSearch.trim().toLowerCase()
    if (!q) return tracking
    return tracking.filter((e: any) =>
      e.name?.toLowerCase().includes(q)
    )
  }, [tracking, trackingSearch])

  const toggleTracked = async (
    exerciseId: string,
    isTracked: boolean
  ) => {
    try {
      await fetch('/api/user/exercise-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, isTracked }),
      })
      setTracking((prev) =>
        prev.map((e: any) =>
          e.id === exerciseId ? { ...e, isTracked } : e
        )
      )
    } catch {}
  }

  const filteredPrs = useMemo(() => {
    const q = prSearch.trim().toLowerCase()
    if (!q) return prs
    return prs.filter((pr) =>
      pr.exercise?.name?.toLowerCase().includes(q)
    )
  }, [prSearch, prs])

  const [name, setName] = useState<string>(
    session?.user?.name || ''
  )
  const [savingName, setSavingName] =
    useState<boolean>(false)

  const onSaveName = async () => {
    const newName = name.trim()
    if (!newName) return
    setSavingName(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      })
      if (res.ok) {
        // no-op; UI вже має нове значення, NextAuth оновиться при наступному завантаженні
      }
    } catch {
    } finally {
      setSavingName(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 pb-24 md:pb-10 safe-bottom">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        {t('profile')}
      </h1>

      {/* Account Info */}
      <section className="fitness-card p-4 md:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t('account') || 'Account'}
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent overflow-hidden flex items-center justify-center">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                width={64}
                height={64}
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border rounded px-2 py-1 bg-background text-foreground w-56"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={onSaveName}
                disabled={savingName}
              >
                {savingName
                  ? t('saving') || 'Saving…'
                  : t('save') || 'Save'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {session.user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* UI Settings */}
      <section className="fitness-card p-4 md:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t('interface') || 'Interface'}
        </h2>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </section>

      {/* Training Preferences */}
      <section className="fitness-card p-4 md:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t('trainingPreferences') ||
            'Training preferences'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              {t('rpeRange') || 'RPE range'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                value={rpeMin}
                onChange={(e) =>
                  setRpeMin(
                    Math.min(
                      Number(e.target.value) || 1,
                      rpeMax
                    )
                  )
                }
                className="w-24 md:w-20 border rounded px-3 md:px-2 py-2 md:py-1 bg-background text-foreground"
              />
              <span className="text-muted-foreground">
                —
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={rpeMax}
                onChange={(e) =>
                  setRpeMax(
                    Math.max(
                      Number(e.target.value) || 10,
                      rpeMin
                    )
                  )
                }
                className="w-24 md:w-20 border rounded px-3 md:px-2 py-2 md:py-1 bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              {t('restTimerSeconds') || 'Rest timer (sec.)'}
            </label>
            <input
              type="number"
              min={0}
              value={restSec}
              onChange={(e) =>
                setRestSec(
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              className="w-32 md:w-28 border rounded px-3 md:px-2 py-2 md:py-1 bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              {t('weightRounding') || 'Weight rounding'}
            </label>
            <select
              value={rounding}
              onChange={(e) =>
                setRounding(Number(e.target.value))
              }
              className="border rounded px-3 md:px-2 py-2 md:py-1 bg-background text-foreground"
            >
              <option value={0.5}>0.5 кг</option>
              <option value={1}>1 кг</option>
              <option value={2.5}>2.5 кг</option>
              <option value={5}>5 кг</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="autoTrackBase"
              type="checkbox"
              checked={autoTrackBase}
              onChange={(e) =>
                setAutoTrackBase(e.target.checked)
              }
              className="h-4 w-4"
            />
            <label
              htmlFor="autoTrackBase"
              className="text-sm text-foreground"
            >
              {t('autoTrackBaseExercises') ||
                'Auto‑track base exercises'}
            </label>
          </div>
        </div>
      </section>

      {/* Personal Records */}
      <section className="fitness-card p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {t('personalRecords') || 'Personal Records'}
          </h2>
          <input
            className="border px-3 py-2 rounded bg-background text-foreground"
            placeholder={
              t('searchExercise') || 'Search exercise...'
            }
            value={prSearch}
            onChange={(e) => setPrSearch(e.target.value)}
          />
        </div>

        {loadingPrs ? (
          <p className="text-sm text-muted-foreground">
            {t('loading') || 'Loading…'}
          </p>
        ) : filteredPrs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('noRecords') || 'No records'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded">
              <thead>
                <tr className="bg-accent">
                  <th className="text-left px-3 py-2 border">
                    {t('exercise') || 'Exercise'}
                  </th>
                  <th className="text-left px-3 py-2 border">
                    {t('type') || 'Type'}
                  </th>
                  <th className="text-left px-3 py-2 border">
                    {t('value') || 'Value'}
                  </th>
                  <th className="text-left px-3 py-2 border">
                    {t('date') || 'Date'}
                  </th>
                  <th className="text-left px-3 py-2 border">
                    {t('actions') || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrs.map((pr) => (
                  <tr
                    key={pr.id}
                    className="bg-background text-foreground"
                  >
                    <td className="px-3 py-2 border">
                      {pr.exercise?.name}
                    </td>
                    <td className="px-3 py-2 border">
                      {pr.recordType === 'weight'
                        ? `${t('weight')} (1RM)`
                        : t('reps')}
                    </td>
                    <td className="px-3 py-2 border">
                      {pr.recordType === 'weight' &&
                      pr.oneRepMax ? (
                        <>{Math.round(pr.oneRepMax)} kg</>
                      ) : pr.recordType === 'reps' &&
                        pr.maxReps ? (
                        <>{pr.maxReps} reps</>
                      ) : (
                        <>—</>
                      )}
                    </td>
                    <td className="px-3 py-2 border">
                      {pr.dateSet
                        ? new Date(
                            pr.dateSet
                          ).toLocaleDateString('uk-UA')
                        : ''}
                    </td>
                    <td className="px-3 py-2 border">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            (window.location.href = `/exercises/${pr.exerciseId}`)
                          }
                        >
                          {t('openExercise') ||
                            'Open exercise'}
                        </Button>
                        {/* Future: edit/delete inline */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Tracked Exercises Manager */}
      <section className="fitness-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {t('trackedExercises') || 'Tracked exercises'}
          </h2>
          <div className="flex items-center gap-2 flex-col sm:flex-row items-stretch sm:items-center">
            <input
              className="border px-3 py-2 rounded bg-background text-foreground w-full sm:w-auto"
              placeholder={
                t('searchExercise') || 'Search exercise...'
              }
              value={trackingSearch}
              onChange={(e) =>
                setTrackingSearch(e.target.value)
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={loadTracking}
              className="w-full sm:w-auto"
            >
              {t('update') || 'Update'}
            </Button>
          </div>
        </div>
        {loadingTracking ? (
          <p className="text-sm text-muted-foreground">
            {t('loading') || 'Loading…'}
          </p>
        ) : filteredTracking.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('noExercisesFound') || 'No exercises found'}
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <table className="min-w-full border rounded text-sm md:text-base">
              <thead>
                <tr className="bg-accent">
                  <th className="text-left px-3 py-2 border">
                    {t('exercise') || 'Exercise'}
                  </th>
                  <th className="text-left px-3 py-2 border">
                    {t('category') || 'Category'}
                  </th>
                  <th className="text-left px-3 py-2 border">
                    {t('actions') || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTracking.map((ex: any) => (
                  <tr
                    key={ex.id}
                    className="bg-background text-foreground"
                  >
                    <td className="px-3 py-2 border">
                      {ex.name}
                    </td>
                    <td className="px-3 py-2 border">
                      {ex.category}
                    </td>
                    <td className="px-3 py-2 border">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!ex.isTracked}
                          onChange={(e) =>
                            toggleTracked(
                              ex.id,
                              e.target.checked
                            )
                          }
                          className="h-4 w-4"
                        />
                        {ex.isTracked
                          ? t('stopTracking') ||
                            'Stop tracking'
                          : t('trackThis') || 'Track this'}
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Tips */}
      <section className="fitness-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {t('tips') || 'Tips'}
        </h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>
            {t('oneRmFormulas') ||
              '1RM: Epley / Brzycki / Lombardi'}
          </li>
          <li>
            {t('volumeDefinition') ||
              'Volume = sum of (weight × reps) per workout'}
          </li>
        </ul>
      </section>
    </div>
  )
}
