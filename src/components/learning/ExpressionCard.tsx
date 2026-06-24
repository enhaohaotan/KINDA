import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { CozyCard } from '../ui/CozyCard'
import { Button } from '../ui/Button'
import { colors, fontSizes, spacing } from '../../styles/tokens'
import type { Expression } from '../../data/expressions'

type Props = {
  expression: Expression
  isSaved: boolean
  onExplain: () => void
  onStory: () => void
  onWrite: () => void
  onSave: () => void
}

export function ExpressionCard({ expression, isSaved, onExplain, onStory, onWrite, onSave }: Props) {
  return (
    <CozyCard>
      <Text style={styles.tiny}>Today's tiny thing</Text>
      <Text style={styles.expression}>{expression.text}</Text>

      <View style={styles.divider} />

      <Text style={styles.label}>意思</Text>
      <Text style={styles.meaning}>{expression.meaningZh}</Text>

      <Text style={styles.label}>语气</Text>
      <Text style={styles.value}>{expression.toneZh}</Text>

      <Text style={styles.label}>例句</Text>
      <Text style={styles.example}>{expression.exampleEn}</Text>

      <View style={styles.buttons}>
        <Button label="讲讲" onPress={onExplain} variant="primary" style={styles.btn} />
        <Button label="编个故事" onPress={onStory} variant="secondary" style={styles.btn} />
        <Button label="我试着造句" onPress={onWrite} variant="secondary" style={styles.btn} />
        <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
          <Text style={[styles.saveText, isSaved && styles.savedText]}>
            {isSaved ? '✓ 已保存' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>
    </CozyCard>
  )
}

const styles = StyleSheet.create({
  tiny: { fontSize: fontSizes.xs, color: colors.muted, marginBottom: spacing.xs },
  expression: { fontSize: fontSizes.xxl, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
  label: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  meaning: { fontSize: fontSizes.md, color: colors.text, marginBottom: spacing.md },
  value: { fontSize: fontSizes.sm, color: colors.text, marginBottom: spacing.md },
  example: { fontSize: fontSizes.sm, color: colors.text, fontStyle: 'italic', marginBottom: spacing.lg },
  buttons: { gap: spacing.sm },
  btn: { alignSelf: 'stretch' },
  saveBtn: { alignSelf: 'center', paddingVertical: spacing.xs },
  saveText: { fontSize: fontSizes.sm, color: colors.muted },
  savedText: { color: colors.primary, fontWeight: '600' },
})
