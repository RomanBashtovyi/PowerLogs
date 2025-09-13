import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/personal-records/[exerciseId] - Get personal record for specific exercise
export async function GET(request: Request, { params }: { params: { exerciseId: string } }) {
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

    const personalRecord = await prisma.personalRecord.findUnique({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: params.exerciseId,
        },
      },
      include: {
        exercise: true,
      },
    })

    if (!personalRecord) {
      return NextResponse.json({ error: 'Personal record not found' }, { status: 404 })
    }

    return NextResponse.json(personalRecord)
  } catch (error) {
    console.error('Error fetching personal record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/personal-records/[exerciseId] - Delete personal record for specific exercise
export async function DELETE(request: Request, { params }: { params: { exerciseId: string } }) {
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

    const personalRecord = await prisma.personalRecord.findUnique({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: params.exerciseId,
        },
      },
    })

    if (!personalRecord) {
      return NextResponse.json({ error: 'Personal record not found' }, { status: 404 })
    }

    await prisma.personalRecord.delete({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: params.exerciseId,
        },
      },
    })

    return NextResponse.json({ message: 'Personal record deleted successfully' })
  } catch (error) {
    console.error('Error deleting personal record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
