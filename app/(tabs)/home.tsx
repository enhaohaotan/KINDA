import React, { useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useLearningStore } from '../../src/store/learningStore'
import { useUserStore } from '../../src/store/userStore'
import { getExpressions, getMeaning, getUsage, t } from '../../src/lib/i18n'
import { colors, fontSizes, spacing, radius } from '../../src/styles/tokens'

function getTodayExpression(learningLanguage: string) {
  const exprs = getExpressions(learningLanguage as any)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return exprs[dayOfYear % exprs.length]
}

export default function HomeScreen() {
  const { todayExpression, setTodayExpression, setActiveExpression, updateStatus, getStatus, statuses } = useLearningStore()
  const { uiLanguage, learningLanguage } = useUserStore()
  const tr = t(uiLanguage)

  useEffect(() => {
    const expr = getTodayExpression(learningLanguage)
    setTodayExpression(expr)
    setActiveExpression(expr)
    updateStatus(expr.id, { seen: true, lastSeenAt: new Date().toISOString() })
  }, [learningLanguage])

  if (!todayExpression) return null
  const status = getStatus(todayExpression.id)
  const seenCount = getExpressions(learningLanguage as any).filter((e) => statuses[e.id]?.seen).length

  function handleExplain() {
    setActiveExpression(todayExpression!)
    router.push(`/ai-explain/${todayExpression!.id}`)
  }
  function handleStory() {
    setActiveExpression(todayExpression!)
    router.push('/story')
  }
  function handleWrite() {
    setActiveExpression(todayExpression!)
    router.push('/writing-fix')
  }
  function handleSave() {
    updateStatus(todayExpression!.id, { saved: !status.saved })
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroTitle}>都行<Text style={styles.heroTitleEn}> KINDA</Text></Text>
          <Text style={styles.heroSubtitle}>
            {uiLanguage === 'zh' ? '今天随便学一点 ☁' : "Learn a little today ☁"}
          </Text>
        </View>
        <View style={styles.capyArea}>
          <View style={styles.capyCircle}>
            <Text style={styles.capyEmoji}>🌿</Text>
          </View>
        </View>
      </View>

      {/* Expression card */}
      <View style={styles.exprCard}>
        <View style={styles.exprCardHeader}>
          <View style={styles.exprCardHeaderLeft}>
            <Ionicons name="star" size={14} color={colors.secondary} />
            <Text style={styles.exprCardLabel}>{tr.todayThing}</Text>
          </View>
          <View style={styles.recommendBadge}>
            <Text style={styles.recommendText}>
              {learningLanguage === 'da' ? 'DA' : learningLanguage === 'en' ? 'EN' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.exprRow}>
          <Text style={styles.exprText}>{todayExpression.text}</Text>
          <TouchableOpacity>
            <Ionicons name="volume-medium-outline" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>{tr.meaning}</Text>
        <Text style={styles.fieldValue}>{getMeaning(todayExpression, uiLanguage)}</Text>

        <Text style={styles.fieldLabel}>{tr.usage}</Text>
        <Text style={styles.fieldValue}>{getUsage(todayExpression, uiLanguage)}</Text>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <ActionButton icon="chatbubble-outline" label={tr.explain} onPress={handleExplain} />
        <ActionButton icon="book-outline" label={tr.makeStory} onPress={handleStory} />
        <ActionButton icon="create-outline" label={tr.trySentence} onPress={handleWrite} />
      </View>

      {/* Weekly progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Ionicons name="leaf" size={16} color={colors.primary} />
          <Text style={styles.progressLabel}>
            {tr.thisWeek} {seenCount} {uiLanguage === 'zh' ? '个表达' : 'phrases'}
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min((seenCount / 10) * 100, 100)}%` }]} />
        </View>
        <Text style={styles.progressCount}>{seenCount} / 10</Text>
      </View>

      <TouchableOpacity style={styles.notReally} onPress={() => router.push('/not-really-studying')}>
        <Text style={styles.notReallyText}>{tr.notReally}</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

function ActionButton({ icon, label, onPress }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.actionIconWrap}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.xxl, gap: spacing.md },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 110,
  },
  heroTextBlock: { flex: 1 },
  heroTitle: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
  heroTitleEn: { fontWeight: '400', fontSize: fontSizes.xl },
  heroSubtitle: { fontSize: fontSizes.sm, color: colors.muted, marginTop: spacing.xs },
  capyArea: { marginLeft: spacing.md },
  capyCircle: { width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.softGreen, alignItems: 'center', justifyContent: 'center' },
  capyEmoji: { fontSize: 36 },
  exprCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: 4 },
  exprCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  exprCardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  exprCardLabel: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text },
  recommendBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2 },
  recommendText: { fontSize: fontSizes.lg },
  exprRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  exprText: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text, flex: 1 },
  fieldLabel: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginTop: spacing.xs },
  fieldValue: { fontSize: fontSizes.sm, color: colors.text, lineHeight: 20 },
  dots: { flexDirection: 'row', gap: 5, justifyContent: 'center', marginTop: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 16 },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1, alignItems: 'center', gap: spacing.xs, backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  actionIconWrap: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.softGreen, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.text, textAlign: 'center' },
  progressCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  progressLabel: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text },
  progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  progressCount: { fontSize: fontSizes.xs, color: colors.muted, textAlign: 'right' },
  notReally: { alignSelf: 'center', paddingVertical: spacing.sm },
  notReallyText: { fontSize: fontSizes.sm, color: colors.muted },
})
