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
