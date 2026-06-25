import { supabase } from './supabase'

export type ExplainExpressionResult = {
  answerZh: string
  examples: string[]
  tinyNote: string
}

export type FixWritingResult = {
  understandable: boolean
  correctedText: string
  explanationZh: string
  naturalVersion: string
  encouragement: string
}

export type GenerateStoryResult = {
  title: string
  story: string
  highlightedExpressions: { text: string; meaningZh: string }[]
}

export type SceneFeedbackResult = {
  isSuccessful: boolean
  feedbackZh: string
  moreNaturalVersion: string
  tinyTip: string
}

async function invoke<T>(fn: string, body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke(fn, { body })
  if (error) throw new Error(error.message)
  return data as T
}

export const ai = {
  explainExpression: (expression: string, userQuestion: string) =>
    invoke<ExplainExpressionResult>('explain-expression', { expression, userQuestion }),

  fixWriting: (userText: string, targetExpression: string) =>
    invoke<FixWritingResult>('fix-writing', { userText, targetExpression }),

  generateStory: (targetExpression: string, themes: string[], length: string) =>
    invoke<GenerateStoryResult>('generate-story', { targetExpression, themes, length }),

  sceneFeedback: (sceneId: string, aiLine: string, userReply: string, targetExpression: string) =>
    invoke<SceneFeedbackResult>('scene-feedback', { sceneId, aiLine, userReply, targetExpression }),
}
