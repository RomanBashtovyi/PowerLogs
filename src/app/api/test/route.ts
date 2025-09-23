import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const exerciseCount = await prisma.exercise.count()

    return NextResponse.json({
      message: 'API is working',
      database: {
        users: userCount,
        exercises: exerciseCount,
        connected: true,
      },
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        message: 'API is working but database has issues',
        error: error instanceof Error ? error.message : 'Unknown error',
        database: {
          connected: false,
        },
      },
      { status: 500 }
    )
  }
}
