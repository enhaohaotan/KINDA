import { Redirect } from 'expo-router'
import { useUserStore } from '../src/store/userStore'
import { useEffect } from 'react'

const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true'

export default function Index() {
  const { userId, onboardingComplete, setUser, setOnboardingComplete } = useUserStore()

  useEffect(() => {
    if (DEV_MODE) {
      setUser('dev-user', 'dev@kinda.app')
      setOnboardingComplete()
    }
  }, [])

  if (DEV_MODE) return <Redirect href="/(tabs)/home" />

  if (!userId) return <Redirect href="/sign-in" />
  if (!onboardingComplete) return <Redirect href="/onboarding" />
  return <Redirect href="/(tabs)/home" />
}
