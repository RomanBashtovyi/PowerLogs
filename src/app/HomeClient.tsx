'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'

export default function HomeClient() {
  const { t } = useLanguage()

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header with theme and language toggles */}
      <header className="flex justify-end p-4 gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">🏋️‍♂️ {t('appTitle')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 px-4">{t('appDescription')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/register" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg px-8 py-3">
                🚀 {t('startTraining')}
              </Button>
            </Link>
            <Link href="/login" className="flex-1 sm:flex-none">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                👤 {t('signInButton')}
              </Button>
            </Link>
          </div>

          {/* Features showcase for mobile */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="fitness-card p-6 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-foreground mb-2">Відслідковування</h3>
              <p className="text-sm text-muted-foreground">Записуйте всі ваші тренування та прогрес</p>
            </div>
            <div className="fitness-card p-6 text-center">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="font-semibold text-foreground mb-2">Вправи</h3>
              <p className="text-sm text-muted-foreground">Велика бібліотека вправ з інструкціями</p>
            </div>
            <div className="fitness-card p-6 text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold text-foreground mb-2">Мобільний</h3>
              <p className="text-sm text-muted-foreground">Оптимізовано для використання в залі</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
