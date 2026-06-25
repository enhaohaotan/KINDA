import React, { useMemo, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js'
import { colors, fontSizes, spacing, radius } from '../../styles/tokens'

type CountryEntry = { iso: CountryCode; dialCode: string; name: string }

function buildCountryList(): CountryEntry[] {
  const dn = new Intl.DisplayNames(['en'], { type: 'region' })
  return getCountries()
    .map((iso) => ({
      iso,
      dialCode: `+${getCountryCallingCode(iso)}`,
      name: dn.of(iso) ?? iso,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

type Props = {
  countryCode: string
  phone: string
  onChangeCountryCode: (code: string) => void
  onChangePhone: (phone: string) => void
  placeholder?: string
}

export function PhoneInput({ countryCode, phone, onChangeCountryCode, onChangePhone, placeholder = '123 456 7890' }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const countries = useMemo(buildCountryList, [])
  const filtered = search.trim()
    ? countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dialCode.includes(search)
      )
    : countries

  function close() {
    setShowPicker(false)
    setSearch('')
  }

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

      <Modal visible={showPicker} animationType="fade" transparent onRequestClose={close}>
        {/* Overlay stays fixed — fade animation applies to the whole modal but
            the overlay covers the screen from the start, so it never "slides" */}
        <View style={styles.overlay}>
          {/* Tap outside to dismiss */}
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={close} activeOpacity={1} />

          {/* Sheet slides up from bottom independently via its own position */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.sheet}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Country code</Text>
              <TouchableOpacity onPress={close}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Search stays fixed at top — list scrolls below it */}
            <View style={styles.searchWrap}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
              <View style={styles.searchIconLeft} pointerEvents="none">
                <Ionicons name="search-outline" size={16} color={colors.muted} />
              </View>
              {search.length > 0 && (
                <TouchableOpacity style={styles.searchClear} onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color={colors.muted} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.iso}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, countryCode === item.dialCode && styles.optionSelected]}
                  onPress={() => { onChangeCountryCode(item.dialCode); close() }}
                >
                  <Text style={styles.optionLabel}>{item.name}</Text>
                  <Text style={styles.optionCode}>{item.dialCode}</Text>
                </TouchableOpacity>
              )}
            />
          </KeyboardAvoidingView>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    height: '70%',
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.lg, paddingBottom: spacing.md,
  },
  sheetTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  searchWrap: { position: 'relative', marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  searchInput: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: spacing.sm, paddingLeft: spacing.xl + spacing.xs, paddingRight: spacing.xl,
    fontSize: fontSizes.md, color: colors.text, backgroundColor: colors.card,
  },
  searchIconLeft: { position: 'absolute', left: spacing.md, top: 0, bottom: 0, justifyContent: 'center' },
  searchClear: { position: 'absolute', right: spacing.md, top: 0, bottom: 0, justifyContent: 'center' },
  list: { flex: 1 },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  optionSelected: { backgroundColor: colors.softGreen },
  optionLabel: { fontSize: fontSizes.md, color: colors.text, flex: 1, marginRight: spacing.sm },
  optionCode: { fontSize: fontSizes.md, color: colors.muted, fontWeight: '600' },
})
