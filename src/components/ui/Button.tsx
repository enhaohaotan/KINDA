import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native'
import { colors, radius, spacing, fontSizes } from '../../styles/tokens'

type Props = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  style?: ViewStyle
  loading?: boolean
  disabled?: boolean
}

export function Button({ label, onPress, variant = 'primary', style, loading, disabled }: Props) {
  const bg =
    variant === 'primary' ? colors.primary
    : variant === 'secondary' ? colors.softPeach
    : 'transparent'
  const textColor =
    variant === 'primary' ? '#fff'
    : variant === 'secondary' ? colors.text
    : colors.primary

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, { backgroundColor: bg }, variant === 'ghost' && styles.ghost, style]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
})
