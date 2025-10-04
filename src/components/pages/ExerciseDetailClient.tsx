'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import { ExerciseForm } from '@/components/features/exercise'
import {
  ToastContainer,
  useToast,
} from '@/components/ui/Toast'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { useConfirmation } from '@/hooks/useConfirmation'
import { Exercise } from '@/types/workout'
import {
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
} from '@/constants/categories'
import { getTranslatedExercise } from '@/lib/translations'

interface ExerciseDetailClientProps {
  exerciseId: string
}

export default function ExerciseDetailClient({
  exerciseId,
}: ExerciseDetailClientProps) {
  const { t } = useTranslations()
  const language = 'uk'
  const router = useRouter()
  const { toasts, removeToast, showError } = useToast()
  const {
    confirmationState,
    showConfirmation,
    hideConfirmation,
  } = useConfirmation()
  const [exercise, setExercise] = useState<Exercise | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchExercise = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/exercises/${exerciseId}`
      )

      if (!response.ok) {
        if (response.status === 404) {
          setError('Вправу не знайдено')
          return
        }
        throw new Error('Failed to fetch exercise')
      }

      const data = await response.json()
      setExercise(data)
    } catch (err) {
      setError('Failed to load exercise')
      console.error('Error fetching exercise:', err)
    } finally {
      setLoading(false)
    }
  }, [exerciseId])

  useEffect(() => {
    fetchExercise()
  }, [fetchExercise])

  const handleEdit = async (formData: any) => {
    try {
      const response = await fetch(
        `/api/exercises/${exerciseId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update exercise')
      }

      const updatedExercise = await response.json()
      setExercise(updatedExercise)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating exercise:', err)
      throw err
    }
  }

  const handleDelete = async () => {
    const confirmed = await showConfirmation({
      title: t('deleteExercise') || 'Delete Exercise',
      message:
        t('deleteExerciseConfirm') ||
        'Are you sure you want to delete this exercise? This action cannot be undone.',
      confirmText: t('delete') || 'Delete',
      cancelText: t('cancel') || 'Cancel',
    })

    if (confirmed) {
      executeDelete()
    }
  }

  const executeDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(
        `/api/exercises/${exerciseId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete exercise')
      }

      router.push('/exercises')
    } catch (err) {
      console.error('Error deleting exercise:', err)
      showError('Failed to delete exercise')
    } finally {
      setIsDeleting(false)
    }
  }

  const parseMuscleGroups = (
    muscleGroupsString: string
  ): string[] => {
    try {
      return JSON.parse(muscleGroupsString)
    } catch {
      return [muscleGroupsString]
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return '💪'
      case 'cardio':
        return '❤️'
      case 'flexibility':
        return '🤸'
      case 'sport':
        return '⚽'
      default:
        return '🏋️'
    }
  }

  const getCategoryName = (category: string) => {
    return (
      EXERCISE_CATEGORIES[
        category as keyof typeof EXERCISE_CATEGORIES
      ] || category
    )
  }

  const getMuscleGroupName = (muscleGroup: string) => {
    return (
      MUSCLE_GROUPS[
        muscleGroup as keyof typeof MUSCLE_GROUPS
      ] || muscleGroup
    )
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

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {error || 'Вправу не знайдено'}
            </h2>
            <p className="text-muted-foreground mb-6">
              The exercise you&apos;re looking for
              doesn&apos;t exist or you don&apos;t have
              permission to view it.
            </p>
            <Link href="/exercises">
              <Button>← {t('backToExercises')}</Button>
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
              {t('editExercise')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('updateExerciseDetails')}
            </p>
          </div>

          {/* Edit Form */}
          <ExerciseForm
            exercise={exercise}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    )
  }

  const muscleGroups = parseMuscleGroups(
    exercise.muscleGroups
  )

  // Get translated exercise name and description for system exercises
  const translatedExercise = !exercise.isCustom
    ? getTranslatedExercise(exercise.name)
    : {
        name: exercise.name,
        description: exercise.description,
      }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {getCategoryIcon(exercise.category)}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {translatedExercise.name}
              </h1>
              {exercise.isCustom && (
                <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                  Custom
                </span>
              )}
            </div>
            <p className="text-lg text-muted-foreground">
              {getCategoryName(exercise.category)}
            </p>
          </div>

          {/* Actions */}
          {exercise.isCustom && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                ✏️ {t('edit')}
              </Button>
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
          )}
        </div>

        {/* Exercise Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="fitness-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('exerciseDetails')}
            </h2>

            {/* Description */}
            {(translatedExercise.description ||
              exercise.description) && (
              <div className="mb-6">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('description')}
                </label>
                <p className="text-foreground mt-2 leading-relaxed">
                  {translatedExercise.description ||
                    exercise.description}
                </p>
              </div>
            )}

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Muscle Groups */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('muscleGroups')}
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {muscleGroups.map((group, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
                    >
                      {getMuscleGroupName(group)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              {exercise.equipment && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('equipment')}
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg">🏋️</span>
                    <span className="text-foreground">
                      {exercise.equipment}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {exercise.instructions && (
            <div className="fitness-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t('instructions')}
              </h2>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-foreground font-sans leading-relaxed">
                  {exercise.instructions}
                </pre>
              </div>
            </div>
          )}

          {/* Exercise Image */}
          {exercise.imageUrl && (
            <div className="fitness-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t('exerciseImage')}
              </h2>
              <div className="flex justify-center">
                <div className="relative max-w-lg w-full h-64">
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    fill
                    className="object-contain rounded-lg border border-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/exercises">
            <Button variant="outline">
              ← {t('backToExercises')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        onConfirm={confirmationState.onConfirm}
        onClose={hideConfirmation}
      />
    </div>
  )
}
