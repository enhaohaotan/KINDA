import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { BrandHeader } from '../../src/components/brand/BrandHeader'
import { CozyCard } from '../../src/components/ui/CozyCard'
import { Badge } from '../../src/components/ui/Badge'
import { useLearningStore } from '../../src/store/learningStore'
import { expressions } from '../../src/data/expressions'
import { colors, fontSizes, spacing } from '../../src/styles/tokens'

export default function LearnScreen() {
  const { statuses, setActiveExpression, recentExpressionIds } = useLearningStore()

  const seenExprs = expressions.filter((e) => statuses[e.id]?.seen)
  const savedExprs = expressions.filter((e) => statuses[e.id]?.saved)
  const driftBackExprs = expressions.filter((e) => statuses[e.id]?.seen && !statuses[e.id]?.tried).slice(0, 3)

  function openExpression(id: string) {
    const expr = expressions.find((e) => e.id === id)
    if (expr) {
      setActiveExpression(expr)
      router.push(`/expression/${id}`)
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="学一点" />

      {driftBackExprs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>漂回来 Drift Back</Text>
          <Text style={styles.sectionSubtitle}>这些东西又漂回来了。不复习也行。</Text>
          {driftBackExprs.map((e) => (
            <ExpressionRow key={e.id} text={e.text} meaning={e.meaningZh} tried={false} saved={false} onPress={() => openExpression(e.id)} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>见过的表达 ({seenExprs.length})</Text>
        {seenExprs.length === 0 ? (
          <Text style={styles.empty}>还没见过什么，去首页看看。</Text>
        ) : (
          seenExprs.map((e) => (
            <ExpressionRow
              key={e.id}
              text={e.text}
              meaning={e.meaningZh}
              tried={!!statuses[e.id]?.tried}
              saved={!!statuses[e.id]?.saved}
              onPress={() => openExpression(e.id)}
            />
          ))
        )}
      </View>

      {savedExprs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>保存的表达 ({savedExprs.length})</Text>
          {savedExprs.map((e) => (
            <ExpressionRow
              key={e.id}
              text={e.text}
              meaning={e.meaningZh}
              tried={!!statuses[e.id]?.tried}
              saved={true}
              onPress={() => openExpression(e.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  )
}

function ExpressionRow({ text, meaning, tried, saved, onPress }: { text: string; meaning: string; tried: boolean; saved: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <CozyCard style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowText}>{text}</Text>
          <Text style={styles.rowMeaning}>{meaning}</Text>
        </View>
        <View style={styles.badges}>
          {tried && <Badge label="试过" />}
          {saved && <Badge label="已保存" color="#FFF0E3" textColor="#E8B87E" />}
        </View>
      </CozyCard>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  sectionSubtitle: { fontSize: fontSizes.sm, color: colors.muted, marginTop: -spacing.xs },
  empty: { fontSize: fontSizes.sm, color: colors.muted },
  row: { padding: spacing.md },
  rowContent: { flex: 1 },
  rowText: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  rowMeaning: { fontSize: fontSizes.sm, color: colors.muted, marginTop: 2 },
  badges: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
})
