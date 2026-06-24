import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { ScenePractice } from '../../src/components/learning/ScenePractice'
import { scenes } from '../../src/data/scenes'
import { ai } from '../../src/lib/ai'
import type { SceneFeedbackResult } from '../../src/lib/ai'
import { colors, fontSizes, spacing } from '../../src/styles/tokens'

export default function SceneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const scene = scenes.find((s) => s.id === id)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SceneFeedbackResult | null>(null)
  const [userReply, setUserReply] = useState('')

  if (!scene) return null

  async function handleSubmit(reply: string) {
    setUserReply(reply)
    setLoading(true)
    try {
      const res = await ai.sceneFeedback(scene!.id, scene!.aiOpeningLine, reply, scene!.targetExpression)
      setResult(res)
    } catch {
      setResult({ isSuccessful: false, feedbackZh: '出了点问题，稍后再试吧。', moreNaturalVersion: '', tinyTip: '' })
    } finally {
      setLoading(false)
    }
  }

  function handleRetry() {
    setResult(null)
    setUserReply('')
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{scene.titleZh}</Text>

      <ScenePractice
        scene={scene}
        onSubmit={handleSubmit}
        loading={loading}
        result={result}
        onRetry={handleRetry}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  back: { paddingTop: spacing.xl },
  backText: { fontSize: fontSizes.sm, color: colors.muted },
  title: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text },
})
