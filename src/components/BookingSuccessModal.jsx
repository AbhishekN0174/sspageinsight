import { motion } from 'framer-motion'
import { useEffect } from 'react'

const BookingSuccessModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  event, 
  session, 
  paymentResponse,
  analytics,
  sourcePage = 'Home',
}) => {
  // Determine if this is a session or event booking
  const isSession = !!session
  const item = session || event
  
  // Detect platform for app store links
  const detectPlatform = () => {
    if (typeof window === 'undefined') return 'web'
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/android/i.test(userAgent)) {
      return 'android'
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios'
    }
    return 'web'
  }

  const platform = detectPlatform()
  
  // App store links
  const appLinks = {
    ios: 'https://apps.apple.com/in/app/sweat-social/id6742068524',
    android: 'https://play.google.com/store/apps/details?id=com.hustlecreatives.sweatsocial&hl=en_IN',
    web: 'https://play.google.com/store/apps/details?id=com.hustlecreatives.sweatsocial&hl=en_IN'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      analytics?.track?.('Booking Success Modal Viewed', {
        source_page: sourcePage,
        booking_id: booking?.bookingId,
        event_id: event?._id,
        event_name: event?.eventName,
      })
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, analytics, booking?.bookingId, event?._id, event?.eventName, sourcePage])

  const trackAction = (action, extra = {}) => {
    analytics?.track?.('Booking Success Modal Action', {
      action,
      source_page: sourcePage,
      booking_id: booking?.bookingId,
      event_id: event?._id,
      event_name: event?.eventName,
      ...extra,
    })
  }

  const handleDone = () => {
    trackAction('done')
    onClose()
  }

  if (!isOpen) return null

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      // If the date is stored in UTC but represents IST time,
      // we need to adjust it. The date from backend is UTC, but the time value
      // represents IST. So we subtract the IST offset to get the correct UTC time,
      // then convert to IST for display.
      // IST is UTC+5:30, so if stored time is 6:00 PM UTC but should be 6:00 PM IST,
      // we need to subtract 5.5 hours from the stored UTC to get correct UTC (12:30 PM UTC),
      // which when converted to IST becomes 6:00 PM IST.
      const istOffsetMs = 5.5 * 60 * 60 * 1000 // IST offset in milliseconds
      const adjustedDate = new Date(date.getTime() - istOffsetMs)
      
      return adjustedDate.toLocaleString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      })
    } catch {
      return ''
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
      >
        {/* Success Icon Header */}
        <div className="relative bg-gradient-to-br from-petal-200/80 to-petal-300/80 p-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center"
          >
            <svg
              className="w-7 h-7 text-petal-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-0.5">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 text-xs">
            Your spot has been reserved
          </p>
        </div>

        {/* Compact Booking Details */}
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
            <div>
              <p className="text-[10px] text-gray-500">{isSession ? 'Class' : 'Event'}</p>
              <p className="font-semibold text-gray-900 text-xs">
                {item?.eventName || item?.className || (isSession ? 'Class' : 'Event')}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Date & Time</p>
              <p className="font-semibold text-gray-900 text-xs">
                {formatDate(item?.date)}
              </p>
            </div>
            {item?.studio?.studioName && (
              <div>
                <p className="text-[10px] text-gray-500">Studio</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {item.studio.studioName}
                </p>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-[10px] text-gray-500">Booking ID</p>
              <p className="font-mono font-semibold text-gray-900 text-[10px]">
                {booking?.bookingId || 'N/A'}
              </p>
            </div>
          </div>

          {/* App Download CTA - Subtle Pink */}
          <div className="bg-gradient-to-br from-petal-100/60 to-petal-200/60 border border-petal-200/50 rounded-xl p-4 mb-3 text-center">
            <div className="mb-2">
              <svg
                className="w-8 h-8 text-petal-500 mx-auto mb-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-sm font-heading font-bold text-gray-900 mb-0.5">
                Get Your Tickets on App
              </h3>
              <p className="text-gray-600 text-[10px] mb-2">
                Download SweatSocial app to access your booking
              </p>
            </div>
            <motion.a
              href={appLinks[platform]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-petal-300 transition-all shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {platform === 'ios' ? (
                <>
                  <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500">Download on the</div>
                    <div className="text-xs font-bold text-gray-900">App Store</div>
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500">GET IT ON</div>
                    <div className="text-xs font-bold text-gray-900">Google Play</div>
                  </div>
                </>
              )}
            </motion.a>
          </div>

          {/* Email Notice - Compact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-blue-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-[10px] text-blue-700">
                Confirmation email sent
              </p>
            </div>
          </div>

          {/* Single Action Button */}
          <motion.button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gradient-primary rounded-lg font-semibold text-black text-sm shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Done
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default BookingSuccessModal

