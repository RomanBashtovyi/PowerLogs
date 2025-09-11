'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? 'Помилка реєстрації')
      return
    }

    setSuccess(true)
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold mb-4">Реєстрація</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Успішна реєстрація! Тепер увійдіть.</p>}
        <Button type="submit" disabled={loading} variant="fitness" className="w-full">
          {loading ? 'Реєстрація…' : 'Зареєструватися'}
        </Button>
      </form>
    </main>
  )
}
