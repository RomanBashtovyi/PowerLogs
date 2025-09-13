const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addTestWorkouts() {
  try {
    // Знайти користувача Roman
    let user = await prisma.user.findFirst({
      where: { email: 'roman.bashtovyy@gmail.com' },
    })

    if (!user) {
      console.log('User not found. Please check the email.')
      return
    }

    // Видалити існуючі тренування для чистого тесту
    console.log('Cleaning existing workouts...')
    await prisma.set.deleteMany({
      where: {
        workoutExercise: {
          workout: {
            userId: user.id,
          },
        },
      },
    })

    await prisma.workoutExercise.deleteMany({
      where: {
        workout: {
          userId: user.id,
        },
      },
    })

    await prisma.workout.deleteMany({
      where: { userId: user.id },
    })

    console.log(`Adding workouts for user: ${user.email}`)

    // Знайти базові вправи
    const exercises = {
      benchPress: await prisma.exercise.findFirst({ where: { name: { contains: 'Bench Press' } } }),
      squat: await prisma.exercise.findFirst({ where: { name: { contains: 'Squat' } } }),
      deadlift: await prisma.exercise.findFirst({ where: { name: { contains: 'Deadlift' } } }),
      pullUp: await prisma.exercise.findFirst({ where: { name: { contains: 'Pull' } } }),
      pushUp: await prisma.exercise.findFirst({ where: { name: { contains: 'Push' } } }),
      plank: await prisma.exercise.findFirst({ where: { name: { contains: 'Plank' } } }),
    }

    // Якщо немає вправ, створимо базові
    if (!exercises.benchPress) {
      console.log('Creating basic exercises...')

      const basicExercises = [
        {
          name: 'Bench Press',
          muscleGroups: '["chest", "triceps", "shoulders"]',
          category: 'strength',
          equipment: 'barbell',
        },
        { name: 'Squat', muscleGroups: '["legs", "glutes"]', category: 'strength', equipment: 'barbell' },
        { name: 'Deadlift', muscleGroups: '["back", "legs", "glutes"]', category: 'strength', equipment: 'barbell' },
        { name: 'Pull Up', muscleGroups: '["back", "biceps"]', category: 'strength', equipment: 'bodyweight' },
        {
          name: 'Push Up',
          muscleGroups: '["chest", "triceps", "shoulders"]',
          category: 'strength',
          equipment: 'bodyweight',
        },
        { name: 'Plank', muscleGroups: '["abs"]', category: 'strength', equipment: 'bodyweight' },
        {
          name: 'Overhead Press',
          muscleGroups: '["shoulders", "triceps"]',
          category: 'strength',
          equipment: 'barbell',
        },
        { name: 'Barbell Row', muscleGroups: '["back", "biceps"]', category: 'strength', equipment: 'barbell' },
      ]

      for (const ex of basicExercises) {
        await prisma.exercise.create({
          data: {
            ...ex,
            isCustom: false,
            isTrackedByDefault: true,
          },
        })
      }

      // Перезавантажити вправи
      exercises.benchPress = await prisma.exercise.findFirst({ where: { name: 'Bench Press' } })
      exercises.squat = await prisma.exercise.findFirst({ where: { name: 'Squat' } })
      exercises.deadlift = await prisma.exercise.findFirst({ where: { name: 'Deadlift' } })
      exercises.pullUp = await prisma.exercise.findFirst({ where: { name: 'Pull Up' } })
      exercises.pushUp = await prisma.exercise.findFirst({ where: { name: 'Push Up' } })
      exercises.plank = await prisma.exercise.findFirst({ where: { name: 'Plank' } })
    }

    // Дати для тренувань (останні 3 тижні)
    const today = new Date()
    const workoutDates = []
    for (let i = 20; i >= 0; i -= 2) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      workoutDates.push(date)
    }

    // Тренувальні програми з прогресією
    const workoutPrograms = [
      // Тиждень 1
      {
        name: 'Upper Body Push',
        exercises: [
          {
            exercise: exercises.benchPress,
            sets: [
              { weight: 60, reps: 8 },
              { weight: 60, reps: 8 },
              { weight: 60, reps: 6 },
            ],
          },
          {
            exercise: exercises.pushUp,
            sets: [
              { weight: 0, reps: 15 },
              { weight: 0, reps: 12 },
              { weight: 0, reps: 10 },
            ],
          },
        ],
      },
      {
        name: 'Lower Body',
        exercises: [
          {
            exercise: exercises.squat,
            sets: [
              { weight: 80, reps: 10 },
              { weight: 80, reps: 8 },
              { weight: 85, reps: 6 },
            ],
          },
          {
            exercise: exercises.deadlift,
            sets: [
              { weight: 100, reps: 5 },
              { weight: 100, reps: 5 },
              { weight: 105, reps: 3 },
            ],
          },
        ],
      },
      {
        name: 'Upper Body Pull',
        exercises: [
          {
            exercise: exercises.pullUp,
            sets: [
              { weight: 0, reps: 6 },
              { weight: 0, reps: 5 },
              { weight: 0, reps: 4 },
            ],
          },
          {
            exercise: exercises.plank,
            sets: [
              { weight: 0, reps: 45 },
              { weight: 0, reps: 45 },
              { weight: 0, reps: 30 },
            ],
          },
        ],
      },
      // Тиждень 2 - прогресія
      {
        name: 'Upper Body Push',
        exercises: [
          {
            exercise: exercises.benchPress,
            sets: [
              { weight: 62.5, reps: 8 },
              { weight: 62.5, reps: 8 },
              { weight: 62.5, reps: 7 },
            ],
          },
          {
            exercise: exercises.pushUp,
            sets: [
              { weight: 0, reps: 16 },
              { weight: 0, reps: 14 },
              { weight: 0, reps: 12 },
            ],
          },
        ],
      },
      {
        name: 'Lower Body',
        exercises: [
          {
            exercise: exercises.squat,
            sets: [
              { weight: 82.5, reps: 10 },
              { weight: 82.5, reps: 9 },
              { weight: 87.5, reps: 6 },
            ],
          },
          {
            exercise: exercises.deadlift,
            sets: [
              { weight: 105, reps: 5 },
              { weight: 105, reps: 5 },
              { weight: 110, reps: 3 },
            ],
          },
        ],
      },
      {
        name: 'Upper Body Pull',
        exercises: [
          {
            exercise: exercises.pullUp,
            sets: [
              { weight: 0, reps: 7 },
              { weight: 0, reps: 6 },
              { weight: 0, reps: 5 },
            ],
          },
          {
            exercise: exercises.plank,
            sets: [
              { weight: 0, reps: 50 },
              { weight: 0, reps: 50 },
              { weight: 0, reps: 40 },
            ],
          },
        ],
      },
      // Тиждень 3 - більша прогресія
      {
        name: 'Upper Body Push',
        exercises: [
          {
            exercise: exercises.benchPress,
            sets: [
              { weight: 65, reps: 8 },
              { weight: 65, reps: 8 },
              { weight: 65, reps: 8 },
            ],
          },
          {
            exercise: exercises.pushUp,
            sets: [
              { weight: 0, reps: 18 },
              { weight: 0, reps: 16 },
              { weight: 0, reps: 14 },
            ],
          },
        ],
      },
      {
        name: 'Lower Body',
        exercises: [
          {
            exercise: exercises.squat,
            sets: [
              { weight: 85, reps: 10 },
              { weight: 85, reps: 10 },
              { weight: 90, reps: 8 },
            ],
          },
          {
            exercise: exercises.deadlift,
            sets: [
              { weight: 110, reps: 5 },
              { weight: 110, reps: 5 },
              { weight: 115, reps: 4 },
            ],
          },
        ],
      },
      {
        name: 'Full Body',
        exercises: [
          {
            exercise: exercises.pullUp,
            sets: [
              { weight: 0, reps: 8 },
              { weight: 0, reps: 7 },
              { weight: 0, reps: 6 },
            ],
          },
          {
            exercise: exercises.pushUp,
            sets: [
              { weight: 0, reps: 20 },
              { weight: 0, reps: 18 },
              { weight: 0, reps: 15 },
            ],
          },
          {
            exercise: exercises.plank,
            sets: [
              { weight: 0, reps: 60 },
              { weight: 0, reps: 55 },
              { weight: 0, reps: 50 },
            ],
          },
        ],
      },
    ]

    // Створити тренування
    for (let i = 0; i < workoutDates.length && i < workoutPrograms.length; i++) {
      const program = workoutPrograms[i]
      const date = workoutDates[i]

      console.log(`Creating workout: ${program.name} for ${date.toDateString()}`)

      const workout = await prisma.workout.create({
        data: {
          name: program.name,
          description: `Автоматично згенероване тренування з прогресією`,
          date: date,
          duration: 45 + Math.floor(Math.random() * 30), // 45-75 хвилин
          userId: user.id,
          notes: `Тренування ${i + 1}/10. Прогресія в базових вправах.`,
        },
      })

      // Додати вправи до тренування
      for (let j = 0; j < program.exercises.length; j++) {
        const exerciseData = program.exercises[j]

        if (!exerciseData.exercise) {
          console.log(`Skipping exercise - not found`)
          continue
        }

        const workoutExercise = await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: exerciseData.exercise.id,
            order: j + 1,
            notes: `${exerciseData.sets.length} підходи`,
          },
        })

        // Додати підходи
        for (let k = 0; k < exerciseData.sets.length; k++) {
          const setData = exerciseData.sets[k]
          await prisma.set.create({
            data: {
              workoutExerciseId: workoutExercise.id,
              weight: setData.weight,
              reps: setData.reps,
              order: k + 1,
              completed: true,
              isWarmup: k === 0 && setData.weight > 50, // Перший підхід з великою вагою = розминка
              rpe: 6 + Math.floor(Math.random() * 3), // RPE 6-8
            },
          })
        }
      }
    }

    console.log(`✅ Successfully created ${workoutDates.length} workouts with progression!`)
    console.log(`📊 Check your progress in the app now!`)
  } catch (error) {
    console.error('Error adding test workouts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestWorkouts()
