'use client'

import { useState, useEffect } from 'react'
import { getTranslations, type Language } from './translations'
import { getCurrentLanguage } from './language-actions'

export function useTranslations() {
  const [language, setLanguage] = useState<Language>('en')
  const { t } = getTranslations(language)

  useEffect(() => {
    getCurrentLanguage().then(setLanguage)
  }, [])

  return { t, language }
} 