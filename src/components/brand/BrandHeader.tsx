import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fontSizes, spacing } from '../../styles/tokens'

type Props = {
  subtitle?: string
}

export function BrandHeader({ subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>都行 KINDA</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingTop: spacing.lg },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    marginTop: 2,
  },
})
