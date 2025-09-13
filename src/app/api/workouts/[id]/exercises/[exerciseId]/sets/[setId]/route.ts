import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const setUpdateSchema = z.object({
  weight: z.number().min(0, 'Weight must be non-negative').nullable().optional(),
  reps: z.number().min(1, 'Reps must be at least 1').optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  isWarmup: z.boolean().optional(),
  completed: z.boolean().optional(),
  restTime: z.number().min(0).nullable().optional(),
  isPercentageBased: z.boolean().optional(),
  percentageOf1RM: z.number().min(1).max(200, 'Percentage must be between 1% and 200%').nullable().optional(),
})

interface RouteParams {
  params: {
    id: string
    exerciseId: string
    setId: string
  }
}

// PUT /api/workouts/[id]/exercises/[exerciseId]/sets/[setId] - Update set
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Check if set exists and belongs to the workout exercise
    const set = await prisma.set.findFirst({
      where: {
        id: params.setId,
        workoutExercise: {
          id: params.exerciseId,
          workoutId: params.id,
        },
      },
    })

    if (!set) {
      return NextResponse.json({ error: 'Set not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = setUpdateSchema.parse(body)

    const updatedSet = await prisma.set.update({
      where: { id: params.setId },
      data: validatedData,
    })

    return NextResponse.json(updatedSet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error updating set:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/workouts/[id]/exercises/[exerciseId]/sets/[setId] - Delete set
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Check if set exists and belongs to the workout exercise
    const set = await prisma.set.findFirst({
      where: {
        id: params.setId,
        workoutExercise: {
          id: params.exerciseId,
          workoutId: params.id,
        },
      },
    })

    if (!set) {
      return NextResponse.json({ error: 'Set not found' }, { status: 404 })
    }

    await prisma.set.delete({
      where: { id: params.setId },
    })

    return NextResponse.json({ message: 'Set deleted successfully' })
  } catch (error) {
    console.error('Error deleting set:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
