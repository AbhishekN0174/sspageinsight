import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const StoryCard = ({ title, description, icon, index, delay }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  const icons = {
    start: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    tribe: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    grow: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, delay }}
      className="relative"
    >
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        {/* Icon Container */}
        <motion.div
          className="relative mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-50" />
          <div className="relative w-32 h-32 rounded-full glass flex items-center justify-center border-2 border-primary-500/30">
            <div className="text-accent-pink">
              {icons[icon]}
            </div>
          </div>
          {/* Number Badge */}
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-xl shadow-lg">
            {index}
          </div>
        </motion.div>

        {/* Content */}
        <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gradient">
          {title}
        </h3>
        <p className="text-lg text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Connecting Line (not on last item) */}
        {index < 3 && (
          <motion.div
            className="hidden md:block absolute top-32 left-1/2 w-1 h-64 bg-gradient-to-b from-primary-500 to-transparent"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1, delay: delay + 0.5 }}
            style={{ transformOrigin: 'top' }}
          />
        )}
      </div>
    </motion.div>
  )
}

const StoryScroll = () => {
  const stories = [
    {
      icon: 'start',
      title: 'Start Alone',
      description: 'Everyone begins somewhere. Your fitness journey starts with a single step, and we\'re here to guide you from day one.'
    },
    {
      icon: 'tribe',
      title: 'Find Your Tribe',
      description: 'Connect with like-minded fitness enthusiasts. Join groups, participate in challenges, and discover your workout community.'
    },
    {
      icon: 'grow',
      title: 'Grow Together',
      description: 'Push each other to new heights. Celebrate wins, overcome obstacles, and achieve goals you never thought possible.'
    }
  ]

  return (
    <section id="story-scroll" className="relative py-32 bg-gradient-to-b from-gray-900 via-primary-900/20 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-pink rounded-full filter blur-[100px]" />
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
            Your Journey
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            From Solo to <span className="text-gradient">Squad</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your workout routine into a social experience that keeps you motivated and accountable.
          </p>
        </motion.div>

        {/* Story Cards */}
        <div className="space-y-48 md:space-y-64">
          {stories.map((story, index) => (
            <StoryCard
              key={index}
              {...story}
              index={index + 1}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="inline-flex items-center gap-4 glass rounded-full px-6 py-3">
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {[1, 2, 3].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-primary"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                />
              ))}
            </motion.div>
            <span className="text-sm font-medium text-gray-300">Your journey awaits</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StoryScroll
