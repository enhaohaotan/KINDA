import type { LanguageCode } from '../data/languages'
import { COMMON } from './common'
import { AUTH } from './auth'
import { LEARNING } from './learning'

export type { CommonTranslations } from './common'
export type { AuthTranslations } from './auth'
export type { LearningTranslations } from './learning'

export function t(lang: LanguageCode) {
  return COMMON[lang] ?? COMMON['en']
}

export function tAuth(lang: LanguageCode) {
  return AUTH[lang] ?? AUTH['en']
}

export function tLearning(lang: LanguageCode) {
  return LEARNING[lang] ?? LEARNING['en']
}
