import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE_URL } from '../apiConfig'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const PaymentModal = ({ 
  event, 
  session, 
  isOpen, 
  onClose, 
  onSuccess, 
  onBookingSuccess,
  analytics,
  sourcePage = 'Home',
}) => {
  // Use onBookingSuccess if provided, otherwise fall back to onSuccess
  const handleSuccess = onBookingSuccess || onSuccess
  const { user, token, isAuthenticated, login } = useAuth()
  
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  })
  const [promoCode, setPromoCode] = useState('')
  const [promoCodeId, setPromoCodeId] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [promoError, setPromoError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  
  // Coupon state
  const [availableCoupons, setAvailableCoupons] = useState([])
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponId, setCouponId] = useState(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponError, setCouponError] = useState(null)

  // Determine if this is a session or event booking
  const isSession = !!session
  const item = session || event
  const basePrice = item?.price || 0
  // Total discount from both promo code and coupon (use the higher one)
  const totalDiscount = Math.max(discount, couponDiscount)
  const priceAfterDiscount = basePrice - totalDiscount
  const gstRate = 0.05 // 5% GST
  const taxes = Math.round(priceAfterDiscount * gstRate * 100) / 100 // Round to 2 decimal places
  const finalPrice = priceAfterDiscount + taxes

  const analyticsProps = {
    source_page: sourcePage,
    event_id: event?._id,
    event_name: event?.eventName,
    studio_id: event?.studio?._id || event?.studio,
  }

  const trackEvent = (name, props = {}) => {
    analytics?.track?.(name, { ...analyticsProps, ...props })
  }

  const trackClick = (name, props = {}) => {
    if (analytics?.trackClick) {
      analytics.trackClick(name, { ...analyticsProps, ...props })
    } else {
      trackEvent(name, props)
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Check if user is authenticated
      if (!isAuthenticated) {
        setShowAuthModal(true)
        return
      }
      
      // Pre-fill form with user data if authenticated
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber?.replace('+91', '') || '',
        })
      } else {
        setFormData({ name: '', email: '', phoneNumber: '' })
      }
      
      setPromoCode('')
      setPromoCodeId(null)
      setDiscount(0)
      setPromoError(null)
      setError(null)
      setShowAuthModal(false)
      
      // Reset coupon state
      setSelectedCoupon(null)
      setCouponDiscount(0)
      setCouponId(null)
      setCouponError(null)
      
      // Fetch available coupons if authenticated
      if (isAuthenticated && item) {
        fetchAvailableCoupons()
      }
    }
  }, [isOpen, isAuthenticated, user])
  
  const fetchAvailableCoupons = async () => {
    if (!item) return
    
    setIsLoadingCoupons(true)
    try {
      const params = new URLSearchParams({
        studioId: item?.studio?._id || item?.studio || '',
      })
      
      if (isSession && session?._id) {
        params.append('sessionId', session._id)
        if (session?.class?._id) {
          params.append('classId', session.class._id)
        }
      } else if (!isSession && event?._id) {
        params.append('eventId', event._id)
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/coupons/getAvailableCoupons?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailableCoupons(data.coupons || [])
      }
    } catch (err) {
      console.error('Error fetching coupons:', err)
    } finally {
      setIsLoadingCoupons(false)
    }
  }
  
  const validateCoupon = async (couponCode) => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    
    setIsValidatingCoupon(true)
    setCouponError(null)
    
    try {
      // Clear promo code if applying coupon
      if (promoCodeId) {
        setPromoCode('')
        setPromoCodeId(null)
        setDiscount(0)
        setPromoError(null)
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/coupons/website/validateCoupon`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: couponCode.trim().toUpperCase(),
            amount: basePrice,
            studioId: item?.studio?._id || item?.studio,
            ...(isSession && session?._id ? { sessionId: session._id } : {}),
            ...(!isSession && event?._id ? { eventId: event._id } : {}),
            ...(session?.class?._id ? { classId: session.class._id } : {}),
          }),
        },
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Invalid coupon code')
      }
      
      const data = await response.json()
      setCouponDiscount(data.discountApplied || 0)
      setCouponId(data.couponId)
      setSelectedCoupon(data.coupon)
      setCouponError(null)
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code')
      setCouponDiscount(0)
      setCouponId(null)
      setSelectedCoupon(null)
    } finally {
      setIsValidatingCoupon(false)
    }
  }
  
  const removeCoupon = () => {
    setSelectedCoupon(null)
    setCouponDiscount(0)
    setCouponId(null)
    setCouponError(null)
  }

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code')
      return
    }

    setIsValidatingPromo(true)
    setPromoError(null)

    try {

      trackClick('Promo Code Applied', {
        promo_code: promoCode.trim().toUpperCase(),
        status: 'validating',
      })
      // Clear coupon if applying promo code
      if (couponId) {
        setSelectedCoupon(null)
        setCouponDiscount(0)
        setCouponId(null)
        setCouponError(null)
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/promo-code/website/validatePromoCode`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
              body: JSON.stringify({
                code: promoCode.trim().toUpperCase(),
                ...(isSession && session?._id ? { sessionId: session._id } : {}),
                ...(!isSession && event?._id ? { eventId: event._id } : {}),
                studioId: item?.studio?._id || item?.studio,
                amount: basePrice, // Validate against original price before discount
                promoCodeType: isSession ? 'sessions' : 'events',
              }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Invalid promo code')
      }

      const data = await response.json()
      setDiscount(data.discountApplied || 0)
      setPromoCodeId(data.promoCodeId)
      setPromoError(null)
      trackEvent('Promo Code Applied', {
        promo_code: promoCode.trim().toUpperCase(),
        status: 'success',
        discount: data.discountApplied || 0,
      })
    } catch (err) {
      setPromoError(err.message || 'Invalid promo code')
      setDiscount(0)
      setPromoCodeId(null)
      trackEvent('Promo Code Applied', {
        promo_code: promoCode.trim().toUpperCase(),
        status: 'error',
        error_message: err.message,
      })
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const handleAuthSuccess = (authData) => {
    login(authData)
    setShowAuthModal(false)
    // Pre-fill form with user data
    if (authData.user) {
      setFormData({
        name: authData.user.name || '',
        email: authData.user.email || '',
        phoneNumber: authData.user.phoneNumber?.replace('+91', '') || '',
      })
    }
  }

  const handlePayment = async () => {
    // Check authentication
    if (!isAuthenticated || !token) {
      setShowAuthModal(true)
      return
    }

    // Check if item is sold out
    if ((item?.availableSlots ?? 0) <= 0) {
      setError(`This ${isSession ? 'class' : 'event'} is sold out. Please try another ${isSession ? 'class' : 'event'}.`)
      return
    }

    // Validate form
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      setError('Please enter a valid phone number (minimum 10 digits)')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      trackClick('Checkout Initiated', {
        final_price: finalPrice,
        discount_applied: discount,
      })
      // Create booking and get Razorpay order
      const formattedPhone = formData.phoneNumber.startsWith('+91') 
        ? formData.phoneNumber 
        : `+91${formData.phoneNumber.trim()}`

      // Build request body exactly like mobile app - completely separate structures
      // For sessions: ONLY sessionId (eventId field does NOT exist in the object)
      // For events: ONLY eventId (sessionId field does NOT exist in the object)
      const requestBody = {}
      
      // Common fields for both
      requestBody.studioId = item?.studio?._id || item?.studio
      requestBody.basePrice = priceAfterDiscount
      requestBody.taxes = taxes
      requestBody.email = user?.email || formData.email
      requestBody.name = user?.name || formData.name
      requestBody.phoneNumber = formattedPhone
      
      if (isSession) {
        // Session booking - match CreateBookingEntity structure
        // DO NOT include eventId field at all
        requestBody.bookingType = session?.classType?.studioType || 'wellness'
        
        // Only add sessionId if it exists
        if (session?._id) {
          requestBody.sessionId = session._id
        }
      } else {
        // Event booking - match BookEventEntity structure
        // DO NOT include sessionId field at all
        requestBody.bookingType = 'event'
        
        // Only add eventId if it exists
        if (event?._id) {
          requestBody.eventId = event._id
        }
      }
      
      // Only add promoCodeId if it exists (and no coupon)
      if (promoCodeId && !couponId) {
        requestBody.promoCodeId = promoCodeId
      }
      
      // Only add couponId if it exists (and no promo code)
      if (couponId && !promoCodeId) {
        requestBody.couponId = couponId
      }
      
      // Final cleanup: Remove any undefined, null, or empty string values
      Object.keys(requestBody).forEach(key => {
        const value = requestBody[key]
        if (value === undefined || value === null || value === '') {
          delete requestBody[key]
        }
      })
      
      // Final safety check: Ensure eventId is NOT in request for session bookings
      if (isSession && 'eventId' in requestBody) {
        console.warn('WARNING: eventId found in session booking request, removing it')
        delete requestBody.eventId
      }
      
      // Final safety check: Ensure sessionId is NOT in request for event bookings
      if (!isSession && 'sessionId' in requestBody) {
        console.warn('WARNING: sessionId found in event booking request, removing it')
        delete requestBody.sessionId
      }
      
      // Debug: Log the request body to verify what's being sent
      console.log('Booking request body (isSession:', isSession, '):', JSON.stringify(requestBody, null, 2))

      const bookingResponse = await fetch(
        `${API_BASE_URL}/api/v1/bookings/website/createBooking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      )

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.message || 'Failed to create booking')
      }

      const bookingData = await bookingResponse.json()
      const { razorpayOrder } = bookingData

      // Check if Razorpay script is already loaded
      if (window.Razorpay) {
        // Script already loaded, proceed with payment
        initializeRazorpay(razorpayOrder, bookingData.booking)
      } else {
        // Load Razorpay script
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
        if (existingScript) {
          // Script tag exists but not loaded yet, wait for it
          existingScript.onload = () => {
            initializeRazorpay(razorpayOrder, bookingData.booking)
          }
        } else {
          // Create and load script
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => {
            initializeRazorpay(razorpayOrder, bookingData.booking)
          }
          script.onerror = () => {
            setError('Failed to load payment gateway. Please try again.')
            setIsProcessing(false)
          }
          document.body.appendChild(script)
        }
      }

      function initializeRazorpay(order, booking) {
        try {
      
          const razorpayKey = order.key
          
          if (!razorpayKey) {
            console.error('Razorpay key missing from backend response:', order)
            throw new Error('Razorpay key not found. Please contact support.')
          }

          const options = {
            key: razorpayKey,
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'SweatSocial',
            description: `Booking for ${item?.eventName || item?.className || (isSession ? 'Class' : 'Event')}`,
            order_id: order.id,
            handler: async function (response) {
              console.log('Payment successful:', response)
              trackEvent('Checkout Completed', {
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                status: 'success',
              })
              // Payment successful - verify and complete booking on backend
              try {
                const completeResponse = await fetch(
                  `${API_BASE_URL}/api/v1/bookings/website/completeBooking`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      orderId: order.id,
                      paymentId: response.razorpay_payment_id,
                    }),
                  },
                )

                if (!completeResponse.ok) {
                  const errorData = await completeResponse.json()
                  console.error('Failed to complete booking:', errorData)
                  throw new Error(errorData.message || 'Failed to complete booking')
                }

                const completeData = await completeResponse.json()
                console.log('Booking completed:', completeData)
                // Payment successful and booking completed
                handleSuccess(response, completeData.booking || booking)
              } catch (err) {
                console.error('Error completing booking:', err)
                trackEvent('Checkout Completed', {
                  order_id: order.id,
                  payment_id: response.razorpay_payment_id,
                  status: 'pending_webhook',
                  error_message: err.message,
                })
                // Still show success but log the error
                // The webhook will handle it, but we show success for better UX
                handleSuccess(response, booking)
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phoneNumber || '',
            },
            theme: {
              color: '#f48fb4',
            },
            modal: {
              ondismiss: function () {
                console.log('Payment modal dismissed')
                setIsProcessing(false)
                trackEvent('Checkout Modal Dismissed', {
                  order_id: order.id,
                })
              },
            },
            notes: {
              booking_id: booking.bookingId || booking._id,
              event_name: event?.eventName,
              session_name: session?.className,
            },
          }

          if (!window.Razorpay) {
            throw new Error('Razorpay script not loaded. Please refresh the page and try again.')
          }

          const razorpay = new window.Razorpay(options)
          
          // Add error handler
          razorpay.on('payment.failed', function (response) {
            console.error('Payment failed:', response)
            setError(`Payment failed: ${response.error?.description || response.error?.reason || 'Please try again'}`)
            setIsProcessing(false)
            trackEvent('Checkout Failed', {
              order_id: order.id,
              error_code: response.error?.code,
              error_description: response.error?.description || response.error?.reason,
            })
          })

          trackEvent('Checkout Modal Opened', {
            order_id: order.id,
            final_price: finalPrice,
          })
          razorpay.open()
          console.log('Razorpay modal opened')
        } catch (err) {
          console.error('Razorpay initialization error:', err)
          setError(err.message || 'Failed to initialize payment. Please try again.')
          setIsProcessing(false)
          trackEvent('Checkout Error', {
            stage: 'razorpay_init',
            error_message: err.message,
          })
        }
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setIsProcessing(false)
      trackEvent('Checkout Error', {
        stage: 'booking_create',
        error_message: err.message,
      })
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          onClose()
        }}
        onAuthSuccess={handleAuthSuccess}
        phoneNumber={formData.phoneNumber}
      />

      {/* Payment Modal */}
      {!showAuthModal && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                Complete Your Booking
              </h2>
              <p className="text-gray-600">{item?.eventName || item?.className}</p>
              {isAuthenticated && user && (
                <div className="mt-3 p-3 bg-primary-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    Booking as <span className="font-semibold text-gray-900">{user.name}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Item Summary */}
            <div className="bg-petal-50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{isSession ? 'Class' : 'Event'} Price</span>
                <span className="font-semibold">₹{basePrice}</span>
              </div>
              {totalDiscount > 0 && (
                <>
                  <div className="flex justify-between items-center mb-2 text-petal-600">
                    <span>{couponDiscount > discount ? 'Coupon' : 'Promo Code'} Discount Applied</span>
                    <span className="font-semibold">-₹{totalDiscount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price after discount</span>
                    <span className="font-semibold">₹{priceAfterDiscount}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">GST (5%)</span>
                <span className="font-semibold">₹{taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-petal-200">
                <span className="text-lg font-bold">Total Amount (incl. GST)</span>
                <span className="text-2xl font-heading font-bold text-petal-600">
                  ₹{finalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Coupons Section */}
            {(isLoadingCoupons || availableCoupons.length > 0 || selectedCoupon) && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <label className="block text-sm font-semibold text-gray-700">
                      Coupons & Bank Offers
                    </label>
                  </div>
                  {availableCoupons.length > 2 && !selectedCoupon && (
                    <button
                      onClick={() => {
                        // Show all coupons - for now just show first 2, can be expanded later
                        setAvailableCoupons(availableCoupons)
                      }}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
                    >
                      View All
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {isLoadingCoupons ? (
                  <div className="space-y-3">
                    <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                    <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                  </div>
                ) : selectedCoupon ? (
                  // Applied Coupon Card
                  <div className="mb-3 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 flex items-center gap-3">
                      {/* Checkmark Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {/* Coupon Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          You saved ₹{couponDiscount.toFixed(0)} with this code.
                        </p>
                        <p className="text-base font-bold text-gray-900 tracking-wide mb-1">
                          {selectedCoupon.code}
                        </p>
                        {selectedCoupon.title && (
                          <p className="text-sm font-medium text-gray-700">
                            {selectedCoupon.title}
                          </p>
                        )}
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={removeCoupon}
                        disabled={isValidatingCoupon}
                        className="flex-shrink-0 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : availableCoupons.length > 0 ? (
                  <div className="space-y-3">
                    {availableCoupons.slice(0, 2).map((coupon) => {
                      const discountAmount = coupon.discountType === 'percentage'
                        ? Math.min(
                            basePrice * (coupon.discountValue / 100),
                            coupon.maxDiscountAmount || Infinity
                          )
                        : coupon.discountValue
                      const discountText = coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`
                      
                      let validOnText = 'Valid on select products'
                      switch (coupon.applicableType) {
                        case 'studio':
                          validOnText = 'Valid on this studio'
                          break
                        case 'event':
                          validOnText = 'Valid on this event'
                          break
                        case 'class':
                          validOnText = 'Valid on this class'
                          break
                        case 'all_events':
                          validOnText = 'Valid on all events'
                          break
                        case 'all_classes':
                          validOnText = 'Valid on all classes'
                          break
                        case 'all':
                        default:
                          validOnText = 'Valid on all products'
                      }
                      
                      return (
                        // Available Coupon Card with Perforated Edge
                        <div
                          key={coupon._id}
                          className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                          {/* Perforated Left Edge */}
                          <div className="absolute left-0 top-0 bottom-0 w-12 bg-petal-100 flex items-center justify-center">
                            <div className="transform -rotate-90 whitespace-nowrap">
                              <span className="text-xs font-extrabold text-gray-900 tracking-tight">
                                {discountText} OFF
                              </span>
                            </div>
                          </div>
                          
                          {/* Main Content */}
                          <div className="pl-16 pr-4 py-4">
                            <div className="flex items-center justify-between gap-4">
                              {/* Coupon Details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-lg font-extrabold text-gray-900 tracking-wider mb-1">
                                  {coupon.code}
                                </p>
                                {coupon.title && (
                                  <p className="text-sm font-medium text-gray-700 mb-1.5">
                                    {coupon.title}
                                  </p>
                                )}
                                <p className="text-sm font-semibold text-petal-600 mb-1">
                                  {coupon.discountType === 'percentage'
                                    ? `Get ${discountText} OFF on this purchase!`
                                    : `Save ₹${coupon.discountValue.toFixed(0)} on this purchase!`}
                                </p>
                                <p className="text-xs font-normal text-gray-500">
                                  {validOnText}
                                </p>
                              </div>
                              
                              {/* Apply Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!isValidatingCoupon) {
                                    validateCoupon(coupon.code)
                                  }
                                }}
                                disabled={isValidatingCoupon}
                                className="flex-shrink-0 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isValidatingCoupon ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  'Apply'
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
                
                {isValidatingCoupon && (
                  <p className="text-sm text-gray-600 mt-2">Validating coupon...</p>
                )}
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>
            )}

            {/* Promo Code Section */}
            <div className="mb-6">
              {selectedCoupon && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-sm text-gray-500 font-medium">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              )}
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Promo Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                  disabled={isValidatingPromo || isProcessing || !!selectedCoupon}
                />
                <button
                  onClick={validatePromoCode}
                  disabled={isValidatingPromo || isProcessing || !promoCode.trim() || !!selectedCoupon}
                  className="px-6 py-3 bg-gradient-primary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isValidatingPromo ? 'Validating...' : 'Apply'}
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-sm mt-2">{promoError}</p>
              )}
              {discount > 0 && !promoError && !selectedCoupon && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Promo code applied! You saved ₹{discount}
                </p>
              )}
            </div>

            {/* User Info or Form */}
            {isAuthenticated && user ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">{formData.name || user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900">{formData.email || user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold text-gray-900">
                      {formData.phoneNumber || user.phoneNumber?.replace('+91', '')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, phoneNumber: e.target.value })
                      setError(null)
                    }}
                    placeholder="Enter your phone number"
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      error && !formData.phoneNumber.trim()
                        ? 'border-red-300'
                        : 'border-petal-200'
                    } focus:outline-none focus:border-petal-400 transition-all`}
                    disabled={isProcessing}
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-6 py-4 bg-gradient-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${finalPrice.toFixed(2)}`}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </div>
        </motion.div>
      </div>
      </AnimatePresence>
      )}
    </>
  )
}

export default PaymentModal

