import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import AnalyticsProvider from './components/AnalyticsProvider'
import { AuthProvider } from './context/AuthContext'

// Lazy load WhatsApp button to defer non-critical UI
const WhatsAppFloat = lazy(() => import('./components/WhatsAppFloat'))

// Lazy load pages
const EventsPage = lazy(() => import('./components/EventsPage'))
const EventDetailPage = lazy(() => import('./components/EventDetailPage'))
const ClassesPage = lazy(() => import('./components/ClassesPage'))
const ClassDetailPage = lazy(() => import('./components/ClassDetailPage'))
const BlogPage = lazy(() => import('./components/BlogPage'))
const BlogDetailPage = lazy(() => import('./components/BlogDetailPage'))
const AboutPage = lazy(() => import('./components/AboutPage'))
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./components/TermsPage'))

// No loading fallback - render pages instantly without spinner
// This improves perceived performance and prevents jank
const NoLoadingFallback = null

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
            <Suspense fallback={NoLoadingFallback}>
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
            </Suspense>
          </main>

          <Footer />

          {/* Lazy load floating WhatsApp Button */}
          <Suspense fallback={null}>
            <WhatsAppFloat />
          </Suspense>
        </div>
      </AuthProvider>
    </AnalyticsProvider>
  )
}

export default App
