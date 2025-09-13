import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ExerciseDetailClient } from '@/components/pages'

interface ExerciseDetailPageProps {
  params: {
    id: string
  }
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <ExerciseDetailClient exerciseId={params.id} />
}
