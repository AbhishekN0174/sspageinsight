import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_BASE_URL } from '../apiConfig'
import PaymentModal from './PaymentModal'
import BookingSuccessModal from './BookingSuccessModal'

const formatClassDateTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
   
    const istOffsetMs = 5.5 * 60 * 60 * 1000 
    const adjustedDate = new Date(date.getTime() - istOffsetMs)
    
    return adjustedDate.toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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

const ClassDetailPage = () => {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [paymentResponse, setPaymentResponse] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `${API_BASE_URL}/api/v1/sessions/getSessionById/${sessionId}`,
        )
        if (!response.ok) {
          throw new Error('Failed to load class details')
        }
        const data = await response.json()
        setSession(data.session)
        
        // Track Meta Pixel ViewContent when class detail page loads
        if (typeof window !== 'undefined' && window.fbq && data.session) {
          window.fbq('track', 'ViewContent', {
            content_name: data.session.className || 'Class',
            content_category: 'Class',
            content_ids: [data.session._id || ''],
            value: data.session.price || 0,
            currency: 'INR',
          })
        }
      } catch (err) {
        console.error('Error fetching session details:', err)
        setError('Unable to load class details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  const handleBookingSuccess = (booking, paymentResp) => {
    setBookingData(booking)
    setPaymentResponse(paymentResp)
    setIsPaymentModalOpen(false)
    setIsSuccessModalOpen(true)
  }

  const mainImage =
    (session?.class?.images && session.class.images[0]) ||
    (session?.studio?.images && session.studio.images[0]) ||
    '/studio1.jpg'

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white via-petal-50/40 to-white pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-petal-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Loading / error / not found states */}
        {loading && (
          <div className="max-w-3xl mx-auto glass rounded-3xl p-8 md:p-10 animate-pulse">
            <div className="h-6 bg-petal-100/70 rounded w-1/3 mb-4" />
            <div className="h-8 bg-petal-100/70 rounded w-2/3 mb-6" />
            <div className="h-52 bg-petal-100/50 rounded-2xl mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-petal-50/80 rounded w-full" />
              <div className="h-4 bg-petal-50/80 rounded w-5/6" />
              <div className="h-4 bg-petal-50/80 rounded w-4/6" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto text-center glass rounded-3xl p-8 md:p-10">
            <p className="text-base md:text-lg text-red-700 font-semibold mb-2">
              {error}
            </p>
            <p className="text-sm md:text-base text-gray-600">
              Please go back to the classes list and try another class.
            </p>
          </div>
        )}

        {!loading && !error && !session && (
          <div className="max-w-xl mx-auto text-center glass rounded-3xl p-8 md:p-10">
            <p className="text-base md:text-lg text-gray-800 font-semibold mb-2">
              Class not found
            </p>
            <p className="text-sm md:text-base text-gray-600">
              The class you're looking for may have been updated or is no longer
              available.
            </p>
          </div>
        )}

        {!loading && !error && session && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 md:gap-14 items-start">
            {/* Left: Image + description */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden rounded-3xl shadow-xl bg-gray-900 relative mb-6"
              >
                <img
                  src={mainImage}
                  alt={session.className || 'SweatSocial Class'}
                  className="w-full h-[260px] md:h-[360px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-petal-100 uppercase tracking-[0.16em] mb-1">
                      {session.studio?.studioName || 'Studio Class'}
                    </p>
                    <p className="text-lg md:text-2xl font-heading font-bold text-white">
                      {session.className}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-petal-100">Class Price</p>
                    <p className="text-xl md:text-2xl font-heading font-bold text-white">
                      ₹{session.price}
                    </p>
                  </div>
                </div>
              </motion.div>

              {session.class?.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="glass rounded-3xl p-6 md:p-8"
                >
                  <h2 className="text-xl md:text-2xl font-heading font-semibold mb-3">
                    About this class
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                    {session.class.description}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Right: Details + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <div className="glass rounded-3xl p-6 md:p-7">
                <h3 className="text-lg md:text-xl font-heading font-semibold mb-4">
                  Class details
                </h3>
                <div className="space-y-4 text-sm md:text-base text-gray-700">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-1">
                      Date & Time
                    </p>
                    <p>{formatClassDateTime(session.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-1">
                      Studio
                    </p>
                    <p className="font-semibold">
                      {session.studio?.studioName || 'Hosted by SweatSocial'}
                    </p>
                  </div>
                  {session.classType && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-1">
                        Class Type
                      </p>
                      <p className="font-semibold">
                        {session.classType.title}
                      </p>
                    </div>
                  )}
                  {session.instructor && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-1">
                        Instructor
                      </p>
                      <p className="font-semibold">
                        {session.instructor.name}
                      </p>
                    </div>
                  )}
                  {session.studio?.address && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-1">
                        Location
                      </p>
                      <p className="whitespace-pre-line">
                        {session.studio.address.trim()}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-1">
                        Duration
                      </p>
                      <p>{session.duration || '60 minutes'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-1">
                        Spots Left
                      </p>
                      <p className={`font-semibold ${(session.availableSlots ?? 0) <= 0 ? 'text-red-600' : ''}`}>
                        {(session.availableSlots ?? 0) > 0
                          ? `${session.availableSlots} spots`
                          : 'Sold Out'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="glass rounded-3xl p-6 md:p-7 space-y-4">
                <h3 className="text-lg md:text-xl font-heading font-semibold">
                  {(session.availableSlots ?? 0) > 0 ? 'Reserve your spot' : 'Class Full'}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {(session.availableSlots ?? 0) > 0
                    ? 'Book your ticket and join the SweatSocial Glow Club!'
                    : 'This class is currently sold out. Check back later or explore other classes.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  {(session.availableSlots ?? 0) > 0 ? (
                    <motion.button
                      onClick={() => {
                        // Track Meta Pixel InitiateCheckout event
                        if (typeof window !== 'undefined' && window.fbq && session) {
                          window.fbq('track', 'InitiateCheckout', {
                            content_name: session.className || 'Class',
                            content_category: 'Class',
                            content_ids: [session._id || ''],
                            value: session.price || 0,
                            currency: 'INR',
                            num_items: 1,
                          })
                        }
                        setIsPaymentModalOpen(true)
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-primary font-semibold text-sm md:text-base shadow-lg hover:shadow-2xl"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Book Now
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
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-300 text-gray-500 font-semibold text-sm md:text-base cursor-not-allowed"
                    >
                      Sold Out
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}

                  <motion.a
                    href="/classes"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full glass text-sm md:text-base font-semibold text-gray-800 hover:bg-white/80"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Back to Classes
                  </motion.a>
                </div>

                {(session.availableSlots ?? 0) > 0 && (
                  <p className="text-[11px] text-gray-500">
                    Secure booking powered by Razorpay. Your payment is safe and encrypted.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {session && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          session={session}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false)
          setBookingData(null)
          setPaymentResponse(null)
        }}
        booking={bookingData}
        session={session}
        paymentResponse={paymentResponse}
      />
    </section>
  )
}

export default ClassDetailPage

