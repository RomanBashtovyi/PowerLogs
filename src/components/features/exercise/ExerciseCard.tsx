'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Exercise } from '@/types/workout'
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS } from '@/constants/categories'
import { getTranslatedExercise } from '@/lib/translations'

interface ExerciseCardProps {
  exercise: Exercise
  onEdit?: () => void
  onDelete?: () => void
  onSelect?: () => void
  className?: string
  showActions?: boolean
}

export default function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
  onSelect,
  className = '',
  showActions = true,
}: ExerciseCardProps) {
  const { t, language } = useLanguage()

  // Get translated exercise name and description for system exercises
  const translatedExercise = !exercise.isCustom
    ? getTranslatedExercise(exercise.name, language)
    : { name: exercise.name, description: exercise.description }

  const parseMuscleGroups = (muscleGroupsString: string): string[] => {
    try {
      return JSON.parse(muscleGroupsString)
    } catch {
      return [muscleGroupsString]
    }
  }

  const muscleGroups = parseMuscleGroups(exercise.muscleGroups)

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
    return EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES] || category
  }

  const getMuscleGroupName = (muscleGroup: string) => {
    return MUSCLE_GROUPS[muscleGroup as keyof typeof MUSCLE_GROUPS] || muscleGroup
  }

  return (
    <div className={`fitness-card p-4 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">{translatedExercise.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
            <span className="text-sm text-muted-foreground">{getCategoryName(exercise.category)}</span>
          </div>
        </div>

        {exercise.isCustom && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Custom</span>}
      </div>

      {/* Description */}
      {(translatedExercise.description || exercise.description) && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {translatedExercise.description || exercise.description}
        </p>
      )}

      {/* Muscle Groups */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {muscleGroups.slice(0, 3).map((group, index) => (
            <span key={index} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
              {getMuscleGroupName(group)}
            </span>
          ))}
          {muscleGroups.length > 3 && (
            <span className="text-xs text-muted-foreground px-2 py-1">+{muscleGroups.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Equipment */}
      {exercise.equipment && (
        <div className="mb-4">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">🏋️</span>
            <span className="text-sm text-muted-foreground">{exercise.equipment}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          {onSelect ? (
            <Button variant="default" className="flex-1" onClick={onSelect}>
              Select
            </Button>
          ) : (
            <Link href={`/exercises/${exercise.id}`} className="flex-1">
              <Button variant="default" className="w-full">
                View
              </Button>
            </Link>
          )}

          {exercise.isCustom && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              {t('edit')}
            </Button>
          )}

          {exercise.isCustom && onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              {t('delete')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
