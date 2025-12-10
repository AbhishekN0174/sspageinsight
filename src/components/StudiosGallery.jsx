import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Studio images are now in public folder

const StudiosGallery = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const studios = [
    {
      id: 1,
      image: '/studio1.jpg',
      title: 'The Studio',
      location: 'Indiranagar',
    },
    {
      id: 2,
      image: '/studio2.jpg',
      title: 'Stretch Pilates',
      location: 'Benson Town',
    },
    {
      id: 3,
      image: '/studio3.jpg',
      title: 'Purple Pilates',
      location: 'HSR Layout',
    },
    {
      id: 4,
      image: '/display2.jpg',
      title: 'Pilates Labs',
      location: 'Sahakar Nagar',
    },
    {
      id: 5,
      image: '/display4.jpg',
      title: 'DizzyDuck Yoga Studio',
      location: 'Koramangala',
    },
  ]

  // Tilt pattern: right, left, right, left, right
  const getTilt = (index) => {
    return index % 2 === 0 ? 8 : -8 // Even = right tilt, Odd = left tilt
  }

  // Vertical offset for cascading effect
  const getVerticalOffset = (index) => {
    // Create a wave pattern: up, down, up, down, up
    return index % 2 === 0 ? -20 : 20
  }

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-white via-petal-50/30 to-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-petal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs md:text-sm font-semibold mb-4 text-petal-700"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petal-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-petal-500" />
            </span>
            Partner Studios
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 md:mb-6">
            Explore Our <span className="text-gradient">Partner Studios</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Premium fitness studios across Bangalore. Each space is thoughtfully
            designed to inspire your fitness journey.
          </p>
        </motion.div>

        {/* Image Gallery - Tilted Cascade (Desktop Only) */}
        <div className="relative">
          {/* Desktop: 5 images in a row with tilts */}
          <div className="hidden lg:flex items-center justify-center gap-4 lg:gap-6 xl:gap-8 px-4">
            {studios.map((studio, index) => {
              const tilt = getTilt(index)
              const verticalOffset = getVerticalOffset(index)
              const scale = 1 - Math.abs(index - 2) * 0.05 // Center images slightly larger

              return (
                <motion.div
                  key={studio.id}
                  initial={{ opacity: 0, y: 50, rotate: tilt * 2 }}
                  animate={
                    inView
                      ? {
                          opacity: 1,
                          y: verticalOffset,
                          rotate: tilt,
                          scale,
                        }
                      : { opacity: 0, y: 50, rotate: tilt * 2 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: scale * 1.1,
                    rotate: tilt * 1.2,
                    y: verticalOffset - 10,
                    zIndex: 20,
                  }}
                  className="relative flex-shrink-0"
                  style={{
                    width: 'clamp(180px, 18vw, 240px)',
                    maxWidth: '240px',
                  }}
                >
                  <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src={studio.image}
                      alt={studio.title}
                      className="w-full h-[200px] lg:h-[240px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-heading font-bold text-white mb-1">
                        {studio.title}
                      </h3>
                      <p className="text-sm lg:text-base text-petal-100 flex items-center gap-1">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {studio.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Mobile & Tablet: Tilted cards (no carousel) */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4">
            {studios.map((studio, index) => {
              const tilt = getTilt(index) * 0.5 // Reduced tilt for mobile
              const verticalOffset = getVerticalOffset(index) * 0.3 // Reduced offset for mobile

              return (
                <motion.div
                  key={studio.id}
                  initial={{ opacity: 0, y: 30, rotate: tilt * 2 }}
                  animate={inView ? { opacity: 1, y: verticalOffset, rotate: tilt } : { opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{ scale: 1.02, rotate: tilt * 1.2 }}
                  className="relative"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                    <img
                      src={studio.image}
                      alt={studio.title}
                      className="w-full h-[200px] sm:h-[220px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-1">
                        {studio.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-petal-100 flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {studio.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12"
        >
          {[
            { number: '20+', label: 'Studio Locations' },
            { number: '50+', label: 'Fitness Classes' },
            { number: '1000+', label: 'Active Members' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-petal-100 shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gradient mb-2">
                {stat.number}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default StudiosGallery

