import OpenAI from 'https://deno.land/x/openai@v4.52.7/mod.ts'

const client = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

const SYSTEM_PROMPT = `你是一个轻松有趣的短篇故事写手，帮助学习者通过故事记住英语表达。
规则：
- 故事长度：short=80词, normal=120词, wild=150词（稍微荒诞一点）
- 故事主体用英文写，自然融入目标表达
- 最多突出3个表达
- 返回 JSON：title（故事标题，中文）、story（故事正文，英文）、highlightedExpressions（数组，每项有text和meaningZh字段）`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } })
  }

  const { targetExpression, themes, length, userLevel } = await req.json()

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `目标表达：${targetExpression}\n主题：${themes.join('、')}\n长度：${length}\n用户水平：${userLevel}`,
      },
    ],
    max_tokens: 600,
  })

  const data = JSON.parse(completion.choices[0].message.content ?? '{}')

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
