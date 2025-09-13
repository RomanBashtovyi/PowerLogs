import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Schema for exercise creation/update
const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  description: z.string().optional(),
  instructions: z.string().optional(),
  muscleGroups: z.string(), // JSON string of muscle groups
  equipment: z.string().optional(),
  category: z.enum(['strength', 'cardio', 'flexibility', 'sport']),
  imageUrl: z.string().optional(),
  isCustom: z.boolean().default(true),
})

// GET /api/exercises - Get exercises (system + user's custom)
export async function GET(request: NextRequest) {
  console.log('=== GET /api/exercises called ===')
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'exists' : 'null', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    console.log('User found:', user ? user.id : 'not found')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const muscleGroup = searchParams.get('muscleGroup') || ''

    let where: any = {
      OR: [
        { isCustom: false }, // System exercises
        { isCustom: true, userId: user.id }, // User's custom exercises
      ],
    }

    // Add additional filters only if they exist
    if (search || category || muscleGroup) {
      where = {
        AND: [
          {
            OR: [
              { isCustom: false }, // System exercises
              { isCustom: true, userId: user.id }, // User's custom exercises
            ],
          },
        ],
      }

      if (search) {
        where.AND.push({
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        })
      }

      if (category) {
        where.AND.push({ category })
      }

      if (muscleGroup) {
        where.AND.push({
          muscleGroups: { contains: muscleGroup },
        })
      }
    }

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        orderBy: [
          { isCustom: 'desc' }, // Custom exercises first
          { name: 'asc' },
        ],
        skip: offset,
        take: limit,
      }),
      prisma.exercise.count({ where }),
    ])

    console.log('API: Found', total, 'total exercises,', exercises.filter(e => e.isCustom).length, 'custom')

    return NextResponse.json({
      exercises,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/exercises - Create custom exercise
export async function POST(request: NextRequest) {
  console.log('=== POST /api/exercises called ===')

  try {
    // Check session
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'exists' : 'null', session?.user?.email)

    if (!session?.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    console.log('User found:', user ? user.id : 'not found')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    console.log('Request body:', body)

    const validatedData = exerciseSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Create exercise
    console.log('Creating exercise in database...')
    const exercise = await prisma.exercise.create({
      data: {
        ...validatedData,
        userId: user.id,
        isCustom: true, // User exercises are always custom
      },
    })
    console.log('Exercise created successfully:', exercise.id)

    return NextResponse.json(exercise, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating exercise:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
