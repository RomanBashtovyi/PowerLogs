export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: "Email і пароль обов'язкові" }, { status: 400 })

    // Діагностика
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.slice(0, 20))
    console.log(
      'All env keys:',
      Object.keys(process.env).filter((k) => k.includes('DATABASE'))
    )

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'Користувач вже існує' }, { status: 409 })

    const hash = await bcrypt.hash(password, 10)
    await prisma.user.create({ data: { email, password: hash } })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 })
  }
}
