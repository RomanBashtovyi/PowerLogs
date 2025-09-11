export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-fitness-blue mb-4">🏋️‍♂️ GetPowerLogs</h1>
        <p className="text-lg text-gray-600 mb-8">
          Твій персональний фітнес трекер для відслідковування тренувань та прогресу
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-fitness-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Почати Тренування
          </button>
          <button className="bg-fitness-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Переглянути Статистику
          </button>
        </div>
      </div>
    </main>
  )
}
