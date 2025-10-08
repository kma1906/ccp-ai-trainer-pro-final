import React, { useEffect, useState } from 'react'
import { load } from '../utils/storage'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Dashboard(){
  const [stats, setStats] = useState({ attempts: 0, avgScore: 0, weakAreas: [] })
  useEffect(()=>{
    const attempts = load('exam_attempts', [])
    const avg = attempts.length ? Math.round(attempts.reduce((a,b)=>a+(b.score||0),0)/attempts.length) : 0
    const weak = load('weak_areas', ['Cost Estimating','Contracts','Scheduling'])
    setStats({ attempts: attempts.length, avgScore: avg, weakAreas: weak })
  },[])

  const data = {
    labels: stats.weakAreas,
    datasets: [{ label: 'Weakness Score (higher=worse)', data: stats.weakAreas.map(()=>Math.round(Math.random()*30+50)) }]
  }

  return (
    <div className="row cols-2">
      <div className="card">
        <h2>Overview</h2>
        <p className="muted">Attempts: {stats.attempts} / Avg Score: {stats.avgScore}%</p>
        <div className="pill">Plan: Focus on weak areas below</div>
        <div style={{marginTop:16}}>
          <Bar data={data} />
        </div>
      </div>
      <div className="card">
        <h2>Study Plan (Auto)</h2>
        <ul>
          {stats.weakAreas.map((w,i)=>(<li key={i}>Practice 20 Q from <b>{w}</b> · Watch 1 explainer · Do 1 memo</li>))}
        </ul>
        <p className="small muted">Plan updates after each exam based on your results.</p>
      </div>
    </div>
  )
}