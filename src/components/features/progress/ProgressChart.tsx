'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Button } from '@/components/ui/button'

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

interface ProgressChartProps {
  exerciseProgress: ExerciseProgress
  metric?: 'weight' | 'volume' | 'reps'
}

export default function ProgressChart({ exerciseProgress, metric = 'weight' }: ProgressChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'volume' | 'reps'>(metric)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const { exercise, data, summary } = exerciseProgress

  // Format data for charts
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('uk-UA', {
      month: 'short',
      day: 'numeric',
    }),
    fullDate: point.date,
    weight: point.maxWeight,
    volume: Math.round(point.totalVolume),
    reps: point.maxReps,
    sets: point.sets.length,
  }))

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'weight':
        return 'Max Weight (kg)'
      case 'volume':
        return 'Total Volume (kg)'
      case 'reps':
        return 'Max Reps'
      default:
        return 'Value'
    }
  }

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'weight':
        return '#8884d8'
      case 'volume':
        return '#82ca9d'
      case 'reps':
        return '#ffc658'
      default:
        return '#8884d8'
    }
  }

  const getImprovementValue = () => {
    if (selectedMetric === 'weight') return summary.improvement.weight
    if (selectedMetric === 'volume') return summary.improvement.volume

    // Calculate reps improvement
    if (data.length > 1) {
      const first = data[0].maxReps
      const last = data[data.length - 1].maxReps
      return (((last - first) / first) * 100).toFixed(1)
    }
    return '0'
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-input rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{data.fullDate}</p>
          <div className="mt-2 space-y-1">
            <p style={{ color: getMetricColor() }}>
              {getMetricLabel()}: <strong>{payload[0].value}</strong>
            </p>
            <p className="text-xs text-muted-foreground">Sets completed: {data.sets}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="fitness-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{exercise.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{exercise.category}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          <div className="flex rounded-md border border-input">
            {['weight', 'volume', 'reps'].map((metricOption) => (
              <Button
                key={metricOption}
                variant={selectedMetric === metricOption ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedMetric(metricOption as any)}
                className="rounded-none first:rounded-l-md last:rounded-r-md"
              >
                {metricOption === 'weight' ? 'Weight' : metricOption === 'volume' ? 'Volume' : 'Reps'}
              </Button>
            ))}
          </div>

          <div className="flex rounded-md border border-input">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              className="rounded-none rounded-l-md"
            >
              📈
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="rounded-none rounded-r-md"
            >
              📊
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{summary.totalWorkouts}</p>
          <p className="text-sm text-muted-foreground">Workouts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">+{getImprovementValue()}%</p>
          <p className="text-sm text-muted-foreground">Improvement</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {selectedMetric === 'weight'
              ? summary.firstRecord.maxWeight
              : selectedMetric === 'volume'
                ? Math.round(summary.firstRecord.totalVolume)
                : summary.firstRecord.maxReps}
          </p>
          <p className="text-sm text-muted-foreground">First</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {selectedMetric === 'weight'
              ? summary.lastRecord.maxWeight
              : selectedMetric === 'volume'
                ? Math.round(summary.lastRecord.totalVolume)
                : summary.lastRecord.maxReps}
          </p>
          <p className="text-sm text-muted-foreground">Latest</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor()}
                strokeWidth={3}
                dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getMetricColor(), strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={selectedMetric} fill={getMetricColor()} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* No data message */}
      {chartData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No progress data available for this exercise</p>
        </div>
      )}
    </div>
  )
}
