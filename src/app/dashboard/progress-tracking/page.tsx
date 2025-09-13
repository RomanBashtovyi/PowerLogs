import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ProgressTrackingClient } from '@/components/pages'

export default async function ProgressTrackingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <ProgressTrackingClient />
}
