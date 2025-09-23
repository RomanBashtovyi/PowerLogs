import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const workoutExerciseUpdateSchema = z.object({
  order: z.number().min(0, 'Order must be non-negative').optional(),
  notes: z.string().optional(),
})

interface RouteParams {
  params: {
    id: string
    exerciseId: string
  }
}

// PUT /api/workouts/[id]/exercises/[exerciseId] - Update workout exercise
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
    const validatedData = workoutExerciseUpdateSchema.parse(body)

    const updatedWorkoutExercise = await prisma.workoutExercise.update({
      where: { id: params.exerciseId },
      data: validatedData,
      include: {
        exercise: true,
        sets: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedWorkoutExercise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error updating workout exercise:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/workouts/[id]/exercises/[exerciseId] - Remove exercise from workout
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

    await prisma.workoutExercise.delete({
      where: { id: params.exerciseId },
    })

    return NextResponse.json({ message: 'Exercise removed from workout successfully' })
  } catch (error) {
    console.error('Error removing exercise from workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
