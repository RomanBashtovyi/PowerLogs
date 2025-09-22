'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers'
import { DashboardClientProps } from '@/types/components'

export default function DashboardClient({ session }: DashboardClientProps) {
  const { t } = useLanguage()
  const [stats, setStats] = useState({ total: 0, week: 0, customExercises: 0 })
  const [recent, setRecent] = useState<any[]>([])
  const [prCount, setPrCount] = useState(0)
  const [prList, setPrList] = useState<any[]>([])
  const [showAllPRs, setShowAllPRs] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [allRes, weekRes, customRes, prRes] = await Promise.all([
          fetch('/api/workouts?limit=1'),
          fetch('/api/workouts?limit=1&timeframeDays=7'),
          fetch('/api/exercises?limit=1&onlyCustom=true'),
          fetch('/api/personal-records'),
        ])
        const [allJson, weekJson, customJson, prJson] = await Promise.all([
          allRes.json(),
          weekRes.json(),
          customRes.json(),
          prRes.json(),
        ])
        const total = allJson?.pagination?.total || 0
        const week = weekJson?.pagination?.total || 0
        const customExercises = customJson?.pagination?.total || customJson?.exercises?.length || 0
        const recentWorkouts = allJson?.workouts?.slice(0, 3) || []
        const prs = Array.isArray(prJson) ? prJson : []
        if (mounted) {
          setStats({ total, week, customExercises })
          setRecent(recentWorkouts)
          setPrCount(prs.length)
          setPrList(prs)
        }
      } catch (_) {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('welcomeBack')}, {session.user?.name || session.user?.email}!
          </h1>
          <p className="text-muted-foreground mt-2">{t('trackFitness')}</p>
        </div>

        {/* Top Quick Action Icon Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Link
            href="/workouts/new"
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-2xl">🏋️</span>
            <span className="text-sm md:text-base font-medium text-foreground">{t('startNewWorkout')}</span>
          </Link>
          <Link
            href="/exercises/new"
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-2xl">➕</span>
            <span className="text-sm md:text-base font-medium text-foreground">{t('createExercise')}</span>
          </Link>
          <Link href="/templates" className="flex items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors">
            <span className="text-2xl">📋</span>
            <span className="text-sm md:text-base font-medium text-foreground">{t('templates')}</span>
          </Link>
          <Link
            href="/dashboard/calculator"
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-2xl">🧮</span>
            <span className="text-sm md:text-base font-medium text-foreground">1RM Calculator</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Quick Stats */}
          <div className="fitness-card p-4 md:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('quickStats')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm md:text-base">{t('totalWorkouts')}:</span>
                <span className="font-medium text-lg">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm md:text-base">{t('thisWeek')}:</span>
                <span className="font-medium text-lg">{stats.week}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm md:text-base">{t('customExercises')}:</span>
                <span className="font-medium text-lg">{stats.customExercises}</span>
              </div>
            </div>
          </div>

          {/* PR Stats */}
          <div className="fitness-card p-4 md:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('personalRecord')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm md:text-base">PRs:</span>
                <span className="font-medium text-lg">{prCount}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Останні:</p>
                {prList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('noPRSet')}</p>
                ) : (
                  <>
                    <ul className="text-sm space-y-1">
                      {(showAllPRs ? prList : prList.slice(0, 3)).map((pr) => (
                        <li key={pr.id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-foreground font-medium truncate">{pr.exercise?.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {pr.dateSet ? new Date(pr.dateSet).toLocaleDateString('uk-UA') : ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            {pr.recordType === 'weight' && pr.oneRepMax ? (
                              <span className="text-muted-foreground">{Math.round(pr.oneRepMax)} kg</span>
                            ) : pr.recordType === 'reps' && pr.maxReps ? (
                              <span className="text-muted-foreground">{pr.maxReps} reps</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {prList.length > 3 && (
                      <div className="pt-2">
                        <button
                          className="text-primary text-sm hover:underline"
                          onClick={() => setShowAllPRs((v) => !v)}
                        >
                          {showAllPRs ? 'Сховати' : 'Показати всі'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="pt-2">
                <Link href="/exercises" className="text-primary text-sm hover:underline">
                  {t('exerciseLibrary')}
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="fitness-card p-4 md:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('quickActions')}</h3>
            <div className="space-y-3">
              <Link
                href="/workouts/new"
                className="block w-full bg-primary text-primary-foreground text-center py-3 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                🏋️ {t('startNewWorkout')}
              </Link>
              <Link
                href="/workouts"
                className="block w-full bg-secondary text-secondary-foreground text-center py-3 px-4 rounded-md hover:bg-secondary/80 transition-colors"
              >
                📊 {t('viewAllWorkouts')}
              </Link>
              <Link
                href="/exercises"
                className="block w-full bg-secondary text-secondary-foreground text-center py-3 px-4 rounded-md hover:bg-secondary/80 transition-colors"
              >
                💪 {t('exerciseLibrary')}
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="fitness-card p-4 md:p-6 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('recentActivity')}</h3>
            {recent.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                {t('noRecentWorkouts')}
                <br />
                <Link href="/workouts/new" className="text-primary hover:underline mt-2 inline-block">
                  {t('startFirstWorkout')}
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {recent.map((w) => (
                  <li key={w.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(w.date).toLocaleDateString('uk-UA')}</p>
                    </div>
                    <Link href={`/workouts/${w.id}`} className="text-primary text-sm hover:underline">
                      Відкрити
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Navigation Grid - Mobile-first design */}
        <div className="mt-8 fitness-card p-4 md:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('navigation')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Link
              href="/workouts"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl md:text-3xl">🏋️</span>
              </div>
              <span className="text-sm md:text-base font-medium text-foreground text-center">{t('workouts')}</span>
            </Link>

            <Link
              href="/exercises"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
                <span className="text-2xl md:text-3xl">💪</span>
              </div>
              <span className="text-sm md:text-base font-medium text-foreground text-center">{t('exercises')}</span>
            </Link>

            <Link
              href="/templates"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                <span className="text-2xl md:text-3xl">📋</span>
              </div>
              <span className="text-sm md:text-base font-medium text-foreground text-center">{t('templates')}</span>
            </Link>

            <Link
              href="/profile"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-500/20 transition-colors">
                <span className="text-2xl md:text-3xl">👤</span>
              </div>
              <span className="text-sm md:text-base font-medium text-foreground text-center">{t('profile')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile-specific quick start section */}
        <div className="md:hidden mt-6 fitness-card p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">🚀 Швидкий старт</h3>
          <div className="space-y-3">
            <Link
              href="/workouts/new"
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-4 px-4 rounded-lg font-semibold text-lg shadow-lg"
            >
              🏋️ Почати тренування зараз
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
