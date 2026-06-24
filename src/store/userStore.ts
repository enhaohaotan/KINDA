import { create } from 'zustand'
import type { LanguageCode } from '../data/languages'

type UserLevel = 'beginner' | 'lower_intermediate' | 'intermediate' | 'advanced'

type UserState = {
  userId: string | null
  email: string | null
  level: UserLevel
  interests: string[]
  uiLanguage: LanguageCode
  targetLanguage: LanguageCode
  onboardingComplete: boolean
  setUser: (userId: string, email: string) => void
  setPreferences: (level: UserLevel, interests: string[]) => void
  setLanguages: (uiLanguage: LanguageCode, targetLanguage: LanguageCode) => void
  setOnboardingComplete: () => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  email: null,
  level: 'intermediate',
  interests: [],
  uiLanguage: 'en',
  targetLanguage: 'en',
  onboardingComplete: false,
  setUser: (userId, email) => set({ userId, email }),
  setPreferences: (level, interests) => set({ level, interests }),
  setLanguages: (uiLanguage, targetLanguage) => set({ uiLanguage, targetLanguage }),
  setOnboardingComplete: () => set({ onboardingComplete: true }),
  clearUser: () => set({ userId: null, email: null, onboardingComplete: false }),
}))
