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
  createOne: string
  // sign-in tabs
  tabPassword: string
  tabEmail: string
  tabPhone: string
  // sign-in fields
  identifierPlaceholder: string
  codePlaceholder: string
  sendCode: string
  sending: string
  verifySignIn: string
  verifying: string
  codeSentEmail: string
  codeSentPhone: string
  changeEmail: string
  changePhone: string
  signingIn: string
}

export const AUTH: Record<LanguageCode, AuthTranslations> = {
  en: {
    signIn: 'Sign in',
    signUp: 'Sign up',
    createAccount: 'Create account',
    creatingAccount: 'Creating account…',
    joinKinda: 'Join KINDA',
    username: 'Username',
    email: 'Email',
    phoneOptional: 'Phone (optional)',
    password: 'Password',
    confirmPassword: 'Confirm password',
    alreadyHaveAccount: 'Already have an account?',
    noAccountYet: 'No account yet?',
    createOne: 'Create one',
    tabPassword: 'Password',
    tabEmail: 'Email',
    tabPhone: 'Phone',
    identifierPlaceholder: 'Username, email, or phone',
    codePlaceholder: '6-digit code',
    sendCode: 'Send code',
    sending: 'Sending…',
    verifySignIn: 'Verify & sign in',
    verifying: 'Verifying…',
    codeSentEmail: 'Code sent to',
    codeSentPhone: 'SMS sent to',
    changeEmail: '← Change email',
    changePhone: '← Change number',
    signingIn: 'Signing in…',
  },
  zh: {
    signIn: '登录',
    signUp: '注册',
    createAccount: '创建账号',
    creatingAccount: '创建中…',
    joinKinda: '加入都行',
    username: '用户名',
    email: '邮箱',
    phoneOptional: '电话（可选）',
    password: '密码',
    confirmPassword: '确认密码',
    alreadyHaveAccount: '已有账号？',
    noAccountYet: '还没有账号？',
    createOne: '去注册',
    tabPassword: '密码',
    tabEmail: '邮箱',
    tabPhone: '手机',
    identifierPlaceholder: '用户名、邮箱或手机号',
    codePlaceholder: '6位验证码',
    sendCode: '发送验证码',
    sending: '发送中…',
    verifySignIn: '验证并登录',
    verifying: '验证中…',
    codeSentEmail: '验证码已发送至',
    codeSentPhone: '短信已发送至',
    changeEmail: '← 更换邮箱',
    changePhone: '← 更换手机号',
    signingIn: '登录中…',
  },
  da: {
    signIn: 'Log ind',
    signUp: 'Opret konto',
    createAccount: 'Opret konto',
    creatingAccount: 'Opretter konto…',
    joinKinda: 'Bliv en del af KINDA',
    username: 'Brugernavn',
    email: 'E-mail',
    phoneOptional: 'Telefon (valgfri)',
    password: 'Adgangskode',
    confirmPassword: 'Bekræft adgangskode',
    alreadyHaveAccount: 'Har du allerede en konto?',
    noAccountYet: 'Ingen konto endnu?',
    createOne: 'Opret en',
    tabPassword: 'Adgangskode',
    tabEmail: 'E-mail',
    tabPhone: 'Telefon',
    identifierPlaceholder: 'Brugernavn, e-mail eller telefon',
    codePlaceholder: '6-cifret kode',
    sendCode: 'Send kode',
    sending: 'Sender…',
    verifySignIn: 'Bekræft og log ind',
    verifying: 'Bekræfter…',
    codeSentEmail: 'Kode sendt til',
    codeSentPhone: 'SMS sendt til',
    changeEmail: '← Skift e-mail',
    changePhone: '← Skift nummer',
    signingIn: 'Logger ind…',
  },
}
