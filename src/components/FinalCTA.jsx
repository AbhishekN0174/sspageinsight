import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { API_BASE_URL } from '../apiConfig'
import { identifyUserWithEmail } from '../utils/analytics'

const FinalCTA = ({ analytics }) => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/common/website/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit email')
      }

      // Update anonymous user with email in analytics
      identifyUserWithEmail(email, {
        source: 'newsletter_signup',
        form_location: 'final_cta',
      })

      const emailDomain = email.split('@')[1]?.toLowerCase() || 'unknown'
      analytics?.track?.('Final CTA Submitted', {
        email_domain: emailDomain,
        form_location: 'final_cta',
      })

      setIsSubmitted(true)
      setEmail('')
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (err) {
      console.error('Error submitting email:', err)
      setError('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStoreClick = (store, url) => {
    analytics?.trackLink?.('App Download Click', url, {
      store,
      location: 'final_cta',
    })
  }

  return (
    <section id="final-cta" className="relative py-16 md:py-32 overflow-hidden bg-gradient-to-b from-white via-petal-50 to-white" data-section="contact">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(/display1.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(244, 143, 180, 0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-petal-200/40 rounded-full filter blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-petal-300/30 rounded-full filter blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass mb-6 md:mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-petal-500"></span>
            </span>
            <span className="text-xs md:text-sm font-semibold text-petal-700">Join 1,000+ Active Members</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold mb-4 md:mb-6 leading-tight text-gray-900 px-4"
          >
            Your Next Workout Buddy
            <br />
            <span className="text-gradient">Is Waiting</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-4"
          >
            Start your fitness journey today. Connect with thousands of motivated individuals ready to help you achieve your goals.
          </motion.p>

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8 md:mb-12"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto px-4">
                <div className="flex-1">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(null)
                    }}
                    placeholder="Enter your email address"
                    required
                    className={`w-full px-4 md:px-6 py-3 md:py-4 rounded-full bg-white border-2 ${
                      error ? 'border-red-300' : 'border-petal-200'
                    } text-gray-900 placeholder-gray-400 focus:outline-none focus:border-petal-400 transition-all shadow-sm`}
                    whileFocus={{ scale: 1.02 }}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-2 ml-4">{error}</p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gradient-primary rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {isSubmitting ? 'Sending...' : 'Get Started'}
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 glass rounded-full px-6 md:px-8 py-3 md:py-4 max-w-md mx-auto"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-petal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold text-gray-900 text-sm md:text-base">Thanks! Check your inbox</span>
              </motion.div>
            )}

            <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 px-4">
              No credit card required • Free forever • Join in 30 seconds
            </p>
          </motion.div>

          {/* App Download Alternative */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base px-4">Or download the app</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <motion.a
                href="https://apps.apple.com/in/app/sweat-social/id6742068524"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  handleStoreClick(
                    'app_store',
                    'https://apps.apple.com/in/app/sweat-social/id6742068524',
                  )
                }
                className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-white rounded-2xl border-2 border-gray-200 hover:border-petal-400 transition-all shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] md:text-xs text-gray-500">Download on the</div>
                  <div className="text-sm md:text-base font-semibold text-gray-900">App Store</div>
                </div>
              </motion.a>

              <motion.a
                href="https://play.google.com/store/apps/details?id=com.hustlecreatives.sweatsocial"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  handleStoreClick(
                    'play_store',
                    'https://play.google.com/store/apps/details?id=com.hustlecreatives.sweatsocial',
                  )
                }
                className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-white rounded-2xl border-2 border-gray-200 hover:border-petal-400 transition-all shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] md:text-xs text-gray-500">GET IT ON</div>
                  <div className="text-sm md:text-base font-semibold text-gray-900">Google Play</div>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 md:mt-16 flex flex-wrap justify-center items-center gap-4 md:gap-8 px-4"
          >
            {[
              { icon: '✓', text: 'No commitment' },
              { icon: '✓', text: 'Cancel anytime' },
              { icon: '✓', text: 'Join 5K+ members' },
              { icon: '✓', text: '100% free to start' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-black"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs md:text-sm">
                  {item.icon}
                </div>
                <span className="font-medium text-xs md:text-base">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTA
