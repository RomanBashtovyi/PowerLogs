'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Exercise } from '@/types/workout'
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS } from '@/constants/categories'
import { getTranslatedExercise } from '@/lib/translations'

interface ExerciseWithTracking extends Exercise {
  isTracked: boolean
}

export default function ProgressTrackingClient() {
  const { t, language } = useLanguage()
  const [exercises, setExercises] = useState<ExerciseWithTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showTrackedOnly, setShowTrackedOnly] = useState(false)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/exercise-tracking')

      if (!response.ok) {
        throw new Error('Failed to fetch exercises')
      }

      const data = await response.json()
      setExercises(data.exercises || [])
    } catch (err) {
      setError('Failed to load exercises')
      console.error('Error fetching exercises:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTracking = async (exerciseId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/user/exercise-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          isTracked: !currentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update tracking')
      }

      // Update local state
      setExercises((prev) =>
        prev.map((exercise) => (exercise.id === exerciseId ? { ...exercise, isTracked: !currentStatus } : exercise))
      )
    } catch (err) {
      console.error('Error updating tracking:', err)
      // TODO: Show toast error
    }
  }

  const handleAutoSetup = async () => {
    try {
      const response = await fetch('/api/user/exercise-tracking', {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Failed to auto-setup tracking')
      }

      // Refresh exercises
      fetchExercises()
      // TODO: Show success toast
    } catch (err) {
      console.error('Error auto-setting up tracking:', err)
      // TODO: Show error toast
    }
  }

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || exercise.category === selectedCategory

    const matchesTracking = !showTrackedOnly || exercise.isTracked

    return matchesSearch && matchesCategory && matchesTracking
  })

  const trackedCount = exercises.filter((e) => e.isTracked).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('progressTracking')}</h1>
            <p className="text-muted-foreground mt-1">
              {trackedCount} {t('trackedExercises')} • {filteredExercises.length} shown
            </p>
          </div>

          <Button onClick={handleAutoSetup} variant="outline">
            ⚡ {t('autoTrackingSetup')}
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder={`${t('search')} exercises...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('category')}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">{t('allCategories')}</option>
                {Object.entries(EXERCISE_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrackedOnly}
                  onChange={(e) => setShowTrackedOnly(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="text-sm font-medium">{t('trackedExercises')} only</span>
              </label>
            </div>

            <div className="flex items-end">
              {(selectedCategory || searchQuery || showTrackedOnly) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('')
                    setSearchQuery('')
                    setShowTrackedOnly(false)
                  }}
                >
                  {t('clearFilters')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchExercises} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {/* Exercise List */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No exercises found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters or add exercises to your library.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExercises.map((exercise) => {
              const translatedExercise = !exercise.isCustom
                ? getTranslatedExercise(exercise.name, language)
                : { name: exercise.name, description: exercise.description }

              return (
                <div key={exercise.id} className="fitness-card p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{translatedExercise.name}</h3>
                      {exercise.isCustom && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Custom</span>
                      )}
                      {exercise.isTrackedByDefault && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Base</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {EXERCISE_CATEGORIES[exercise.category as keyof typeof EXERCISE_CATEGORIES] ||
                          exercise.category}
                      </span>
                      {exercise.equipment && <span>• {exercise.equipment}</span>}
                    </div>
                  </div>

                  <Button
                    variant={exercise.isTracked ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleTracking(exercise.id, exercise.isTracked)}
                  >
                    {exercise.isTracked ? '✓ Tracking' : '+ Track'}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
