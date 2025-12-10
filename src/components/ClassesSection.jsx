import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { API_BASE_URL } from '../apiConfig'
import PaymentModal from './PaymentModal'
import BookingSuccessModal from './BookingSuccessModal'

const formatClassDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
   
    const istOffsetMs = 5.5 * 60 * 60 * 1000 // IST offset in milliseconds
    const adjustedDate = new Date(date.getTime() - istOffsetMs)
    
    return adjustedDate.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    })
  } catch {
    return ''
  }
}

const ClassPill = ({ label }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-petal-100 text-xs font-semibold text-petal-700">
    {label}
  </span>
)

const ClassesSection = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [paymentResponse, setPaymentResponse] = useState(null)
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = `${API_BASE_URL}/api/v1/sessions/website/getActiveSessions?page=1&pageSize=6`
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to load classes')
        }

        const data = await response.json()
        setSessions(Array.isArray(data.sessions) ? data.sessions : [])
      } catch (err) {
        console.error('Error fetching sessions:', err)
        setError('Unable to load classes right now. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const hasSessions = !loading && sessions.length > 0

  return (
    <section
      id="classes"
      className="relative py-20 md:py-28 bg-gradient-to-b from-white via-petal-50/40 to-white overflow-hidden"
      ref={ref}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-petal-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(244, 143, 180, 0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs md:text-sm font-semibold mb-4 text-petal-700"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petal-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-petal-500" />
            </span>
            Upcoming Classes
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 md:mb-5">
            Book Your{' '}
            <span className="text-gradient">Fitness Classes</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Join expert-led classes at partner studios. From yoga to pilates, find the perfect class for your fitness journey.
          </p>
        </motion.div>

        {/* Content states */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="premium-card p-1 animate-pulse bg-gradient-to-br from-petal-50 to-white"
              >
                <div className="rounded-[22px] overflow-hidden bg-white/70">
                  <div className="h-52 bg-petal-100/40" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-petal-100/70 rounded w-1/3" />
                    <div className="h-6 bg-petal-100/70 rounded w-2/3" />
                    <div className="h-4 bg-petal-50/80 rounded w-full" />
                    <div className="h-10 bg-petal-100/80 rounded w-1/2 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto text-center glass rounded-3xl p-6 md:p-8 border border-red-100 bg-red-50/60">
            <p className="text-sm md:text-base text-red-700 font-medium mb-2">
              {error}
            </p>
            <p className="text-xs md:text-sm text-red-500">
              You can still explore our classes on the SweatSocial app.
            </p>
          </div>
        )}

        {/* Sessions grid - all uniform */}
        {hasSessions && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {sessions.map((session, index) => (
              <motion.article
                key={session._id || index}
                className="premium-card p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="relative rounded-[22px] overflow-hidden bg-white h-full flex flex-col">
                  <div className="relative h-48" style={{ contentVisibility: 'auto' }}>
                    <img
                      src={session.class?.images?.[0] || session.studio?.images?.[0] || '/studio1.jpg'}
                      alt={session.className || 'SweatSocial Class'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <ClassPill
                        label={
                          session.studio?.studioName ||
                          session.classType?.title ||
                          'SweatSocial Class'
                        }
                      />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-petal-100">
                          {session.studio?.studioName || 'Studio'}
                        </p>
                        <p className="text-xs md:text-sm text-white font-medium">
                          {formatClassDate(session.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-petal-100">From</p>
                        <p className="text-sm md:text-base font-heading font-bold text-white">
                          ₹{session.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-5 md:p-6 flex flex-col">
                    <h3 className="text-lg md:text-xl font-heading font-semibold mb-2 line-clamp-2">
                      {session.className}
                    </h3>
                    {session.classType && (
                      <p className="text-sm text-petal-600 mb-2 font-medium">
                        {session.classType.title}
                      </p>
                    )}
                    {session.instructor && (
                      <p className="text-sm text-gray-600 mb-3">
                        Instructor: {session.instructor.name}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className={(session.availableSlots ?? 0) <= 0 ? 'text-red-600 font-semibold' : ''}>
                        {(session.availableSlots ?? 0) > 0
                          ? `${session.availableSlots} spots left`
                          : 'Sold Out'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-neon-green" />
                        Live on SweatSocial
                      </span>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <div className="flex gap-2">
                        {(session.availableSlots ?? 0) > 0 ? (
                          <button
                            onClick={() => {
                              // Track Meta Pixel InitiateCheckout event
                              if (typeof window !== 'undefined' && window.fbq) {
                                window.fbq('track', 'InitiateCheckout', {
                                  content_name: session.className || 'Class',
                                  content_category: 'Class',
                                  content_ids: [session._id || ''],
                                  value: session.price || 0,
                                  currency: 'INR',
                                  num_items: 1,
                                })
                              }
                              setSelectedSession(session)
                              setIsPaymentModalOpen(true)
                            }}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-full bg-gradient-primary text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                          >
                            Book Now
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-full bg-gray-300 text-gray-500 text-xs font-semibold cursor-not-allowed"
                          >
                            Sold Out
                          </button>
                        )}
                        <motion.a
                          href={`/classes/${session._id}`}
                          onClick={() => {
                            // Track Meta Pixel ViewContent event
                            if (typeof window !== 'undefined' && window.fbq) {
                              window.fbq('track', 'ViewContent', {
                                content_name: session.className || 'Class',
                                content_category: 'Class',
                                content_ids: [session._id || ''],
                                value: session.price || 0,
                                currency: 'INR',
                              })
                            }
                          }}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-full glass text-xs font-semibold"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          View Details
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* No sessions fallback */}
        {!loading && !error && sessions.length === 0 && (
          <div className="max-w-xl mx-auto text-center glass rounded-3xl p-6 md:p-8">
            <p className="text-base md:text-lg text-gray-700 font-semibold mb-2">
              No upcoming classes right now
            </p>
            <p className="text-sm md:text-base text-gray-500">
              Check back soon or explore our partner studios on the SweatSocial
              app.
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        session={selectedSession}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedSession(null)
        }}
        onSuccess={(paymentResp, booking) => {
          // Handle successful payment
          setPaymentResponse(paymentResp)
          setBookingData(booking)
          setIsPaymentModalOpen(false)
          setIsSuccessModalOpen(true)
        }}
      />

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false)
          setSelectedSession(null)
          setBookingData(null)
          setPaymentResponse(null)
        }}
        booking={bookingData}
        session={selectedSession}
        paymentResponse={paymentResponse}
      />
    </section>
  )
}

export default ClassesSection

