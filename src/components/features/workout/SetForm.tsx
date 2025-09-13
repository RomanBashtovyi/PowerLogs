'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Set } from '@/types/workout'

interface SetFormProps {
  set?: Set
  onSubmit: (setData: Omit<Set, 'id' | 'workoutExerciseId' | 'order'>) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function SetForm({ set, onSubmit, onCancel, isLoading }: SetFormProps) {
  const [formData, setFormData] = useState({
    weight: set?.weight ? set.weight.toString() : '',
    reps: set?.reps ? set.reps.toString() : '',
    rpe: set?.rpe ? set.rpe.toString() : '',
    isWarmup: set?.isWarmup || false,
    completed: set?.completed || false,
    restTime: set?.restTime ? set.restTime.toString() : '',
    numSets: '1', // Number of sets to create (only for new sets)
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    const weight = parseFloat(formData.weight)
    const reps = parseInt(formData.reps)
    const rpe = formData.rpe ? parseInt(formData.rpe) : null
    const restTime = formData.restTime ? parseInt(formData.restTime) : null
    const numSets = parseInt(formData.numSets)

    if (!formData.weight || isNaN(weight) || weight < 0) {
      newErrors.weight = 'Weight must be a positive number'
    }
    if (!formData.reps || isNaN(reps) || reps < 1) {
      newErrors.reps = 'Reps must be at least 1'
    }
    if (formData.rpe && (isNaN(rpe!) || rpe! < 1 || rpe! > 10)) {
      newErrors.rpe = 'RPE must be between 1 and 10'
    }
    if (formData.restTime && (isNaN(restTime!) || restTime! < 0)) {
      newErrors.restTime = 'Rest time must be non-negative'
    }
    if (!set && (!formData.numSets || isNaN(numSets) || numSets < 1 || numSets > 10)) {
      newErrors.numSets = 'Number of sets must be between 1 and 10'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const setData = {
        weight: parseFloat(formData.weight),
        reps: parseInt(formData.reps),
        rpe: formData.rpe && formData.rpe.trim() !== '' ? parseInt(formData.rpe) : null,
        isWarmup: formData.isWarmup,
        completed: formData.completed,
        restTime: formData.restTime && formData.restTime.trim() !== '' ? parseInt(formData.restTime) : null,
        numSets: set ? 1 : parseInt(formData.numSets), // Only relevant for new sets
      }
      console.log('Submitting set data:', setData)
      onSubmit(setData as any)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{set ? 'Edit Set' : 'Add New Set'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Weight (kg) *</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Enter weight"
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>

          {/* Reps */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Reps *</label>
            <input
              type="number"
              min="1"
              value={formData.reps}
              onChange={(e) => handleChange('reps', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Enter reps"
            />
            {errors.reps && <p className="text-red-500 text-sm mt-1">{errors.reps}</p>}
          </div>

          {/* RPE */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">RPE (Rate of Perceived Exertion)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.rpe}
              onChange={(e) => handleChange('rpe', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="1-10 (optional)"
            />
            {errors.rpe && <p className="text-red-500 text-sm mt-1">{errors.rpe}</p>}
          </div>

          {/* Rest Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Rest Time (seconds)</label>
            <input
              type="number"
              min="0"
              value={formData.restTime}
              onChange={(e) => handleChange('restTime', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Rest time (optional)"
            />
            {errors.restTime && <p className="text-red-500 text-sm mt-1">{errors.restTime}</p>}
          </div>

          {/* Number of Sets (only for new sets) */}
          {!set && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Number of Sets *</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.numSets}
                onChange={(e) => handleChange('numSets', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="How many sets?"
              />
              {errors.numSets && <p className="text-red-500 text-sm mt-1">{errors.numSets}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                This will create {formData.numSets || 1} identical set(s) with the same weight and reps
              </p>
            </div>
          )}

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isWarmup}
                onChange={(e) => handleChange('isWarmup', e.target.checked)}
                className="rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Warmup set</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.completed}
                onChange={(e) => handleChange('completed', e.target.checked)}
                className="rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Completed</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : set ? 'Update Set' : 'Add Set'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
