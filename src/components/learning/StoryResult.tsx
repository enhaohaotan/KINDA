import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CozyCard } from '../ui/CozyCard'
import { Badge } from '../ui/Badge'
import { colors, fontSizes, spacing } from '../../styles/tokens'
import type { GenerateStoryResult } from '../../lib/ai'

type Props = {
  result: GenerateStoryResult
}

export function StoryResult({ result }: Props) {
  return (
    <View style={styles.container}>
      <CozyCard>
        <Text style={styles.title}>{result.title}</Text>
        <Text style={styles.story}>{result.story}</Text>
      </CozyCard>

      {result.highlightedExpressions.length > 0 && (
        <CozyCard variant="green">
          <Text style={styles.sectionLabel}>故事里学到：</Text>
          {result.highlightedExpressions.map((expr, i) => (
            <View key={i} style={styles.exprRow}>
              <Text style={styles.exprText}>{expr.text}</Text>
              <Text style={styles.exprMeaning}>= {expr.meaningZh}</Text>
            </View>
          ))}
        </CozyCard>
      )}

      <View style={styles.badges}>
        <Text style={styles.sectionLabel}>顺便捡到：</Text>
        <View style={styles.badgeRow}>
          {result.highlightedExpressions.map((expr, i) => (
            <Badge key={i} label={expr.text} />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  title: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  story: { fontSize: fontSizes.md, color: colors.text, lineHeight: 26 },
  sectionLabel: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  exprRow: { marginBottom: spacing.sm },
  exprText: { fontSize: fontSizes.md, fontWeight: '600', color: colors.primary },
  exprMeaning: { fontSize: fontSizes.sm, color: colors.text },
  badges: {},
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
})
