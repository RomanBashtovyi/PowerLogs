import { ReactNode } from 'react'
import { AuthSession } from './auth'

export interface BaseComponentProps {
  children?: ReactNode
  className?: string
}

export interface PageProps {
  params?: Record<string, string>
  searchParams?: Record<string, string | string[] | undefined>
}

export interface DashboardClientProps {
  session: AuthSession
}

export interface NavigationProps {
  className?: string
}

export interface ProviderProps {
  children: ReactNode
}

export interface ThemeToggleProps {
  className?: string
}

export interface LanguageToggleProps {
  className?: string
}
