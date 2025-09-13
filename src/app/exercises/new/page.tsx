import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { NewExerciseClient } from '@/components/pages'

export default async function NewExercisePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <NewExerciseClient />
}
