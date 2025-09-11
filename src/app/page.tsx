import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">🏋️‍♂️ GetPowerLogs</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Твій персональний фітнес трекер для відслідковування тренувань та прогресу
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="fitness" size="lg">
            Почати Тренування
          </Button>
          <Button variant="outline" size="lg">
            Переглянути Статистику
          </Button>
        </div>
      </div>
    </main>
  )
}
