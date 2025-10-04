'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import {
  Exercise,
  ExerciseCategory,
  MuscleGroup,
} from '@/types/workout'
import {
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
} from '@/constants/categories'

interface ExerciseFormProps {
  exercise?: Exercise
  onSubmit?: (data: ExerciseFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

interface ExerciseFormData {
  name: string
  description?: string
  instructions?: string
  muscleGroups: string // JSON string
  equipment?: string
  category: ExerciseCategory
  imageUrl?: string
}

export default function ExerciseForm({
  exercise,
  onSubmit,
  onCancel,
  isLoading,
}: ExerciseFormProps) {
  const { t } = useTranslations()
  const router = useRouter()

  const parseMuscleGroups = (
    muscleGroupsString?: string
  ): MuscleGroup[] => {
    if (!muscleGroupsString) return []
    try {
      return JSON.parse(muscleGroupsString)
    } catch {
      return [muscleGroupsString as MuscleGroup]
    }
  }

  const [formData, setFormData] =
    useState<ExerciseFormData>({
      name: exercise?.name || '',
      description: exercise?.description || '',
      instructions: exercise?.instructions || '',
      muscleGroups:
        exercise?.muscleGroups || JSON.stringify([]),
      equipment: exercise?.equipment || '',
      category: exercise?.category || 'strength',
      imageUrl: exercise?.imageUrl || '',
    })

  const [selectedMuscleGroups, setSelectedMuscleGroups] =
    useState<MuscleGroup[]>(
      parseMuscleGroups(exercise?.muscleGroups)
    )

  const [errors, setErrors] = useState<
    Record<string, string>
  >({})
  const [successMessage, setSuccessMessage] =
    useState<string>('')

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('exerciseNameRequired')
    }

    if (selectedMuscleGroups.length === 0) {
      newErrors.muscleGroups = t('atLeastOneMuscleGroup')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleMuscleGroupToggle = (
    muscleGroup: MuscleGroup
  ) => {
    const updated = selectedMuscleGroups.includes(
      muscleGroup
    )
      ? selectedMuscleGroups.filter(
          (mg) => mg !== muscleGroup
        )
      : [...selectedMuscleGroups, muscleGroup]

    setSelectedMuscleGroups(updated)
    setFormData({
      ...formData,
      muscleGroups: JSON.stringify(updated),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setErrors({})
      setSuccessMessage('')

      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Default submission to API
        const url = exercise
          ? `/api/exercises/${exercise.id}`
          : '/api/exercises'
        const method = exercise ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({}))
          console.error('API Error:', errorData)
          throw new Error(
            errorData.error || 'Failed to save exercise'
          )
        }

        const result = await response.json()
        console.log('Exercise saved successfully:', result)

        // Show success message
        setSuccessMessage(
          exercise
            ? t('exerciseUpdatedSuccess')
            : t('exerciseCreatedSuccess')
        )

        // Redirect after showing success message
        setTimeout(() => {
          router.push('/exercises')
          router.refresh() // Force refresh to reload exercises
        }, 1500)
      }
    } catch (error) {
      console.error('Error saving exercise:', error)
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : t('failedToSaveExercise'),
      })
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exercise Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {t('exerciseName')} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={t('exerciseName')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {t('category')} *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target
                  .value as ExerciseCategory,
              })
            }
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          >
            {Object.entries(EXERCISE_CATEGORIES).map(
              ([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              )
            )}
          </select>
        </div>

        {/* Muscle Groups */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('muscleGroups')} *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(MUSCLE_GROUPS).map(
              ([key, value]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedMuscleGroups.includes(
                      key as MuscleGroup
                    )
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMuscleGroups.includes(
                      key as MuscleGroup
                    )}
                    onChange={() =>
                      handleMuscleGroupToggle(
                        key as MuscleGroup
                      )
                    }
                    className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                    disabled={isLoading}
                  />
                  <span className="text-sm font-medium">
                    {value}
                  </span>
                </label>
              )
            )}
          </div>
          {errors.muscleGroups && (
            <p className="text-destructive text-sm mt-1">
              {errors.muscleGroups}
            </p>
          )}
        </div>

        {/* Equipment */}
        <div>
          <label
            htmlFor="equipment"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {t('equipment')}
          </label>
          <select
            id="equipment"
            value={formData.equipment}
            onChange={(e) =>
              setFormData({
                ...formData,
                equipment: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">{t('noEquipment')}</option>
            {EQUIPMENT_TYPES.map((equipment) => (
              <option key={equipment} value={equipment}>
                {equipment}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {t('description')}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder={t('exerciseDescription')}
            disabled={isLoading}
          />
        </div>

        {/* Instructions */}
        <div>
          <label
            htmlFor="instructions"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {t('instructions')}
          </label>
          <textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) =>
              setFormData({
                ...formData,
                instructions: e.target.value,
              })
            }
            rows={5}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder={t('exerciseInstructions')}
            disabled={isLoading}
          />
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {t('imageUrl')}
          </label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({
                ...formData,
                imageUrl: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com/exercise-image.jpg"
            disabled={isLoading}
          />
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3">
            <p className="text-green-600 text-sm">
              {successMessage}
            </p>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-destructive text-sm">
              {errors.submit}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading
              ? t('loading')
              : exercise
                ? t('updateExerciseButton')
                : t('createExerciseButton')}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
        </div>
      </form>
    </div>
  )
}
