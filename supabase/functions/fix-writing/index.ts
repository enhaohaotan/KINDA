import OpenAI from 'https://deno.land/x/openai@v4.52.7/mod.ts'

const client = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

const SYSTEM_PROMPT = `你是一个温和的英语写作助手，帮助中文学习者改进英文句子。
规则：
- 绝对不要给分数
- 不要说"错误很多"或类似批评性语言
- 用温和、鼓励的语气
- 用中文解释原因
- 返回 JSON 格式包含：understandable（布尔值）、correctedText（修正后的句子）、explanationZh（中文解释原因）、naturalVersion（更自然的版本，可与correctedText相同）、encouragement（简短鼓励，如"能懂，小修一下就自然很多"）`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } })
  }

  const { userText, targetExpression, userLevel } = await req.json()

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `用户写的句子：${userText}\n目标表达：${targetExpression}\n用户水平：${userLevel}`,
      },
    ],
    max_tokens: 400,
  })

  const data = JSON.parse(completion.choices[0].message.content ?? '{}')

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
