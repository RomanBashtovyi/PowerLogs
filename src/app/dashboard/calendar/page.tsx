import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { CalendarClient } from '@/components/pages'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  return <CalendarClient session={session} />
}
