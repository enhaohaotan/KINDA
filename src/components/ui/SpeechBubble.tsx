import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSizes } from '../../styles/tokens'

type Props = {
  text: string
  sender: 'user' | 'ai'
}

export function SpeechBubble({ text, sender }: Props) {
  const isUser = sender === 'user'
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAi]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>{text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  rowUser: { alignItems: 'flex-end' },
  rowAi: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  userBubble: { backgroundColor: colors.primary },
  aiBubble: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  text: { fontSize: fontSizes.md, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: colors.text },
})
