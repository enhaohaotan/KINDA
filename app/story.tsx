import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Button } from '../src/components/ui/Button'
import { StoryResult } from '../src/components/learning/StoryResult'
import { useLearningStore } from '../src/store/learningStore'
import { useUserStore } from '../src/store/userStore'
import { ai } from '../src/lib/ai'
import { storyThemes, storyLengths } from '../src/data/themes'
import type { GenerateStoryResult } from '../src/lib/ai'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

export default function StoryScreen() {
  const { activeExpression } = useLearningStore()
  const { level } = useUserStore()
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedLength, setSelectedLength] = useState('normal')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateStoryResult | null>(null)

  // Show 6 random themes, stable per session
  const [displayThemes] = useState(() => storyThemes.sort(() => Math.random() - 0.5).slice(0, 6))

  function toggleTheme(id: string) {
    setSelectedThemes((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id])
  }

  async function handleGenerate() {
    if (!activeExpression) return
    setLoading(true)
    try {
      const themes = selectedThemes.length > 0
        ? displayThemes.filter((t) => selectedThemes.includes(t.id)).map((t) => t.labelZh)
        : ['日常']
      const res = await ai.generateStory(activeExpression.text, themes, selectedLength, level)
      setResult(res)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <Text style={styles.title}>编个故事</Text>
      {activeExpression && <Text style={styles.expr}>{activeExpression.text}</Text>}

      {!result ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>选择主题</Text>
            <View style={styles.chipRow}>
              {displayThemes.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.chip, selectedThemes.includes(t.id) && styles.chipSelected]}
                  onPress={() => toggleTheme(t.id)}
                >
                  <Text style={styles.chipText}>{t.emoji} {t.labelZh}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>选择长度</Text>
            <View style={styles.chipRow}>
              {storyLengths.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.chip, selectedLength === l.id && styles.chipSelected]}
                  onPress={() => setSelectedLength(l.id)}
                >
                  <Text style={styles.chipText}>{l.labelZh}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button label="编一个" onPress={handleGenerate} loading={loading} />
        </>
      ) : (
        <View style={styles.resultArea}>
          <StoryResult result={result} />
          <Button label="换一个故事" onPress={() => { setResult(null); handleGenerate() }} variant="secondary" loading={loading} />
          <Button label="← 返回首页" onPress={() => router.push('/(tabs)/home')} variant="ghost" />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  back: { paddingVertical: spacing.sm },
  backText: { fontSize: fontSizes.sm, color: colors.muted },
  title: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text },
  expr: { fontSize: fontSizes.lg, color: colors.primary, fontWeight: '600' },
  section: { gap: spacing.sm },
  sectionLabel: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.muted },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.softGreen },
  chipText: { fontSize: fontSizes.sm, color: colors.text },
  resultArea: { gap: spacing.md },
})
