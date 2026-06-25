export type LanguageCode = 'en' | 'zh' | 'da'

export type UILanguage = {
  code: LanguageCode
  label: string
  labelNative: string
}

export type TargetLanguage = {
  code: LanguageCode
  label: string        // name in English (fallback)
  labelNative: string  // name in its own language
}

export const UI_LANGUAGES: UILanguage[] = [
  { code: 'en', label: 'English', labelNative: 'English' },
  { code: 'zh', label: 'Chinese', labelNative: '中文' },
]

export const TARGET_LANGUAGES: TargetLanguage[] = [
  { code: 'en', label: 'English', labelNative: 'English' },
  { code: 'da', label: 'Danish',  labelNative: 'Dansk' },
]

// Returns the language name as it would appear to a speaker of uiLanguage.
// e.g. getTargetLabel('da', 'zh') → '丹麦语'
export function getTargetLabel(lang: TargetLanguage, uiLanguage: LanguageCode): string {
  try {
    const dn = new Intl.DisplayNames([uiLanguage], { type: 'language' })
    return dn.of(lang.code) ?? lang.label
  } catch {
    return lang.label
  }
}

export type Translations = {
  appTagline: string
  appDesc: string
  startBtn: string
  peekBtn: string
  levelQuestion: string
  interestQuestion: string
  multiSelect: string
  nextBtn: string
  enterBtn: string
  todayThing: string
  explain: string
  makeStory: string
  trySentence: string
  save: string
  saved: string
  notReally: string
  meaning: string
  usage: string
  tone: string
  thisWeek: string
  iSpeak: string
  iLearn: string
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  zh: {
    appTagline: '学也行，不学也行，都行。',
    appDesc: '一个不逼你打卡的 AI 语言学习 App。\n想起来就看两眼，不想学也没事。',
    startBtn: '开始随便学一点',
    peekBtn: '先看看',
    levelQuestion: '你现在大概什么水平？',
    interestQuestion: '你想多看哪类内容？',
    multiSelect: '可以多选',
    nextBtn: '下一步',
    enterBtn: '进去随便看看',
    todayThing: '今日表达',
    explain: '讲讲',
    makeStory: '编个故事',
    trySentence: '我试着造句',
    save: '保存',
    saved: '✓ 已保存',
    notReally: '不是真的学习 →',
    meaning: '意思',
    usage: '用法',
    tone: '语气',
    thisWeek: '这周捡到',
    iSpeak: '我说',
    iLearn: '我想学',
  },
  en: {
    appTagline: "Learn. Or don't. Either way.",
    appDesc: "An AI language app that won't nag you.\nOpen it when you feel like it.",
    startBtn: 'Start learning (kinda)',
    peekBtn: 'Just look around',
    levelQuestion: "What's your level?",
    interestQuestion: 'What do you want to learn about?',
    multiSelect: 'Pick as many as you like',
    nextBtn: 'Next',
    enterBtn: 'Enter',
    todayThing: "Today's phrase",
    explain: 'Explain',
    makeStory: 'Make a story',
    trySentence: 'Try a sentence',
    save: 'Save',
    saved: '✓ Saved',
    notReally: 'Not really studying →',
    meaning: 'Meaning',
    usage: 'Usage',
    tone: 'Tone',
    thisWeek: 'Picked up this week',
    iSpeak: 'I speak',
    iLearn: 'I want to learn',
  },
  da: {
    appTagline: 'Lær. Eller lad være. Begge dele er fint.',
    appDesc: 'En AI-sprogapp der ikke maser på.\nÅbn den når du har lyst.',
    startBtn: 'Begynd at lære (lidt)',
    peekBtn: 'Kig bare',
    levelQuestion: 'Hvad er dit niveau?',
    interestQuestion: 'Hvad vil du gerne lære om?',
    multiSelect: 'Vælg så mange du vil',
    nextBtn: 'Næste',
    enterBtn: 'Gå ind',
    todayThing: 'Dagens udtryk',
    explain: 'Forklar',
    makeStory: 'Lav en historie',
    trySentence: 'Prøv en sætning',
    save: 'Gem',
    saved: '✓ Gemt',
    notReally: 'Ikke rigtig studie →',
    meaning: 'Betydning',
    usage: 'Brug',
    tone: 'Tone',
    thisWeek: 'Fundet denne uge',
    iSpeak: 'Jeg taler',
    iLearn: 'Jeg vil lære',
  },
}
