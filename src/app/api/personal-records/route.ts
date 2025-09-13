import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/personal-records - Get all personal records for the user
export async function GET() {
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

    const personalRecords = await prisma.personalRecord.findMany({
      where: { userId: user.id },
      include: {
        exercise: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(personalRecords)
  } catch (error) {
    console.error('Error fetching personal records:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/personal-records - Create or update a personal record
export async function POST(request: Request) {
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

    const { exerciseId, recordType = 'weight', oneRepMax, maxReps, unit = 'kg', notes } = await request.json()

    if (!exerciseId) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 })
    }

    if (recordType === 'weight' && (!oneRepMax || oneRepMax <= 0)) {
      return NextResponse.json({ error: 'Positive 1RM value is required for weight-based records' }, { status: 400 })
    }

    if (recordType === 'reps' && (!maxReps || maxReps <= 0)) {
      return NextResponse.json({ error: 'Positive max reps value is required for rep-based records' }, { status: 400 })
    }

    // Check if exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    })

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    // Upsert personal record (update if exists, create if not)
    const personalRecord = await prisma.personalRecord.upsert({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: exerciseId,
        },
      },
      update: {
        recordType,
        ...(recordType === 'weight'
          ? { oneRepMax: parseFloat(oneRepMax), maxReps: null }
          : { maxReps: parseInt(maxReps), oneRepMax: null }),
        unit,
        notes,
        dateSet: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        exerciseId,
        recordType,
        ...(recordType === 'weight'
          ? { oneRepMax: parseFloat(oneRepMax), maxReps: null }
          : { maxReps: parseInt(maxReps), oneRepMax: null }),
        unit,
        notes,
        dateSet: new Date(),
      },
      include: {
        exercise: true,
      },
    })

    return NextResponse.json(personalRecord, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating personal record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
