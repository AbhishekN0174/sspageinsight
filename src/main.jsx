import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { reportWebVitals, respectPrefersReducedMotion } from './utils/performance'

// Initialize performance optimizations
respectPrefersReducedMotion()

// Report web vitals in development
if (import.meta.env.DEV) {
  reportWebVitals()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
