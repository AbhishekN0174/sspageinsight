import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import WhatsAppFloat from './components/WhatsAppFloat'
import AnalyticsProvider from './components/AnalyticsProvider'
import { AuthProvider } from './context/AuthContext'

// Lazy load pages for better code splitting
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
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petal-500"></div>
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
            <Suspense fallback={<PageLoader />}>
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
