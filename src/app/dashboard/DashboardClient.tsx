'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Session } from 'next-auth'

interface DashboardClientProps {
  session: Session
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('welcomeBack')}, {session.user?.name || session.user?.email}!
          </h1>
          <p className="text-muted-foreground mt-2">{t('trackFitness')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Quick Stats */}
          <div className="fitness-card p-4 md:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('quickStats')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm md:text-base">{t('totalWorkouts')}:</span>
                <span className="font-medium text-lg">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm md:text-base">{t('thisWeek')}:</span>
                <span className="font-medium text-lg">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm md:text-base">{t('customExercises')}:</span>
                <span className="font-medium text-lg">0</span>
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
            <div className="text-muted-foreground text-center py-8">
              {t('noRecentWorkouts')}
              <br />
              <Link href="/workouts/new" className="text-primary hover:underline mt-2 inline-block">
                {t('startFirstWorkout')}
              </Link>
            </div>
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
