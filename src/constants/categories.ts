import { ExerciseCategory, MuscleGroup } from '@/types/workout'

export const EXERCISE_CATEGORIES: Record<ExerciseCategory, string> = {
  strength: 'Силові',
  cardio: 'Кардіо',
  flexibility: 'Гнучкість',
  sport: 'Спортивні',
} as const

export const MUSCLE_GROUPS: Record<MuscleGroup, string> = {
  chest: 'Груди',
  back: 'Спина',
  shoulders: 'Плечі',
  biceps: 'Біцепс',
  triceps: 'Трицепс',
  legs: 'Ноги',
  glutes: 'Сідниці',
  abs: 'Прес',
  cardio: 'Кардіо',
} as const

export const EQUIPMENT_TYPES = [
  'Штанга',
  'Гантелі',
  'Тренажер',
  'Власна вага',
  'Кардіо',
  'Еспандер',
  'Гирі',
  'TRX',
  'Інше',
] as const

export const RPE_SCALE = {
  1: 'Дуже легко',
  2: 'Легко',
  3: 'Помірно легко',
  4: 'Помірно легко+',
  5: 'Помірно',
  6: 'Помірно важко',
  7: 'Важко',
  8: 'Дуже важко',
  9: 'Максимально важко',
  10: 'Максимум',
} as const
