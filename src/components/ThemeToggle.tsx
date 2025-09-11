'use client'

import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'system':
        return '🔄'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'Auto'
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2"
      title={`Current theme: ${getThemeLabel()}`}
    >
      <span className="text-lg">{getThemeIcon()}</span>
      <span className="hidden sm:inline text-sm">{getThemeLabel()}</span>
    </Button>
  )
}
