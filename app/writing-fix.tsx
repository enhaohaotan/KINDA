import React, { useState } from 'react'
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { Button } from '../src/components/ui/Button'
import { WritingFixResult } from '../src/components/learning/WritingFixResult'
import { useLearningStore } from '../src/store/learningStore'
import { ai } from '../src/lib/ai'
import type { FixWritingResult } from '../src/lib/ai'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

export default function WritingFixScreen() {
  const { activeExpression, updateStatus } = useLearningStore()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FixWritingResult | null>(null)
  const [submittedText, setSubmittedText] = useState('')

  async function handleSubmit() {
    if (!text.trim() || !activeExpression) return
    setLoading(true)
    setSubmittedText(text.trim())
    try {
      const res = await ai.fixWriting(text.trim(), activeExpression.text)
      setResult(res)
      updateStatus(activeExpression.id, { tried: true })
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  function handleRetry() {
    setResult(null)
    setText('')
    setSubmittedText('')
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>

        <Text style={styles.title}>我试着造句</Text>
        {activeExpression && (
          <Text style={styles.hint}>用今天的表达写一句：{activeExpression.text}</Text>
        )}
        <Text style={styles.subhint}>写烂也行。句子活着就行。</Text>

        {!result ? (
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="在这里写…"
              placeholderTextColor={colors.muted}
              multiline
              autoFocus
            />
            <Button label="帮我错少一点" onPress={handleSubmit} loading={loading} disabled={!text.trim()} />
          </View>
        ) : (
          <View style={styles.resultArea}>
            <WritingFixResult result={result} originalText={submittedText} />
            <Button label="再写一句" onPress={handleRetry} variant="secondary" />
            <Button label="问问为什么" onPress={() => activeExpression && router.push(`/ai-explain/${activeExpression.id}`)} variant="ghost" />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  back: { paddingVertical: spacing.sm },
  backText: { fontSize: fontSizes.sm, color: colors.muted },
  title: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text },
  hint: { fontSize: fontSizes.md, color: colors.text },
  subhint: { fontSize: fontSizes.sm, color: colors.muted },
  inputArea: { gap: spacing.md },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    minHeight: 100,
    backgroundColor: colors.card,
    textAlignVertical: 'top',
  },
  resultArea: { gap: spacing.md },
})
