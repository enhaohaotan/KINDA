import { expressions } from '../data/expressions'
import { expressionsDa } from '../data/expressions-da'
import type { LanguageCode } from '../data/languages'
import type { Expression } from '../data/expressions'

export function getExpressions(learningLanguage: LanguageCode): Expression[] {
  if (learningLanguage === 'da') return expressionsDa
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

// Re-export for screens that only need t()
export { t, tAuth, tLearning } from '../i18n'
