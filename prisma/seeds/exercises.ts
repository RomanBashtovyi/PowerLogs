import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const exercisesSeedData = [
  // Strength Exercises
  {
    name: 'Bench Press',
    description: 'Classic chest building exercise using a barbell',
    instructions:
      '1. Lie on bench with feet flat on floor\n2. Grip barbell slightly wider than shoulders\n3. Lower bar to chest\n4. Press up explosively\n5. Repeat for desired reps',
    muscleGroups: JSON.stringify(['chest', 'triceps', 'shoulders']),
    equipment: 'Штанга',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Squat',
    description: 'Fundamental lower body exercise targeting legs and glutes',
    instructions:
      '1. Stand with feet shoulder-width apart\n2. Lower body by bending knees and hips\n3. Keep chest up and knees tracking over toes\n4. Descend until thighs parallel to floor\n5. Drive through heels to return to start',
    muscleGroups: JSON.stringify(['legs', 'glutes']),
    equipment: 'Штанга',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Deadlift',
    description: 'Full-body compound exercise focusing on posterior chain',
    instructions:
      '1. Stand with feet hip-width apart\n2. Bend at hips and knees to grip bar\n3. Keep back straight and chest up\n4. Drive through heels and extend hips\n5. Stand tall with shoulders back',
    muscleGroups: JSON.stringify(['back', 'legs', 'glutes']),
    equipment: 'Штанга',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Pull-up',
    description: 'Upper body pulling exercise using body weight',
    instructions:
      '1. Hang from pull-up bar with arms extended\n2. Pull body up until chin over bar\n3. Lower with control to starting position\n4. Keep core engaged throughout movement',
    muscleGroups: JSON.stringify(['back', 'biceps']),
    equipment: 'Власна вага',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Push-up',
    description: 'Classic bodyweight chest and triceps exercise',
    instructions:
      '1. Start in plank position\n2. Lower body until chest nearly touches floor\n3. Push up to starting position\n4. Keep body in straight line throughout',
    muscleGroups: JSON.stringify(['chest', 'triceps', 'shoulders']),
    equipment: 'Власна вага',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Dumbbell Row',
    description: 'Unilateral back exercise using dumbbells',
    instructions:
      '1. Place one knee and hand on bench\n2. Hold dumbbell in opposite hand\n3. Pull elbow back and up\n4. Squeeze shoulder blade at top\n5. Lower with control',
    muscleGroups: JSON.stringify(['back', 'biceps']),
    equipment: 'Гантелі',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Overhead Press',
    description: 'Shoulder building exercise pressing weight overhead',
    instructions:
      '1. Stand with feet shoulder-width apart\n2. Hold barbell at shoulder level\n3. Press straight up overhead\n4. Lower with control to shoulders\n5. Keep core tight throughout',
    muscleGroups: JSON.stringify(['shoulders', 'triceps']),
    equipment: 'Штанга',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Barbell Curl',
    description: 'Isolation exercise targeting the biceps',
    instructions:
      '1. Stand with feet hip-width apart\n2. Hold barbell with underhand grip\n3. Curl bar up to chest level\n4. Squeeze biceps at top\n5. Lower with control',
    muscleGroups: JSON.stringify(['biceps']),
    equipment: 'Штанга',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Tricep Dips',
    description: 'Bodyweight exercise targeting triceps',
    instructions:
      '1. Place hands on edge of bench or chair\n2. Lower body by bending elbows\n3. Push back up to starting position\n4. Keep elbows close to body',
    muscleGroups: JSON.stringify(['triceps']),
    equipment: 'Власна вага',
    category: 'strength' as const,
    isCustom: false,
  },
  {
    name: 'Plank',
    description: 'Core stability exercise holding a static position',
    instructions:
      '1. Start in push-up position\n2. Lower to forearms\n3. Hold straight line from head to heels\n4. Keep core engaged and breathe normally\n5. Hold for desired time',
    muscleGroups: JSON.stringify(['abs']),
    equipment: 'Власна вага',
    category: 'strength' as const,
    isCustom: false,
  },

  // Cardio Exercises
  {
    name: 'Running',
    description: 'Classic cardiovascular exercise',
    instructions:
      '1. Start with warm-up walk\n2. Gradually increase pace to comfortable run\n3. Maintain steady breathing\n4. Land on midfoot\n5. Cool down with walk',
    muscleGroups: JSON.stringify(['cardio', 'legs']),
    equipment: '',
    category: 'cardio' as const,
    isCustom: false,
  },
  {
    name: 'Cycling',
    description: 'Low-impact cardiovascular exercise',
    instructions:
      '1. Adjust seat height properly\n2. Start with easy pace\n3. Gradually increase intensity\n4. Maintain steady cadence\n5. Cool down gradually',
    muscleGroups: JSON.stringify(['cardio', 'legs']),
    equipment: 'Кардіо',
    category: 'cardio' as const,
    isCustom: false,
  },
  {
    name: 'Burpees',
    description: 'Full-body high-intensity exercise',
    instructions:
      '1. Start standing\n2. Drop into squat position\n3. Jump back to plank\n4. Do push-up (optional)\n5. Jump feet back to squat\n6. Jump up with arms overhead',
    muscleGroups: JSON.stringify(['cardio', 'chest', 'legs']),
    equipment: 'Власна вага',
    category: 'cardio' as const,
    isCustom: false,
  },
  {
    name: 'Jumping Jacks',
    description: 'Simple cardio exercise for warm-up or conditioning',
    instructions:
      '1. Start with feet together, arms at sides\n2. Jump feet apart while raising arms overhead\n3. Jump back to starting position\n4. Maintain steady rhythm\n5. Land softly on feet',
    muscleGroups: JSON.stringify(['cardio']),
    equipment: 'Власна вага',
    category: 'cardio' as const,
    isCustom: false,
  },

  // Flexibility Exercises
  {
    name: 'Downward Dog',
    description: 'Yoga pose that stretches and strengthens',
    instructions:
      '1. Start on hands and knees\n2. Tuck toes under\n3. Lift hips up and back\n4. Straighten legs if possible\n5. Hold and breathe deeply',
    muscleGroups: JSON.stringify(['back', 'legs']),
    equipment: 'Власна вага',
    category: 'flexibility' as const,
    isCustom: false,
  },
  {
    name: "Child's Pose",
    description: 'Relaxing yoga pose for back and hip stretching',
    instructions:
      '1. Kneel on floor\n2. Touch big toes together\n3. Sit back on heels\n4. Lean forward with arms extended\n5. Rest forehead on ground\n6. Breathe and relax',
    muscleGroups: JSON.stringify(['back']),
    equipment: 'Власна вага',
    category: 'flexibility' as const,
    isCustom: false,
  },
  {
    name: 'Hamstring Stretch',
    description: 'Stretch for the back of the thighs',
    instructions:
      '1. Sit with one leg extended\n2. Bend other leg with foot against inner thigh\n3. Lean forward toward extended leg\n4. Hold stretch for 30 seconds\n5. Switch legs and repeat',
    muscleGroups: JSON.stringify(['legs']),
    equipment: 'Власна вага',
    category: 'flexibility' as const,
    isCustom: false,
  },
  {
    name: 'Shoulder Stretch',
    description: 'Stretch for shoulder and chest muscles',
    instructions:
      '1. Stand tall with good posture\n2. Bring one arm across chest\n3. Use other arm to gently pull\n4. Hold for 30 seconds\n5. Switch arms and repeat',
    muscleGroups: JSON.stringify(['shoulders']),
    equipment: 'Власна вага',
    category: 'flexibility' as const,
    isCustom: false,
  },

  // Sport-specific exercises
  {
    name: 'Box Jumps',
    description: 'Plyometric exercise for explosive power',
    instructions:
      '1. Stand in front of sturdy box\n2. Bend knees and swing arms back\n3. Jump explosively onto box\n4. Land softly with bent knees\n5. Step down carefully',
    muscleGroups: JSON.stringify(['legs', 'glutes']),
    equipment: 'Інше',
    category: 'sport' as const,
    isCustom: false,
  },
  {
    name: 'Medicine Ball Slam',
    description: 'Explosive full-body exercise',
    instructions:
      '1. Hold medicine ball overhead\n2. Engage core and slam ball down\n3. Squat down to pick up ball\n4. Return to standing position\n5. Repeat with force',
    muscleGroups: JSON.stringify(['abs', 'shoulders', 'back']),
    equipment: 'Інше',
    category: 'sport' as const,
    isCustom: false,
  },
]

export async function seedExercises() {
  console.log('🌱 Seeding exercises...')

  // Check if exercises already exist
  const existingExercises = await prisma.exercise.count({
    where: { isCustom: false },
  })

  if (existingExercises > 0) {
    console.log('✅ System exercises already exist, skipping seed')
    return
  }

  // Insert exercises
  for (const exercise of exercisesSeedData) {
    await prisma.exercise.create({
      data: exercise,
    })
  }

  console.log(`✅ Seeded ${exercisesSeedData.length} exercises`)
}

export default seedExercises
