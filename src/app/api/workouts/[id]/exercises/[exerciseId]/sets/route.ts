import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const setCreateSchema = z
  .object({
    weight: z.number().min(0, 'Weight must be non-negative').nullable().optional(),
    reps: z.number().min(1, 'Reps must be at least 1'),
    rpe: z.number().min(1).max(10).nullable().optional(),
    isWarmup: z.boolean().default(false),
    completed: z.boolean().default(false),
    restTime: z.number().min(0).nullable().optional(),
    isPercentageBased: z.boolean().default(false),
    percentageOf1RM: z.number().min(1).max(200, 'Percentage must be between 1% and 200%').nullable().optional(),
  })
  .refine(
    (data) => {
      // Either weight OR percentage must be provided
      if (data.isPercentageBased) {
        return data.percentageOf1RM !== null && data.percentageOf1RM !== undefined
      } else {
        return data.weight !== null && data.weight !== undefined
      }
    },
    {
      message: 'Either weight or percentage of 1RM must be provided',
      path: ['weight'],
    }
  )

interface RouteParams {
  params: {
    id: string
    exerciseId: string
  }
}

// GET /api/workouts/[id]/exercises/[exerciseId]/sets - Get all sets for workout exercise
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

    // Get workout exercise with sets
    const workoutExercise = await prisma.workoutExercise.findFirst({
      where: {
        id: params.exerciseId,
        workoutId: params.id,
      },
      include: {
        sets: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!workoutExercise) {
      return NextResponse.json({ error: 'Workout exercise not found' }, { status: 404 })
    }

    return NextResponse.json({ sets: workoutExercise.sets })
  } catch (error) {
    console.error('Error fetching sets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/workouts/[id]/exercises/[exerciseId]/sets - Create new set
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

    // Check if workout exercise exists
    const workoutExercise = await prisma.workoutExercise.findFirst({
      where: {
        id: params.exerciseId,
        workoutId: params.id,
      },
    })

    if (!workoutExercise) {
      return NextResponse.json({ error: 'Workout exercise not found' }, { status: 404 })
    }

    const body = await request.json()
    console.log('Received set data:', body)
    const validatedData = setCreateSchema.parse(body)
    console.log('Validated set data:', validatedData)

    // Get the next order for this workout exercise
    const lastSet = await prisma.set.findFirst({
      where: { workoutExerciseId: params.exerciseId },
      orderBy: { order: 'desc' },
    })

    const nextOrder = lastSet ? lastSet.order + 1 : 1

    const newSet = await prisma.set.create({
      data: {
        ...validatedData,
        workoutExerciseId: params.exerciseId,
        order: nextOrder,
      },
    })

    return NextResponse.json(newSet, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error creating set:', error.errors)
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
          message: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        { status: 400 }
      )
    }

    console.error('Error creating set:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
