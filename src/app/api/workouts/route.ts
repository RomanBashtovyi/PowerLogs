import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Schema for workout creation/update
const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  description: z.string().optional(),
  date: z.string().datetime(),
  duration: z.number().optional(),
  notes: z.string().optional(),
  isTemplate: z.boolean().default(false),
})

// GET /api/workouts - Get user's workouts
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const isTemplate = searchParams.get('template') === 'true'
    const timeframeDays = parseInt(searchParams.get('timeframeDays') || '0')

    const where: any = {
      userId: user.id,
      isTemplate,
    }

    if (search) {
      where.OR = [{ name: { contains: search } }, { description: { contains: search } }]
    }

    if (!isNaN(timeframeDays) && timeframeDays > 0) {
      const since = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000)
      where.date = { gte: since }
    }

    const [workouts, total] = await Promise.all([
      prisma.workout.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit,
        include: {
          exercises: {
            include: {
              exercise: true,
              sets: true,
            },
          },
        },
      }),
      prisma.workout.count({ where }),
    ])

    return NextResponse.json({
      workouts,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/workouts - Create new workout
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
    const validatedData = workoutSchema.parse(body)

    const workout = await prisma.workout.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId: user.id,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    })

    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
