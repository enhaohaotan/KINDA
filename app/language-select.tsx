import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useUserStore } from '../src/store/userStore'
import { Button } from '../src/components/ui/Button'
import { UI_LANGUAGES, TARGET_LANGUAGES, type LanguageCode } from '../src/data/languages'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

type Props = {
  returnTo?: string
}

export default function LanguageSelectScreen() {
  const { uiLanguage, targetLanguage, setLanguages } = useUserStore()
  const [selectedUI, setSelectedUI] = useState<LanguageCode>(uiLanguage)
  const [selectedTarget, setSelectedTarget] = useState<LanguageCode>(targetLanguage)

  function handleSave() {
    setLanguages(selectedUI, selectedTarget)
    router.back()
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Language</Text>
      <Text style={styles.subtitle}>Choose your languages</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>I speak</Text>
        <View style={styles.options}>
          {UI_LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.option, selectedUI === lang.code && styles.optionSelected]}
              onPress={() => setSelectedUI(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, selectedUI === lang.code && styles.optionLabelSelected]}>
                  {lang.labelNative}
                </Text>
                {lang.labelNative !== lang.label && (
                  <Text style={styles.optionSub}>{lang.label}</Text>
                )}
              </View>
              {selectedUI === lang.code && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>I want to learn</Text>
        <View style={styles.options}>
          {TARGET_LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.option, selectedTarget === lang.code && styles.optionSelected]}
              onPress={() => setSelectedTarget(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, selectedTarget === lang.code && styles.optionLabelSelected]}>
                  {lang.labelNative}
                </Text>
                {lang.labelNative !== lang.label && (
                  <Text style={styles.optionSub}>{lang.label}</Text>
                )}
              </View>
              {selectedTarget === lang.code && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button label="Save" onPress={handleSave} style={styles.saveBtn} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingTop: spacing.xl + 8, gap: spacing.xl, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.sm },
  title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSizes.md, color: colors.muted, marginTop: -spacing.md },
  section: { gap: spacing.sm },
  sectionLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.softGreen },
  flag: { fontSize: 28 },
  optionText: { flex: 1 },
  optionLabel: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  optionLabelSelected: { color: colors.primary },
  optionSub: { fontSize: fontSizes.sm, color: colors.muted, marginTop: 1 },
  saveBtn: { marginTop: spacing.md },
})
