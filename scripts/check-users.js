const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany()
    console.log('Found users:', users.length)
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id})`)
      })
    } else {
      console.log('No users found. Please register a user first at /register')
    }

    const workouts = await prisma.workout.count()
    console.log(`Total workouts in database: ${workouts}`)

    const exercises = await prisma.exercise.count()
    console.log(`Total exercises in database: ${exercises}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
