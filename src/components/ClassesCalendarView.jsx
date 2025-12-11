import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_BASE_URL } from '../apiConfig'
import PaymentModal from './PaymentModal'
import BookingSuccessModal from './BookingSuccessModal'
import { format, startOfDay, isBefore, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addDays, subDays } from 'date-fns'

const formatClassDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const istOffsetMs = 5.5 * 60 * 60 * 1000
    const adjustedDate = new Date(date.getTime() - istOffsetMs)
    
    return adjustedDate.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    })
  } catch {
    return ''
  }
}

const formatClassDateFull = (date) => {
  if (!date) return ''
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    })
  } catch {
    return ''
  }
}

const ClassesCalendarView = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const getCurrentISTDate = () => {
    const now = new Date()
    // Get current IST date string (YYYY-MM-DD)
    const istFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const istDateString = istFormatter.format(now)
    // Parse the IST date string and create a date at midnight
    // Since sessions are stored with IST times as UTC, we create dates in the same format
    const [year, month, day] = istDateString.split('-').map(Number)
    // Create date representing the IST date at midnight (stored as UTC, matching session storage format)
    const istDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    return startOfDay(istDate)
  }

  // Read filters from URL on mount
  const getInitialFilters = () => {
    const studioId = searchParams.get('studio') || ''
    const priceMin = searchParams.get('priceMin') || ''
    const priceMax = searchParams.get('priceMax') || ''
    return { studioId, priceMin, priceMax }
  }

  const [selectedDate, setSelectedDate] = useState(getCurrentISTDate())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [sessions, setSessions] = useState([])
  const [allSessions, setAllSessions] = useState([]) // Store all sessions for filtering
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [paymentResponse, setPaymentResponse] = useState(null)
  const [datesWithSessions, setDatesWithSessions] = useState(new Set())
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState(getInitialFilters())
  const dateSliderRef = useRef(null)
  const filterRef = useRef(null)

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFilterOpen])

  // Apply filters to sessions
  const applyFilters = useCallback((sessionsToFilter, currentFilters) => {
    let filtered = [...sessionsToFilter]

    // Filter by studio
    if (currentFilters.studioId) {
      filtered = filtered.filter(session => 
        session.studio?._id === currentFilters.studioId || 
        session.studio === currentFilters.studioId
      )
    }

    // Filter by price range
    if (currentFilters.priceMin) {
      const minPrice = parseFloat(currentFilters.priceMin)
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(session => (session.price || 0) >= minPrice)
      }
    }
    if (currentFilters.priceMax) {
      const maxPrice = parseFloat(currentFilters.priceMax)
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(session => (session.price || 0) <= maxPrice)
      }
    }

    setSessions(filtered)
  }, [])

  const fetchSessions = useCallback(async (date) => {
    try {
      setIsLoading(true)
      setError(null)
      const istFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      const dateStr = istFormatter.format(date)
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sessions/website/getActiveSessions?date=${dateStr}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load classes')
      }

      const data = await response.json()
      const fetchedSessions = Array.isArray(data.sessions) ? data.sessions : []
      setAllSessions(fetchedSessions) // Store all sessions
      // Apply filters to fetched sessions - use current filters state
      const currentFilters = filters
      let filtered = [...fetchedSessions]

      // Filter by studio
      if (currentFilters.studioId) {
        filtered = filtered.filter(session => 
          session.studio?._id === currentFilters.studioId || 
          session.studio === currentFilters.studioId
        )
      }

      // Filter by price range
      if (currentFilters.priceMin) {
        const minPrice = parseFloat(currentFilters.priceMin)
        if (!isNaN(minPrice)) {
          filtered = filtered.filter(session => (session.price || 0) >= minPrice)
        }
      }
      if (currentFilters.priceMax) {
        const maxPrice = parseFloat(currentFilters.priceMax)
        if (!isNaN(maxPrice)) {
          filtered = filtered.filter(session => (session.price || 0) <= maxPrice)
        }
      }

      setSessions(filtered)
    } catch (err) {
      console.error('Error fetching sessions:', err)
      setError('Unable to load classes right now. Please try again later.')
      setSessions([])
      setAllSessions([])
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchAllSessions = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sessions/website/getActiveSessions`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const datesSet = new Set()

        ;(data.sessions || []).forEach((session) => {
          if (session.date) {
            const sessionDate = new Date(session.date)
            const year = sessionDate.getUTCFullYear()
            const month = String(sessionDate.getUTCMonth() + 1).padStart(2, '0')
            const day = String(sessionDate.getUTCDate()).padStart(2, '0')
            const dateKey = `${year}-${month}-${day}`
            datesSet.add(dateKey)
          }
        })

        setDatesWithSessions(datesSet)
      }
    } catch (err) {
      console.error('Error fetching all sessions:', err)
    }
  }, [])

  // Update URL with filter parameters
  const updateURLFilters = useCallback((newFilters) => {
    const params = new URLSearchParams()
    if (newFilters.studioId) {
      params.set('studio', newFilters.studioId)
    }
    if (newFilters.priceMin) {
      params.set('priceMin', newFilters.priceMin)
    }
    if (newFilters.priceMax) {
      params.set('priceMax', newFilters.priceMax)
    }
    setSearchParams(params, { replace: true })
  }, [setSearchParams])

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value || ''
    }
    setFilters(newFilters)
    updateURLFilters(newFilters)
    // Apply filters to all sessions
    applyFilters(allSessions, newFilters)
  }, [filters, allSessions, applyFilters, updateURLFilters])

  // Clear all filters
  const clearFilters = useCallback(() => {
    const emptyFilters = { studioId: '', priceMin: '', priceMax: '' }
    setFilters(emptyFilters)
    setSearchParams({}, { replace: true })
    applyFilters(allSessions, emptyFilters)
  }, [allSessions, applyFilters, setSearchParams])

  // Get unique studios from all sessions
  const uniqueStudios = useMemo(() => {
    const studiosMap = new Map()
    allSessions.forEach(session => {
      if (session.studio?._id && session.studio?.studioName) {
        if (!studiosMap.has(session.studio._id)) {
          studiosMap.set(session.studio._id, {
            id: session.studio._id,
            name: session.studio.studioName
          })
        }
      }
    })
    return Array.from(studiosMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [allSessions])

  // Get price range from all sessions
  const priceRange = useMemo(() => {
    if (allSessions.length === 0) return { min: 0, max: 0 }
    const prices = allSessions.map(s => s.price || 0).filter(p => p > 0)
    if (prices.length === 0) return { min: 0, max: 0 }
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }, [allSessions])

  // Apply filters when allSessions or filters change
  useEffect(() => {
    if (allSessions.length > 0) {
      applyFilters(allSessions, filters)
    }
  }, [allSessions, filters, applyFilters])

  useEffect(() => {
    fetchSessions(selectedDate)
  }, [selectedDate, filters])

  useEffect(() => {
    fetchAllSessions()
  }, [fetchAllSessions])

  const handleDateSelect = (date) => {
    const currentIST = getCurrentISTDate()
    if (!isBefore(date, currentIST)) {
      setSelectedDate(date)
      setIsCalendarDialogOpen(false)
    }
  }

  const scrollToSelectedDate = () => {
    if (dateSliderRef.current) {
      const selectedElement = dateSliderRef.current.querySelector('[data-selected="true"]')
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }

  useEffect(() => {
    if (selectedDate) {
      setTimeout(scrollToSelectedDate, 100)
    }
  }, [selectedDate])

  const getDatesForSlider = () => {
    const dates = []
    const today = getCurrentISTDate()
    const startDate = subDays(today, 7)
    const endDate = addDays(today, 30)
    
    for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
      if (!isBefore(d, today)) {
        dates.push(d)
      }
    }
    return dates
  }

  const sliderDates = getDatesForSlider()

  const shouldDisableDate = (date) => {
    const currentIST = getCurrentISTDate()
    // Convert calendar date to IST date string for comparison
    const istFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const dateISTString = istFormatter.format(date)
    const currentISTString = istFormatter.format(currentIST)
    // Disable if date is before today (not including today)
    return dateISTString < currentISTString
  }

  const hasSessions = (date) => {
    const istFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const istDateKey = istFormatter.format(date)
    return datesWithSessions.has(istDateKey)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const firstDayOfWeek = monthStart.getDay()
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => null)

  return (
    <div>
      {/* Sticky Date Slider - Below Navbar (Mobile Only) */}
      <div className="lg:hidden sticky top-20 md:top-24 z-40 bg-white border-b border-primary-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <div 
              className="flex-1 overflow-x-auto scrollbar-hide" 
              ref={dateSliderRef}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory'
              }}
            >
              <div 
                className="flex gap-2 pb-2"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {sliderDates.map((date) => {
                  const isSelected = isSameDay(date, selectedDate)
                  const hasClass = hasSessions(date)
                  const isToday = isSameDay(date, getCurrentISTDate())
                  
                  return (
                    <button
                      key={date.toString()}
                      onClick={() => handleDateSelect(date)}
                      data-selected={isSelected}
                      style={{ scrollSnapAlign: 'center' }}
                      className={`
                        flex-shrink-0 flex flex-col items-center justify-center px-3 py-2.5 rounded-2xl min-w-[65px] transition-all
                        ${isSelected 
                          ? 'bg-gradient-primary shadow-lg' 
                          : isToday
                          ? 'bg-primary-100'
                          : 'bg-white border border-primary-200'
                        }
                      `}
                    >
                      <span className={`text-xs font-semibold uppercase ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                        {format(date, 'EEE')}
                      </span>
                      <span className={`text-lg font-bold ${isSelected ? 'text-black' : 'text-gray-900'}`}>
                        {format(date, 'd')}
                      </span>
                      {hasClass && (
                        <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-black' : 'bg-primary-500'}`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            <button
              onClick={() => setIsCalendarDialogOpen(true)}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <section className="relative py-12 md:py-20 bg-gradient-to-b from-white via-primary-50/40 to-white">
        <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 md:gap-8">
          <div className="hidden lg:block order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-6 sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 hover:bg-primary-50 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-heading font-bold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-primary-50 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, idx) => (
                  <div key={idx} className="text-center text-xs font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {paddingDays.map((_, idx) => (
                  <div key={`pad-${idx}`} className="aspect-square" />
                ))}
                {daysInMonth.map((day) => {
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, getCurrentISTDate())
                  const isDisabled = shouldDisableDate(day)
                  const hasClass = hasSessions(day)
                  const isCurrentMonth = isSameMonth(day, currentMonth)

                  return (
                    <button
                      key={day.toString()}
                      onClick={() => !isDisabled && handleDateSelect(day)}
                      disabled={isDisabled}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all relative
                        ${isSelected 
                          ? 'bg-gradient-primary text-white shadow-lg scale-105' 
                          : isToday
                          ? 'bg-primary-100 text-primary-700 font-bold'
                          : isDisabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-primary-50'
                        }
                        ${!isCurrentMonth ? 'opacity-40' : ''}
                      `}
                    >
                      {format(day, 'd')}
                      {hasClass && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 lg:p-8">
                {/* Header with Filter Button */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="hidden lg:block mb-2">
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
                        Active Classes for {formatClassDateFull(selectedDate)}
                      </h2>
                    </div>
                    <div className="lg:hidden">
                      <h2 className="text-lg lg:text-2xl md:text-3xl font-heading font-bold text-gray-900">
                        {formatClassDateFull(selectedDate)}
                      </h2>
                    </div>
                    {sessions.length > 0 && (
                      <p className="text-xs lg:text-base text-gray-600 mt-1">
                        {sessions.length} {sessions.length === 1 ? 'class' : 'classes'} available
                        {(filters.studioId || filters.priceMin || filters.priceMax) && ' (filtered)'}
                      </p>
                    )}
                  </div>
                  
                  {/* Filter Button */}
                  <div className="relative" ref={filterRef}>
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">Filter</span>
                      {(filters.studioId || filters.priceMin || filters.priceMax) && (
                        <span className="w-2 h-2 bg-petal-500 rounded-full"></span>
                      )}
                    </button>

                    {/* Filter Dropdown */}
                    {isFilterOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-heading font-bold text-gray-900">Filters</h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Studio Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Studio
                          </label>
                          <select
                            value={filters.studioId}
                            onChange={(e) => handleFilterChange('studioId', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-petal-400 transition-all bg-white"
                          >
                            <option value="">All Studios</option>
                            {uniqueStudios.map(studio => (
                              <option key={studio.id} value={studio.id}>
                                {studio.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price Range
                          </label>
                          <div className="flex gap-2 min-w-0">
                            <input
                              type="number"
                              placeholder="Min"
                              value={filters.priceMin}
                              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                              min={0}
                              className="flex-1 min-w-0 px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-petal-400 transition-all"
                            />
                            <input
                              type="number"
                              placeholder="Max"
                              value={filters.priceMax}
                              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                              min={0}
                              className="flex-1 min-w-0 px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-petal-400 transition-all"
                            />
                          </div>
                          {priceRange.max > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Range: ₹{priceRange.min} - ₹{priceRange.max}
                            </p>
                          )}
                        </div>

                        {/* Clear Filters */}
                        {(filters.studioId || filters.priceMin || filters.priceMax) && (
                          <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-all"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-gray-600 font-medium">
                      No active classes found for the selected date.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">
                      Found {sessions.length} active {sessions.length === 1 ? 'class' : 'classes'}
                    </p>
                    <div className="space-y-2 lg:space-y-3 max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {sessions.map((session, index) => (
                        <motion.div
                          key={session._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gradient-to-br from-white to-primary-50/30 rounded-lg lg:rounded-xl p-2.5 lg:p-4 border border-primary-100 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => {
                            navigate(`/classes/${session._id}`)
                          }}
                        >
                          <div className="flex gap-3 lg:gap-4">
                            {/* Image - Left Side (Optional) */}
                            {session.image && (
                              <img
                                src={session.image || session.class?.image || '/studio1.jpg'}
                                alt={session.className}
                                width={80}
                                height={80}
                                className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg flex-shrink-0"
                              />
                            )}

                            {/* Content - Right Side */}
                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-start justify-between mb-1.5 gap-2">
                                <h3 className="text-sm lg:text-base font-heading font-bold text-gray-900 flex-1 line-clamp-1">
                                  {session.className}
                                </h3>
                                <span className="text-sm lg:text-base font-heading font-bold text-primary-600 flex-shrink-0">
                                  ₹{session.price}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 mb-1.5">
                                <span className="px-2 py-0.5 bg-white/70 rounded-full text-xs font-semibold text-gray-700">
                                  {session.duration} min
                                </span>
                                <span className={`px-2 py-0.5 bg-white/70 rounded-full text-xs font-semibold ${
                                  session.availableSlots > 0 ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {session.availableSlots}/{session.slots} slots
                                </span>
                                {session.classType?.name && (
                                  <span className="px-2 py-0.5 bg-white/70 rounded-full text-xs font-semibold text-gray-700">
                                    {session.classType.name}
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 text-xs text-gray-600 mb-2">
                                <div className="flex items-center gap-1.5">
                                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="truncate">{formatClassDate(session.date)}</span>
                                </div>
                                {session.studio?.studioName && (
                                  <div className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="truncate">{session.studio.studioName}</span>
                                  </div>
                                )}
                                {session.instructor?.name && (
                                  <div className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="truncate">{session.instructor.name}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end gap-2 mt-auto">
                                <a
                                  href={`/classes/${session._id}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
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
                                  className="px-3 py-1.5 bg-white border border-primary-200 text-primary-700 rounded-lg text-xs font-semibold hover:bg-primary-50 transition-all"
                                >
                                  View Details
                                </a>
                                {session.availableSlots > 0 ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
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
                                    className="px-3 lg:px-4 py-1.5 bg-gradient-primary text-black text-xs font-semibold rounded-lg hover:shadow-lg transition-all"
                                  >
                                    Book Now
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-3 lg:px-4 py-1.5 bg-gray-300 text-gray-600 text-xs font-semibold rounded-lg cursor-not-allowed"
                                  >
                                    Sold Out
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <PaymentModal
        session={selectedSession}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedSession(null)
        }}
        onSuccess={(paymentResp, booking) => {
          setPaymentResponse(paymentResp)
          setBookingData(booking)
          setIsPaymentModalOpen(false)
          setIsSuccessModalOpen(true)
        }}
      />

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

      {/* Mobile Calendar Dialog */}
      {isCalendarDialogOpen && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCalendarDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsCalendarDialogOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-heading font-bold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="text-center text-xs font-semibold text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {paddingDays.map((_, idx) => (
                    <div key={`pad-${idx}`} className="aspect-square" />
                  ))}
                  {daysInMonth.map((day) => {
                    const isSelected = isSameDay(day, selectedDate)
                    const isToday = isSameDay(day, getCurrentISTDate())
                    const isDisabled = shouldDisableDate(day)
                    const hasClass = hasSessions(day)
                    const isCurrentMonth = isSameMonth(day, currentMonth)

                    return (
                      <button
                        key={day.toString()}
                        onClick={() => !isDisabled && handleDateSelect(day)}
                        disabled={isDisabled}
                        className={`
                          aspect-square rounded-lg text-sm font-medium transition-all relative
                          ${isSelected 
                            ? 'bg-gradient-primary text-white shadow-lg scale-105' 
                            : isToday
                            ? 'bg-primary-100 text-primary-700 font-bold'
                            : isDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-primary-50'
                          }
                          ${!isCurrentMonth ? 'opacity-40' : ''}
                        `}
                      >
                        {format(day, 'd')}
                        {hasClass && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
      </section>
    </div>
  )
}

export default ClassesCalendarView

