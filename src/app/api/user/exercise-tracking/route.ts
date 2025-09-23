import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const trackingUpdateSchema = z.object({
  exerciseId: z.string(),
  isTracked: z.boolean(),
})

// GET /api/user/exercise-tracking - Get user's exercise tracking preferences
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

    // Get all exercises with tracking status
    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [
          { isCustom: false }, // System exercises
          { isCustom: true, userId: user.id }, // User's custom exercises
        ],
      },
      include: {
        userTracking: {
          where: { userId: user.id },
        },
      },
      orderBy: [
        { isTrackedByDefault: 'desc' }, // Tracked by default first
        { isCustom: 'asc' }, // System exercises first
        { name: 'asc' },
      ],
    })

    // Transform data to include tracking status
    const exercisesWithTracking = exercises.map((exercise) => ({
      ...exercise,
      isTracked: exercise.userTracking.length > 0 ? exercise.userTracking[0].isTracked : exercise.isTrackedByDefault, // Default to isTrackedByDefault if no preference set
    }))

    return NextResponse.json({ exercises: exercisesWithTracking })
  } catch (error) {
    console.error('Error fetching exercise tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/user/exercise-tracking - Update exercise tracking preference
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { exerciseId, isTracked } = trackingUpdateSchema.parse(body)

    // Check if exercise exists and user has access
    const exercise = await prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        OR: [
          { isCustom: false }, // System exercise
          { isCustom: true, userId: user.id }, // User's custom exercise
        ],
      },
    })

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found or access denied' }, { status: 404 })
    }

    // Upsert tracking preference
    const tracking = await prisma.userExerciseTracking.upsert({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: exerciseId,
        },
      },
      update: {
        isTracked,
      },
      create: {
        userId: user.id,
        exerciseId,
        isTracked,
      },
    })

    return NextResponse.json(tracking)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error updating exercise tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/user/exercise-tracking/auto-setup - Auto-setup tracking for new user
export async function PUT(request: NextRequest) {
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

    // Get all exercises that should be tracked by default
    const baseExercises = await prisma.exercise.findMany({
      where: { isTrackedByDefault: true },
    })

    // Create tracking records for base exercises
    const trackingPromises = baseExercises.map((exercise) =>
      prisma.userExerciseTracking.upsert({
        where: {
          userId_exerciseId: {
            userId: user.id,
            exerciseId: exercise.id,
          },
        },
        update: {}, // Don't update if already exists
        create: {
          userId: user.id,
          exerciseId: exercise.id,
          isTracked: true,
        },
      })
    )

    await Promise.all(trackingPromises)

    return NextResponse.json({
      message: 'Auto-setup completed',
      trackedExercises: baseExercises.length,
    })
  } catch (error) {
    console.error('Error auto-setting up exercise tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
