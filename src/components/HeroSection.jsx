import { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

const HeroSection = ({ analytics }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const videoRef = useRef(null)
  const mouseTimerRef = useRef(null)

  // Only load video when hero is in view to improve LCP
  const { ref: inViewRef, inView } = useInView({ threshold: 0.25, triggerOnce: true })
  const [loadVideo, setLoadVideo] = useState(false)

  useEffect(() => {
    if (inView) setLoadVideo(true)
  }, [inView])

  // Debounced mouse move handler - updates only every 30ms
  const handleMouseMove = useCallback((e) => {
    if (mouseTimerRef.current) return
    
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    })
    
    mouseTimerRef.current = setTimeout(() => {
      mouseTimerRef.current = null
    }, 30)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current)
    }
  }, [handleMouseMove])

  // Ensure video is muted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
    }
  }, [])

  // Pause video on mobile, play on desktop
  useEffect(() => {
    const handleVideoByScreen = () => {
      if (!videoRef.current) return

      const isMobile = window.innerWidth < 768

      if (isMobile) {
        videoRef.current.pause()
        videoRef.current.style.display = 'none'
      } else {
        videoRef.current.style.display = 'block'
        videoRef.current.play?.().catch(() => {})
      }
    }

    handleVideoByScreen()
    window.addEventListener('resize', handleVideoByScreen, { passive: true })

    return () => window.removeEventListener('resize', handleVideoByScreen)
  }, [])


  const scrollToSignup = () => {
    document.getElementById('final-cta').scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToHow = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSignupClick = () => {
    analytics?.trackClick('Hero CTA', {
      action: 'Join the Movement',
    })
    scrollToSignup()
  }

  const handleHowItWorksClick = (origin = 'button') => {
    analytics?.trackClick('Hero CTA', {
      action: 'Watch How It Works',
      origin,
    })
    scrollToHow()
  }

  return (
    <section ref={inViewRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ opacity: 0.5 }}
        preload="none"
      >
        {loadVideo && (
          <>
            <source src="/background_video.mp4" type="video/mp4" />
            <source src="/background_video.MOV" type="video/quicktime" />
          </>
        )}
        Your browser does not support the video tag.
      </video>
      {/* Light Gradient Overlay for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 via-petal-50/60 to-primary-50/40" />
      {/* Animated Background - reduced opacity */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 via-petal-50/15 to-primary-50/20">
        {/* Gradient Overlay - reduced opacity */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-petal-50/20 via-primary-50/15 to-accent-peach-50/20"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />

        {/* Animated Orbs - reduced size and animation complexity */}
        <motion.div
          className="absolute top-20 left-20 w-[400px] h-[400px] bg-petal-200/40 rounded-full mix-blend-multiply filter blur-[100px]"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-primary-200/35 rounded-full mix-blend-multiply filter blur-[100px]"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-accent-peach-200/25 rounded-full mix-blend-multiply filter blur-[100px]"
          animate={{
            x: [0, 40, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(244, 143, 180, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Badge */}
          {/* <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-petal-500"></span>
            </span>
            <span className="text-sm font-semibold text-petal-700">5,000+ Active Members</span>
          </motion.div> */}

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-4 md:mb-6 leading-tight text-shadow px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block">Endless ways to</span>
            <span className="text-gradient inline-block">sweat.</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline">One place to </span>
            <span className="text-gradient-peach inline-block">find it.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-base sm:text-xl md:text-2xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto font-body px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            From aerial yoga to bungee fitness, discover exciting classes tailored to your fitness goals.
            <br className="hidden sm:block" />
            <span className="text-petal-600 font-semibold">Move Together, Grow Together.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={handleSignupClick}
              className="group relative px-8 py-4 bg-gradient-primary rounded-full font-semibold text-lg overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Join the Movement
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            <motion.button
              onClick={() => handleHowItWorksClick('button')}
              className="group px-8 py-4 glass-strong rounded-full font-semibold text-lg hover:bg-white/15 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                Watch How It Works
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-6 md:mt-12 mb-8 md:mb-0 relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="inline-flex flex-col items-center gap-2 text-gray-500 cursor-pointer"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => handleHowItWorksClick('scroll-indicator')}
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

export default HeroSection
