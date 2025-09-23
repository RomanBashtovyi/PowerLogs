import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('=== AUTHORIZE CALLED ===')
        console.log('Credentials received:', { email: credentials?.email, hasPassword: !!credentials?.password })
        console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET)
        console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)

        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          console.log('Looking up user in database...')
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          console.log('User lookup result:', user ? `Found user ${user.id}` : 'User not found')

          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          console.log('Comparing passwords...')
          const isValid = await bcrypt.compare(credentials.password, user.password)
          console.log('Password comparison result:', isValid)

          if (!isValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('Authentication successful for user:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email.split('@')[0],
          }
        } catch (error) {
          console.error('Auth error:', error)
          console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback:', { hasUser: !!user, tokenEmail: token.email })
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { sessionEmail: session.user?.email, tokenEmail: token.email })
      if (token?.userId && session.user) {
        session.user.id = token.userId as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  debug: true, // Enable debug for production to see logs
  secret: process.env.NEXTAUTH_SECRET,
}
