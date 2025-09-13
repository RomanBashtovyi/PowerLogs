'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLanguage } from '../providers'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { Button } from '../ui/button'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Don't show navigation on auth pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
    return null
  }

  if (!session) {
    return null
  }

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), icon: '📊' },
    { href: '/workouts', label: t('workouts'), icon: '🏋️' },
    { href: '/templates', label: 'Templates', icon: '📋' },
    { href: '/exercises', label: t('exercises'), icon: '💪' },
    { href: '/dashboard/progress-tracking', label: t('progressTracking'), icon: '📈' },
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <span className="text-lg font-bold text-primary">💪 PowerLogs</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageToggle />

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="text-lg">☰</span>
              </Button>

              {/* Desktop user menu */}
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-xs"
                >
                  {t('signOut')}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background">
              <div className="px-2 py-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive ? 'text-primary bg-accent' : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  )
                })}

                {/* Mobile user menu */}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {session.user?.name || session.user?.email}
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      signOut({ callbackUrl: '/login' })
                    }}
                    className="w-full text-left px-3 py-3 text-base text-destructive hover:bg-accent rounded-md transition-colors"
                  >
                    {t('signOut')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  isActive ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="md:hidden h-16" />
    </>
  )
}
