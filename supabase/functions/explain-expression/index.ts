import OpenAI from 'https://deno.land/x/openai@v4.52.7/mod.ts'

const client = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

const SYSTEM_PROMPT = `你是一个帮助中文学习者学英语的助手。
你的风格：随意、轻松、不说教。用中文解释，像朋友聊天一样。
不要说"This phrase means..."，直接用中文说明。
返回 JSON 格式，包含字段：answerZh（中文解释）、examples（2-3个英文例句数组）、tinyNote（一条小提示，可为空字符串）。`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } })
  }

  const { expression, userQuestion, userLevel } = await req.json()

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `表达：${expression}\n用户问题：${userQuestion || '请解释这个表达'}\n用户水平：${userLevel}`,
      },
    ],
    max_tokens: 500,
  })

  const data = JSON.parse(completion.choices[0].message.content ?? '{}')

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
