import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import EventsPage from './components/EventsPage'
import EventDetailPage from './components/EventDetailPage'
import ClassesPage from './components/ClassesPage'
import ClassDetailPage from './components/ClassDetailPage'
import BlogPage from './components/BlogPage'
import BlogDetailPage from './components/BlogDetailPage'
import AboutPage from './components/AboutPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsPage from './components/TermsPage'
import WhatsAppFloat from './components/WhatsAppFloat'
import AnalyticsProvider from './components/AnalyticsProvider'
import { AuthProvider } from './context/AuthContext'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  return null
}

function App() {
  return (
    <AnalyticsProvider>
      <AuthProvider>
        <div className="relative overflow-x-hidden min-h-screen bg-white">
          <ScrollToHash />
          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/classes/:sessionId" element={<ClassDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </main>

          <Footer />

          {/* Floating WhatsApp Button */}
          <WhatsAppFloat />
        </div>
      </AuthProvider>
    </AnalyticsProvider>
  )
}

export default App
