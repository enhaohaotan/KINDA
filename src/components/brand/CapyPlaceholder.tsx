import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSizes } from '../../styles/tokens'

type Props = {
  message?: string
}

export function CapyPlaceholder({ message = 'One phrase is still a phrase.' }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.emoji}>🌿</Text>
      </View>
      <View style={styles.bubble}>
        <Text style={styles.name}>都行搭子</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  bubble: {
    flex: 1,
    backgroundColor: colors.softPeach,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  name: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.muted },
  message: { fontSize: fontSizes.sm, color: colors.text, marginTop: 2 },
})
