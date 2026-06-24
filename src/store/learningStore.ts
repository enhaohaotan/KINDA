import { create } from 'zustand'
import type { Expression } from '../data/expressions'

export type ExpressionStatus = {
  expressionId: string
  seen: boolean
  understood: boolean
  tried: boolean
  saved: boolean
  lastSeenAt: string | null
}

type LearningState = {
  todayExpression: Expression | null
  activeExpression: Expression | null
  statuses: Record<string, ExpressionStatus>
  recentExpressionIds: string[]
  setTodayExpression: (expr: Expression) => void
  setActiveExpression: (expr: Expression | null) => void
  updateStatus: (expressionId: string, updates: Partial<Omit<ExpressionStatus, 'expressionId'>>) => void
  getStatus: (expressionId: string) => ExpressionStatus
}

const defaultStatus = (expressionId: string): ExpressionStatus => ({
  expressionId,
  seen: false,
  understood: false,
  tried: false,
  saved: false,
  lastSeenAt: null,
})

export const useLearningStore = create<LearningState>((set, get) => ({
  todayExpression: null,
  activeExpression: null,
  statuses: {},
  recentExpressionIds: [],

  setTodayExpression: (expr) => set({ todayExpression: expr }),
  setActiveExpression: (expr) => set({ activeExpression: expr }),

  updateStatus: (expressionId, updates) =>
    set((state) => {
      const current = state.statuses[expressionId] ?? defaultStatus(expressionId)
      const updated = { ...current, ...updates }
      const recents = state.recentExpressionIds.filter((id) => id !== expressionId)
      return {
        statuses: { ...state.statuses, [expressionId]: updated },
        recentExpressionIds: [expressionId, ...recents].slice(0, 10),
      }
    }),

  getStatus: (expressionId) =>
    get().statuses[expressionId] ?? defaultStatus(expressionId),
}))
