import type { LanguageCode } from '../data/languages'

export type CommonTranslations = {
  appName: string
  appTagline: string
  appDesc: string
  iSpeak: string
  iLearn: string
  nextBtn: string
  enterBtn: string
  save: string
  saved: string
}

export const COMMON: Record<LanguageCode, CommonTranslations> = {
  en: {
    appName: 'KINDA',
    appTagline: "Fluent? Eventually. Maybe.",
    appDesc: "An AI language app that won't nag you.\nOpen it when you feel like it.",
    iSpeak: 'I speak',
    iLearn: 'I want to learn',
    nextBtn: 'Next',
    enterBtn: 'Enter',
    save: 'Save',
    saved: '✓ Saved',
  },
  zh: {
    appName: '都行',
    appTagline: '学也行，不学也行，都行。',
    appDesc: '一个不逼你打卡的 AI 语言学习 App。\n想起来就看两眼，不想学也没事。',
    iSpeak: '我说',
    iLearn: '我想学',
    nextBtn: '下一步',
    enterBtn: '进去随便看看',
    save: '保存',
    saved: '✓ 已保存',
  },
  da: {
    appName: 'KINDA',
    appTagline: 'Lær. Eller lad være. Begge dele er fint.',
    appDesc: 'En AI-sprogapp der ikke maser på.\nÅbn den når du har lyst.',
    iSpeak: 'Jeg taler',
    iLearn: 'Jeg vil lære',
    nextBtn: 'Næste',
    enterBtn: 'Gå ind',
    save: 'Gem',
    saved: '✓ Gemt',
  },
}
