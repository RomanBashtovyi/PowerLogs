// Exercise translations for system exercises
export const exerciseTranslations = {
  uk: {
    // Strength exercises
    'Bench Press': {
      name: 'Жим лежачи',
      description: "Класична вправа для розвитку грудних м'язів з використанням штанги",
    },
    Squat: {
      name: 'Присідання',
      description: 'Фундаментальна вправа для нижньої частини тіла, яка працює з ногами та сідницями',
    },
    Deadlift: {
      name: 'Станова тяга',
      description: "Комплексна вправа для всього тіла з акцентом на задню ланцюг м'язів",
    },
    'Pull-up': {
      name: 'Підтягування',
      description: "Вправа для верхньої частини тіла з власною вагою для м'язів спини",
    },
    'Push-up': {
      name: 'Віджимання',
      description: "Класична вправа з власною вагою для грудних м'язів та трицепсів",
    },
    'Dumbbell Row': {
      name: 'Тяга гантелі',
      description: 'Односторонна вправа для спини з використанням гантелей',
    },
    'Overhead Press': {
      name: 'Жим стоячи',
      description: 'Вправа для розвитку плечей, піднімаючи вагу над головою',
    },
    'Barbell Curl': {
      name: 'Згинання рук зі штангою',
      description: 'Ізольована вправа для біцепсів',
    },
    'Tricep Dips': {
      name: 'Зворотні віджимання',
      description: 'Вправа з власною вагою для трицепсів',
    },
    Plank: {
      name: 'Планка',
      description: 'Статична вправа для стабілізації корпусу',
    },

    // Cardio exercises
    Running: {
      name: 'Біг',
      description: 'Класична кардіо вправа',
    },
    Cycling: {
      name: 'Велосипед',
      description: 'Низькоударна кардіо вправа',
    },
    Burpees: {
      name: 'Бурпі',
      description: 'Високоінтенсивна вправа для всього тіла',
    },
    'Jumping Jacks': {
      name: 'Стрибки з розведенням',
      description: 'Проста кардіо вправа для розминки або кондиціонування',
    },

    // Flexibility exercises
    'Downward Dog': {
      name: 'Собака мордою вниз',
      description: 'Поза йоги для розтягування та зміцнення',
    },
    "Child's Pose": {
      name: 'Поза дитини',
      description: 'Розслаблююча поза йоги для розтягування спини та стегон',
    },
    'Hamstring Stretch': {
      name: 'Розтягування задньої поверхні стегна',
      description: 'Розтягування для задньої частини стегон',
    },
    'Shoulder Stretch': {
      name: 'Розтягування плечей',
      description: "Розтягування для плечових та грудних м'язів",
    },

    // Sport exercises
    'Box Jumps': {
      name: 'Стрибки на бокс',
      description: 'Пліометрична вправа для розвитку вибухової сили',
    },
    'Medicine Ball Slam': {
      name: 'Удари медболом',
      description: 'Вибухова вправа для всього тіла',
    },
  },
}

// Helper function to get translated exercise name and description
export function getTranslatedExercise(exerciseName: string, currentLang: string = 'uk') {
  const langTranslations = exerciseTranslations[currentLang as keyof typeof exerciseTranslations]
  const translation = langTranslations?.[exerciseName as keyof typeof langTranslations]

  return {
    name: translation?.name || exerciseName,
    description: translation?.description || null,
  }
}

