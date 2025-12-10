import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { API_BASE_URL } from '../apiConfig'

const AuthModal = ({ isOpen, onClose, onAuthSuccess, phoneNumber: initialPhoneNumber }) => {
  const [step, setStep] = useState('phone') // 'phone', 'otp', 'signup'
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    age: '',
    gender: ''
  })
  const otpInputRefs = useRef([])

  // Lock body scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
      
      return () => {
        const savedScrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
        
        if (savedScrollY) {
          const scrollPosition = parseInt(savedScrollY || '0', 10) * -1
          requestAnimationFrame(() => {
            window.scrollTo({
              top: scrollPosition,
              behavior: 'auto'
            })
          })
        }
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setStep('phone')
      setPhoneNumber(initialPhoneNumber || '')
      setOtp(['', '', '', ''])
      setError(null)
      setUserData(null)
      setSignupData({ name: '', email: '', age: '', gender: '' })
    }
  }, [isOpen, initialPhoneNumber])

  useEffect(() => {
    if (step === 'otp' && otpInputRefs.current[0]) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 100)
    }
  }, [step])

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setError('Please enter a valid phone number (minimum 10 digits)')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formattedPhone = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : `+91${phoneNumber.trim()}`

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/generateOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          isMock: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send OTP')
      }

      const data = await response.json()
      setStep('otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take last character
    setOtp(newOtp)
    setError(null)

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(['', '', '', '']).slice(0, 4)
      setOtp(newOtp)
      const nextEmptyIndex = newOtp.findIndex(val => !val)
      if (nextEmptyIndex > 0) {
        otpInputRefs.current[nextEmptyIndex - 1]?.focus()
      } else {
        otpInputRefs.current[3]?.focus()
      }
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit OTP')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formattedPhone = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : `+91${phoneNumber.trim()}`

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/validateOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          otp: otpString,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Invalid OTP')
      }

      const data = await response.json()
      
      if (data.isOtpValidated) {
        setUserData(data)
        
        // Check if profile is complete
        const user = data.user
        const isProfileComplete = 
          user?.name?.trim() &&
          user?.email?.trim() &&
          user?.age != null &&
          user?.gender?.trim()

        if (!isProfileComplete) {
          // Pre-fill signup form with available data
          setSignupData({
            name: user?.name || '',
            email: user?.email || '',
            age: user?.age?.toString() || '',
            gender: user?.gender || ''
          })
          setStep('signup')
        } else {
          // Profile complete, proceed with auth success
          onAuthSuccess(data)
        }
      } else {
        throw new Error('Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    
    if (!signupData.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!signupData.email.trim() || !signupData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (!signupData.age || parseInt(signupData.age) < 1) {
      setError('Please enter a valid age')
      return
    }
    if (!signupData.gender) {
      setError('Please select your gender')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/updateUserProfile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          name: signupData.name.trim(),
          email: signupData.email.trim(),
          age: parseInt(signupData.age),
          gender: signupData.gender,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      // Profile updated, proceed with auth success
      const updatedUserData = {
        ...userData,
        user: {
          ...userData.user,
          name: signupData.name.trim(),
          email: signupData.email.trim(),
          age: parseInt(signupData.age),
          gender: signupData.gender,
        }
      }
      onAuthSuccess(updatedUserData)
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit}>
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold mb-2 text-gray-900">
                  Enter Phone Number
                </h2>
                <p className="text-sm text-gray-600">
                  We'll send you an OTP to verify your number
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border-2 border-r-0 border-petal-200 bg-gray-50 text-gray-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      setPhoneNumber(value)
                      setError(null)
                    }}
                    placeholder="Enter your phone number"
                    className="flex-1 px-4 py-3 rounded-r-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full px-6 py-3 bg-gradient-primary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold mb-2 text-gray-900">
                  Enter OTP
                </h2>
                <p className="text-sm text-gray-600">
                  We've sent a 4-digit code to +91 {phoneNumber}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 4}
                className="w-full px-6 py-3 bg-gradient-primary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-3"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setOtp(['', '', '', ''])
                  setError(null)
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold mb-2 text-gray-900">
                  Complete Your Profile
                </h2>
                <p className="text-sm text-gray-600">
                  Please provide a few details to complete your registration
                </p>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={signupData.age}
                    onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={signupData.gender}
                    onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-petal-200 focus:outline-none focus:border-petal-400 transition-all"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-primary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Saving...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

export default AuthModal

