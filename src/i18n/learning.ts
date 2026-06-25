import type { LanguageCode } from '../data/languages'

export type LearningTranslations = {
  todayThing: string
  explain: string
  makeStory: string
  trySentence: string
  notReally: string
  meaning: string
  usage: string
  tone: string
  thisWeek: string
}

export const LEARNING: Record<LanguageCode, LearningTranslations> = {
  en: {
    todayThing: "Today's phrase",
    explain: 'Explain',
    makeStory: 'Make a story',
    trySentence: 'Try a sentence',
    notReally: 'Not really studying →',
    meaning: 'Meaning',
    usage: 'Usage',
    tone: 'Tone',
    thisWeek: 'Picked up this week',
  },
  zh: {
    todayThing: '今日表达',
    explain: '讲讲',
    makeStory: '编个故事',
    trySentence: '我试着造句',
    notReally: '不是真的学习 →',
    meaning: '意思',
    usage: '用法',
    tone: '语气',
    thisWeek: '这周捡到',
  },
  da: {
    todayThing: 'Dagens udtryk',
    explain: 'Forklar',
    makeStory: 'Lav en historie',
    trySentence: 'Prøv en sætning',
    notReally: 'Ikke rigtig studie →',
    meaning: 'Betydning',
    usage: 'Brug',
    tone: 'Tone',
    thisWeek: 'Fundet denne uge',
  },
}
