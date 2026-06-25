import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useUserStore } from '../../store/userStore'
import { t } from '../../lib/i18n'
import { colors, fontSizes, spacing } from '../../styles/tokens'

type Props = {
  subtitle?: string
}

export function BrandHeader({ subtitle }: Props) {
  const { uiLanguage } = useUserStore()
  const tr = t(uiLanguage)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tr.appName}</Text>
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
