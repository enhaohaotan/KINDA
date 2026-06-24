import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { BrandHeader } from '../../src/components/brand/BrandHeader'
import { CozyCard } from '../../src/components/ui/CozyCard'
import { scenes } from '../../src/data/scenes'
import { colors, fontSizes, spacing } from '../../src/styles/tokens'

export default function ScenesScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="场景" />
      <Text style={styles.subtitle}>随便进一个。不会也没事。</Text>

      {scenes.map((scene) => (
        <TouchableOpacity key={scene.id} onPress={() => router.push(`/scene/${scene.id}`)}>
          <CozyCard style={styles.card}>
            <Text style={styles.emoji}>{scene.emoji}</Text>
            <Text style={styles.title}>{scene.titleZh}</Text>
            <Text style={styles.desc}>{scene.descriptionZh}</Text>
          </CozyCard>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  subtitle: { fontSize: fontSizes.sm, color: colors.muted, marginTop: -spacing.sm },
  card: {},
  emoji: { fontSize: 32, marginBottom: spacing.sm },
  title: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  desc: { fontSize: fontSizes.sm, color: colors.muted, marginTop: spacing.xs },
})
