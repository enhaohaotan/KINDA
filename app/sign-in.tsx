import React, { useRef, useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity, Animated,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../src/lib/supabase'
import { useUserStore } from '../src/store/userStore'
import { t, tAuth } from '../src/lib/i18n'
import { PhoneInput } from '../src/components/ui/PhoneInput'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

type Method = 'password' | 'email-otp' | 'phone-otp'

export default function LoginScreen() {
  const { registered } = useLocalSearchParams<{ registered?: string }>()
  const [method, setMethod] = useState<Method>('password')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const METHODS: Method[] = ['password', 'email-otp', 'phone-otp']
  const [tabContainerWidth, setTabContainerWidth] = useState(0)
  const tabSlide = useRef(new Animated.Value(0)).current

  function switchMethod(newMethod: Method) {
    const index = METHODS.indexOf(newMethod)
    const tabWidth = tabContainerWidth / METHODS.length
    Animated.spring(tabSlide, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start()
    setMethod(newMethod)
    reset()
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser, setOnboardingComplete, loadSettings, uiLanguage } = useUserStore()
  const tr = t(uiLanguage)
  const trAuth = tAuth(uiLanguage)

  function reset() {
    setError('')
    setOtp('')
    setOtpSent(false)
    setIdentifier('')
    setPassword('')
    setShowPassword(false)
  }

  async function resolveEmail(raw: string): Promise<string | null> {
    const v = raw.trim().toLowerCase()
    if (v.includes('@')) return v
    const { data } = await supabase.from('profiles').select('email').eq('username', v).single()
    return data?.email ?? null
  }

  async function handlePasswordLogin() {
    setError('')
    if (!identifier.trim() || !password) return setError(trAuth.identifierPlaceholder)
    setLoading(true)
    try {
      const email = await resolveEmail(identifier)
      if (!email) return setError('No account found.')
      const { data, error: e } = await supabase.auth.signInWithPassword({ email, password })
      if (e) throw e
      if (data.user) {
        setUser(data.user.id, data.user.email ?? '')
        await loadSettings(data.user.id)
        setOnboardingComplete()
        router.replace('/(tabs)/home')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendEmailOtp() {
    setError('')
    if (!identifier.trim()) return setError(trAuth.email)
    setLoading(true)
    try {
      const { error: e } = await supabase.auth.signInWithOtp({ email: identifier.trim().toLowerCase() })
      if (e) throw e
      setOtpSent(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyEmailOtp() {
    setError('')
    if (!otp.trim()) return
    setLoading(true)
    try {
      const { data, error: e } = await supabase.auth.verifyOtp({
        email: identifier.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email',
      })
      if (e) throw e
      if (data.user) {
        setUser(data.user.id, data.user.email ?? '')
        await loadSettings(data.user.id)
        setOnboardingComplete()
        router.replace('/(tabs)/home')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendPhoneOtp() {
    setError('')
    const fullPhone = `${countryCode}${phoneNumber.trim()}`
    if (!phoneNumber.trim()) return
    setLoading(true)
    try {
      const { error: e } = await supabase.auth.signInWithOtp({ phone: fullPhone })
      if (e) throw e
      setIdentifier(fullPhone)
      setOtpSent(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyPhoneOtp() {
    setError('')
    if (!otp.trim()) return
    setLoading(true)
    try {
      const { data, error: e } = await supabase.auth.verifyOtp({
        phone: identifier.trim(),
        token: otp.trim(),
        type: 'sms',
      })
      if (e) throw e
      if (data.user) {
        setUser(data.user.id, data.user.email ?? '')
        await loadSettings(data.user.id)
        setOnboardingComplete()
        router.replace('/(tabs)/home')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const isPhone = method === 'phone-otp'
  const isEmail = method === 'email-otp'
  const isPassword = method === 'password'

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <Text style={styles.logo}>{tr.appName}</Text>
        <Text style={styles.tagline}>{tr.appTagline}</Text>

        {registered === '1' && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#2e7d32" />
            <Text style={styles.successText}>{trAuth.joinKinda} ✓</Text>
          </View>
        )}

        <View
          style={styles.tabs}
          onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width - 6)}
        >
          <Animated.View style={[styles.tabPill, { width: `${100 / METHODS.length}%` as any, transform: [{ translateX: tabSlide }] }]} />
          <Tab label={trAuth.tabPassword} active={isPassword} onPress={() => switchMethod('password')} />
          <Tab label={trAuth.tabEmail} active={isEmail} onPress={() => switchMethod('email-otp')} />
          <Tab label={trAuth.tabPhone} active={isPhone} onPress={() => switchMethod('phone-otp')} />
        </View>

        <View style={styles.form}>
          {!otpSent && (
            <>
              {isPhone ? (
                <PhoneInput
                  countryCode={countryCode}
                  phone={phoneNumber}
                  onChangeCountryCode={setCountryCode}
                  onChangePhone={setPhoneNumber}
                />
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder={isPassword ? trAuth.identifierPlaceholder : 'you@example.com'}
                  placeholderTextColor={colors.muted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType={isEmail ? 'email-address' : 'default'}
                />
              )}
              {isPassword && (
                <View style={styles.passwordWrap}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder={trAuth.password}
                    placeholderTextColor={colors.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          {otpSent && (
            <>
              <View style={styles.sentNote}>
                <Ionicons name={isEmail ? 'mail-outline' : 'phone-portrait-outline'} size={18} color={colors.primary} />
                <Text style={styles.sentText}>
                  {isEmail ? trAuth.codeSentEmail : trAuth.codeSentPhone}{' '}
                  <Text style={styles.sentEmail}>{identifier}</Text>
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder={trAuth.codePlaceholder}
                placeholderTextColor={colors.muted}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </>
          )}

          {error ? <ErrorBox message={error} /> : null}

          <PrimaryButton
            disabled={loading}
            onPress={
              isPassword ? handlePasswordLogin
              : otpSent ? (isEmail ? handleVerifyEmailOtp : handleVerifyPhoneOtp)
              : (isEmail ? handleSendEmailOtp : handleSendPhoneOtp)
            }
            label={
              isPassword ? (loading ? trAuth.signingIn : trAuth.signIn)
              : otpSent ? (loading ? trAuth.verifying : trAuth.verifySignIn)
              : (loading ? trAuth.sending : trAuth.sendCode)
            }
          />

          {otpSent && (
            <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.linkBtn}>
              <Text style={styles.linkText}>{isEmail ? trAuth.changeEmail : trAuth.changePhone}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.registerText}>
          {trAuth.noAccountYet}{' '}
          <Text style={styles.registerEmphasis} onPress={() => router.navigate('/sign-up')}>{trAuth.createOne}</Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  )
}

function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]} onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <View style={styles.errorBox}>
      <Ionicons name="alert-circle-outline" size={16} color="#C0392B" />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  logo: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, textAlign: 'center' },
  tagline: { fontSize: fontSizes.md, color: colors.muted, textAlign: 'center', marginTop: -spacing.sm },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#E8F5E9', borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: '#A5D6A7',
  },
  successText: { flex: 1, fontSize: fontSizes.sm, color: '#2e7d32' },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, padding: 3, borderWidth: 1, borderColor: colors.border, position: 'relative' },
  tabPill: { position: 'absolute', top: 3, bottom: 3, left: 3, backgroundColor: colors.primary, borderRadius: radius.md - 4 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.md - 4, zIndex: 1 },
  tabActive: {},
  tabText: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.muted },
  tabTextActive: { color: '#fff' },
  form: { gap: spacing.md },
  input: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSizes.md, color: colors.text, backgroundColor: colors.card,
  },
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: spacing.xl + spacing.lg },
  eyeBtn: { position: 'absolute', right: 0, top: 0, bottom: 0, paddingHorizontal: spacing.md, justifyContent: 'center' },
  sentNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.softGreen, borderRadius: radius.md },
  sentText: { fontSize: fontSizes.sm, color: colors.text, flex: 1 },
  sentEmail: { fontWeight: '700', color: colors.primary },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, backgroundColor: '#FEE', padding: spacing.sm, borderRadius: radius.sm },
  errorText: { flex: 1, fontSize: fontSizes.sm, color: '#C0392B' },
  primaryBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.full, alignItems: 'center' },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#fff', fontSize: fontSizes.md, fontWeight: '700' },
  linkBtn: { alignItems: 'center', paddingVertical: spacing.xs },
  linkText: { fontSize: fontSizes.sm, color: colors.muted },
  registerText: { fontSize: fontSizes.sm, color: colors.muted, textAlign: 'center', paddingVertical: spacing.sm },
  registerEmphasis: { color: colors.primary, fontWeight: '600' },
})
