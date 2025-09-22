import { PersonalRecord, Set } from '@/types/workout'

/**
 * Calculate actual weight from percentage of 1RM
 * @param percentage - Percentage of 1RM (e.g., 70 for 70%)
 * @param oneRepMax - User's 1RM for the exercise
 * @param roundTo - Round result to nearest increment (default: 2.5kg)
 * @returns Calculated weight rounded to specified increment
 */
export function calculateWeightFromPercentage(percentage: number, oneRepMax: number, roundTo: number = 2.5): number {
  const weight = (percentage / 100) * oneRepMax
  return Math.round(weight / roundTo) * roundTo
}

/**
 * Calculate percentage of 1RM from weight
 * @param weight - Actual weight used
 * @param oneRepMax - User's 1RM for the exercise
 * @returns Percentage of 1RM (rounded to 1 decimal place)
 */
export function calculatePercentageFromWeight(weight: number, oneRepMax: number): number {
  if (oneRepMax === 0) return 0
  return Math.round((weight / oneRepMax) * 100 * 10) / 10
}

/**
 * Get effective weight for a set (either direct weight or calculated from percentage)
 * @param set - The set object
 * @param personalRecord - User's personal record for the exercise (optional)
 * @returns Effective weight to display/use
 */
export function getEffectiveWeight(set: Set, personalRecord?: PersonalRecord): number | null {
  if (set.isPercentageBased && set.percentageOf1RM && personalRecord?.oneRepMax) {
    return calculateWeightFromPercentage(set.percentageOf1RM, personalRecord.oneRepMax)
  }
  return set.weight ?? null
}

/**
 * Format weight display with percentage information
 * @param set - The set object
 * @param personalRecord - User's personal record for the exercise (optional)
 * @returns Formatted string for display
 */
export function formatWeightDisplay(set: Set, personalRecord?: PersonalRecord): string {
  if (set.isPercentageBased && set.percentageOf1RM) {
    if (personalRecord?.oneRepMax) {
      const calculatedWeight = calculateWeightFromPercentage(set.percentageOf1RM, personalRecord.oneRepMax)
      return `${calculatedWeight}kg (${set.percentageOf1RM}% of 1RM)`
    } else {
      return `${set.percentageOf1RM}% of 1RM (no PR set)`
    }
  }
  return set.weight ? `${set.weight}kg` : '0kg'
}

/**
 * Check if a set can be calculated (has required data)
 * @param set - The set object
 * @param personalRecord - User's personal record for the exercise (optional)
 * @returns True if weight can be determined
 */
export function canCalculateSetWeight(set: Set, personalRecord?: PersonalRecord): boolean {
  if (set.isPercentageBased) {
    return !!(set.percentageOf1RM && personalRecord?.oneRepMax)
  }
  return set.weight !== null && set.weight !== undefined
}

/**
 * Generate a suggested 1RM based on a completed set using Epley formula
 * @param weight - Weight used in the set
 * @param reps - Number of reps completed
 * @returns Estimated 1RM
 */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight
  // Epley formula: 1RM = weight × (1 + reps/30)
  const estimated1RM = weight * (1 + reps / 30)
  // Round to nearest 2.5kg
  return Math.round(estimated1RM / 2.5) * 2.5
}

/**
 * Common powerlifting percentage templates
 */
export const POWERLIFTING_PERCENTAGES = {
  // Linear progression (beginner)
  LINEAR_PROGRESSION: [
    { week: 1, percentage: 65 },
    { week: 2, percentage: 70 },
    { week: 3, percentage: 75 },
    { week: 4, percentage: 80 },
  ],

  // 5/3/1 style
  FIVE_THREE_ONE: [
    { week: 1, day1: 65, day2: 75, day3: 85 },
    { week: 2, day1: 70, day2: 80, day3: 90 },
    { week: 3, day1: 75, day2: 85, day3: 95 },
    { week: 4, day1: 40, day2: 50, day3: 60 }, // Deload
  ],

  // Sheiko-style high volume
  SHEIKO_STYLE: [
    { sets: 5, reps: 5, percentage: 70 },
    { sets: 4, reps: 4, percentage: 75 },
    { sets: 3, reps: 3, percentage: 80 },
    { sets: 2, reps: 2, percentage: 85 },
    { sets: 1, reps: 1, percentage: 90 },
  ],
}
