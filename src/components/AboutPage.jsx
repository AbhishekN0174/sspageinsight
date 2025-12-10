import { motion } from 'framer-motion'
import { useAnalytics } from '../hooks/useAnalytics'

const AboutPage = () => {
  const analytics = useAnalytics('About')
  const sections = [
    {
      title: 'About SweatSocial',
      content: [
        "SweatSocial is India's first experimental fitness platform connecting you with boutique studios that actually care about your journey.",
        "We believe fitness should be personal, not transactional. That's why we exclusively partner with premium studios where trainers know your name, help you modify movements for your body, and celebrate your progress. No more getting lost in crowded gyms where you're just another membership number."
      ]
    },
    {
      title: 'What We Do',
      content: [
        "We've simplified the entire fitness discovery and booking experience. Through the SweatSocial app, you can instantly book classes at all our exclusive partner studios offering aerial yoga, pilates, bungee fitness, and a lot more workouts – no more DMing studios or calling receptionists. One app, endless possibilities."
      ]
    },
    {
      title: 'Why We Exist',
      content: [
        "With 67% of gym memberships going unused, we knew the problem wasn't motivation – it was the lack of genuine connection and variety. We're building a community where boutique studios thrive, instructors invest in your growth, and every workout feels like time well spent with people who care."
      ]
    },
    {
      title: 'Our Promise',
      subtitle: 'Move Together, Grow Together.',
      content: [
        "We're not just booking slots – we're connecting you to studios and communities that transform fitness from a chore into the highlight of your day. With personalized attention, experimental workouts, and seamless booking, we're making premium fitness accessible to everyone.",
        "Join the community members who've discovered that the best workouts happen in studios where everybody cares about the real you."
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-petal-50 via-pink-50 to-purple-50 opacity-50" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              About SweatSocial
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              India's first experimental fitness platform connecting you with boutique studios that actually care about your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="premium-card p-8 md:p-10 rounded-3xl"
              >
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-2xl md:text-3xl font-heading font-bold text-petal-600 mb-6">
                    {section.subtitle}
                  </p>
                )}
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-lg md:text-xl text-gray-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-petal-50 to-pink-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Ready to Join Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start your fitness journey with SweatSocial today.
            </p>
            <motion.a
              href="/"
              onClick={() =>
                analytics?.trackLink?.('About CTA - Get Started', '/', {
                  source: 'about_page_cta',
                })
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage

