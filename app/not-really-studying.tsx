import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { CozyCard } from '../src/components/ui/CozyCard'
import { Button } from '../src/components/ui/Button'
import { expressions } from '../src/data/expressions'
import { colors, fontSizes, spacing } from '../src/styles/tokens'

function getRandomExpression(excludeId?: string) {
  const pool = excludeId ? expressions.filter((e) => e.id !== excludeId) : expressions
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function NotReallyStudyingScreen() {
  const [expr, setExpr] = useState(() => getRandomExpression())
  const [saved, setSaved] = useState(false)

  function next() {
    setExpr(getRandomExpression(expr.id))
    setSaved(false)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← 退出</Text>
      </TouchableOpacity>

      <Text style={styles.title}>不是真的学习</Text>
      <Text style={styles.subtitle}>Here's a phrase.{'\n'}You don't have to remember it.</Text>

      <CozyCard style={styles.card}>
        <Text style={styles.expression}>{expr.text}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>意思</Text>
        <Text style={styles.meaning}>{expr.meaningZh}</Text>
        <Text style={styles.label}>例句</Text>
        <Text style={styles.example}>{expr.exampleEn}</Text>
      </CozyCard>

      <View style={styles.actions}>
        <Button label="再随便看一个" onPress={next} />
        {!saved ? (
          <Button label="好吧，保存" onPress={() => setSaved(true)} variant="ghost" />
        ) : (
          <Text style={styles.savedText}>✓ 保存了。不大声说。</Text>
        )}
        <Button label="退出" onPress={() => router.back()} variant="ghost" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.lg },
  back: { paddingTop: spacing.xl },
  backText: { fontSize: fontSizes.sm, color: colors.muted },
  title: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSizes.sm, color: colors.muted, lineHeight: 20 },
  card: { flex: 0 },
  expression: { fontSize: fontSizes.xxl, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
  label: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginBottom: 2, textTransform: 'uppercase' },
  meaning: { fontSize: fontSizes.md, color: colors.text, marginBottom: spacing.md },
  example: { fontSize: fontSizes.sm, color: colors.text, fontStyle: 'italic' },
  actions: { gap: spacing.sm, marginTop: 'auto' },
  savedText: { fontSize: fontSizes.sm, color: colors.primary, textAlign: 'center', paddingVertical: spacing.sm },
})
