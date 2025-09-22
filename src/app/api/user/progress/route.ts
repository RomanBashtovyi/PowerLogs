import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const progressQuerySchema = z.object({
  exerciseIds: z.string().optional(),
  timeframe: z.union([z.enum(['30', '90', '180', 'all']), z.string()]).default('90'),
  metric: z.union([z.enum(['weight', 'volume', 'reps']), z.string()]).default('weight'),
})

// GET /api/user/progress - Get progress data for selected exercises
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const rawTimeframe = searchParams.get('timeframe') || '90'
    const rawMetric = searchParams.get('metric') || 'weight'
    const query = progressQuerySchema.parse({
      exerciseIds: searchParams.get('exerciseIds') || undefined,
      timeframe: rawTimeframe,
      metric: rawMetric,
    })

    // Calculate date range
    const now = new Date()
    const daysBack = query.timeframe === 'all' ? 365 * 2 : parseInt(query.timeframe)
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Parse exercise IDs
    const exerciseIds = query.exerciseIds ? query.exerciseIds.split(',').filter((id) => id.trim()) : null

    // Get tracked exercises if no specific ones requested
    let targetExercises
    if (exerciseIds && exerciseIds.length > 0) {
      targetExercises = await prisma.exercise.findMany({
        where: {
          id: { in: exerciseIds },
          OR: [{ isCustom: false }, { isCustom: true, userId: user.id }],
        },
      })
    } else {
      // Get exercises that user is tracking or basic exercises
      targetExercises = await prisma.exercise.findMany({
        where: {
          OR: [
            {
              isTrackedByDefault: true,
              isCustom: false,
            },
            {
              userTracking: {
                some: {
                  userId: user.id,
                  isTracked: true,
                },
              },
            },
          ],
        },
        include: {
          userTracking: {
            where: { userId: user.id },
          },
        },
      })
    }

    // Get progress data for each exercise
    const progressData = []

    for (const exercise of targetExercises) {
      // Get all sets for this exercise within timeframe
      const sets = await prisma.set.findMany({
        where: {
          workoutExercise: {
            exerciseId: exercise.id,
            workout: {
              userId: user.id,
              date: {
                gte: startDate,
              },
            },
          },
          completed: true, // Only completed sets
        },
        include: {
          workoutExercise: {
            include: {
              workout: true,
            },
          },
        },
        orderBy: [{ workoutExercise: { workout: { date: 'asc' } } }, { order: 'asc' }],
      })

      if (sets.length === 0) continue

      // Group sets by workout date and calculate metrics
      const dataPoints = new Map()

      sets.forEach((set) => {
        const date = set.workoutExercise.workout.date.toISOString().split('T')[0]

        if (!dataPoints.has(date)) {
          dataPoints.set(date, {
            date,
            maxWeight: 0,
            totalVolume: 0,
            maxReps: 0,
            sets: [],
          })
        }

        const point = dataPoints.get(date)
        point.sets.push(set)
        if (set.weight !== null) {
          point.maxWeight = Math.max(point.maxWeight, set.weight)
          point.totalVolume += set.weight * set.reps
        }
        point.maxReps = Math.max(point.maxReps, set.reps)
      })

      // Convert to array and sort by date
      const chartData = Array.from(dataPoints.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      progressData.push({
        exercise: {
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
        },
        data: chartData,
        summary: {
          totalWorkouts: chartData.length,
          firstRecord: chartData[0],
          lastRecord: chartData[chartData.length - 1],
          improvement: {
            weight:
              chartData.length > 1 && chartData[0].maxWeight > 0
                ? (
                    ((chartData[chartData.length - 1].maxWeight - chartData[0].maxWeight) / chartData[0].maxWeight) *
                    100
                  ).toFixed(1)
                : 0,
            volume:
              chartData.length > 1 && chartData[0].totalVolume > 0
                ? (
                    ((chartData[chartData.length - 1].totalVolume - chartData[0].totalVolume) /
                      chartData[0].totalVolume) *
                    100
                  ).toFixed(1)
                : 0,
          },
        },
      })
    }

    return NextResponse.json({
      exercises: progressData,
      timeframe: query.timeframe,
      metric: query.metric,
      summary: {
        totalExercises: progressData.length,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 })
    }

    console.error('Error fetching progress data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