export const translations = {
  uk: {
    // Navigation
    dashboard: 'Дашборд',
    workouts: 'Тренування',
    exercises: 'Вправи',
    templates: 'Шаблони',
    profile: 'Профіль',
    signOut: 'Вийти',

    // Dashboard
    welcomeBack: 'Ласкаво просимо',
    trackFitness: 'Відслідковуйте свій фітнес прогрес',
    quickStats: 'Швидка статистика',
    totalWorkouts: 'Всього тренувань',
    thisWeek: 'Цього тижня',
    customExercises: 'Власні вправи',
    quickActions: 'Швидкі дії',
    startNewWorkout: 'Почати тренування',
    viewAllWorkouts: 'Всі тренування',
    exerciseLibrary: 'Бібліотека вправ',
    createExercise: 'Створити вправу',
    exerciseName: 'Назва вправи',
    exerciseDescription: 'Опис вправи',
    exerciseInstructions: 'Інструкції',
    muscleGroups: "М'язові групи",
    equipment: 'Обладнання',
    category: 'Категорія',
    imageUrl: 'URL зображення',
    strength: 'Силові',
    cardio: 'Кардіо',
    flexibility: 'Гнучкість',
    sport: 'Спортивні',

    // Exercise Details
    exerciseDetails: 'Деталі вправи',
    instructions: 'Інструкції',
    exerciseImage: 'Зображення вправи',
    backToExercises: 'Назад до вправ',
    editExercise: 'Редагувати вправу',
    updateExerciseDetails: 'Оновіть деталі вправи',
    noInstructions: 'Інструкції не надано',
    noDescription: 'Опис не наданий',
    created: 'Створено',
    builtInExercises: 'Вбудовані вправи',
    yourCustomExercises: 'Ваші власні вправи',
    exercisesAvailable: 'вправ доступно',
    addCustomExercise: 'Додати власну вправу',
    allCategories: 'Всі категорії',
    allMuscleGroups: "Всі групи м'язів",
    clearFilters: 'Очистити фільтри',
    noExercisesFound: 'Вправи не знайдено',
    adjustSearchFilters: 'Спробуйте змінити пошук або фільтри',
    startByAddingFirst: 'Почніть з додавання першої власної вправи',
    recentActivity: 'Остання активність',
    noRecentWorkouts: 'Поки що немає тренувань',
    startFirstWorkout: 'Почніть своє перше тренування!',
    navigation: 'Навігація',

    // Auth
    email: 'Електронна пошта',
    password: 'Пароль',
    signIn: 'Увійти',
    signUp: 'Зареєструватися',
    register: 'Реєстрація',
    login: 'Вхід',
    createAccount: 'Створити акаунт',
    alreadyHaveAccount: 'Вже маєте акаунт?',
    dontHaveAccount: 'Немає акаунту?',

    // Common
    save: 'Зберегти',
    cancel: 'Скасувати',
    delete: 'Видалити',
    edit: 'Редагувати',
    add: 'Додати',
    loading: 'Завантаження...',
    error: 'Помилка',
    success: 'Успішно',
    search: 'Пошук',
    filter: 'Фільтр',
    date: 'Дата',
    name: 'Назва',
    description: 'Опис',
    notes: 'Нотатки',

    // Workouts
    workoutName: 'Назва тренування',
    workoutDescription: 'Опис тренування',
    workoutDate: 'Дата тренування',
    workoutDuration: 'Тривалість',
    workoutNotes: 'Нотатки',
    createWorkout: 'Створити тренування',
    editWorkout: 'Редагувати тренування',
    deleteWorkout: 'Видалити тренування',
    noWorkouts: 'Немає тренувань',
    addFirstWorkout: 'Додайте своє перше тренування',
    workoutCreated: 'Тренування створено',
    workoutUpdated: 'Тренування оновлено',
    workoutDeleted: 'Тренування видалено',
    recentWorkouts: 'Останні тренування',
    allWorkouts: 'Всі тренування',
    workoutTemplates: 'Шаблони тренувань',

    // Exercise form
    exerciseNameRequired: "Назва вправи обов'язкова",
    atLeastOneMuscleGroup: "Потрібно вибрати хоча б одну групу м'язів",
    exerciseCreatedSuccess: 'Вправа успішно створена!',
    exerciseUpdatedSuccess: 'Вправа успішно оновлена!',
    failedToSaveExercise: 'Не вдалося зберегти вправу. Спробуйте ще раз.',
    createExerciseButton: 'Створити вправу',
    updateExerciseButton: 'Оновити вправу',
    noEquipment: 'Без обладнання',

    // Landing page
    appTitle: 'PowerLogs',
    appDescription: 'Твій персональний фітнес трекер для відслідковування тренувань та прогресу',
    startTraining: 'Почати тренування',
    signInButton: 'Увійти',
  },

  en: {
    // Navigation
    dashboard: 'Dashboard',
    workouts: 'Workouts',
    exercises: 'Exercises',
    templates: 'Templates',
    profile: 'Profile',
    signOut: 'Sign Out',

    // Dashboard
    welcomeBack: 'Welcome back',
    trackFitness: 'Track your fitness journey',
    quickStats: 'Quick Stats',
    totalWorkouts: 'Total Workouts',
    thisWeek: 'This Week',
    customExercises: 'Custom Exercises',
    quickActions: 'Quick Actions',
    startNewWorkout: 'Start New Workout',
    viewAllWorkouts: 'View All Workouts',
    exerciseLibrary: 'Exercise Library',
    createExercise: 'Create Exercise',
    exerciseName: 'Exercise Name',
    exerciseDescription: 'Exercise Description',
    exerciseInstructions: 'Instructions',
    muscleGroups: 'Muscle Groups',
    equipment: 'Equipment',
    category: 'Category',
    imageUrl: 'Image URL',
    strength: 'Strength',
    cardio: 'Cardio',
    flexibility: 'Flexibility',
    sport: 'Sport',

    // Exercise Details
    exerciseDetails: 'Exercise Details',
    instructions: 'Instructions',
    exerciseImage: 'Exercise Image',
    backToExercises: 'Back to Exercises',
    editExercise: 'Edit Exercise',
    updateExerciseDetails: 'Update your exercise details',
    noInstructions: 'No instructions provided',
    noDescription: 'No description provided',
    created: 'Created',
    builtInExercises: 'Built-in Exercises',
    yourCustomExercises: 'Your Custom Exercises',
    exercisesAvailable: 'exercises available',
    addCustomExercise: 'Add Custom Exercise',
    allCategories: 'All Categories',
    allMuscleGroups: 'All Muscle Groups',
    clearFilters: 'Clear Filters',
    noExercisesFound: 'No exercises found',
    adjustSearchFilters: 'Try adjusting your search or filters',
    startByAddingFirst: 'Start by adding your first custom exercise',
    recentActivity: 'Recent Activity',
    noRecentWorkouts: 'No recent workouts yet',
    startFirstWorkout: 'Start your first workout!',
    navigation: 'Navigation',

    // Auth
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    register: 'Register',
    login: 'Login',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",

    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    search: 'Search',
    filter: 'Filter',
    date: 'Date',
    name: 'Name',
    description: 'Description',
    notes: 'Notes',

    // Workouts
    workoutName: 'Workout Name',
    workoutDescription: 'Workout Description',
    workoutDate: 'Workout Date',
    workoutDuration: 'Duration',
    workoutNotes: 'Notes',
    createWorkout: 'Create Workout',
    editWorkout: 'Edit Workout',
    deleteWorkout: 'Delete Workout',
    noWorkouts: 'No workouts',
    addFirstWorkout: 'Add your first workout',
    workoutCreated: 'Workout created',
    workoutUpdated: 'Workout updated',
    workoutDeleted: 'Workout deleted',
    recentWorkouts: 'Recent workouts',
    allWorkouts: 'All workouts',
    workoutTemplates: 'Workout templates',

    // Exercise form
    exerciseNameRequired: 'Exercise name is required',
    atLeastOneMuscleGroup: 'At least one muscle group is required',
    exerciseCreatedSuccess: 'Exercise created successfully!',
    exerciseUpdatedSuccess: 'Exercise updated successfully!',
    failedToSaveExercise: 'Failed to save exercise. Please try again.',
    createExerciseButton: 'Create Exercise',
    updateExerciseButton: 'Update Exercise',
    noEquipment: 'No equipment',

    // Landing page
    appTitle: 'PowerLogs',
    appDescription: 'Your personal fitness tracker for monitoring workouts and progress',
    startTraining: 'Start Training',
    signInButton: 'Sign In',
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.uk
