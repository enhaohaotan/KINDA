import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, fontSizes, spacing } from '../../styles/tokens'

type Props = {
  label: string
  color?: string
  textColor?: string
}

export function Badge({ label, color = colors.softGreen, textColor = colors.primary }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  text: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
})
