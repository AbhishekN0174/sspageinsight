import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import WhatsAppFloat from './components/WhatsAppFloat'
import AnalyticsProvider from './components/AnalyticsProvider'
import { AuthProvider } from './context/AuthContext'

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

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-pulse">
      <div className="w-12 h-12 bg-petal-200 rounded-full"></div>
    </div>
  </div>
)

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
            <Suspense fallback={<LoadingFallback />}>
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

          {/* Floating WhatsApp Button */}
          <WhatsAppFloat />
        </div>
      </AuthProvider>
    </AnalyticsProvider>
  )
}

export default App
