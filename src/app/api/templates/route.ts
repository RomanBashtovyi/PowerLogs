export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const templateCreateSchema = z.object({
  workoutId: z.string().optional(), // ID тренування для конвертації в шаблон
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string(),
        order: z.number(),
        notes: z.string().optional(),
        sets: z
          .array(
            z.object({
              weight: z.number().min(0),
              reps: z.number().min(1),
              rpe: z.number().min(1).max(10).nullable().optional(),
              isWarmup: z.boolean().default(false),
              restTime: z.number().min(0).nullable().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
})

// GET /api/templates - Get all user templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const templates = await prisma.workout.findMany({
      where: {
        userId: user.id,
        isTemplate: true,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/templates - Create new template or convert workout to template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { workoutId, name, description, exercises } = templateCreateSchema.parse(body)

    let template

    if (workoutId) {
      // Convert existing workout to template
      const workout = await prisma.workout.findFirst({
        where: {
          id: workoutId,
          userId: user.id,
        },
        include: {
          exercises: {
            include: {
              exercise: true,
              sets: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      })

      if (!workout) {
        return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
      }

      // Create template based on existing workout
      template = await prisma.workout.create({
        data: {
          name: name || `${workout.name} Template`,
          description: description || workout.description,
          date: new Date(), // Templates use current date as created date
          userId: user.id,
          isTemplate: true,
          duration: workout.duration,
          notes: workout.notes,
        },
      })

      // Copy exercises and sets
      for (const workoutExercise of workout.exercises) {
        const templateExercise = await prisma.workoutExercise.create({
          data: {
            workoutId: template.id,
            exerciseId: workoutExercise.exerciseId,
            order: workoutExercise.order,
            notes: workoutExercise.notes,
          },
        })

        // Copy sets (remove completed status for template)
        for (const set of workoutExercise.sets) {
          await prisma.set.create({
            data: {
              workoutExerciseId: templateExercise.id,
              weight: set.weight,
              reps: set.reps,
              rpe: set.rpe,
              isWarmup: set.isWarmup,
              completed: false, // Templates start as not completed
              order: set.order,
              restTime: set.restTime,
            },
          })
        }
      }
    } else {
      // Create new template from scratch
      template = await prisma.workout.create({
        data: {
          name,
          description,
          date: new Date(),
          userId: user.id,
          isTemplate: true,
        },
      })

      // Add exercises if provided
      if (exercises && exercises.length > 0) {
        for (const exerciseData of exercises) {
          const templateExercise = await prisma.workoutExercise.create({
            data: {
              workoutId: template.id,
              exerciseId: exerciseData.exerciseId,
              order: exerciseData.order,
              notes: exerciseData.notes,
            },
          })

          // Add sets if provided
          if (exerciseData.sets && exerciseData.sets.length > 0) {
            for (let i = 0; i < exerciseData.sets.length; i++) {
              const setData = exerciseData.sets[i]
              await prisma.set.create({
                data: {
                  workoutExerciseId: templateExercise.id,
                  weight: setData.weight,
                  reps: setData.reps,
                  rpe: setData.rpe,
                  isWarmup: setData.isWarmup,
                  completed: false,
                  order: i + 1,
                  restTime: setData.restTime,
                },
              })
            }
          }
        }
      }
    }

    // Return template with exercises
    const createdTemplate = await prisma.workout.findUnique({
      where: { id: template.id },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(createdTemplate, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
