'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Workout } from '@/types/workout'

interface WorkoutCardProps {
  workout: Workout
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export default function WorkoutCard({
  workout,
  onEdit,
  onDelete,
  className = '',
}: WorkoutCardProps) {
  const { t } = useTranslations()
  const language = 'uk'

  const formatDate = (date: Date) => {
    const locale = uk
    return format(date, 'MMM dd, yyyy', { locale })
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

  return (
    <div
      className={`fitness-card p-4 hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {workout.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(new Date(workout.date))}
          </p>
        </div>

        {workout.isTemplate && (
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
            Template
          </span>
        )}
      </div>

      {/* Description */}
      {workout.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {workout.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        {workout.duration && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">
              ⏱️
            </span>
            <span>{formatDuration(workout.duration)}</span>
          </div>
        )}

        {workout.exercises &&
          workout.exercises.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">
                💪
              </span>
              <span>
                {workout.exercises.length} exercises
              </span>
            </div>
          )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/workouts/${workout.id}`}
          className="flex-1"
        >
          <Button variant="default" className="w-full">
            View
          </Button>
        </Link>

        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            {t('edit')}
          </Button>
        )}

        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            {t('delete')}
          </Button>
        )}
      </div>
    </div>
  )
}
