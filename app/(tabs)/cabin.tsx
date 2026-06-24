import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { CozyCard } from '../../src/components/ui/CozyCard'
import { Button } from '../../src/components/ui/Button'
import { useLearningStore } from '../../src/store/learningStore'
import { useUserStore } from '../../src/store/userStore'
import { supabase } from '../../src/lib/supabase'
import { getExpressions, t } from '../../src/lib/i18n'
import { UI_LANGUAGES, TARGET_LANGUAGES } from '../../src/data/languages'
import { colors, fontSizes, spacing, radius } from '../../src/styles/tokens'

export default function CabinScreen() {
  const { statuses } = useLearningStore()
  const { clearUser, level, uiLanguage, targetLanguage } = useUserStore()
  const tr = t(uiLanguage)

  const exprs = getExpressions(targetLanguage as any)
  const seenCount = exprs.filter((e) => statuses[e.id]?.seen).length
  const triedCount = exprs.filter((e) => statuses[e.id]?.tried).length
  const savedCount = exprs.filter((e) => statuses[e.id]?.saved).length

  const uiLangLabel = UI_LANGUAGES.find((l) => l.code === uiLanguage)
  const targetLangLabel = TARGET_LANGUAGES.find((l) => l.code === targetLanguage)

  async function handleSignOut() {
    await supabase.auth.signOut()
    clearUser()
    router.replace('/login')
  }

  const seenLabel = uiLanguage === 'zh' ? '见过' : 'Seen'
  const triedLabel = uiLanguage === 'zh' ? '试过' : 'Tried'
  const savedLabel = uiLanguage === 'zh' ? '保存了' : 'Saved'
  const caption = uiLanguage === 'zh'
    ? '看起来你在学。\n但我们不大声说。'
    : "Looks like you're learning.\nWe won't make a big deal of it."

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>{uiLanguage === 'zh' ? '小窝' : 'My Space'}</Text>

      <CozyCard>
        <View style={styles.statsRow}>
          <Stat label={seenLabel} value={seenCount} />
          <Stat label={triedLabel} value={triedCount} />
          <Stat label={savedLabel} value={savedCount} />
        </View>
        <Text style={styles.caption}>{caption}</Text>
      </CozyCard>

      {/* Language settings */}
      <TouchableOpacity onPress={() => router.push('/language-select')}>
        <CozyCard variant="green" style={styles.langCard}>
          <View style={styles.langRow}>
            <View style={styles.langInfo}>
              <Text style={styles.settingLabel}>{tr.iSpeak}</Text>
              <Text style={styles.langValue}>
                {uiLangLabel?.flag} {uiLangLabel?.labelNative}
              </Text>
            </View>
            <View style={styles.langDivider} />
            <View style={styles.langInfo}>
              <Text style={styles.settingLabel}>{tr.iLearn}</Text>
              <Text style={styles.langValue}>
                {targetLangLabel?.flag} {targetLangLabel?.labelNative}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        </CozyCard>
      </TouchableOpacity>

      <Button
        label={uiLanguage === 'zh' ? '退出登录' : 'Sign out'}
        onPress={handleSignOut}
        variant="ghost"
      />
    </ScrollView>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingTop: spacing.xl + 8, gap: spacing.lg, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md },
  stat: { alignItems: 'center' },
  statValue: { fontSize: fontSizes.xxl, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: fontSizes.sm, color: colors.muted },
  caption: { fontSize: fontSizes.sm, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  langCard: { padding: spacing.md },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  langInfo: { flex: 1 },
  settingLabel: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  langValue: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  langDivider: { width: 1, height: 36, backgroundColor: colors.border },
})
