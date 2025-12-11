import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE_URL } from '../apiConfig'

const JoinStudioDialog = ({ isOpen, onClose }) => {
  // Lock body scroll when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      // Get scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      // Lock body scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      // Prevent layout shift from scrollbar
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
      
      return () => {
        // Restore scroll position when dialog closes
        const savedScrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
        
        // Restore scroll position smoothly
        if (savedScrollY) {
          const scrollPosition = parseInt(savedScrollY || '0', 10) * -1
          // Use requestAnimationFrame to ensure smooth restoration
          requestAnimationFrame(() => {
            window.scrollTo({
              top: scrollPosition,
              behavior: 'auto' // Use 'auto' instead of 'smooth' to prevent unwanted scrolling
            })
          })
        }
      }
    }
  }, [isOpen])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' or 'error'

  // Detect platform
  const detectPlatform = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/android/i.test(userAgent)) {
      return 'android'
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios'
    }
    return 'web' // Default to web
  }

  const platform = detectPlatform()

  // App store links
  const appLinks = {
    ios: 'https://apps.apple.com/in/app/sweat-social/id6742068524',
    android: 'https://play.google.com/store/apps/details?id=com.hustlecreatives.sweatsocial&hl=en_IN',
    web: 'https://play.google.com/store/apps/details?id=com.hustlecreatives.sweatsocial&hl=en_IN' // Default to Android
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/common/website/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          location: formData.location || undefined,
          source: 'join_studio_dialog'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit inquiry')
      }

      // Update anonymous user with email in analytics (deferred)
      if (formData.email) {
        import('../utils/analytics')
          .then(mod => {
            if (mod.identifyUserWithEmail) {
              mod.identifyUserWithEmail(formData.email, {
                name: formData.fullName,
                phone_number: formData.phoneNumber,
                location: formData.location,
                source: 'join_studio_dialog',
                form_type: 'studio_inquiry',
              })
            }
          })
          .catch(() => {})
      }

      setSubmitStatus('success')
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ fullName: '', email: '', phoneNumber: '', location: '' })
        setSubmitStatus(null)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Use portal to render dialog outside of any parent stacking context
  if (!isOpen) return null

  return createPortal(
    <AnimatePresence mode="wait">
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ 
          zIndex: 9999,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          style={{ 
            position: 'fixed',
            zIndex: 9998
          }}
        />

        {/* Dialog Container - ensures proper centering */}
        <div 
          className="relative w-full flex items-center justify-center min-h-full py-4"
          style={{ zIndex: 9999 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
              Join Our Club
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Get started with SweatSocial and discover amazing fitness experiences
            </p>
          </div>

          {/* Form */}
          {submitStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">We'll get back to you soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-petal-500 focus:ring-2 focus:ring-petal-200 outline-none transition-all"
                  placeholder="Sweat Social"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-petal-500 focus:ring-2 focus:ring-petal-200 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-petal-500 focus:ring-2 focus:ring-petal-200 outline-none transition-all"
                  placeholder="+91 1234567890"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-petal-500 focus:ring-2 focus:ring-petal-200 outline-none transition-all"
                  placeholder="e.g., Indiranagar, Bangalore"
                />
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  Failed to submit. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </motion.button>
            </form>
          )}

{/* App Download Links */}
{submitStatus !== 'success' && (
  <div className="mt-6 pt-6 border-t border-gray-200">
    <p className="text-sm text-gray-600 text-center mb-3">
      Or download our mobile app
    </p>

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {/* App Store button */}
      <motion.a
        href={appLinks.ios}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full sm:w-auto py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        <div className="text-left">
          <div className="text-xs text-gray-500">Download on the</div>
          <div className="text-sm font-semibold">App Store</div>
        </div>
      </motion.a>

      {/* Google Play button */}
      <motion.a
        href={appLinks.android}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full sm:w-auto py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
        </svg>
        <div className="text-left">
          <div className="text-xs text-gray-500">GET IT ON</div>
          <div className="text-sm font-semibold">Google Play</div>
        </div>
      </motion.a>
    </div>
  </div>
)}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

export default JoinStudioDialog

