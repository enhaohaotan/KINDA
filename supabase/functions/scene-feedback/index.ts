import OpenAI from 'https://deno.land/x/openai@v4.52.7/mod.ts'

const client = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

const SYSTEM_PROMPT = `你是一个场景对话评估助手，帮助中文学习者练习英语场景对话。
规则：
- 温和、鼓励、不苛刻
- 判断用户回复是否自然、是否传达了正确意思
- 如果不太自然，给出更好的版本
- 返回 JSON：isSuccessful（布尔值，回复是否基本OK）、feedbackZh（中文反馈，简短）、moreNaturalVersion（更自然的英文版本，若已很好可为空）、tinyTip（一条小建议，可为空）`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } })
  }

  const { sceneId, aiLine, userReply, targetExpression } = await req.json()

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `场景：${sceneId}\nAI说：${aiLine}\n用户回复：${userReply}\n目标表达：${targetExpression}`,
      },
    ],
    max_tokens: 300,
  })

  const data = JSON.parse(completion.choices[0].message.content ?? '{}')

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
