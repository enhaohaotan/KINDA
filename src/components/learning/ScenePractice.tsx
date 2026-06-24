import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { CozyCard } from '../ui/CozyCard'
import { Button } from '../ui/Button'
import { SpeechBubble } from '../ui/SpeechBubble'
import { colors, fontSizes, spacing, radius } from '../../styles/tokens'
import type { SceneFeedbackResult } from '../../lib/ai'
import type { Scene } from '../../data/scenes'

type Props = {
  scene: Scene
  onSubmit: (userReply: string) => void
  loading: boolean
  result: SceneFeedbackResult | null
  onRetry: () => void
}

export function ScenePractice({ scene, onSubmit, loading, result, onRetry }: Props) {
  const [reply, setReply] = useState('')

  return (
    <View style={styles.container}>
      <CozyCard style={styles.context}>
        <Text style={styles.contextLabel}>任务</Text>
        <Text style={styles.hint}>{scene.hintZh}</Text>
      </CozyCard>

      <SpeechBubble text={scene.aiOpeningLine} sender="ai" />

      {!result ? (
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={reply}
            onChangeText={setReply}
            placeholder="用英语回复…"
            placeholderTextColor={colors.muted}
            multiline
          />
          <Button
            label="发送"
            onPress={() => { if (reply.trim()) onSubmit(reply.trim()) }}
            loading={loading}
            disabled={!reply.trim()}
          />
        </View>
      ) : (
        <View style={styles.resultArea}>
          <SpeechBubble text={reply} sender="user" />

          {result.isSuccessful ? (
            <View style={styles.completionBanner}>
              <Text style={styles.completionText}>你 kinda 完成了这个场景 ✓</Text>
            </View>
          ) : null}

          <CozyCard variant="green">
            <Text style={styles.feedbackText}>{result.feedbackZh}</Text>
            {result.moreNaturalVersion ? (
              <>
                <Text style={styles.naturalLabel}>更自然：</Text>
                <Text style={styles.naturalText}>{result.moreNaturalVersion}</Text>
              </>
            ) : null}
            {result.tinyTip ? (
              <Text style={styles.tip}>{result.tinyTip}</Text>
            ) : null}
          </CozyCard>

          <Button label="再试一次" onPress={onRetry} variant="ghost" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  context: {},
  contextLabel: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginBottom: spacing.xs },
  hint: { fontSize: fontSizes.sm, color: colors.text },
  inputArea: { gap: spacing.sm, paddingHorizontal: spacing.md },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    minHeight: 80,
    backgroundColor: colors.card,
  },
  resultArea: { gap: spacing.md },
  completionBanner: {
    backgroundColor: colors.softGreen,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    alignItems: 'center',
  },
  completionText: { fontSize: fontSizes.md, fontWeight: '600', color: colors.primary },
  feedbackText: { fontSize: fontSizes.md, color: colors.text, marginBottom: spacing.sm },
  naturalLabel: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginBottom: 2 },
  naturalText: { fontSize: fontSizes.md, fontStyle: 'italic', color: colors.text, marginBottom: spacing.sm },
  tip: { fontSize: fontSizes.sm, color: colors.muted },
})
