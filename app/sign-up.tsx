import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity, Modal, FlatList,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../src/lib/supabase'
import { useUserStore } from '../src/store/userStore'
import { UI_LANGUAGES, TARGET_LANGUAGES, getTargetLabel, type LanguageCode } from '../src/data/languages'
import { detectUILanguage } from '../src/lib/locale'
import { t, tAuth } from '../src/lib/i18n'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

const COUNTRY_CODES = [
  { code: '+1', label: 'United States' },
  { code: '+44', label: 'United Kingdom' },
  { code: '+45', label: 'Denmark' },
  { code: '+46', label: 'Sweden' },
  { code: '+47', label: 'Norway' },
  { code: '+49', label: 'Germany' },
  { code: '+33', label: 'France' },
  { code: '+86', label: 'China' },
  { code: '+852', label: 'Hong Kong' },
  { code: '+886', label: 'Taiwan' },
  { code: '+65', label: 'Singapore' },
  { code: '+60', label: 'Malaysia' },
  { code: '+61', label: 'Australia' },
  { code: '+81', label: 'Japan' },
  { code: '+82', label: 'South Korea' },
]

export default function RegisterScreen() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [uiLanguage, setUiLanguage] = useState<LanguageCode>(detectUILanguage)
  const [learningLanguage, setLearningLanguage] = useState<LanguageCode>('da')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const { setLanguages } = useUserStore()
  const tr = t(uiLanguage)
  const trAuth = tAuth(uiLanguage)

  async function handleRegister() {
    setError('')
    if (!username.trim()) return setError('Username is required.')
    if (username.trim().length < 3) return setError('Username must be at least 3 characters.')
    if (!email.trim()) return setError('Email is required.')
    if (!password) return setError('Password is required.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const fullPhone = phone.trim() ? `${countryCode}${phone.trim()}` : null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { username: username.trim(), phone: fullPhone },
        },
      })
      if (signUpError) throw signUpError

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          phone: fullPhone,
        })
        await supabase.from('user_settings').upsert({
          id: data.user.id,
          ui_language: uiLanguage,
          learning_language: learningLanguage,
        })
        setLanguages(uiLanguage, learningLanguage)
      }

      router.replace({ pathname: '/sign-in', params: { registered: '1' } })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <TouchableOpacity style={styles.backBtn} onPress={() => router.navigate('/sign-in')}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>{trAuth.createAccount}</Text>
        <Text style={styles.subtitle}>{trAuth.joinKinda}</Text>

        <View style={styles.form}>
          <Field label={trAuth.username}>
            <TextInput
              style={styles.input}
              placeholder="e.g. coollearner"
              placeholderTextColor={colors.muted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Field>

          <Field label={trAuth.email}>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Field>

          <Field label={trAuth.phoneOptional}>
            <View style={styles.phoneRow}>
              <TouchableOpacity style={styles.countryBtn} onPress={() => setShowCountryPicker(true)}>
                <Text style={styles.countryCode}>{countryCode}</Text>
                <Ionicons name="chevron-down" size={14} color={colors.muted} />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="123 456 7890"
                placeholderTextColor={colors.muted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </Field>

          <Field label={tr.iSpeak}>
            <View style={styles.langRow}>
              {UI_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langOption, uiLanguage === lang.code && styles.langOptionSelected]}
                  onPress={() => setUiLanguage(lang.code)}
                >
                  <Text style={[styles.langLabel, uiLanguage === lang.code && styles.langLabelSelected]}>{lang.labelNative}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label={tr.iLearn}>
            <View style={styles.langRow}>
              {TARGET_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langOption, learningLanguage === lang.code && styles.langOptionSelected]}
                  onPress={() => setLearningLanguage(lang.code)}
                >
                  <Text style={[styles.langLabel, learningLanguage === lang.code && styles.langLabelSelected]}>{getTargetLabel(lang, uiLanguage)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label={trAuth.password}>
            <TextInput
              style={styles.input}
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Field>

          <Field label={trAuth.confirmPassword}>
            <TextInput
              style={styles.input}
              placeholder="Same as above"
              placeholderTextColor={colors.muted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </Field>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>{loading ? trAuth.creatingAccount : trAuth.createAccount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => router.replace('/sign-in')}>
            <Text style={styles.linkText}>{trAuth.alreadyHaveAccount} <Text style={styles.linkEmphasis}>{trAuth.signIn}</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showCountryPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Country code</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryOption, countryCode === item.code && styles.countryOptionSelected]}
                  onPress={() => { setCountryCode(item.code); setShowCountryPicker(false) }}
                >
                  <Text style={styles.countryOptionText}>{item.label}</Text>
                  <Text style={styles.countryOptionCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.xl, paddingTop: spacing.xl + 8 },
  backBtn: { marginBottom: spacing.lg },
  title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSizes.md, color: colors.muted, marginBottom: spacing.xl },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  fieldLabel: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.muted },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    backgroundColor: colors.card,
  },
  phoneRow: { flexDirection: 'row', gap: spacing.sm },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
  },
  countryCode: { fontSize: fontSizes.md, color: colors.text, fontWeight: '600' },
  phoneInput: { flex: 1 },
  error: { fontSize: fontSizes.sm, color: '#C0392B', backgroundColor: '#FEE', padding: spacing.sm, borderRadius: radius.sm },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#fff', fontSize: fontSizes.md, fontWeight: '700' },
  linkBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  linkText: { fontSize: fontSizes.sm, color: colors.muted },
  linkEmphasis: { color: colors.primary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  countryOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  countryOptionSelected: { backgroundColor: colors.softGreen },
  countryOptionText: { fontSize: fontSizes.md, color: colors.text },
  countryOptionCode: { fontSize: fontSizes.md, color: colors.muted, fontWeight: '600' },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  langOption: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.card,
  },
  langOptionSelected: { borderColor: colors.primary, backgroundColor: colors.softGreen },
  langFlag: { fontSize: fontSizes.lg },
  langLabel: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.muted },
  langLabelSelected: { color: colors.primary },
})
