import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../src/lib/supabase'
import { useUserStore } from '../src/store/userStore'
import { Button } from '../src/components/ui/Button'
import { colors, fontSizes, spacing, radius } from '../src/styles/tokens'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { setUser, setOnboardingComplete } = useUserStore()

  async function handleAuth() {
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password })
        if (error) throw error
        if (data.user) {
          setUser(data.user.id, data.user.email ?? '')
          router.replace('/onboarding')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
        if (data.user) {
          setUser(data.user.id, data.user.email ?? '')
          setOnboardingComplete()
          router.replace('/(tabs)/home')
        }
      }
    } catch (e: any) {
      Alert.alert('出错了', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>都行 KINDA</Text>
        <Text style={styles.tagline}>学也行，不学也行，都行。</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="邮箱"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="密码"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            label={isSignUp ? '注册' : '登录'}
            onPress={handleAuth}
            loading={loading}
          />
          <Button
            label={isSignUp ? '已有账号？登录' : '没有账号？注册'}
            onPress={() => setIsSignUp(!isSignUp)}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  logo: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  tagline: { fontSize: fontSizes.md, color: colors.muted, textAlign: 'center', marginBottom: spacing.xxl },
  form: { gap: spacing.md },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    backgroundColor: colors.card,
  },
})
