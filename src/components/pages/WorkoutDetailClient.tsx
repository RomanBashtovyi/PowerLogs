'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import {
  WorkoutForm,
  ExerciseSelector,
  SetForm,
} from '@/components/features/workout'
import {
  ExerciseCard,
  PersonalRecordManager,
} from '@/components/features/exercise'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import InputModal from '@/components/ui/InputModal'
import {
  ToastContainer,
  useToast,
} from '@/components/ui/Toast'
import {
  Workout,
  Exercise,
  WorkoutExercise,
  Set,
  PersonalRecord,
} from '@/types/workout'
import { getTranslatedExercise } from '@/lib/translations'
import { useConfirmation } from '@/hooks/useConfirmation'
import { formatWeightDisplay } from '@/utils/percentage-calculations'

interface WorkoutDetailClientProps {
  workoutId: string
}

export default function WorkoutDetailClient({
  workoutId,
}: WorkoutDetailClientProps) {
  const { t } = useTranslations()
  const language = 'uk'
  const router = useRouter()
  const { toasts, removeToast, showSuccess, showError } =
    useToast()
  const {
    confirmationState,
    showConfirmation,
    hideConfirmation,
    setLoading: setConfirmationLoading,
  } = useConfirmation()
  const [workout, setWorkout] = useState<Workout | null>(
    null
  )
  const [workoutExercises, setWorkoutExercises] = useState<
    WorkoutExercise[]
  >([])
  const [loading, setLoading] = useState(true)
  const [exercisesLoading, setExercisesLoading] =
    useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showExerciseSelector, setShowExerciseSelector] =
    useState(false)
  const [showSetForm, setShowSetForm] = useState(false)
  const [editingSet, setEditingSet] = useState<{
    exerciseId: string
    set?: Set
  } | null>(null)
  const [setFormLoading, setSetFormLoading] =
    useState(false)
  const [showTemplateModal, setShowTemplateModal] =
    useState(false)
  const [templateSaving, setTemplateSaving] =
    useState(false)
  const [personalRecords, setPersonalRecords] = useState<
    Record<string, PersonalRecord>
  >({})

  useEffect(() => {
    fetchWorkout()
    fetchWorkoutExercises()
    fetchPersonalRecords()
  }, [workoutId])

  const fetchWorkout = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/workouts/${workoutId}`
      )

      if (!response.ok) {
        if (response.status === 404) {
          setError('Тренування не знайдено')
          return
        }
        throw new Error('Failed to fetch workout')
      }

      const data = await response.json()
      setWorkout(data)
    } catch (err) {
      setError('Failed to load workout')
      console.error('Error fetching workout:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkoutExercises = async () => {
    try {
      setExercisesLoading(true)
      const response = await fetch(
        `/api/workouts/${workoutId}/exercises`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch workout exercises')
      }

      const data = await response.json()
      setWorkoutExercises(data.exercises || [])
    } catch (err) {
      console.error(
        'Error fetching workout exercises:',
        err
      )
    } finally {
      setExercisesLoading(false)
    }
  }

  const fetchPersonalRecords = async () => {
    try {
      const response = await fetch('/api/personal-records')

      if (response.ok) {
        const records = await response.json()
        const recordsMap: Record<string, PersonalRecord> =
          {}
        records.forEach((record: PersonalRecord) => {
          recordsMap[record.exerciseId] = record
        })
        setPersonalRecords(recordsMap)
      }
    } catch (error) {
      console.error(
        'Error fetching personal records:',
        error
      )
    }
  }

  const handleAddExercise = async (exercise: Exercise) => {
    try {
      const nextOrder = workoutExercises.length
      const response = await fetch(
        `/api/workouts/${workoutId}/exercises`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseId: exercise.id,
            order: nextOrder,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add exercise to workout')
      }

      // Refresh exercises list
      fetchWorkoutExercises()
    } catch (err) {
      console.error(
        'Error adding exercise to workout:',
        err
      )
      // TODO: Replace with toast notification
    }
  }

  const handleRemoveExercise = async (
    workoutExerciseId: string
  ) => {
    const confirmed = await showConfirmation({
      title: t('confirmDeleteExercise'),
      message: t('confirmDeleteExerciseMessage'),
      confirmText: t('delete'),
      cancelText: t('cancel'),
      confirmVariant: 'destructive',
      icon: '🗑️',
    })

    if (!confirmed) return

    try {
      setConfirmationLoading(true)
      const response = await fetch(
        `/api/workouts/${workoutId}/exercises/${workoutExerciseId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to remove exercise from workout'
        )
      }

      // Refresh exercises list
      fetchWorkoutExercises()
    } catch (err) {
      console.error(
        'Error removing exercise from workout:',
        err
      )
      // Could add a toast notification here instead of alert
    } finally {
      setConfirmationLoading(false)
    }
  }

  const handleEdit = async (formData: any) => {
    try {
      const response = await fetch(
        `/api/workouts/${workoutId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update workout')
      }

      const updatedWorkout = await response.json()
      setWorkout(updatedWorkout)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating workout:', err)
      throw err
    }
  }

  const handleDelete = async () => {
    const confirmed = await showConfirmation({
      title: t('confirmDeleteWorkout'),
      message: t('confirmDeleteWorkoutMessage'),
      confirmText: t('delete'),
      cancelText: t('cancel'),
      confirmVariant: 'destructive',
      icon: '🗑️',
    })

    if (!confirmed) return

    try {
      setIsDeleting(true)
      setConfirmationLoading(true)
      const response = await fetch(
        `/api/workouts/${workoutId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete workout')
      }

      router.push('/workouts')
    } catch (err) {
      console.error('Error deleting workout:', err)
      // Could add a toast notification here instead of alert
    } finally {
      setIsDeleting(false)
      setConfirmationLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    const locale = uk
    return format(date, 'EEEE, MMMM dd, yyyy', { locale })
  }

  const formatDuration = (minutes?: number | null) => {
    if (!minutes) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  // Set management functions
  const handleAddSet = (exerciseId: string) => {
    setEditingSet({ exerciseId })
    setShowSetForm(true)
  }

  const handleEditSet = (exerciseId: string, set: Set) => {
    setEditingSet({ exerciseId, set })
    setShowSetForm(true)
  }

  const handleDeleteSet = async (
    exerciseId: string,
    setId: string
  ) => {
    try {
      const response = await fetch(
        `/api/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete set')
      }

      // Refresh workout exercises to get updated sets
      await fetchWorkoutExercises()
      showSuccess('Set deleted successfully')
    } catch (err) {
      console.error('Error deleting set:', err)
      showError('Failed to delete set')
    }
  }

  const handleSetSubmit = async (
    setData: Omit<
      Set,
      'id' | 'workoutExerciseId' | 'order'
    > & { numSets?: number }
  ) => {
    if (!editingSet) return

    try {
      setSetFormLoading(true)
      const { exerciseId, set } = editingSet

      if (set) {
        // Update existing set
        const { numSets, ...updateData } = setData
        const response = await fetch(
          `/api/workouts/${workoutId}/exercises/${exerciseId}/sets/${set.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || 'Failed to update set'
          )
        }
      } else {
        // Create new set(s)
        const { numSets = 1, ...createData } = setData

        // Create multiple sets if numSets > 1
        const promises = []
        for (let i = 0; i < numSets; i++) {
          promises.push(
            fetch(
              `/api/workouts/${workoutId}/exercises/${exerciseId}/sets`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(createData),
              }
            )
          )
        }

        const responses = await Promise.all(promises)

        for (const response of responses) {
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
              errorData.error ||
                'Не вдалося створити підхід'
            )
          }
        }
      }

      // Refresh workout exercises to get updated sets
      await fetchWorkoutExercises()
      handleSetFormClose()

      if (set) {
        showSuccess('Підхід успішно оновлено')
      } else {
        const { numSets = 1 } = setData
        showSuccess(
          `${numSets} підхід${numSets > 1 ? 'ів' : ''} успішно додано`
        )
      }
    } catch (err) {
      console.error('Error saving set:', err)
      showError(
        err instanceof Error
          ? err.message
          : 'Failed to save set'
      )
    } finally {
      setSetFormLoading(false)
    }
  }

  const handleSetFormClose = () => {
    setShowSetForm(false)
    setEditingSet(null)
  }

  // Template management functions
  const handleSaveAsTemplate = () => {
    if (!workout) return
    setShowTemplateModal(true)
  }

  const handleConfirmSaveAsTemplate = async (
    templateName: string
  ) => {
    if (!workout) return

    try {
      setTemplateSaving(true)
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId: workout.id,
          name: templateName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || 'Не вдалося створити шаблон'
        )
      }

      setShowTemplateModal(false)
      showSuccess('Шаблон успішно створено')
    } catch (err) {
      console.error('Error creating template:', err)
      showError(
        err instanceof Error
          ? err.message
          : 'Не вдалося створити шаблон'
      )
    } finally {
      setTemplateSaving(false)
    }
  }

  const handleConvertToTemplate = async () => {
    if (!workout) return

    try {
      const response = await fetch(
        `/api/workouts/${workout.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isTemplate: true,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || 'Failed to convert to template'
        )
      }

      showSuccess('Workout converted to template')
      // Refresh workout data
      await fetchWorkout()
    } catch (err) {
      console.error('Error converting to template:', err)
      showError(
        err instanceof Error
          ? err.message
          : 'Failed to convert to template'
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
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

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {error || 'Тренування не знайдено'}
            </h2>
            <p className="text-muted-foreground mb-6">
              The workout you&apos;re looking for
              doesn&apos;t exist or you don&apos;t have
              permission to view it.
            </p>
            <Link href="/workouts">
              <Button>← Back to Workouts</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('editWorkout')}
            </h1>
            <p className="text-muted-foreground mt-2">
              Update your workout details
            </p>
          </div>

          {/* Edit Form */}
          <WorkoutForm
            workout={workout}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {workout.name}
              </h1>
              {workout.isTemplate && (
                <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full">
                  Template
                </span>
              )}
            </div>
            <p className="text-lg text-muted-foreground">
              {formatDate(new Date(workout.date))}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              ✏️ {t('edit')}
            </Button>

            {!workout.isTemplate && (
              <Button
                variant="outline"
                onClick={handleSaveAsTemplate}
              >
                📋 Save as Template
              </Button>
            )}

            {workout.isTemplate && (
              <Button
                variant="outline"
                onClick={() =>
                  (window.location.href = '/templates')
                }
              >
                📋 Manage Templates
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? t('loading')
                : `🗑️ ${t('delete')}`}
            </Button>
          </div>
        </div>

        {/* Workout Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="fitness-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Workout Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workout.duration && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('workoutDuration')}
                  </label>
                  <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                    ⏱️ {formatDuration(workout.duration)}
                  </p>
                </div>
              )}

              {workout.exercises &&
                workout.exercises.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Exercises
                    </label>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                      💪 {workout.exercises.length}{' '}
                      exercises
                    </p>
                  </div>
                )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-lg font-semibold text-foreground">
                  {format(
                    new Date(workout.createdAt),
                    'MMM dd, yyyy'
                  )}
                </p>
              </div>
            </div>

            {workout.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('description')}
                </label>
                <p className="text-foreground mt-2 leading-relaxed">
                  {workout.description}
                </p>
              </div>
            )}

            {workout.notes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('notes')}
                </label>
                <p className="text-foreground mt-2 leading-relaxed">
                  {workout.notes}
                </p>
              </div>
            )}
          </div>

          {/* Exercises Section */}
          <div className="fitness-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t('workoutExercises')}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowExerciseSelector(true)
                }
              >
                ➕ {t('addExercise')}
              </Button>
            </div>

            {exercisesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  {t('loading')}
                </p>
              </div>
            ) : workoutExercises.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('noExercisesInWorkout')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('addFirstExercise')}
                </p>
                <Button
                  onClick={() =>
                    setShowExerciseSelector(true)
                  }
                >
                  ➕ {t('addExercise')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workoutExercises.map(
                  (workoutExercise, index) => {
                    const translatedExercise =
                      workoutExercise.exercise &&
                      !workoutExercise.exercise.isCustom
                        ? getTranslatedExercise(
                            workoutExercise.exercise.name
                          )
                        : {
                            name:
                              workoutExercise.exercise
                                ?.name ||
                              'Unknown Exercise',
                            description:
                              workoutExercise.exercise
                                ?.description,
                          }

                    return (
                      <div
                        key={workoutExercise.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {index + 1}.{' '}
                              {translatedExercise.name}
                            </h3>
                            {workoutExercise.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {workoutExercise.notes}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleRemoveExercise(
                                workoutExercise.id
                              )
                            }
                          >
                            🗑️
                          </Button>
                        </div>

                        {/* Personal Record Manager - show for templates and strength exercises */}
                        {(workout?.isTemplate ||
                          workoutExercise.exercise
                            ?.category === 'strength') &&
                          workoutExercise.exercise && (
                            <div className="mb-4">
                              <PersonalRecordManager
                                exercise={
                                  workoutExercise.exercise
                                }
                                onRecordUpdated={(
                                  record
                                ) => {
                                  if (record) {
                                    setPersonalRecords(
                                      (prev) => ({
                                        ...prev,
                                        [workoutExercise.exerciseId]:
                                          record,
                                      })
                                    )
                                  } else {
                                    setPersonalRecords(
                                      (prev) => {
                                        const newRecords = {
                                          ...prev,
                                        }
                                        delete newRecords[
                                          workoutExercise
                                            .exerciseId
                                        ]
                                        return newRecords
                                      }
                                    )
                                  }
                                }}
                              />
                            </div>
                          )}

                        {/* Sets */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Sets
                            </h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleAddSet(
                                  workoutExercise.id
                                )
                              }
                              className="text-xs"
                            >
                              ➕ Add Set
                            </Button>
                          </div>

                          {workoutExercise.sets &&
                          workoutExercise.sets.length >
                            0 ? (
                            <div className="space-y-2">
                              {workoutExercise.sets.map(
                                (set, setIndex) => (
                                  <div
                                    key={set.id}
                                    className="flex items-center gap-4 text-sm bg-muted p-2 rounded"
                                  >
                                    <span className="w-8 text-center text-muted-foreground">
                                      {setIndex + 1}
                                    </span>
                                    <div className="flex-1">
                                      <span className="text-foreground">
                                        {formatWeightDisplay(
                                          set,
                                          personalRecords[
                                            workoutExercise
                                              .exerciseId
                                          ]
                                        )}{' '}
                                        × {set.reps} reps
                                      </span>
                                      {set.rpe && (
                                        <span className="text-muted-foreground ml-2">
                                          RPE {set.rpe}
                                        </span>
                                      )}
                                      {set.restTime && (
                                        <span className="text-muted-foreground ml-2">
                                          Rest:{' '}
                                          {set.restTime}s
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {set.isWarmup && (
                                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                                          Warmup
                                        </span>
                                      )}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleEditSet(
                                            workoutExercise.id,
                                            set
                                          )
                                        }
                                        className="text-xs"
                                      >
                                        ✏️
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteSet(
                                            workoutExercise.id,
                                            set.id
                                          )
                                        }
                                        className="text-xs text-red-600 hover:bg-red-50"
                                      >
                                        🗑️
                                      </Button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No sets recorded yet. Click
                              &quot;Add Set&quot; to start.
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/workouts">
            <Button variant="outline">
              ← Back to Workouts
            </Button>
          </Link>
        </div>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <ExerciseSelector
          onSelectExercise={handleAddExercise}
          onClose={() => setShowExerciseSelector(false)}
          selectedExercises={workoutExercises.map(
            (we) => we.exerciseId
          )}
        />
      )}

      {/* Set Form Modal */}
      {showSetForm && editingSet && (
        <SetForm
          set={editingSet.set}
          onSubmit={handleSetSubmit}
          onCancel={handleSetFormClose}
          isLoading={setFormLoading}
        />
      )}

      {/* Template Name Input Modal */}
      <InputModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onConfirm={handleConfirmSaveAsTemplate}
        title={t('saveAsTemplate') || 'Save as Template'}
        message={
          t('enterTemplateName') ||
          'Enter a name for your workout template:'
        }
        placeholder={
          t('templateNamePlaceholder') || 'Template name'
        }
        defaultValue={
          workout ? `${workout.name} Template` : ''
        }
        confirmText={t('save') || 'Save'}
        loading={templateSaving}
        icon="📋"
      />

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

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  )
}
