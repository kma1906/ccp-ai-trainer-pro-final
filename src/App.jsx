import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function App(){
  return (
    <div>
      <nav>
        <div className="wrap">
          <div className="brand">CCP AI Trainer PRO</div>
          <div className="spacer" />
          <NavLink to="/dashboard" className={({isActive})=>isActive?'active':''}>Dashboard</NavLink>
          <NavLink to="/tutor" className={({isActive})=>isActive?'active':''}>Personal Tutor</NavLink>
          <NavLink to="/mock-exam" className={({isActive})=>isActive?'active':''}>Mock Exam</NavLink>
          <NavLink to="/final-exam" className={({isActive})=>isActive?'active':''}>Final Exam</NavLink>
          <NavLink to="/tips" className={({isActive})=>isActive?'active':''}>Tips</NavLink>
          <NavLink to="/admin" className={({isActive})=>isActive?'active':''}>Questions</NavLink>
          <NavLink to="/settings" className={({isActive})=>isActive?'active':''}>Settings</NavLink>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}