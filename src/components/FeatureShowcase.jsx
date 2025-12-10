import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const FeatureCard = ({ feature, index }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-[400px] w-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="h-full bg-white rounded-3xl overflow-hidden border-2 border-petal-200 hover:border-petal-400 transition-all shadow-lg hover:shadow-xl group">
            <div className="relative h-full p-6 md:p-8 flex flex-col items-center justify-center text-center">
              {/* Icon */}
              <motion.div
                className="mb-4 md:mb-6 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-petal-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${feature.bgColor}`}>
                  {feature.icon}
                </div>
              </motion.div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 md:mb-4 text-gray-900">
                {feature.title}
              </h3>

              {/* Short Description */}
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                {feature.shortDesc}
              </p>

              {/* Hover Hint */}
              <motion.div
                className="flex items-center gap-2 text-xs md:text-sm text-petal-600 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span>Hover to learn more</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full bg-gradient-to-br from-petal-400 to-petal-600 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 md:mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-white/95 text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                {feature.longDesc}
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-2 md:space-y-3">
              {feature.benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2 md:gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isFlipped ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs md:text-sm text-white">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const FeatureShowcase = () => {
  const features = [
    {
      title: 'Unique Workouts',
      shortDesc: 'One-of-a-kind fitness experiences',
      longDesc: 'Embark on a journey with aerial yoga and bungee fitness, and delve into a diverse array of exhilarating, one-of-a-kind classes',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500',
      image: 'https://assets-v2.codedesign.ai/storage/v1/object/public/680b37e3efe2f11ac90457f3_fffa2dfa/asset-aaa7a924',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      benefits: [
        'Aerial yoga and bungee fitness classes',
        'Pilates, calisthenics, and more',
        'Discover new workout styles',
        'Expert-led unique fitness experiences'
      ]
    },
    {
      title: 'Community Focused',
      shortDesc: 'Connect with fitness enthusiasts',
      longDesc: 'Become a part of a dynamic community of fitness enthusiasts, where you can exchange experiences, uncover motivation',
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      image: 'https://assets-v2.codedesign.ai/storage/v1/object/public/680b37e3efe2f11ac90457f3_fffa2dfa/asset-467783b2',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      benefits: [
        'Join a vibrant fitness community',
        'Share experiences and motivation',
        'Connect with like-minded people',
        'Build lasting fitness friendships'
      ]
    },
    {
      title: 'Premium Studios',
      shortDesc: 'Bangalore\'s finest wellness spaces',
      longDesc: 'Discover Bangalore\'s premier wellness studios, offering exceptional amenities and expert guidance',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      image: 'https://assets-v2.codedesign.ai/storage/v1/object/public/680b37e3efe2f11ac90457f3_fffa2dfa/asset-df4bda28',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      benefits: [
        'Access to top-tier studios',
        'Exceptional amenities and facilities',
        'Expert trainers and guidance',
        'Multiple locations across Bangalore'
      ]
    },
    {
      title: 'Flexible Plans',
      shortDesc: 'No long-term commitments',
      longDesc: 'Experience unparalleled access to top-tier studios with our versatile membership options',
      bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
      image: 'https://assets-v2.codedesign.ai/storage/v1/object/public/680b37e3efe2f11ac90457f3_fffa2dfa/asset-6b76df8c',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      benefits: [
        'Flexible membership options',
        'No long-term contracts',
        'Access multiple studios',
        'Cancel or change plans anytime'
      ]
    }
  ]

  return (
    <section id="features" className="relative py-16 md:py-32 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(244, 143, 180, 0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.span
            className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full glass text-xs md:text-sm font-semibold mb-4 md:mb-6 text-petal-700"
            whileHover={{ scale: 1.05 }}
          >
            Why SweatSocial
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 md:mb-6 px-4">
            Elevate Your <span className="text-gradient">Fitness Journey</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Not just a fitness app, we're fostering a community through unique workouts, premium studios, and flexible memberships.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base px-4">Ready to experience all features?</p>
          <motion.button
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-primary rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-2xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </section>
  )
}

export default FeatureShowcase
