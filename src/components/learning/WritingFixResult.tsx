import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CozyCard } from '../ui/CozyCard'
import { colors, fontSizes, spacing } from '../../styles/tokens'
import type { FixWritingResult } from '../../lib/ai'

type Props = {
  result: FixWritingResult
  originalText: string
}

export function WritingFixResult({ result, originalText }: Props) {
  return (
    <View style={styles.container}>
      <CozyCard style={styles.section}>
        <Text style={styles.label}>你这样写也能懂：</Text>
        <Text style={styles.original}>{originalText}</Text>
      </CozyCard>

      <CozyCard variant="green" style={styles.section}>
        <Text style={styles.label}>更自然的说法：</Text>
        <Text style={styles.corrected}>{result.correctedText}</Text>
      </CozyCard>

      <CozyCard style={styles.section}>
        <Text style={styles.label}>为什么：</Text>
        <Text style={styles.explanation}>{result.explanationZh}</Text>
      </CozyCard>

      {result.naturalVersion && result.naturalVersion !== result.correctedText && (
        <CozyCard variant="peach" style={styles.section}>
          <Text style={styles.label}>更自然一点：</Text>
          <Text style={styles.natural}>{result.naturalVersion}</Text>
        </CozyCard>
      )}

      <Text style={styles.encouragement}>{result.encouragement}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  section: {},
  label: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  original: { fontSize: fontSizes.md, color: colors.muted, fontStyle: 'italic' },
  corrected: { fontSize: fontSizes.lg, fontWeight: '600', color: colors.primary },
  explanation: { fontSize: fontSizes.md, color: colors.text, lineHeight: 22 },
  natural: { fontSize: fontSizes.md, color: colors.text, fontStyle: 'italic' },
  encouragement: { fontSize: fontSizes.md, color: colors.muted, textAlign: 'center', paddingVertical: spacing.sm },
})
