import type { LanguageCode } from '../data/languages'

export type AuthTranslations = {
  signIn: string
  signUp: string
  createAccount: string
  creatingAccount: string
  joinKinda: string
  username: string
  email: string
  phoneOptional: string
  password: string
  confirmPassword: string
  alreadyHaveAccount: string
  noAccountYet: string
}

export const AUTH: Record<LanguageCode, AuthTranslations> = {
  en: {
    signIn: 'Sign in',
    signUp: 'Sign up',
    createAccount: 'Create account',
    creatingAccount: 'Creating account…',
    joinKinda: 'Join 都行 KINDA',
    username: 'Username',
    email: 'Email',
    phoneOptional: 'Phone (optional)',
    password: 'Password',
    confirmPassword: 'Confirm password',
    alreadyHaveAccount: 'Already have an account?',
    noAccountYet: 'No account yet?',
  },
  zh: {
    signIn: '登录',
    signUp: '注册',
    createAccount: '创建账号',
    creatingAccount: '创建中…',
    joinKinda: '加入 都行 KINDA',
    username: '用户名',
    email: '邮箱',
    phoneOptional: '电话（可选）',
    password: '密码',
    confirmPassword: '确认密码',
    alreadyHaveAccount: '已有账号？',
    noAccountYet: '没有账号？',
  },
  da: {
    signIn: 'Log ind',
    signUp: 'Opret konto',
    createAccount: 'Opret konto',
    creatingAccount: 'Opretter konto…',
    joinKinda: 'Bliv en del af 都行 KINDA',
    username: 'Brugernavn',
    email: 'E-mail',
    phoneOptional: 'Telefon (valgfri)',
    password: 'Adgangskode',
    confirmPassword: 'Bekræft adgangskode',
    alreadyHaveAccount: 'Har du allerede en konto?',
    noAccountYet: 'Ingen konto endnu?',
  },
}
