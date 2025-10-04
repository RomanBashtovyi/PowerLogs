'use client'

import Link from 'next/link'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout'

export default function HomeClient() {
  const { t } = useTranslations()

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">💪</div>
              <span className="text-xl font-bold text-primary">
                PowerLogs
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Увійти
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Реєстрація
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              Фітнес-трекер для спортсменів
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Відслідковуйте свій
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {' '}
                прогрес
              </span>
              <br />
              як професіонал
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Система управління тренуваннями з детальною
              аналітикою, персональними рекордами та
              інтуїтивним інтерфейсом для мобільних
              пристроїв.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg px-8 py-4 h-auto"
                >
                  <span className="mr-2">🚀</span>
                  Почати безкоштовно
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-4 h-auto"
                >
                  Дізнатися більше
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Інструменти для вашого прогресу
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Все необхідне для професійного планування та
              відстеження тренувань
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Детальна аналітика
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Графіки прогресу 1RM, об&apos;єму та
                повторень для будь-якого періоду.
                Відстежуйте тренди та коригуйте програму на
                основі даних.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Персональні рекорди
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Встановлюйте та відстежуйте PR для кожної
                вправи. Автоматичні розрахунки 1RM з різних
                формул.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Шаблони тренувань
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Готові програми та власні шаблони.
                Створюйте, зберігайте та використовуйте
                улюблені тренування за один клік.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Мобільна оптимізація
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Адаптивний дизайн для залу. Великі кнопки,
                таймери відпочинку, швидкий ввід даних - все
                для комфортних тренувань.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Швидкий ввід
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Миттєве додавання сетів з підтримкою RPE,
                відсотків від 1RM, таймерів відпочинку та
                нотаток.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Безпека даних
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Ваші дані захищені сучасними стандартами
                безпеки. Приватність та надійність на
                першому місці.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Як це працює
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Простий процес від планування до аналізу
              результатів
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Створіть план
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Оберіть з бібліотеки готових вправ або
                створіть власний шаблон тренування.
                Налаштуйте порядок, нотатки та цілі.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Записуйте тренування
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Легко фіксуйте вагу, повтори, RPE та час
                відпочинку. Використовуйте таймери та
                автоматичні розрахунки.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Аналізуйте прогрес
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Дивіться графіки зростання, встановлюйте
                нові рекорди та коригуйте програму на основі
                даних.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Готові розпочати свій шлях до нових рекордів?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Приєднуйтесь до тисяч спортсменів, які вже
            використовують PowerLogs для досягнення своїх
            цілей
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg px-8 py-4 h-auto"
              >
                Створити акаунт безкоштовно
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-4 h-auto"
              >
                У мене вже є акаунт
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-2xl">💪</div>
              <span className="text-xl font-bold text-primary">
                PowerLogs
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Професійний фітнес-трекер для серйозних
              спортсменів
            </p>
            <div className="text-sm text-muted-foreground">
              © 2024 PowerLogs. Зроблено з ❤️ для
              спортсменів.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
