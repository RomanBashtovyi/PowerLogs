import {
  translations,
  TranslationKey,
} from '@/lib/translations'

export function useTranslations() {
  const t = (key: TranslationKey): string => {
    return translations[key] || key
  }

  return { t }
}

