import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useUserStore } from '../src/store/userStore'
import { Button } from '../src/components/ui/Button'
import { UI_LANGUAGES, TARGET_LANGUAGES, type LanguageCode } from '../src/data/languages'
import { t } from '../src/lib/i18n'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

export default function OnboardingScreen() {
  const [step, setStep] = useState(0)
  const [uiLang, setUiLang] = useState<LanguageCode>('en')
  const [targetLang, setTargetLang] = useState<LanguageCode>('en')
  const { setLanguages, setOnboardingComplete, saveSettings } = useUserStore()

  const tr = t(uiLang)

  function finish() {
    setLanguages(uiLang, targetLang)
    setOnboardingComplete()
    saveSettings()
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

        <Button label={tr.enterBtn} onPress={finish} style={styles.nextBtn} />
      </View>
    )
  }
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
