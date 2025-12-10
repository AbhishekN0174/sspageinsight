import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const PhoneMockup = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="relative"
    >
      {/* Phone Frame */}
      <div className="relative mx-auto w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-10" />

        {/* Screen */}
        <div className="absolute inset-2 bg-gray-950 rounded-[2.5rem] overflow-hidden">
          {children}
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-pink/20 rounded-[3rem] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  )
}

const AppScreen = ({ screen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gradient-to-br from-gray-900 to-primary-900/30 p-6 flex flex-col"
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-6 text-xs text-gray-400">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 border border-white rounded-sm" />
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-hidden">
        <h3 className="text-xl font-heading font-bold mb-4">{screen.title}</h3>

        {screen.type === 'dashboard' && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Today's Activity</span>
                <span className="text-xs text-neon-green">+12%</span>
              </div>
              <div className="flex items-end gap-1 h-20">
                {[40, 60, 45, 80, 70, 55, 90].map((height, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-primary rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-2">Active Streak</p>
              <p className="text-3xl font-bold text-gradient">12 Days</p>
            </div>

            <div className="glass rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-3">Recent Workouts</p>
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green" />
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen.type === 'social' && (
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <motion.div
                key={i}
                className="glass rounded-2xl p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary" />
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded w-24 mb-2" />
                    <div className="h-1.5 bg-gray-800 rounded w-16" />
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-primary-500/20 to-accent-pink/20 rounded-xl mb-2" />
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>❤️ 124</span>
                  <span>💬 12</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {screen.type === 'challenges' && (
          <div className="space-y-4">
            {[
              { color: 'from-yellow-500 to-orange-500', progress: 75 },
              { color: 'from-blue-500 to-cyan-500', progress: 50 },
              { color: 'from-pink-500 to-purple-500', progress: 90 }
            ].map((challenge, i) => (
              <motion.div
                key={i}
                className="glass rounded-2xl p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${challenge.color}`} />
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded w-32 mb-2" />
                    <div className="h-1.5 bg-gray-800 rounded w-20" />
                  </div>
                </div>
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${challenge.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    transition={{ delay: i * 0.15 + 0.3, duration: 1 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{challenge.progress}% Complete</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const AppPreview = () => {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  })

  const screens = [
    { title: 'Dashboard', type: 'dashboard' },
    { title: 'Social Feed', type: 'social' },
    { title: 'Challenges', type: 'challenges' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen(prev => (prev + 1) % screens.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [screens.length])

  return (
    <section className="relative py-32 bg-gray-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-500 to-accent-pink rounded-full filter blur-[150px] opacity-10" />
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
            The App
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            Your Fitness Journey, <span className="text-gradient">In Your Pocket</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the full power of SweatSocial on iOS and Android. Download now and start your transformation.
          </p>
        </motion.div>

        {/* App Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Phone Mockup */}
          <div className="flex justify-center" ref={ref}>
            <PhoneMockup>
              <AnimatePresence mode="wait">
                <AppScreen key={currentScreen} screen={screens[currentScreen]} />
              </AnimatePresence>
            </PhoneMockup>
          </div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {[
              {
                icon: '📱',
                title: 'Cross-Platform',
                description: 'Seamlessly sync your progress across all your devices'
              },
              {
                icon: '🎯',
                title: 'Smart Tracking',
                description: 'Automatically log workouts and track your fitness journey'
              },
              {
                icon: '👥',
                title: 'Social Features',
                description: 'Connect, compete, and celebrate with your fitness community'
              },
              {
                icon: '🏆',
                title: 'Achievements',
                description: 'Unlock badges, earn rewards, and climb the leaderboards'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 glass rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10, borderColor: 'rgba(145, 83, 244, 0.3)' }}
              >
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-heading font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Download Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl mb-8 text-gray-300">Download the app and get started today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="https://apps.apple.com/in/app/sweat-social/id6742068524"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-black rounded-2xl hover:bg-gray-900 transition-all border border-gray-800"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(145, 83, 244, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-400">Download on the</div>
                <div className="text-xl font-semibold">App Store</div>
              </div>
            </motion.a>

            <motion.a
              href="https://play.google.com/store/apps/details?id=com.hustlecreatives.sweatsocial"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-black rounded-2xl hover:bg-gray-900 transition-all border border-gray-800"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(238, 105, 131, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-400">GET IT ON</div>
                <div className="text-xl font-semibold">Google Play</div>
              </div>
            </motion.a>
          </div>

          {/* Screen Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {screens.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentScreen(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentScreen ? 'w-8 bg-gradient-primary' : 'w-2 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AppPreview
