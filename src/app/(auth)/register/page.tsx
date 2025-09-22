'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // First, register the user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error ?? 'Помилка реєстрації')
        setLoading(false)
        return
      }

      // If registration successful, automatically sign in
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Реєстрація успішна, але не вдалося автоматично увійти. Спробуйте увійти вручну.')
        setLoading(false)
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        return
      }

      // Success! Redirect to dashboard
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError('Помилка реєстрації')
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-sm p-6 min-h-screen flex flex-col justify-center bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border dark:border-gray-700">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Реєстрація</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 dark:text-green-400 text-sm">Успішна реєстрація! Автоматично входимо...</p>
          )}
          <Button type="submit" disabled={loading} variant="fitness" className="w-full">
            {loading ? (success ? 'Входимо...' : 'Реєстрація…') : 'Зареєструватися'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Вже маєте акаунт?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
