'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { ThemeToggle, LanguageToggle } from '@/components/layout'

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
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">🏋️‍♂️ {t('appTitle')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 px-4">
            {t('appDescription') || 'Plan your training, track progress and set personal records with clarity.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
            <Link href="/register" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg px-8 py-3">
                🚀 {t('startTraining') || 'Get started'}
              </Button>
            </Link>
            <Link href="/login" className="flex-1 sm:flex-none">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                👤 {t('signInButton') || 'Sign in'}
              </Button>
            </Link>
          </div>

          {/* Key benefits */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="fitness-card p-6 text-left">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-foreground mb-1">Аналітика прогресу</h3>
              <p className="text-sm text-muted-foreground">
                Графіки 1RM, об’єму та повторень для вибраних вправ за будь-який період.
              </p>
            </div>
            <div className="fitness-card p-6 text-left">
              <div className="text-3xl mb-2">🧰</div>
              <h3 className="font-semibold text-foreground mb-1">Шаблони тренувань</h3>
              <p className="text-sm text-muted-foreground">
                Готові плани і власні шаблони, щоб стартувати в один клік.
              </p>
            </div>
            <div className="fitness-card p-6 text-left">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-foreground mb-1">Мобільний під зал</h3>
              <p className="text-sm text-muted-foreground">
                Великі торч-таргети, таймери відпочинку, швидкі дії — усе для тренувань.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="fitness-card p-6">
              <h4 className="font-semibold mb-2">1. Створи план</h4>
              <p className="text-sm text-muted-foreground">Обери з бібліотеки або створи власний шаблон тренування.</p>
            </div>
            <div className="fitness-card p-6">
              <h4 className="font-semibold mb-2">2. Записуй сети</h4>
              <p className="text-sm text-muted-foreground">
                Легко фіксуй вагу, повтори, RPE і відпочинок під час підходів.
              </p>
            </div>
            <div className="fitness-card p-6">
              <h4 className="font-semibold mb-2">3. Аналізуй</h4>
              <p className="text-sm text-muted-foreground">
                Дивись, як зростають 1RM та обсяг — і коригуй навантаження.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3">
                Почати безкоштовно
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
