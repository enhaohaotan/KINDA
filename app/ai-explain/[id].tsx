import React, { useState, useRef } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { SpeechBubble } from '../../src/components/ui/SpeechBubble'
import { Button } from '../../src/components/ui/Button'
import { useLearningStore } from '../../src/store/learningStore'
import { expressions } from '../../src/data/expressions'
import { ai } from '../../src/lib/ai'
import { useUserStore } from '../../src/store/userStore'
import { colors, fontSizes, spacing, radius } from '../../src/styles/tokens'

type Message = { id: string; text: string; sender: 'user' | 'ai' }

const QUICK_QUESTIONS = [
  '和相似表达有什么区别？',
  '正式场合能用吗？',
  '帮我造 3 个例句',
  '中文里最接近什么？',
]

export default function AIExplainScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const expr = expressions.find((e) => e.id === id)
  const { level } = useUserStore()
  const { updateStatus } = useLearningStore()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      sender: 'ai',
      text: `这个表达是 "${expr?.text}"\n${expr?.meaningZh}\n\n你可以问我它和其他说法的区别，或者让我造几个例句。`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<ScrollView>(null)

  async function sendMessage(text: string) {
    if (!text.trim() || !expr) return
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const result = await ai.explainExpression(expr.text, text, level)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: result.answerZh + (result.tinyNote ? `\n\n${result.tinyNote}` : ''),
      }
      setMessages((prev) => [...prev, aiMsg])
      updateStatus(expr.id, { understood: true })
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: '出了点问题，稍后再试吧。' }])
    } finally {
      setLoading(false)
    }
  }

  if (!expr) return null

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>跟都行聊聊</Text>
      </View>

      <ScrollView ref={listRef} style={styles.messages} onContentSizeChange={() => listRef.current?.scrollToEnd()}>
        {messages.map((m) => <SpeechBubble key={m.id} text={m.text} sender={m.sender} />)}
        {loading && <SpeechBubble text="…" sender="ai" />}
      </ScrollView>

      <View style={styles.quickRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
          {QUICK_QUESTIONS.map((q) => (
            <TouchableOpacity key={q} style={styles.chip} onPress={() => sendMessage(q)}>
              <Text style={styles.chipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="随便问点什么吧…"
          placeholderTextColor={colors.muted}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(input)}
        />
        <Button label="发" onPress={() => sendMessage(input)} disabled={!input.trim() || loading} style={styles.sendBtn} />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, paddingTop: spacing.xxl },
  back: { fontSize: fontSizes.sm, color: colors.muted },
  title: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  messages: { flex: 1 },
  quickRow: { borderTopWidth: 1, borderTopColor: colors.border },
  quickScroll: { padding: spacing.sm, gap: spacing.sm },
  chip: {
    backgroundColor: colors.softGreen,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  chipText: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '500' },
  inputRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.text,
    backgroundColor: colors.card,
  },
  sendBtn: { paddingHorizontal: spacing.md },
})
