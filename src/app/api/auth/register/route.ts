export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email і пароль обов'язкові" }, { status: 400 })
    }

    // Check if user already exists
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Користувач вже існує' }, { status: 409 })
    }

    // Hash password and create user
    const hash = await bcrypt.hash(password, 10)
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
    return NextResponse.json(
      {
        error: 'Внутрішня помилка сервера',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
