import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { CalculatorClient } from '@/components/pages'

export default async function CalculatorPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }
  return <CalculatorClient session={session} />
}
