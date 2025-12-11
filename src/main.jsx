import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { reportWebVitals, respectPrefersReducedMotion } from './utils/performance'
import { prefetchChunks, optimizeAnimationsForNetwork } from './utils/prefetch'

// Initialize performance optimizations
respectPrefersReducedMotion()
optimizeAnimationsForNetwork()

// Prefetch route chunks for faster transitions
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', prefetchChunks)
} else {
  prefetchChunks()
}

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
