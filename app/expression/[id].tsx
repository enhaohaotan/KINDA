import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { CozyCard } from '../../src/components/ui/CozyCard'
import { Button } from '../../src/components/ui/Button'
import { Badge } from '../../src/components/ui/Badge'
import { useLearningStore } from '../../src/store/learningStore'
import { expressions } from '../../src/data/expressions'
import { colors, fontSizes, spacing } from '../../src/styles/tokens'

export default function ExpressionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const expr = expressions.find((e) => e.id === id)
  const { setActiveExpression, getStatus, updateStatus } = useLearningStore()

  if (!expr) return null
  const status = getStatus(expr.id)

  function handleSave() {
    updateStatus(expr!.id, { saved: !status.saved })
  }

  function handleExplain() {
    setActiveExpression(expr!)
    router.push(`/ai-explain/${expr!.id}`)
  }

  function handleWrite() {
    setActiveExpression(expr!)
    router.push('/writing-fix')
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <CozyCard>
        <Text style={styles.expression}>{expr.text}</Text>
        <Text style={styles.label}>中文意思</Text>
        <Text style={styles.value}>{expr.meaningZh}</Text>
        <Text style={styles.label}>什么时候用</Text>
        <Text style={styles.value}>{expr.usageZh}</Text>
        <Text style={styles.label}>语气</Text>
        <Text style={styles.value}>{expr.toneZh}</Text>
        <Text style={styles.label}>例句</Text>
        <Text style={styles.example}>{expr.exampleEn}</Text>
      </CozyCard>

      {expr.similarExpressions.length > 0 && (
        <CozyCard variant="green">
          <Text style={styles.label}>相似表达</Text>
          <View style={styles.badges}>
            {expr.similarExpressions.map((s) => <Badge key={s} label={s} />)}
          </View>
        </CozyCard>
      )}

      <View style={styles.actions}>
        <Button label="让 AI 讲讲" onPress={handleExplain} />
        <Button label="我造一句" onPress={handleWrite} variant="secondary" />
        <Button
          label={status.saved ? '✓ 已保存' : '保存'}
          onPress={handleSave}
          variant="ghost"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  back: { paddingVertical: spacing.sm },
  backText: { fontSize: fontSizes.sm, color: colors.muted },
  expression: { fontSize: fontSizes.xxl, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  label: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.sm },
  value: { fontSize: fontSizes.md, color: colors.text, lineHeight: 22 },
  example: { fontSize: fontSizes.md, color: colors.text, fontStyle: 'italic', lineHeight: 22 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  actions: { gap: spacing.sm },
})
