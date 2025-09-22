import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return []
}

const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  description: z.string().optional(),
  date: z.string().datetime(),
  duration: z.number().optional(),
  notes: z.string().optional(),
  isTemplate: z.boolean().default(false),
})

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/workouts/[id] - Get specific workout
export async function GET(request: NextRequest, { params }: RouteParams) {
  console.log('GET /api/workouts/[id] called with params:', params)
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session?.user?.email)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const workout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: true,
            sets: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    return NextResponse.json(workout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/workouts/[id] - Update workout
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
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingWorkout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = workoutSchema.parse(body)

    const workout = await prisma.workout.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: true,
            sets: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    return NextResponse.json(workout)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error updating workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/workouts/[id] - Delete workout
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
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingWorkout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    await prisma.workout.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Workout deleted successfully' })
  } catch (error) {
    console.error('Error deleting workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
