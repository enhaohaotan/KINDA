import { create } from 'zustand'
import type { LanguageCode } from '../data/languages'
import { getSupabase } from '../lib/supabase'

type UserState = {
  userId: string | null
  email: string | null
  uiLanguage: LanguageCode
  learningLanguage: LanguageCode
  onboardingComplete: boolean
  setUser: (userId: string, email: string) => void
  setLanguages: (uiLanguage: LanguageCode, learningLanguage: LanguageCode) => void
  setOnboardingComplete: () => void
  clearUser: () => void
  loadSettings: (userId: string) => Promise<void>
  saveSettings: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  email: null,
  uiLanguage: 'en',
  learningLanguage: 'en',
  onboardingComplete: false,

  setUser: (userId, email) => set({ userId, email }),

  setLanguages: (uiLanguage, learningLanguage) => set({ uiLanguage, learningLanguage }),

  setOnboardingComplete: () => set({ onboardingComplete: true }),

  clearUser: () => set({ userId: null, email: null, onboardingComplete: false }),

  loadSettings: async (userId) => {
    const { data } = await getSupabase()
      .from('user_settings')
      .select('ui_language, learning_language')
      .eq('id', userId)
      .single()

    if (data) {
      set({
        uiLanguage: data.ui_language as LanguageCode,
        learningLanguage: data.learning_language as LanguageCode,
        onboardingComplete: true,
      })
    }
  },

  saveSettings: async () => {
    const { userId, uiLanguage, learningLanguage } = get()
    if (!userId) return
    await getSupabase()
      .from('user_settings')
      .upsert({ id: userId, ui_language: uiLanguage, learning_language: learningLanguage })
  },
}))
