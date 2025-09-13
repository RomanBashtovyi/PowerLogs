'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { WorkoutForm } from '@/components/features/workout'
import { Workout } from '@/types/workout'

interface WorkoutDetailClientProps {
  workoutId: string
}

export default function WorkoutDetailClient({ workoutId }: WorkoutDetailClientProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchWorkout()
  }, [workoutId])

  const fetchWorkout = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/workouts/${workoutId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Workout not found')
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

  const handleEdit = async (formData: any) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

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
    if (!confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete workout')
      }

      router.push('/workouts')
    } catch (err) {
      console.error('Error deleting workout:', err)
      alert('Failed to delete workout')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: Date) => {
    const locale = language === 'uk' ? uk : enUS
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
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

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{error || 'Workout not found'}</h2>
            <p className="text-muted-foreground mb-6">
              The workout you're looking for doesn't exist or you don't have permission to view it.
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('editWorkout')}</h1>
            <p className="text-muted-foreground mt-2">Update your workout details</p>
          </div>

          {/* Edit Form */}
          <WorkoutForm workout={workout} onSubmit={handleEdit} onCancel={() => setIsEditing(false)} />
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{workout.name}</h1>
              {workout.isTemplate && (
                <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full">Template</span>
              )}
            </div>
            <p className="text-lg text-muted-foreground">{formatDate(new Date(workout.date))}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              ✏️ {t('edit')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t('loading') : `🗑️ ${t('delete')}`}
            </Button>
          </div>
        </div>

        {/* Workout Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="fitness-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Workout Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workout.duration && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('workoutDuration')}</label>
                  <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                    ⏱️ {formatDuration(workout.duration)}
                  </p>
                </div>
              )}

              {workout.exercises && workout.exercises.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Exercises</label>
                  <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                    💪 {workout.exercises.length} exercises
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-lg font-semibold text-foreground">
                  {format(new Date(workout.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {workout.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">{t('description')}</label>
                <p className="text-foreground mt-2 leading-relaxed">{workout.description}</p>
              </div>
            )}

            {workout.notes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">{t('notes')}</label>
                <p className="text-foreground mt-2 leading-relaxed">{workout.notes}</p>
              </div>
            )}
          </div>

          {/* Exercises Section */}
          <div className="fitness-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Exercises</h2>
              <Button variant="outline" size="sm">
                ➕ Add Exercise
              </Button>
            </div>

            {!workout.exercises || workout.exercises.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💪</div>
                <p className="text-muted-foreground">
                  No exercises added yet. Add exercises to track your workout progress.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {workout.exercises.map((workoutExercise, index) => (
                  <div key={workoutExercise.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {index + 1}. {workoutExercise.exercise?.name || 'Unknown Exercise'}
                        </h3>
                        {workoutExercise.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{workoutExercise.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Sets */}
                    {workoutExercise.sets && workoutExercise.sets.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Sets</h4>
                        <div className="space-y-2">
                          {workoutExercise.sets.map((set, setIndex) => (
                            <div key={set.id} className="flex items-center gap-4 text-sm">
                              <span className="w-8 text-center text-muted-foreground">{setIndex + 1}</span>
                              <span className="text-foreground">
                                {set.weight}kg × {set.reps} reps
                              </span>
                              {set.rpe && <span className="text-muted-foreground">RPE {set.rpe}</span>}
                              {set.isWarmup && (
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Warmup</span>
                              )}
                              {set.completed && <span className="text-green-600">✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/workouts">
            <Button variant="outline">← Back to Workouts</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
