import React from 'react'

const items = [
  { title:'Practice in small sets', desc:'Do 20 Q focused sprints with immediate feedback.'},
  { title:'Memo mastery', desc:'Write a 5-min memo daily; compare with sample rubrics.'},
  { title:'Error log', desc:'Maintain a mistake log by category; review every weekend.'},
  { title:'Teach back', desc:'Explain a topic to a friend or record yourself for 2 mins.'}
]

export default function Tips(){
  return (
    <div className="card">
      <h2>Tips</h2>
      <ul>
        {items.map((t,i)=>(<li key={i}><b>{t.title}</b> — {t.desc}</li>))}
      </ul>
    </div>
  )
}