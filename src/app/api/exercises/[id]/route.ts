import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export async function generateStaticParams() {
  return []
}

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  description: z.string().optional(),
  instructions: z.string().optional(),
  muscleGroups: z.string(),
  equipment: z.string().optional(),
  category: z.enum(['strength', 'cardio', 'flexibility', 'sport']),
  imageUrl: z.string().optional(),
})

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/exercises/[id] - Get specific exercise
export async function GET(request: NextRequest, { params }: RouteParams) {
  console.log('GET /api/exercises/[id] called with params:', params)
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

    const exercise = await prisma.exercise.findFirst({
      where: {
        id: params.id,
        OR: [
          { isCustom: false }, // System exercises
          { isCustom: true, userId: user.id }, // User's custom exercises
        ],
      },
    })

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    return NextResponse.json(exercise)
  } catch (error) {
    console.error('Error fetching exercise:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/exercises/[id] - Update exercise (only custom exercises)
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

    // Check if exercise exists and is custom and belongs to user
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        id: params.id,
        isCustom: true,
        userId: user.id,
      },
    })

    if (!existingExercise) {
      return NextResponse.json(
        {
          error: 'Exercise not found or you can only edit custom exercises',
        },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = exerciseSchema.parse(body)

    const exercise = await prisma.exercise.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(exercise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error updating exercise:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/exercises/[id] - Delete exercise (only custom exercises)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  console.log('DELETE /api/exercises/[id] called with params:', params)
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

    // Check if exercise exists and is custom and belongs to user
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        id: params.id,
        isCustom: true,
        userId: user.id,
      },
    })

    if (!existingExercise) {
      return NextResponse.json(
        {
          error: 'Exercise not found or you can only delete custom exercises',
        },
        { status: 404 }
      )
    }

    await prisma.exercise.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Exercise deleted successfully' })
  } catch (error) {
    console.error('Error deleting exercise:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
