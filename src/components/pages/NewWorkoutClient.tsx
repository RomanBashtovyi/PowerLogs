'use client'

import { useLanguage } from '@/components/providers'
import { WorkoutForm } from '@/components/features/workout'

export default function NewWorkoutClient() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('createWorkout')}</h1>
          <p className="text-muted-foreground mt-2">Create a new workout to track your fitness progress</p>
        </div>

        {/* Form */}
        <WorkoutForm />
      </div>
    </div>
  )
}
