import React, { useState, useEffect } from 'react'
import { load, save } from '../utils/storage'
import { validateApiKey } from '../lib/openai'

export default function Settings(){
  const [apiKey, setApiKey] = useState('')
  const [lang, setLang] = useState('en')

  useEffect(()=>{
    const s = load('settings', { apiKey:'', lang:'en' })
    setApiKey(s.apiKey || '')
    setLang(s.lang || 'en')
  },[])

const [testMsg, setTestMsg] = useState('')

const onSave = ()=>{
    save('settings', { apiKey, lang })
    alert('Saved!')
  }

  return (
    <div className="card">
      <h2>Settings</h2>
      <div className="row">
        <label>OpenAI API Key (optional for smarter tutor)</label>
        <input className="input" type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-..." />
        <label>Default Language</label>
        <select className="input" value={lang} onChange={e=>setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
        <div className="flex">
  <div className="flex">
  <button className="btn" onClick={onSave}>Save</button>
  <button className="btn" onClick={async()=>{
    setTestMsg('Testing...')
    const key = apiKey.trim()
    if(!key){ setTestMsg('No key provided'); return }
    const res = await validateApiKey(key)
    setTestMsg(res.ok ? '✅ Key works!' : ('❌ ' + (res.error || 'Key failed')))
  }}>Test Key</button>
</div>
{testMsg && <p className="muted">{testMsg}</p>}
<p className="muted small">You can also place a local <b>.env</b> file with <code>VITE_OPENAI_API_KEY=sk-....</code> and rebuild.</p>
  <button className="btn" onClick={async()=>{
    try{
      const settings = { apiKey, lang }
      if(!apiKey){ alert('No API key entered'); return }
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      })
      const ok = res.ok
      const body = await res.text()
      if(ok){
        alert('API Key looks valid. Models fetched successfully.')
      } else {
        alert('Key test failed: '+ body)
      }
    }catch(e){ alert('Network error: '+ e.message) }
  }}>Test Key</button>
</div>
        <p className="muted">Data is stored locally in your browser (localStorage).</p>
      </div>
    </div>
  )
}