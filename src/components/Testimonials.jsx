import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-8 border border-primary-500/20 h-full flex flex-col"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            className="w-5 h-5 text-accent-gold"
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </motion.svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-lg text-gray-200 mb-6 flex-1 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-50" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-lg">
            {testimonial.initials}
          </div>
        </div>
        <div>
          <p className="font-heading font-bold">{testimonial.name}</p>
          <p className="text-sm text-gray-400">{testimonial.role}</p>
          {testimonial.emoji && (
            <span className="text-2xl mt-1 inline-block">{testimonial.emoji}</span>
          )}
        </div>
      </div>

      {/* Badge */}
      {testimonial.badge && (
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-primary/20 border border-primary-500/30 text-xs font-semibold w-fit">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          {testimonial.badge}
        </div>
      )}
    </motion.div>
  )
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  })

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      initials: 'SM',
      role: 'Marathon Runner',
      quote: 'SweatSocial transformed my training routine. I found an amazing running group that keeps me motivated every single day. Lost 20 lbs and gained a family!',
      emoji: '🏃‍♀️',
      badge: '100+ Workouts'
    },
    {
      name: 'Mike Thompson',
      initials: 'MT',
      role: 'CrossFit Enthusiast',
      quote: 'The community here is incredible. I went from working out alone to having 50+ training partners. The challenges keep me pushing harder than ever.',
      emoji: '💪',
      badge: 'Top Challenger'
    },
    {
      name: 'Emma Rodriguez',
      initials: 'ER',
      role: 'Yoga Instructor',
      quote: 'As an instructor, I love how easy it is to connect with students and build a real community. The app makes organizing group sessions seamless.',
      emoji: '🧘‍♀️',
      badge: 'Community Leader'
    },
    {
      name: 'Alex Chen',
      initials: 'AC',
      role: 'Fitness Newbie',
      quote: 'I was intimidated to start working out, but SweatSocial made it so welcoming. My group celebrates every small win with me. Best decision ever!',
      emoji: '🎯',
      badge: '30 Day Streak'
    },
    {
      name: 'Jessica Williams',
      initials: 'JW',
      role: 'Gym Owner',
      quote: 'SweatSocial helped me grow my gym community beyond the physical space. Members are more engaged and motivated than ever before.',
      emoji: '🏋️‍♀️',
      badge: 'Verified Trainer'
    },
    {
      name: 'David Park',
      initials: 'DP',
      role: 'Cyclist',
      quote: 'Found my cycling crew through this app. We ride every weekend now and push each other to new distances. The tracking features are amazing!',
      emoji: '🚴‍♂️',
      badge: '500+ Miles'
    }
  ]

  const itemsPerView = 3
  const maxIndex = Math.max(0, testimonials.length - itemsPerView)

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused, maxIndex])

  const goToNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
  }

  const goToPrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1))
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <section id="testimonials" className="relative py-32 bg-gradient-to-b from-gray-900 via-primary-900/20 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent-pink rounded-full filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full glass text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Success Stories
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            Real People, Real <span className="text-gradient">Results</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands who have transformed their fitness journey with SweatSocial
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          ref={ref}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <AnimatePresence mode="wait">
              {visibleTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${currentIndex}-${index}`}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={goToPrev}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Indicators */}
            <div className="flex gap-2">
              {[...Array(maxIndex + 1)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-gradient-primary' : 'w-2 bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={goToNext}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Pause Indicator */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              Paused
            </motion.div>
          )}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 flex flex-wrap justify-center items-center gap-8"
        >
          {[
            { label: '10,000+ Reviews', icon: '⭐' },
            { label: '4.8/5 Rating', icon: '❤️' },
            { label: 'Featured App', icon: '🏆' },
            { label: 'Trusted Platform', icon: '✓' }
          ].map((badge, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 glass rounded-full px-6 py-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-semibold">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
