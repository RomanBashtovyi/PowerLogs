'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { WorkoutCard } from '@/components/features/workout'
import { Workout } from '@/types/workout'

export default function WorkoutsClient() {
  const { t } = useLanguage()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workouts')

      if (!response.ok) {
        throw new Error('Failed to fetch workouts')
      }

      const data = await response.json()
      setWorkouts(data.workouts || [])
    } catch (err) {
      setError('Failed to load workouts')
      console.error('Error fetching workouts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) {
      return
    }

    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete workout')
      }

      setWorkouts(workouts.filter((w) => w.id !== workoutId))
    } catch (err) {
      console.error('Error deleting workout:', err)
      alert('Failed to delete workout')
    }
  }

  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('allWorkouts')}</h1>
            <p className="text-muted-foreground mt-1">
              {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'}
            </p>
          </div>

          <Link href="/workouts/new">
            <Button className="w-full sm:w-auto">➕ {t('createWorkout')}</Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchWorkouts} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {/* Workouts Grid */}
        {filteredWorkouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No workouts found' : t('noWorkouts')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search terms' : t('addFirstWorkout')}
            </p>
            {!searchQuery && (
              <Link href="/workouts/new">
                <Button>➕ {t('createWorkout')}</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} onDelete={() => handleDeleteWorkout(workout.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
