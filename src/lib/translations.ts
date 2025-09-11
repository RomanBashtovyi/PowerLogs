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
    recentActivity: 'Остання активність',
    noRecentWorkouts: 'Поки що немає тренувань',
    startFirstWorkout: 'Почніть своє перше тренування!',
    navigation: 'Навігація',

    // Auth
    email: 'Електронна пошта',
    password: 'Пароль',
    name: "Ім'я",
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
    recentActivity: 'Recent Activity',
    noRecentWorkouts: 'No recent workouts yet',
    startFirstWorkout: 'Start your first workout!',
    navigation: 'Navigation',

    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
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

    // Landing page
    appTitle: 'PowerLogs',
    appDescription: 'Your personal fitness tracker for monitoring workouts and progress',
    startTraining: 'Start Training',
    signInButton: 'Sign In',
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.uk
