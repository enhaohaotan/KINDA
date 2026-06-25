import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COUNTRY_CODES } from '../../data/countryCodes'
import { colors, fontSizes, spacing, radius } from '../../styles/tokens'

type Props = {
  countryCode: string
  phone: string
  onChangeCountryCode: (code: string) => void
  onChangePhone: (phone: string) => void
  placeholder?: string
}

export function PhoneInput({ countryCode, phone, onChangeCountryCode, onChangePhone, placeholder = '123 456 7890' }: Props) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity style={styles.countryBtn} onPress={() => setShowPicker(true)}>
          <Text style={styles.countryCode}>{countryCode}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.muted} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={phone}
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
        />
      </View>

      <Modal visible={showPicker} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Country code</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, countryCode === item.code && styles.optionSelected]}
                  onPress={() => { onChangeCountryCode(item.code); setShowPicker(false) }}
                >
                  <Text style={styles.optionLabel}>{item.label}</Text>
                  <Text style={styles.optionCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  countryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    backgroundColor: colors.card,
  },
  countryCode: { fontSize: fontSizes.md, color: colors.text, fontWeight: '600' },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSizes.md, color: colors.text, backgroundColor: colors.card,
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, maxHeight: '70%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionSelected: { backgroundColor: colors.softGreen },
  optionLabel: { fontSize: fontSizes.md, color: colors.text },
  optionCode: { fontSize: fontSizes.md, color: colors.muted, fontWeight: '600' },
})
