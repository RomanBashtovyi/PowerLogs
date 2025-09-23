export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  console.log('=== REGISTER API CALLED ===')
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)

  try {
    console.log('Parsing request body...')
    const { email, password } = await request.json()
    console.log('Request data:', { email, hasPassword: !!password })

    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json({ error: "Email і пароль обов'язкові" }, { status: 400 })
    }

    console.log('Checking if user already exists...')
    // Check if user already exists
    const exists = await prisma.user.findUnique({ where: { email } })
    console.log('User exists check:', exists ? 'User exists' : 'User does not exist')

    if (exists) {
      console.log('User already exists:', email)
      return NextResponse.json({ error: 'Користувач вже існує' }, { status: 409 })
    }

    console.log('Hashing password...')
    // Hash password and create user
    const hash = await bcrypt.hash(password, 10)
    console.log('Password hashed successfully')

    console.log('Creating user in database...')
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name: email.split('@')[0], // Default name from email
      },
    })

    console.log('User created successfully:', user.id)
    return NextResponse.json({ success: true, message: 'Користувач створений успішно' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      {
        error: 'Внутрішня помилка сервера',
        details:
          process.env.NODE_ENV === 'development'
            ? (error as Error)?.message
            : error instanceof Error
              ? error.message
              : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
