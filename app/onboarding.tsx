import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useUserStore } from '../src/store/userStore'
import { Button } from '../src/components/ui/Button'
import { UI_LANGUAGES, TARGET_LANGUAGES, type LanguageCode } from '../src/data/languages'
import { t } from '../src/lib/i18n'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

const LEVELS_ZH = ['刚开始', '能看懂一点', '能聊天但不自然', '想学得更地道']
const LEVELS_EN = ['Just starting', 'Can understand a little', 'Can chat but not natural', 'Want to sound more fluent']
const LEVEL_IDS = ['beginner', 'lower_intermediate', 'intermediate', 'advanced'] as const

const INTERESTS = [
  { id: 'daily', labelZh: '日常聊天', labelEn: 'Daily chat', emoji: '💬' },
  { id: 'work', labelZh: '工作学习', labelEn: 'Work & study', emoji: '💼' },
  { id: 'travel', labelZh: '旅行生活', labelEn: 'Travel & life', emoji: '✈️' },
  { id: 'entertainment', labelZh: '影视游戏', labelEn: 'Movies & games', emoji: '🎮' },
]

type Level = typeof LEVEL_IDS[number]

export default function OnboardingScreen() {
  const [step, setStep] = useState(0)
  const [uiLang, setUiLang] = useState<LanguageCode>('en')
  const [targetLang, setTargetLang] = useState<LanguageCode>('en')
  const [level, setLevel] = useState<Level>('intermediate')
  const [interests, setInterests] = useState<string[]>([])
  const { setPreferences, setLanguages, setOnboardingComplete } = useUserStore()

  const tr = t(uiLang)
  const levels = uiLang === 'zh' ? LEVELS_ZH : LEVELS_EN

  function toggleInterest(id: string) {
    setInterests((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  function finish() {
    setLanguages(uiLang, targetLang)
    setPreferences(level, interests)
    setOnboardingComplete()
    router.replace('/(tabs)/home')
  }

  // Step 0: Brand splash
  if (step === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>都行 KINDA</Text>
          <Text style={styles.tagline}>Learn. Or don't. Either way.</Text>
          <Text style={styles.desc}>An AI language app that won't nag you.{'\n'}Open it when you feel like it.</Text>
        </View>
        <View style={styles.buttons}>
          <Button label="Get started" onPress={() => setStep(1)} />
          <Button label="Just look around" onPress={() => setStep(1)} variant="ghost" />
        </View>
      </View>
    )
  }

  // Step 1: Language selection
  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>Choose your languages</Text>

        <View style={styles.langSection}>
          <Text style={styles.langLabel}>I speak</Text>
          <View style={styles.options}>
            {UI_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.option, uiLang === lang.code && styles.optionSelected]}
                onPress={() => setUiLang(lang.code)}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[styles.optionText, uiLang === lang.code && styles.optionTextSelected]}>
                  {lang.labelNative}
                </Text>
                {uiLang === lang.code && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.langSection}>
          <Text style={styles.langLabel}>I want to learn</Text>
          <View style={styles.options}>
            {TARGET_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.option, targetLang === lang.code && styles.optionSelected]}
                onPress={() => setTargetLang(lang.code)}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[styles.optionText, targetLang === lang.code && styles.optionTextSelected]}>
                  {lang.labelNative}
                </Text>
                {targetLang === lang.code && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button label={tr.nextBtn} onPress={() => setStep(2)} style={styles.nextBtn} />
      </View>
    )
  }

  // Step 2: Level
  if (step === 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>{tr.levelQuestion}</Text>
        <View style={styles.options}>
          {LEVEL_IDS.map((id, i) => (
            <TouchableOpacity
              key={id}
              style={[styles.option, level === id && styles.optionSelected]}
              onPress={() => setLevel(id)}
            >
              <Text style={[styles.optionText, level === id && styles.optionTextSelected]}>{levels[i]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button label={tr.nextBtn} onPress={() => setStep(3)} style={styles.nextBtn} />
      </View>
    )
  }

  // Step 3: Interests
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{tr.interestQuestion}</Text>
      <Text style={styles.subtext}>{tr.multiSelect}</Text>
      <View style={styles.options}>
        {INTERESTS.map((i) => (
          <TouchableOpacity
            key={i.id}
            style={[styles.option, interests.includes(i.id) && styles.optionSelected]}
            onPress={() => toggleInterest(i.id)}
          >
            <Text style={styles.flag}>{i.emoji}</Text>
            <Text style={[styles.optionText, interests.includes(i.id) && styles.optionTextSelected]}>
              {uiLang === 'zh' ? i.labelZh : i.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button label={tr.enterBtn} onPress={finish} style={styles.nextBtn} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center' },
  logo: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  tagline: { fontSize: fontSizes.lg, color: colors.text, marginBottom: spacing.xl },
  desc: { fontSize: fontSizes.md, color: colors.muted, lineHeight: 24 },
  buttons: { gap: spacing.sm },
  question: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text, marginTop: spacing.xxl, marginBottom: spacing.lg },
  subtext: { fontSize: fontSizes.sm, color: colors.muted, marginTop: -spacing.sm, marginBottom: spacing.sm },
  langSection: { gap: spacing.sm },
  langLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  options: { gap: spacing.sm, flex: 1 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.softGreen },
  flag: { fontSize: fontSizes.xl },
  optionText: { flex: 1, fontSize: fontSizes.md, color: colors.text },
  optionTextSelected: { color: colors.primary, fontWeight: '600' },
  nextBtn: { marginTop: spacing.xl },
})
