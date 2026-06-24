import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors, radius, spacing } from '../../styles/tokens'

type Props = {
  children: React.ReactNode
  style?: ViewStyle
  variant?: 'default' | 'green' | 'peach'
}

export function CozyCard({ children, style, variant = 'default' }: Props) {
  const bg = variant === 'green' ? colors.softGreen : variant === 'peach' ? colors.softPeach : colors.card
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#2F241D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
})
