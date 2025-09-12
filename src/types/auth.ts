import { Session } from 'next-auth'

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession extends Session {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
}
