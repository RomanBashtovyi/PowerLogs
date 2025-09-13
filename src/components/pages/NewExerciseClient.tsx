'use client'

import { useLanguage } from '@/components/providers'
import { ExerciseForm } from '@/components/features/exercise'

export default function NewExerciseClient() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('createExercise')}</h1>
          <p className="text-muted-foreground mt-2">{t('addCustomExercise')}</p>
        </div>

        {/* Form */}
        <ExerciseForm />
      </div>
    </div>
  )
}
