'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Workout } from '@/types/workout'

interface WorkoutFormProps {
  workout?: Workout
  onSubmit?: (data: WorkoutFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

interface WorkoutFormData {
  name: string
  description?: string
  date: string
  duration?: number
  notes?: string
  isTemplate: boolean
}

export default function WorkoutForm({ workout, onSubmit, onCancel, isLoading }: WorkoutFormProps) {
  const { t } = useLanguage()
  const router = useRouter()

  const [formData, setFormData] = useState<WorkoutFormData>({
    name: workout?.name || '',
    description: workout?.description || '',
    date: workout?.date ? new Date(workout.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    duration: workout?.duration || undefined,
    notes: workout?.notes || '',
    isTemplate: workout?.isTemplate || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Workout name is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // Add time to date for proper datetime format
      const dateTime = new Date(formData.date + 'T12:00:00').toISOString()

      const submitData = {
        ...formData,
        date: dateTime,
      }

      if (onSubmit) {
        await onSubmit(submitData)
      } else {
        // Default submission to API
        const url = workout ? `/api/workouts/${workout.id}` : '/api/workouts'
        const method = workout ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        })

        if (!response.ok) {
          throw new Error('Failed to save workout')
        }

        router.push('/workouts')
      }
    } catch (error) {
      console.error('Error saving workout:', error)
      setErrors({ submit: 'Failed to save workout. Please try again.' })
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
        {/* Workout Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            {t('workoutName')} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={t('workoutName')}
            disabled={isLoading}
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            {t('workoutDescription')}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder={t('workoutDescription')}
            disabled={isLoading}
          />
        </div>

        {/* Date and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
              {t('workoutDate')} *
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
            {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-2">
              {t('workoutDuration')} (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={formData.duration || ''}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="60"
              min="1"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
            {t('workoutNotes')}
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder={t('workoutNotes')}
            disabled={isLoading}
          />
        </div>

        {/* Template Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isTemplate"
            checked={formData.isTemplate}
            onChange={(e) => setFormData({ ...formData, isTemplate: e.target.checked })}
            className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
            disabled={isLoading}
          />
          <label htmlFor="isTemplate" className="text-sm font-medium text-foreground">
            Save as template
          </label>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-destructive text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? t('loading') : workout ? t('editWorkout') : t('createWorkout')}
          </Button>

          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            {t('cancel')}
          </Button>
        </div>
      </form>
    </div>
  )
}
