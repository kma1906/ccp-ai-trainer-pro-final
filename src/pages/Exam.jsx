import React, { useEffect, useMemo, useState } from 'react'
import { load, save, pushArray } from '../utils/storage'
import enQ from '../data/questions_en.json'
import arQ from '../data/questions_ar.json'

function useLang(){
  return (load('settings', {lang:'en'}).lang || 'en')
}

function pick(arr, n){
  const clone = [...arr]
  const out = []
  while(out.length<n && clone.length){
    const i = Math.floor(Math.random()*clone.length)
    out.push(clone.splice(i,1)[0])
  }
  return out
}

export default function Exam({mode='mock'}){
  const lang = useLang()
  const override = lang==='ar' ? load('qs_ar', null) : load('qs_en', null);
    const base = override || (lang==='ar' ? arQ : enQ)
  const targetCount = mode==='final' ? 119 : Math.min(50, base.length)
  const [qs, setQs] = useState([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const [memo, setMemo] = useState('')

  useEffect(()=>{
    const set = base.length >= targetCount ? pick(base, targetCount) : base
    setQs(set)
  },[lang])

  const current = qs[idx] || {}
  const onSelect = (i)=>{
    setAnswers({...answers, [current.id]: i})
  }

  const next = ()=> setIdx(i=> Math.min(i+1, qs.length-1))
  const prev = ()=> setIdx(i=> Math.max(i-1, 0))

  const score = useMemo(()=>{
    let s = 0
    for(const q of qs){
      if(answers[q.id]===q.c) s++
    }
    return Math.round( (s / (qs.length||1)) * 100 )
  },[answers, qs])

  const finish = ()=>{
    setDone(true)
    const attempt = { ts: Date.now(), mode, score, memo, lang, answered: Object.keys(answers).length }
    pushArray('exam_attempts', attempt)
    // simple weak-areas update
    const wrongCats = []
    for(const q of qs){
      if(answers[q.id]!==q.c) wrongCats.push(q.cat)
    }
    const freq = wrongCats.reduce((m,c)=> (m[c]=(m[c]||0)+1, m), {})
    const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]).map(([k])=>k).slice(0,5)
    save('weak_areas', sorted)
  }

  return (
    <div className="card">
      <h2>{mode==='final'?'Final Exam':'Mock Exam'} <span className="pill">{lang==='ar'?'ثنائي اللغة':'Bilingual'}</span></h2>
      {!done ? (
        <>
          <p className="muted small">Question {idx+1} / {qs.length||0}</p>
          <h3 style={{marginTop:0}}>{current.q}</h3>
          <div className="row">
            {(current.a||[]).map((opt,i)=>(
              <label key={i} style={{display:'block',margin:'8px 0'}}>
                <input type="radio" name={"q"+current.id} checked={answers[current.id]===i} onChange={()=>onSelect(i)} />
                &nbsp; {opt}
              </label>
            ))}
          </div>
          <div className="flex" style={{marginTop:12}}>
            <button className="btn" onClick={prev}>Prev</button>
            <button className="btn" onClick={next}>Next</button>
            <button className="btn" onClick={finish}>Finish</button>
          </div>
          {mode==='final' && (
            <div style={{marginTop:16}}>
              <label>Memo Question</label>
              <textarea className="input" rows="4" placeholder={lang==='ar'?'اكتب ملخصك هنا...':'Write your memo answer here...'} value={memo} onChange={e=>setMemo(e.target.value)} />
            </div>
          )}
        </>
      ):(
        <>
          <h3>Score: {score}%</h3>
          <p className="muted">Attempts saved to Dashboard. Your plan will update based on weak areas.</p>
        </>
      )}
    </div>
  )
}