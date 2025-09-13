import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    return NextResponse.json({
      authenticated: !!session,
      session: session
        ? {
            email: session.user?.email,
            name: session.user?.name,
            userId: (session as any).userId,
          }
        : null,
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      {
        error: 'Auth test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

