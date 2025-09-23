export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const useTemplateSchema = z.object({
  date: z.string().datetime().optional(), // ISO string for workout date
  name: z.string().optional(), // Override template name
  copyCompletedSets: z.boolean().default(false), // Whether to copy completed status
})

interface RouteParams {
  params: {
    id: string
  }
}

// POST /api/templates/[id]/use - Create workout from template
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Get template with all exercises and sets
    const template = await prisma.workout.findFirst({
      where: {
        id: params.id,
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
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const body = await request.json()
    const { date, name, copyCompletedSets } = useTemplateSchema.parse(body)

    // Create new workout from template
    const workout = await prisma.workout.create({
      data: {
        name: name || template.name,
        description: template.description,
        date: date ? new Date(date) : new Date(),
        userId: user.id,
        isTemplate: false, // This is a real workout, not a template
        duration: template.duration,
        notes: template.notes,
      },
    })

    // Copy all exercises and sets from template
    for (const templateExercise of template.exercises) {
      const workoutExercise = await prisma.workoutExercise.create({
        data: {
          workoutId: workout.id,
          exerciseId: templateExercise.exerciseId,
          order: templateExercise.order,
          notes: templateExercise.notes,
        },
      })

      // Copy all sets from template
      for (const templateSet of templateExercise.sets) {
        await prisma.set.create({
          data: {
            workoutExerciseId: workoutExercise.id,
            weight: templateSet.weight,
            reps: templateSet.reps,
            rpe: templateSet.rpe,
            isWarmup: templateSet.isWarmup,
            completed: copyCompletedSets ? templateSet.completed : false,
            order: templateSet.order,
            restTime: templateSet.restTime,
          },
        })
      }
    }

    // Return created workout with all data
    const createdWorkout = await prisma.workout.findUnique({
      where: { id: workout.id },
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

    return NextResponse.json(createdWorkout, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error using template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
