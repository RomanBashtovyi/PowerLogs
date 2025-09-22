import { PrismaClient } from '@prisma/client'
import { seedExercises } from './seeds/exercises'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    await seedExercises()
    // Ensure uniqueness on reruns by removing strict count check inside seeder or upserting here if needed
    // Example sanity check
    const count = await prisma.exercise.count({ where: { isCustom: false } })
    console.log(`ℹ️ System exercises in DB: ${count}`)
    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
