import { getLocales } from 'expo-localization'
import type { LanguageCode } from '../data/languages'

const SUPPORTED: LanguageCode[] = ['zh', 'da', 'en']

// Maps a BCP-47 locale tag to a supported LanguageCode, falling back to 'en'.
// e.g. 'zh-Hans-CN' → 'zh', 'da-DK' → 'da', 'fr-FR' → 'en'
export function detectUILanguage(): LanguageCode {
  const locales = getLocales()
  for (const locale of locales) {
    const lang = locale.languageCode?.toLowerCase()
    if (lang && (SUPPORTED as string[]).includes(lang)) {
      return lang as LanguageCode
    }
  }
  return 'en'
}
