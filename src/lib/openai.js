import { load } from '../utils/storage'

// Using Responses API (browser-friendly). Make sure your API key has Allowed Origins set to your domain (e.g., http://localhost:5173)
const endpoint = 'https://api.openai.com/v1/responses'

const envKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) ? import.meta.env.VITE_OPENAI_API_KEY : '';

export function getApiKey(){
  const settings = load('settings', { apiKey: '' })
  return settings.apiKey || envKey || 'sk-yourkey-placeholder'
}

export async function validateApiKey(key){
  try{
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role:'system', content:'ping'}],
        max_tokens: 1
      })
    })
    if(!res.ok){
      const txt = await res.text()
      return { ok:false, error: txt.slice(0,500) }
    }
    return { ok:true }
  } catch(e){
    return { ok:false, error: String(e).slice(0,500) }
  }
}

export async function chatLLM(messages, lang='en'){
  const settings = load('settings', { apiKey: '' })
  if(!settings.apiKey){
    const last = messages[messages.length-1]?.content || ''
    return { content: `(${lang==='ar'?'وضع بدون API:':'No API mode:'}) ${last.slice(0,160)}` }
  }
  const payload = {
    model: 'gpt-4o-mini',
    input: [
      { role: 'system', content: 'You are a helpful CCP personal tutor. Teach like a human: ask questions, give hints, use short steps, and encourage. Keep answers concise.'},
      ...messages.filter(m => m.role !== 'system')
    ]
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2' // harmless header; some environments require explicit beta flags
    },
    body: JSON.stringify(payload)
  })
  const text = await res.text()
  if(!res.ok){
    throw new Error('OpenAI error: '+ text)
  }
  let json
  try{ json = JSON.parse(text) } catch(e){ throw new Error('Invalid JSON from OpenAI: '+ text) }
  const content = json.output_text || json.choices?.[0]?.message?.content || ''
  return { content }
}