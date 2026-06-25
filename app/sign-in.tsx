import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../src/lib/supabase'
import { useUserStore } from '../src/store/userStore'
import { t } from '../src/lib/i18n'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

type Method = 'password' | 'email-otp' | 'phone-otp'

export default function LoginScreen() {
  const { registered } = useLocalSearchParams<{ registered?: string }>()
  const [method, setMethod] = useState<Method>('password')
  const [identifier, setIdentifier] = useState('')   // email, username, or phone
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser, setOnboardingComplete, loadSettings, uiLanguage } = useUserStore()
  const tr = t(uiLanguage)

  function reset() {
    setError('')
    setOtp('')
    setOtpSent(false)
    setIdentifier('')
    setPassword('')
  }

  async function resolveEmail(raw: string): Promise<string | null> {
    const v = raw.trim().toLowerCase()
    // Looks like an email
    if (v.includes('@')) return v
    // Looks like a phone
    if (v.startsWith('+')) {
      const { data } = await supabase.from('profiles').select('email').eq('phone', v).single()
      return data?.email ?? null
    }
    // Username lookup
    const { data } = await supabase.from('profiles').select('email').eq('username', v).single()
    return data?.email ?? null
  }

  async function handlePasswordLogin() {
    setError('')
    if (!identifier.trim() || !password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      const email = await resolveEmail(identifier)
      if (!email) return setError('No account found with that username, email, or phone.')
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
    if (!identifier.trim()) return setError('Enter your email address.')
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
    if (!otp.trim()) return setError('Enter the code from your email.')
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
    if (!identifier.trim()) return setError('Enter your phone number with country code, e.g. +1 234 567 8900')
    setLoading(true)
    try {
      const { error: e } = await supabase.auth.signInWithOtp({ phone: identifier.trim() })
      if (e) throw e
      setOtpSent(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyPhoneOtp() {
    setError('')
    if (!otp.trim()) return setError('Enter the code from your SMS.')
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

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <Text style={styles.logo}>{tr.appName}</Text>
        <Text style={styles.tagline}>{tr.appTagline}</Text>

        {registered === '1' && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#2e7d32" />
            <Text style={styles.successText}>Account created! Check your email to verify, then sign in.</Text>
          </View>
        )}

        {/* Method tabs */}
        <View style={styles.tabs}>
          <Tab label="Password" active={method === 'password'} onPress={() => { setMethod('password'); reset() }} />
          <Tab label="Email code" active={method === 'email-otp'} onPress={() => { setMethod('email-otp'); reset() }} />
          <Tab label="SMS code" active={method === 'phone-otp'} onPress={() => { setMethod('phone-otp'); reset() }} />
        </View>

        {/* Password login */}
        {method === 'password' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username, email, or phone"
              placeholderTextColor={colors.muted}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <ErrorBox message={error} /> : null}
            <PrimaryButton label={loading ? 'Signing in…' : 'Sign in'} onPress={handlePasswordLogin} disabled={loading} />
          </View>
        )}

        {/* Email OTP */}
        {method === 'email-otp' && (
          <View style={styles.form}>
            {!otpSent ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.muted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {error ? <ErrorBox message={error} /> : null}
                <PrimaryButton label={loading ? 'Sending…' : 'Send code'} onPress={handleSendEmailOtp} disabled={loading} />
              </>
            ) : (
              <>
                <View style={styles.sentNote}>
                  <Ionicons name="mail-outline" size={18} color={colors.primary} />
                  <Text style={styles.sentText}>Code sent to <Text style={styles.sentEmail}>{identifier}</Text></Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="6-digit code"
                  placeholderTextColor={colors.muted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {error ? <ErrorBox message={error} /> : null}
                <PrimaryButton label={loading ? 'Verifying…' : 'Verify & sign in'} onPress={handleVerifyEmailOtp} disabled={loading} />
                <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.linkBtn}>
                  <Text style={styles.linkText}>← Change email</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Phone OTP */}
        {method === 'phone-otp' && (
          <View style={styles.form}>
            {!otpSent ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 8900"
                  placeholderTextColor={colors.muted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="phone-pad"
                />
                <Text style={styles.hint}>Requires SMS to be enabled in your Supabase project.</Text>
                {error ? <ErrorBox message={error} /> : null}
                <PrimaryButton label={loading ? 'Sending…' : 'Send SMS code'} onPress={handleSendPhoneOtp} disabled={loading} />
              </>
            ) : (
              <>
                <View style={styles.sentNote}>
                  <Ionicons name="phone-portrait-outline" size={18} color={colors.primary} />
                  <Text style={styles.sentText}>SMS sent to <Text style={styles.sentEmail}>{identifier}</Text></Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="6-digit code"
                  placeholderTextColor={colors.muted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {error ? <ErrorBox message={error} /> : null}
                <PrimaryButton label={loading ? 'Verifying…' : 'Verify & sign in'} onPress={handleVerifyPhoneOtp} disabled={loading} />
                <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.linkBtn}>
                  <Text style={styles.linkText}>← Change number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.registerBtn} onPress={() => router.navigate('/sign-up')}>
          <Text style={styles.registerText}>No account yet? <Text style={styles.registerEmphasis}>Create one</Text></Text>
        </TouchableOpacity>

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
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: '#E8F5E9', borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: '#A5D6A7',
  },
  successText: { flex: 1, fontSize: fontSizes.sm, color: '#2e7d32', lineHeight: 20 },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.muted },
  tabTextActive: { color: '#fff' },
  form: { gap: spacing.md },
  input: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSizes.md, color: colors.text, backgroundColor: colors.card,
  },
  hint: { fontSize: fontSizes.xs, color: colors.muted },
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
  registerBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  registerText: { fontSize: fontSizes.sm, color: colors.muted },
  registerEmphasis: { color: colors.primary, fontWeight: '600' },
})
