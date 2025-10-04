# 💪 PowerLogs

[![Next.js](https://img.shields.io/badge/Next.js-14.2.32-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.0-000000)](https://next-auth.js.org/)

> Фітнес-трекер для спортсменів з детальною аналітикою прогресу та інтуїтивним інтерфейсом.

## 🎯 Огляд

PowerLogs - це сучасний веб-додаток для відстеження тренувань, який дозволяє спортсменам планувати тренування, фіксувати результати та аналізувати прогрес через детальні графіки та статистику.

### ✨ Ключові особливості

- 📊 **Детальна аналітика** - Графіки прогресу 1RM, об'єму та повторень
- 🎯 **Персональні рекорди** - Встановлення та відстеження PR з автоматичними розрахунками
- 📋 **Шаблони тренувань** - Готові програми та власні шаблони
- 📱 **Мобільна оптимізація** - Адаптивний дизайн для використання в залі
- ⚡ **Швидкий ввід** - Миттєве додавання сетів з підтримкою RPE та відсотків
- 🔒 **Безпека даних** - Захист інформації сучасними стандартами

## 🚀 Технології

### Frontend

- **Next.js 14** - React фреймворк з App Router
- **TypeScript** - Типізація для надійності коду
- **Tailwind CSS** - Utility-first CSS фреймворк
- **Shadcn/ui** - Компоненти інтерфейсу
- **React Hook Form** - Управління формами
- **Zod** - Валідація схем

### Backend

- **Next.js API Routes** - Serverless API
- **Prisma** - ORM для роботи з базою даних
- **PostgreSQL** - Реляційна база даних
- **NextAuth.js** - Аутентифікація та авторизація

### Додаткові інструменти

- **Recharts** - Бібліотека графіків
- **date-fns** - Робота з датами
- **Lucide React** - Іконки

## 📸 Скріншоти

### Головна сторінка

<div align="center">
  <img src="/public/screenshots/home.png" alt="Головна сторінка" width="600" />
</div>

### Дашборд

<div align="center">
  <img src="/public/screenshots/dashoboard.png" alt="Дашборд" width="600" />
</div>

### Тренування

<div align="center">
  <img src="/public/screenshots/workouts.png" alt="Список тренувань" width="600" />
</div>

### Деталі тренування

<div align="center">
  <img src="/public/screenshots/workouts-details.png" alt="Деталі тренування" width="600" />
</div>

### Вправи

<div align="center">
  <img src="/public/screenshots/exercises.png" alt="Бібліотека вправ" width="600" />
</div>

### Шаблони тренувань

<div align="center">
  <img src="/public/screenshots/templates.png" alt="Шаблони тренувань" width="600" />
</div>

### Календар

<div align="center">
  <img src="/public/screenshots/calendar.png" alt="Календар тренувань" width="600" />
</div>

### Відстеження прогресу

<div align="center">
  <img src="/public/screenshots/progress-tracking.png" alt="Відстеження прогресу" width="600" />
</div>

## 🛠️ Встановлення та запуск

### Передумови

- Node.js 18+
- npm або yarn
- PostgreSQL база даних

### 1. Клонування репозиторію

```bash
git clone https://github.com/your-username/powerlogs.git
cd powerlogs
```

### 2. Встановлення залежностей

```bash
npm install
# або
yarn install
```

### 3. Налаштування змінних середовища

Створіть файл `.env.local` в корені проекту:

```env
# База даних
DATABASE_URL="postgresql://username:password@localhost:5432/powerlogs"
DIRECT_URL="postgresql://username:password@localhost:5432/powerlogs"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Supabase (опціонально)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

### 4. Налаштування бази даних

```bash
# Генерація Prisma клієнта
npx prisma generate

# Застосування міграцій
npx prisma db push

# Заповнення початковими даними
npx prisma db seed
```

### 5. Запуск проекту

```bash
# Розробка
npm run dev

# Продакшн збірка
npm run build
npm start
```

Додаток буде доступний за адресою: [http://localhost:3000](http://localhost:3000)

## 📊 Структура проекту

```
powerlogs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API маршрути
│   │   ├── dashboard/         # Дашборд сторінки
│   │   ├── workouts/          # Тренування
│   │   └── exercises/         # Вправи
│   ├── components/            # React компоненти
│   │   ├── ui/               # Базові UI компоненти
│   │   ├── features/         # Функціональні компоненти
│   │   ├── pages/            # Сторінкові компоненти
│   │   └── layout/           # Layout компоненти
│   ├── lib/                  # Утиліти та конфігурація
│   ├── hooks/                # Кастомні React хуки
│   └── types/                # TypeScript типи
├── prisma/                   # Prisma схема та міграції
│   ├── schema.prisma         # Схема бази даних
│   └── seed.ts              # Початкові дані
├── public/                   # Статичні файли
└── docs/                    # Документація
```

## 🗄️ База даних

Проект використовує PostgreSQL з наступною структурою:

### Основні сутності:

- **User** - Користувачі системи
- **Exercise** - Вправи (системні та користувацькі)
- **Workout** - Тренування
- **WorkoutExercise** - Зв'язок тренування з вправами
- **Set** - Підходи/сети
- **PersonalRecord** - Персональні рекорди
- **UserExerciseTracking** - Налаштування відстеження

### Ключові особливості:

- Підтримка відсоткового програмування
- Відстеження RPE (Rate of Perceived Exertion)
- Автоматичні розрахунки 1RM
- Групування вправ за категоріями

## 🔧 API Документація

### Аутентифікація

- `POST /api/auth/signin` - Вхід в систему
- `POST /api/auth/signup` - Реєстрація
- `GET /api/auth/session` - Отримання сесії

### Тренування

- `GET /api/workouts` - Список тренувань
- `POST /api/workouts` - Створення тренування
- `GET /api/workouts/[id]` - Деталі тренування
- `PUT /api/workouts/[id]` - Оновлення тренування
- `DELETE /api/workouts/[id]` - Видалення тренування

### Вправи

- `GET /api/exercises` - Список вправ
- `POST /api/exercises` - Створення вправи
- `GET /api/exercises/[id]` - Деталі вправи
- `PUT /api/exercises/[id]` - Оновлення вправи
- `DELETE /api/exercises/[id]` - Видалення вправи

### Підходи

- `GET /api/workouts/[id]/exercises/[exerciseId]/sets` - Список сетів
- `POST /api/workouts/[id]/exercises/[exerciseId]/sets` - Додавання сету
- `PUT /api/workouts/[id]/exercises/[exerciseId]/sets/[setId]` - Оновлення сету
- `DELETE /api/workouts/[id]/exercises/[exerciseId]/sets/[setId]` - Видалення сету

## 🎨 UI/UX Особливості

### Дизайн система

- **Темна/світла тема** з автоматичним перемиканням
- **Адаптивний дизайн** для всіх пристроїв
- **Консистентна колірна схема** з CSS змінними
- **Сучасна типографіка** з системними шрифтами

### Користувацький досвід

- **Інтуїтивна навігація** з чіткими іконками
- **Швидкий ввід даних** з автозаповненням
- **Валідація в реальному часі**
- **Плавні анімації та переходи**

### Мобільна оптимізація

- **Touch-friendly інтерфейс**
- **Великі кнопки та поля вводу**
- **Оптимізовані форми**
- **Швидкий доступ до основних функцій**

## 🔒 Безпека

- **NextAuth.js** для аутентифікації
- **Валідація всіх входів** з Zod
- **SQL Injection захист** через Prisma
- **XSS захист** з React

## 🚀 Деплой

### Vercel (рекомендовано)

```bash
# Встановлення Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Змінні середовища для продакшну

- `DATABASE_URL` - URL бази даних
- `NEXTAUTH_URL` - URL додатку
- `NEXTAUTH_SECRET` - Секретний ключ

---

⭐ Якщо проект вам сподобався, поставте зірочку!

**Зроблено з ❤️ для спортсменів**
