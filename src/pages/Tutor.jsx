import React, { useEffect, useRef, useState } from 'react'
import { chatLLM } from '../lib/openai'
import { load } from '../utils/storage'

const getRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return null
  const rec = new SpeechRecognition()
  rec.lang = (load('settings', {lang:'en'}).lang || 'en') === 'ar' ? 'ar-AE' : 'en-US'
  rec.interimResults = false
  rec.continuous = false
  return rec
}

function speak(text, gender='male', specificVoiceName=null){
  const utter = new SpeechSynthesisUtterance(text)
  const voices = speechSynthesis.getVoices()

  const femaleNames = /(sonia|libby|maisie|abbi|bella|eloise|aria|jenny|zira|sara|salma|noura|zara|laila|olivia|emma|natasha|danna|hoda)/i
  const maleNames   = /(guy|adam|maged|hassan|omar|ahmed|mohammed|daniel|mark|brian|steffan|rashid)/i

  if (specificVoiceName){
    const v = voices.find(v => v.name === specificVoiceName)
    if (v) utter.voice = v
  } else {
    const prefer = gender==='female' ? femaleNames : maleNames
    const fallback = gender==='female' ? maleNames : femaleNames
    utter.voice = voices.find(v => prefer.test(v.name)) || voices.find(v => fallback.test(v.name)) || voices[0]
  }

  utter.rate = 1.0
  utter.pitch = gender==='female' ? 1.05 : 0.98
  speechSynthesis.speak(utter)
}

export default function Tutor(){
  const [chat, setChat] = useState([
    { role:'system', content:'You are a helpful CCP personal tutor. Teach like a human: ask questions, give hints, use short steps, and encourage. Keep answers concise.'},
    { role:'assistant', content:'Hey! I\'m Dr Khaled 👨‍🏫. What CCP topic do you want to practice today?'}
  ])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [voice, setVoice] = useState('male')
  const recRef = useRef(null)
  const chatRef = useRef(null)

  useEffect(()=>{
    recRef.current = getRecognition()
    const onVoices = ()=>{}; // trigger voices load
    speechSynthesis.onvoiceschanged = onVoices
  },[])

  useEffect(()=>{
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat])

  const send = async (text) => {
    const lang = load('settings', {lang:'en'}).lang || 'en'
    const newChat = [...chat, { role:'user', content: text }]
    setChat(newChat)
    const res = await chatLLM(newChat, lang)
    const reply = res.content || '...'
    setChat(c => [...c, { role:'assistant', content: reply }])
    speak(reply, voice==='female' ? 'female' : 'male')
  }

  const onMic = () => {
    if(!recRef.current){ alert('SpeechRecognition not supported in this browser. Use Microsoft Edge.'); return }
    if(listening){ recRef.current.stop(); setListening(false); return }
    setListening(true)
    recRef.current.onresult = (e)=>{
      const text = Array.from(e.results).map(r=>r[0].transcript).join(' ')
      setListening(false)
      send(text)
    }
    recRef.current.onerror = ()=> setListening(false)
    recRef.current.onend = ()=> setListening(false)
    recRef.current.start()
  }

  return (
    <div className="card">
      <h2>Personal Tutor <span className="pill">Voice: {voice==='male'?'Dr Khaled':'Dr Noof'}</span></h2>
      <div className="flex" style={{marginBottom:12}}>
        <select value={voice} onChange={e=>setVoice(e.target.value)} className="input" style={{maxWidth:220}}>
          <option value="male">Dr Khaled (Male)</option>
          <option value="female">Dr Noof (Female)</option>
        </select>
        <button className="btn" onClick={onMic}>{listening?'Stop 🎙️':'Speak 🎙️'}</button>
      </div>
      <div className="chat" ref={chatRef}>
        {chat.filter(m=>m.role!=='system').map((m,i)=>(
          <div key={i} className={'bubble '+(m.role==='user'?'you':'ai')}>{m.content}</div>
        ))}
      </div>
      <div className="flex" style={{marginTop:12}}>
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about cost control, contracts, scheduling..."/>
        <button className="btn" onClick={()=>{ if(input.trim()){ send(input.trim()); setInput('') }}}>Send</button>
      </div>
      <p className="muted small" style={{marginTop:8}}>Works offline with Web Speech API (Edge). Add your OpenAI key in Settings for smarter answers.</p>
    </div>
  )
}