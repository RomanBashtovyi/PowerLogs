import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const workoutExerciseSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise ID is required'),
  order: z.number().min(0, 'Order must be non-negative'),
  notes: z.string().optional(),
})

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/workouts/[id]/exercises - Get exercises in workout
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Check if workout exists and belongs to user
    const workout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    const workoutExercises = await prisma.workoutExercise.findMany({
      where: { workoutId: params.id },
      orderBy: { order: 'asc' },
      include: {
        exercise: true,
        sets: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json({ exercises: workoutExercises })
  } catch (error) {
    console.error('Error fetching workout exercises:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/workouts/[id]/exercises - Add exercise to workout
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Check if workout exists and belongs to user
    const workout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = workoutExerciseSchema.parse(body)

    // Check if exercise exists and user has access to it
    const exercise = await prisma.exercise.findFirst({
      where: {
        id: validatedData.exerciseId,
        OR: [
          { isCustom: false }, // System exercise
          { isCustom: true, userId: user.id }, // User's custom exercise
        ],
      },
    })

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found or access denied' }, { status: 404 })
    }

    // Create workout exercise
    const workoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId: params.id,
        exerciseId: validatedData.exerciseId,
        order: validatedData.order,
        notes: validatedData.notes,
      },
      include: {
        exercise: true,
        sets: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(workoutExercise, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error adding exercise to workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
