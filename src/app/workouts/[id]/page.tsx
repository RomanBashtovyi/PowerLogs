import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { WorkoutDetailClient } from '@/components/pages'

export const dynamic = 'force-dynamic'

interface WorkoutDetailPageProps {
  params: {
    id: string
  }
}

export default async function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <WorkoutDetailClient workoutId={params.id} />
}
