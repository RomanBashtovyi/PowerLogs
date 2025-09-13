'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { ExerciseCard } from '@/components/features/exercise'
import { Exercise, ExerciseCategory, MuscleGroup } from '@/types/workout'
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS } from '@/constants/categories'

interface ExerciseSelectorProps {
  onSelectExercise: (exercise: Exercise) => void
  onClose: () => void
  selectedExercises?: string[] // IDs of already selected exercises
}

export default function ExerciseSelector({ onSelectExercise, onClose, selectedExercises = [] }: ExerciseSelectorProps) {
  const { t } = useLanguage()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('')

  useEffect(() => {
    fetchExercises()
  }, [selectedCategory, selectedMuscleGroup])

  const fetchExercises = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedMuscleGroup) params.append('muscleGroup', selectedMuscleGroup)

      const response = await fetch(`/api/exercises?${params}`)

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

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise)
    onClose()
  }

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter out already selected exercises
  const availableExercises = filteredExercises.filter((exercise) => !selectedExercises.includes(exercise.id))

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('loading')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{t('selectExercise')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border space-y-4">
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

          {/* Category and Muscle Group Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('muscleGroups')}</label>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">{t('allMuscleGroups')}</option>
                {Object.entries(MUSCLE_GROUPS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedMuscleGroup || searchQuery) && (
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

        {/* Exercise List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchExercises} className="mt-2">
                Try Again
              </Button>
            </div>
          )}

          {availableExercises.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {filteredExercises.length === 0 ? t('noExercisesFound') : 'All exercises already added'}
              </h3>
              <p className="text-muted-foreground">
                {filteredExercises.length === 0
                  ? t('adjustSearchFilters')
                  : 'Try adjusting your search filters or add more exercises to your library.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={() => handleSelectExercise(exercise)}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
