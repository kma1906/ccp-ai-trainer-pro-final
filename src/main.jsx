import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import Tutor from './pages/Tutor'
import MockExam from './pages/MockExam'
import FinalExam from './pages/FinalExam'
import Tips from './pages/Tips'
import Admin from './pages/Admin'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'tutor', element: <Tutor /> },
      { path: 'mock-exam', element: <MockExam /> },
      { path: 'final-exam', element: <FinalExam /> },
      { path: 'tips', element: <Tips /> },
      { path: 'admin', element: <Admin /> },
      { path: 'settings', element: <Settings /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)