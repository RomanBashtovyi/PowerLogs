export interface Workout {
  id: string
  name: string
  description?: string | null
  date: Date
  duration?: number | null
  notes?: string | null
  isTemplate: boolean
  userId: string
  createdAt: Date
  exercises?: WorkoutExercise[]
}

export interface Exercise {
  id: string
  name: string
  description?: string | null
  instructions?: string | null
  muscleGroups: string // JSON string of muscle groups
  equipment?: string | null
  category: ExerciseCategory
  imageUrl?: string | null
  isCustom: boolean
  userId?: string | null
  createdAt: Date
}

export interface WorkoutExercise {
  id: string
  workoutId: string
  exerciseId: string
  order: number
  notes?: string | null
  workout?: Workout
  exercise?: Exercise
  sets?: Set[]
}

export interface Set {
  id: string
  workoutExerciseId: string
  weight: number
  reps: number
  rpe?: number | null
  isWarmup: boolean
  completed: boolean
  order: number
  restTime?: number | null
}

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'sport'

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'abs' | 'cardio'

export interface WorkoutFormData {
  name: string
  description?: string
  date: Date
  exercises: {
    exerciseId: string
    sets: {
      weight: number
      reps: number
      rpe?: number
      isWarmup: boolean
    }[]
  }[]
}
