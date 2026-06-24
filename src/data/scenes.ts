export type Scene = {
  id: string
  titleZh: string
  titleEn: string
  descriptionZh: string
  emoji: string
  aiOpeningLine: string
  targetExpression: string
  hintZh: string
}

export const scenes: Scene[] = [
  {
    id: 'cafe',
    titleZh: '咖啡店',
    titleEn: 'Café',
    descriptionZh: '点一杯东西，不要慌。',
    emoji: '☕',
    aiOpeningLine: "Hi, welcome! What can I get for you today?",
    targetExpression: "Could I get a...",
    hintZh: '试着点一杯咖啡或饮料。',
  },
  {
    id: 'small_talk',
    titleZh: '工作闲聊',
    titleEn: 'Small Talk',
    descriptionZh: '听起来像个人类同事。',
    emoji: '💬',
    aiOpeningLine: "Hey! How was your weekend?",
    targetExpression: "It was good. I...",
    hintZh: '简单聊聊你的周末，不需要说很多。',
  },
  {
    id: 'decline_plans',
    titleZh: '委婉拒绝',
    titleEn: 'Declining Plans',
    descriptionZh: '委婉拒绝，不显得太冷漠。',
    emoji: '🌿',
    aiOpeningLine: "Hey, want to go out tonight? We're all heading to that new bar downtown.",
    targetExpression: "I'm not feeling it.",
    hintZh: "用自然的方式拒绝。试试 \"I'm not feeling it\" 或 \"Maybe another time\"。",
  },
]
