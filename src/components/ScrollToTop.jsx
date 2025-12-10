import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 100 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-primary shadow-2xl flex items-center justify-center group overflow-hidden"
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 30px rgba(244, 143, 180, 0.5)'
          }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ y: '100%' }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Arrow Icon */}
          <motion.svg
            className="w-6 h-6 text-gray-800 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </motion.svg>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 border-2 border-petal-400 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
