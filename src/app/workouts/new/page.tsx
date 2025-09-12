import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { NewWorkoutClient } from '@/components/pages'

export default async function NewWorkoutPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <NewWorkoutClient />
}
