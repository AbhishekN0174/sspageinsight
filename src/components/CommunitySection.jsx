import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Community images are now in public folder

const CommunitySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const interactionTimeoutRef = useRef(null)
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  })

  // Community images using actual provided images
  const communityImages = [
    {
      url: '/display2.jpg',
      title: 'Group Yoga Sessions',
      description: 'Join thousands in mindful group fitness sessions',
    },
    {
      url: '/display3.jpg',
      title: 'Pilates Classes',
      description: 'Experience professional Pilates training',
    },
    {
      url: '/display4.jpg',
      title: 'Studio Events',
      description: 'Exclusive launch events and experiences',
    },
    {
      url: '/display5.jpg',
      title: 'Community Challenges',
      description: 'Compete and grow together',
    },
    {
      url: '/display6.jpg',
      title: 'Wellness Retreats',
      description: 'Connect at curated wellness experiences',
    },
    {
      url: '/display7.jpg',
      title: 'Reformer Pilates',
      description: 'Advanced Pilates on professional equipment',
    },
    {
      url: '/display8.jpg',
      title: 'Group Training',
      description: 'Train together, achieve more',
    },
    {
      url: '/studio1.jpg',
      title: 'Modern Studios',
      description: 'State-of-the-art fitness facilities',
    },
    {
      url: '/studio2.jpg',
      title: 'Expert Instructors',
      description: 'Learn from certified professionals',
    },
    {
      url: '/studio3.jpg',
      title: 'Inspiring Spaces',
      description: 'Beautiful studios designed for your success',
    },
  ]

  // Auto-rotate images (only when user is stable/not interacting)
  useEffect(() => {
    if (!inView || isDragging || isUserInteracting) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % communityImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [inView, isDragging, isUserInteracting, communityImages.length])

  // Reset interaction timeout
  const handleUserInteraction = () => {
    setIsUserInteracting(true)
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    // Resume auto-rotation after 5 seconds of inactivity
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false)
    }, 5000)
  }

  const nextImage = () => {
    handleUserInteraction()
    setCurrentIndex((prev) => (prev + 1) % communityImages.length)
  }

  const prevImage = () => {
    handleUserInteraction()
    setCurrentIndex((prev) => (prev - 1 + communityImages.length) % communityImages.length)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }
  }, [])

  // Get visible cards (previous 2 + current + next 2 = 5 cards total)
  const getVisibleCards = () => {
    const cards = []
    // Show 2 previous cards, current, and 2 next cards
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + communityImages.length) % communityImages.length
      cards.push({ 
        ...communityImages[index], 
        position: i, 
        originalIndex: index 
      })
    }
    return cards
  }

  return (
    <section id="community" className="relative py-20 md:py-32 bg-gradient-to-b from-white via-petal-50/40 to-white overflow-x-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-petal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div ref={ref}>
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs md:text-sm font-semibold mb-4 text-petal-700"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petal-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-petal-500" />
            </span>
              Active Community
            </motion.span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Join a Thriving{' '}
              <span className="text-gradient">Fitness Community</span>
          </h2>

            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect with thousands of fitness enthusiasts who are transforming
              their lives together. Be part of something bigger than yourself.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
        </div>
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2">
                    Connect & Grow Together
            </h3>
                  <p className="text-gray-600">
                    Join group workouts, challenges, and events with like-minded
                    fitness enthusiasts in your city.
                  </p>
          </div>
          </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
              </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2">
                    Exclusive Studio Events
                  </h3>
                  <p className="text-gray-600">
                    Get access to launch events, special workshops, and curated
                    experiences at partner studios across the city.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-600">
                    Monitor your fitness journey, celebrate milestones, and stay
                    motivated with the community cheering you on.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // Dispatch custom event to open join studio dialog
                window.dispatchEvent(new CustomEvent('openJoinStudioDialog'))
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary font-semibold shadow-lg hover:shadow-2xl transition-all"
            >
              Join Our Club
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          {/* Right Images - Card Carousel */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full max-w-md mx-auto overflow-visible">
              {getVisibleCards().map((card, idx) => {
                const position = card.position
                const absPosition = Math.abs(position)
                // Scale: active card = 1.0, cards behind scale down more gradually
                const scale = position === 0 ? 1 : 1 - absPosition * 0.08
                // Y offset: cards behind are slightly offset
                const yOffset = position === 0 ? 0 : position * 15
                // X offset: cards behind are slightly offset horizontally (reduced for mobile)
                const xOffset = position === 0 ? 0 : position * 4
                // Opacity: more visible back cards
                const opacity = position === 0 ? 1 : position === 1 || position === -1 ? 0.7 : position === 2 || position === -2 ? 0.4 : 0.2
                // Z-index: higher for cards closer to front
                const zIndex = 10 - absPosition

                return (
                  <Card
                    key={`${card.originalIndex}-${currentIndex}-${position}`}
                    card={card}
                    position={position}
                    scale={scale}
                    yOffset={yOffset}
                    xOffset={xOffset}
                    opacity={opacity}
                    zIndex={zIndex}
                    isActive={position === 0}
                    onSwipeLeft={nextImage}
                    onSwipeRight={prevImage}
                    onDragStart={() => {
                      setIsDragging(true)
                      handleUserInteraction()
                    }}
                    onDragEnd={() => setIsDragging(false)}
                  />
                )
              })}
              </div>

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
              {communityImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleUserInteraction()
                    setCurrentIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-petal-500 w-8'
                      : 'bg-white/40 hover:bg-white/60 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all group"
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-petal-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all group"
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-petal-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Individual Card Component
const Card = ({
  card,
  position,
  scale,
  yOffset,
  xOffset,
  opacity,
  zIndex,
  isActive,
  onSwipeLeft,
  onSwipeRight,
  onDragStart,
  onDragEnd,
}) => {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const cardX = useTransform(x, (latest) => {
    if (position !== 0) return xOffset
    return latest + xOffset
  })

  const handleDragEnd = (event, info) => {
    if (position !== 0) return

    const threshold = 100
    if (info.offset.x > threshold) {
      onSwipeRight()
    } else if (info.offset.x < -threshold) {
      onSwipeLeft()
    }
    x.set(0)
    onDragEnd()
  }

  return (
    <motion.div
      style={{
        x: cardX,
        rotate,
        scale,
        y: yOffset,
        opacity,
        zIndex,
      }}
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{
        scale,
        y: yOffset,
        x: xOffset,
        opacity,
        rotate: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={`absolute inset-0 rounded-3xl overflow-hidden ${
        isActive 
          ? 'cursor-grab active:cursor-grabbing shadow-2xl' 
          : 'pointer-events-none shadow-xl'
      }`}
    >
      <div className="relative w-full h-full">
        <img
          src={card.url}
          alt={card.title}
          width={800}
          height={600}
          className="w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
            {card.title}
          </h3>
          <p className="text-petal-100 text-sm md:text-base">
            {card.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default CommunitySection
