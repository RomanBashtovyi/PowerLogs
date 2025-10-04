'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import {
  ProgressChart,
  ExerciseSelector,
} from '@/components/features/progress'
import {
  ToastContainer,
  useToast,
} from '@/components/ui/Toast'

interface ProgressDataPoint {
  date: string
  maxWeight: number
  totalVolume: number
  maxReps: number
  sets: any[]
}

interface ExerciseProgress {
  exercise: {
    id: string
    name: string
    category: string
  }
  data: ProgressDataPoint[]
  summary: {
    totalWorkouts: number
    firstRecord: ProgressDataPoint
    lastRecord: ProgressDataPoint
    improvement: {
      weight: string
      volume: string
    }
  }
}

interface ProgressData {
  exercises: ExerciseProgress[]
  timeframe: string
  metric: string
  summary: {
    totalExercises: number
    dateRange: {
      start: string
      end: string
    }
  }
}

export default function ProgressTrackingClient() {
  const { t } = useTranslations()
  const language = 'uk'
  const { toasts, removeToast, showSuccess, showError } =
    useToast()

  const [progressData, setProgressData] =
    useState<ProgressData | null>(null)
  const [selectedExercises, setSelectedExercises] =
    useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<
    '30' | '90' | '180' | 'all'
  >('90')
  const [metric, setMetric] = useState<
    'weight' | 'volume' | 'reps'
  >('weight')
  const [showExerciseSelector, setShowExerciseSelector] =
    useState(false)

  useEffect(() => {
    fetchProgressData()
  }, [selectedExercises, timeframe, metric])

  const fetchProgressData = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        timeframe,
        metric,
      })

      if (selectedExercises.length > 0) {
        params.set(
          'exerciseIds',
          selectedExercises.join(',')
        )
      }

      const response = await fetch(
        `/api/user/progress?${params}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch progress data')
      }

      const data = await response.json()
      setProgressData(data)

      if (data.exercises.length === 0) {
        showError(
          'No progress data found for selected exercises'
        )
      }
    } catch (err) {
      console.error('Error fetching progress data:', err)
      showError('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }

  const handleExerciseSelectionChange = (
    exerciseIds: string[]
  ) => {
    setSelectedExercises(exerciseIds)
  }

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case '30':
        return t('last30Days')
      case '90':
        return t('last3Months')
      case '180':
        return t('last6Months')
      case 'all':
        return t('allTime')
      default:
        return t('last3Months')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('progressTracking')}
          </h1>
          <p className="text-muted-foreground">
            {t('progressTrackingDescription')}
          </p>
        </div>

        {/* Controls */}
        <div className="fitness-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Exercise Selection */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  setShowExerciseSelector(true)
                }
                className="flex items-center gap-2"
              >
                📊 {t('selectExercises')} (
                {selectedExercises.length})
              </Button>

              {selectedExercises.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  {t('showingDefaultTracked')}
                </span>
              )}
            </div>

            {/* Timeframe & Metric Selection */}
            <div className="flex gap-2">
              {/* Timeframe */}
              <div className="flex rounded-md border border-input">
                {[
                  { key: '30', label: '1M' },
                  { key: '90', label: '3M' },
                  { key: '180', label: '6M' },
                  { key: 'all', label: 'All' },
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={
                      timeframe === option.key
                        ? 'default'
                        : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                      setTimeframe(option.key as any)
                    }
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Metric */}
              <div className="flex rounded-md border border-input">
                {[
                  {
                    key: 'weight',
                    label: 'Weight',
                    icon: '🏋️',
                  },
                  {
                    key: 'volume',
                    label: 'Volume',
                    icon: '📊',
                  },
                  {
                    key: 'reps',
                    label: 'Reps',
                    icon: '🔢',
                  },
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={
                      metric === option.key
                        ? 'default'
                        : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                      setMetric(option.key as any)
                    }
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                  >
                    {option.icon}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          {progressData && (
            <div className="mt-4 pt-4 border-t border-input">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {progressData.summary.totalExercises}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('exercisesLabel')}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {getTimeframeLabel()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('period')}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Date(
                      progressData.summary.dateRange.start
                    ).toLocaleDateString('uk-UA')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('from')}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Date(
                      progressData.summary.dateRange.end
                    ).toLocaleDateString('uk-UA')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('to')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {t('loadingProgress')}
            </p>
          </div>
        )}

        {/* Charts */}
        {!loading &&
          progressData &&
          progressData.exercises.length > 0 && (
            <div className="space-y-6">
              {progressData.exercises.map(
                (exerciseProgress) => (
                  <ProgressChart
                    key={exerciseProgress.exercise.id}
                    exerciseProgress={exerciseProgress}
                    metric={metric}
                  />
                )
              )}
            </div>
          )}

        {/* No Data */}
        {!loading &&
          (!progressData ||
            progressData.exercises.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('noProgressDataTitle')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedExercises.length > 0
                  ? t('noProgressDataForSelected')
                  : t('startTrackingToSeeCharts')}
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setShowExerciseSelector(true)
                }
              >
                {t('selectDifferentExercises')}
              </Button>
            </div>
          )}

        {/* Exercise Selector Modal */}
        {showExerciseSelector && (
          <ExerciseSelector
            selectedExercises={selectedExercises}
            onSelectionChange={
              handleExerciseSelectionChange
            }
            onClose={() => setShowExerciseSelector(false)}
          />
        )}

        {/* Toast Notifications */}
        <ToastContainer
          toasts={toasts}
          onRemove={removeToast}
        />
      </div>
    </div>
  )
}
