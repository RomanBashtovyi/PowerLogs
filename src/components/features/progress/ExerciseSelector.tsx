'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Exercise {
  id: string
  name: string
  category: string
  isTracked: boolean
}

interface ExerciseSelectorProps {
  selectedExercises: string[]
  onSelectionChange: (exerciseIds: string[]) => void
  onClose: () => void
}

export default function ExerciseSelector({ selectedExercises, onSelectionChange, onClose }: ExerciseSelectorProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'tracked' | 'strength' | 'cardio'>('tracked')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/user/exercise-tracking')
      if (response.ok) {
        const data = await response.json()
        setExercises(data.exercises)
      }
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExercises = exercises.filter((exercise) => {
    // Filter by category/tracking
    if (filter === 'tracked' && !exercise.isTracked) return false
    if (filter === 'strength' && exercise.category !== 'strength') return false
    if (filter === 'cardio' && exercise.category !== 'cardio') return false

    // Filter by search term
    if (searchTerm && !exercise.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  const handleExerciseToggle = (exerciseId: string) => {
    const newSelection = selectedExercises.includes(exerciseId)
      ? selectedExercises.filter((id) => id !== exerciseId)
      : [...selectedExercises, exerciseId]

    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredExercises.map((ex) => ex.id)
    onSelectionChange(allFilteredIds)
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return '🏋️'
      case 'cardio':
        return '🏃'
      case 'flexibility':
        return '🧘'
      case 'sport':
        return '⚽'
      default:
        return '💪'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Exercises for Progress Tracking</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'tracked', label: 'Tracked', icon: '⭐' },
            { key: 'all', label: 'All', icon: '📋' },
            { key: 'strength', label: 'Strength', icon: '🏋️' },
            { key: 'cardio', label: 'Cardio', icon: '🏃' },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
            >
              {filterOption.icon} {filterOption.label}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All ({filteredExercises.length})
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear Selection
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">{selectedExercises.length} selected</div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading exercises...</p>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No exercises found</p>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedExercises.includes(exercise.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-input hover:bg-muted'
                }`}
                onClick={() => handleExerciseToggle(exercise.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedExercises.includes(exercise.id)}
                  onChange={() => handleExerciseToggle(exercise.id)}
                  className="rounded"
                />
                <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {exercise.category}
                    {exercise.isTracked && <span className="ml-2">⭐ Tracked</span>}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-4 border-t border-input">
          <Button onClick={onClose} className="flex-1">
            Done ({selectedExercises.length} exercises)
          </Button>
        </div>
      </div>
    </div>
  )
}
