import React, { useState } from 'react'
import { save, load } from '../utils/storage'

function parseCSV(text){
  // CSV columns: id,q,a1,a2,a3,a4,c,cat
  const lines = text.split(/\r?\n/).filter(Boolean)
  const out = []
  for(const line of lines.slice(1)){
    const parts = line.split(',')
    if(parts.length<8) continue
    out.push({
      id: Number(parts[0]),
      q: parts[1],
      a: [parts[2], parts[3], parts[4], parts[5]],
      c: Number(parts[6]),
      cat: parts[7]
    })
  }
  return out
}

export default function Admin(){
  const [csv, setCsv] = useState('')
  const [lang, setLang] = useState('en')

  const onImport = ()=>{
    try{
      const qs = parseCSV(csv)
      const key = lang==='ar' ? 'qs_ar' : 'qs_en'
      save(key, qs)
      alert('Imported '+qs.length+' questions to localStorage ('+key+').')
    }catch(e){
      alert('Import error: '+e.message)
    }
  }

  const example = 'id,q,a1,a2,a3,a4,c,cat\n1,What is EAC?,AC+ETC,AC+BAC,BAC-EV,EV+PV,0,EVM'

  return (
    <div className="card">
      <h2>Questions Manager</h2>
      <div className="row cols-2">
        <div>
          <label>Language</label>
          <select className="input" value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <label style={{marginTop:8}}>Paste CSV</label>
          <textarea className="input" rows="10" value={csv} onChange={e=>setCsv(e.target.value)} placeholder={example} />
          <button className="btn" onClick={onImport}>Import CSV</button>
          <p className="muted small">Format: id,q,a1,a2,a3,a4,c,cat</p>
        </div>
        <div>
          <h3>Notes</h3>
          <ul>
            <li>Imported sets are stored in localStorage and override bundled questions.</li>
            <li>Use <b>Admin</b> to update anytime. No server needed.</li>
            <li>Final Exam targets 119 Q if available.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}