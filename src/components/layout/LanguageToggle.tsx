'use client'

import { useLanguage } from '../providers'
import { Button } from '../ui/button'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'uk' ? 'en' : 'uk')
  }

  const getLanguageFlag = () => {
    return language === 'uk' ? '🇺🇦' : '🇺🇸'
  }

  const getLanguageLabel = () => {
    return language === 'uk' ? 'УКР' : 'ENG'
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2"
      title={`Switch to ${language === 'uk' ? 'English' : 'Ukrainian'}`}
    >
      <span className="text-lg">{getLanguageFlag()}</span>
      <span className="hidden sm:inline text-sm font-medium">{getLanguageLabel()}</span>
    </Button>
  )
}
