'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { ExerciseCard } from '@/components/features/exercise'
import {
  Exercise,
  ExerciseCategory,
  MuscleGroup,
} from '@/types/workout'
import {
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
} from '@/constants/categories'
import { useConfirmation } from '@/hooks/useConfirmation'

export default function ExercisesClient() {
  const { t } = useTranslations()
  const pathname = usePathname()
  const {
    confirmationState,
    showConfirmation,
    hideConfirmation,
    setLoading: setConfirmationLoading,
  } = useConfirmation()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState<string>('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<string>('')

  useEffect(() => {
    fetchExercises()
  }, [selectedCategory, selectedMuscleGroup])

  // Refetch exercises when returning to the page
  useEffect(() => {
    if (pathname === '/exercises') {
      fetchExercises()
    }
  }, [pathname])

  const fetchExercises = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory)
        params.append('category', selectedCategory)
      if (selectedMuscleGroup)
        params.append('muscleGroup', selectedMuscleGroup)

      const response = await fetch(
        `/api/exercises?${params}`
      )

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

  const handleDeleteExercise = async (
    exerciseId: string
  ) => {
    const confirmed = await showConfirmation({
      title: t('confirmDelete'),
      message: t('confirmDeleteMessage'),
      confirmText: t('delete'),
      cancelText: t('cancel'),
      confirmVariant: 'destructive',
      icon: '🗑️',
    })

    if (!confirmed) return

    try {
      setConfirmationLoading(true)
      const response = await fetch(
        `/api/exercises/${exerciseId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete exercise')
      }

      setExercises(
        exercises.filter((e) => e.id !== exerciseId)
      )
    } catch (err) {
      console.error('Error deleting exercise:', err)
      // TODO: Replace with toast notification
    } finally {
      setConfirmationLoading(false)
    }
  }

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exercise.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  )

  const systemExercises = filteredExercises.filter(
    (e) => !e.isCustom
  )
  const customExercises = filteredExercises.filter(
    (e) => e.isCustom
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {t('loading')}
              </p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('exerciseLibrary')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredExercises.length}{' '}
              {t('exercisesAvailable')}
            </p>
          </div>

          <Link href="/exercises/new">
            <Button className="w-full sm:w-auto">
              ➕ {t('addCustomExercise')}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder={`${t('search')} exercises...`}
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category and Muscle Group Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('category')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">
                  {t('allCategories')}
                </option>
                {Object.entries(EXERCISE_CATEGORIES).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('muscleGroups')}
              </label>
              <select
                value={selectedMuscleGroup}
                onChange={(e) =>
                  setSelectedMuscleGroup(e.target.value)
                }
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">
                  {t('allMuscleGroups')}
                </option>
                {Object.entries(MUSCLE_GROUPS).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory ||
            selectedMuscleGroup ||
            searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('')
                setSelectedMuscleGroup('')
                setSearchQuery('')
              }}
            >
              {t('clearFilters')}
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchExercises}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Results */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ||
              selectedCategory ||
              selectedMuscleGroup
                ? t('noExercisesFound')
                : 'No exercises available'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ||
              selectedCategory ||
              selectedMuscleGroup
                ? t('adjustSearchFilters')
                : t('startByAddingFirst')}
            </p>
            <Link href="/exercises/new">
              <Button>➕ {t('addCustomExercise')}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* System Exercises */}
            {systemExercises.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t('builtInExercises')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Custom Exercises */}
            {customExercises.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t('customExercises')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onDelete={() =>
                        handleDeleteExercise(exercise.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        confirmVariant={confirmationState.confirmVariant}
        icon={confirmationState.icon}
        loading={confirmationState.loading}
      />
    </div>
  )
}
