import { expressions } from '../data/expressions'
import { expressionsDa } from '../data/expressions-da'
import { TRANSLATIONS, type LanguageCode } from '../data/languages'
import type { Expression } from '../data/expressions'

export function getExpressions(targetLanguage: LanguageCode): Expression[] {
  if (targetLanguage === 'da') return expressionsDa
  return expressions
}

export function getMeaning(expr: Expression, uiLanguage: LanguageCode): string {
  if (uiLanguage === 'en') return expr.meaningEn ?? expr.meaningZh
  return expr.meaningZh
}

export function getUsage(expr: Expression, uiLanguage: LanguageCode): string {
  if (uiLanguage === 'en') return expr.usageEn ?? expr.usageZh
  return expr.usageZh
}

export function getTone(expr: Expression, uiLanguage: LanguageCode): string {
  if (uiLanguage === 'en') return expr.toneEn ?? expr.toneZh
  return expr.toneZh
}

export function t(uiLanguage: LanguageCode) {
  return TRANSLATIONS[uiLanguage] ?? TRANSLATIONS['en']
}
