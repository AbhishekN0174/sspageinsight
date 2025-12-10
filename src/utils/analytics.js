import mixpanel from 'mixpanel-browser'

// Initialize Mixpanel
let isInitialized = false

export const initAnalytics = (token) => {
  if (!token) {
    console.warn('Mixpanel token not provided. Analytics will not be initialized.')
    return
  }

  try {
    mixpanel.init(token, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: false, 
      persistence: 'localStorage',
      ignore_dnt: true, 
    })
    isInitialized = true
    console.log('Mixpanel analytics initialized')
  } catch (error) {
    console.error('Failed to initialize Mixpanel:', error)
  }
}

// Get or create anonymous user ID
const getAnonymousId = () => {
  let anonymousId = localStorage.getItem('sweatsocial_anonymous_id')
  
  if (!anonymousId) {
    // Generate a unique anonymous ID
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('sweatsocial_anonymous_id', anonymousId)
  }
  
  return anonymousId
}

// Identify user with anonymous ID
const identifyUser = () => {
  if (!isInitialized) return
  
  const anonymousId = getAnonymousId()
  mixpanel.identify(anonymousId)
  
  // Check if we have a stored email
  const storedEmail = localStorage.getItem('sweatsocial_user_email')
  
  // Set user properties
  const userProperties = {
    anonymous_id: anonymousId,
    platform: 'web',
    first_seen: localStorage.getItem('sweatsocial_first_seen') || new Date().toISOString(),
  }
  
  // If we have an email, include it
  if (storedEmail) {
    userProperties.$email = storedEmail
    userProperties.email = storedEmail
    userProperties.has_email = true
    userProperties.$name = storedEmail.split('@')[0] // Use email prefix as name
  } else {
    userProperties.$name = 'Anonymous User'
  }
  
  mixpanel.people.set(userProperties)
  
  if (!localStorage.getItem('sweatsocial_first_seen')) {
    localStorage.setItem('sweatsocial_first_seen', new Date().toISOString())
  }
}

// Track page view
export const trackPageView = (pageName, properties = {}) => {
  if (!isInitialized) return
  
  identifyUser()
  
  const pageProperties = {
    page_name: pageName,
    page_path: window.location.pathname,
    page_url: window.location.href,
    page_title: document.title,
    timestamp: new Date().toISOString(),
    ...properties,
  }
  
  // Use the page name itself as the event name so funnels are easy to read,
  // e.g. "Home", "Events", "Blog Detail"
  mixpanel.track(pageName, pageProperties)
}

// Track custom event
export const trackEvent = (eventName, properties = {}) => {
  if (!isInitialized) return
  
  identifyUser()
  
  const eventProperties = {
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    page_url: window.location.href,
    ...properties,
  }
  
  mixpanel.track(eventName, eventProperties)
}

// Track time spent on page
let timeSpentInterval = null
let pageStartTime = null
let lastActiveTime = null

export const startTimeTracking = (pageName) => {
  if (!isInitialized) return
  
  // Clear any existing interval
  if (timeSpentInterval) {
    clearInterval(timeSpentInterval)
  }
  
  pageStartTime = Date.now()
  lastActiveTime = Date.now()
  
  // Track time spent every 10 seconds
  timeSpentInterval = setInterval(() => {
    if (!isInitialized) return
    
    const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000) // in seconds
    const activeTime = Math.floor((Date.now() - lastActiveTime) / 1000)
    
    // Track time spent event every 30 seconds
    if (timeSpent % 30 === 0) {
      trackEvent('Time Spent', {
        page_name: pageName,
        time_spent_seconds: timeSpent,
        active_time_seconds: activeTime,
        page_path: window.location.pathname,
      })
    }
  }, 10000) // Check every 10 seconds
  
  // Track when user exits the website (tab close, refresh, or navigate away)
  const handleBeforeUnload = () => {
    if (!isInitialized || !pageStartTime) return
    
    const totalTimeSpent = Math.floor((Date.now() - pageStartTime) / 1000)
    
    // Generic website exit event (no per-page exit names like "Home - Exit")
    trackEvent('Website Exit', {
      page_name: pageName,
      time_spent_seconds: totalTimeSpent,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
    })
  }
  
  // Update last active time on user interaction
  const updateActiveTime = () => {
    lastActiveTime = Date.now()
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('mousemove', updateActiveTime)
  window.addEventListener('keydown', updateActiveTime)
  window.addEventListener('scroll', updateActiveTime)
  window.addEventListener('click', updateActiveTime)
  
  return () => {
    if (timeSpentInterval) {
      clearInterval(timeSpentInterval)
    }
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('mousemove', updateActiveTime)
    window.removeEventListener('keydown', updateActiveTime)
    window.removeEventListener('scroll', updateActiveTime)
    window.removeEventListener('click', updateActiveTime)
  }
}

export const stopTimeTracking = () => {
  if (timeSpentInterval) {
    clearInterval(timeSpentInterval)
    timeSpentInterval = null
  }
  pageStartTime = null
  lastActiveTime = null
}

// Track navigation flow (from page to page)
let previousPage = null

export const trackNavigationFlow = (currentPage, previousPageName = null) => {
  if (!isInitialized) return
  
  if (previousPageName || previousPage) {
    trackEvent('Navigation Flow', {
      from_page: previousPageName || previousPage,
      to_page: currentPage,
      from_path: previousPage ? window.location.pathname : null,
      to_path: window.location.pathname,
      timestamp: new Date().toISOString(),
    })
  }
  
  previousPage = currentPage
}

// Track button clicks
export const trackButtonClick = (buttonName, properties = {}) => {
  if (!isInitialized) return
  
  trackEvent(buttonName || 'Button Click', {
    event_type: 'button_click',
    button_name: buttonName,
    page_path: window.location.pathname,
    page_url: window.location.href,
    ...properties,
  })
}

// Track link clicks
export const trackLinkClick = (linkName, linkUrl, properties = {}) => {
  if (!isInitialized) return
  
  // Ensure we send the full absolute link URL even if a relative path is provided
  let resolvedLinkUrl = linkUrl
  try {
    resolvedLinkUrl = new URL(linkUrl, window.location.origin).href
  } catch {
    // If URL construction fails, fall back to the original value
    resolvedLinkUrl = linkUrl
  }
  
  trackEvent(linkName || 'Link Click', {
    event_type: 'link_click',
    link_name: linkName,
    link_url: resolvedLinkUrl,
    page_path: window.location.pathname,
    page_url: window.location.href,
    ...properties,
  })
}

// Set user properties
export const setUserProperties = (properties) => {
  if (!isInitialized) return
  
  identifyUser()
  mixpanel.people.set(properties)
}

// Update anonymous user with email
export const identifyUserWithEmail = (email, additionalProperties = {}) => {
  if (!isInitialized) return
  
  if (!email || !email.includes('@')) {
    console.warn('Invalid email provided for user identification')
    return
  }
  
  const anonymousId = getAnonymousId()
  
  // Identify user with email (this links the anonymous ID to the email)
  mixpanel.identify(anonymousId)
  
  // Set user properties including email
  mixpanel.people.set({
    $email: email,
    $name: additionalProperties.name || email.split('@')[0], // Use name from properties or email prefix
    email: email,
    anonymous_id: anonymousId,
    platform: 'web',
    has_email: true,
    email_provided_at: new Date().toISOString(),
    first_seen: localStorage.getItem('sweatsocial_first_seen') || new Date().toISOString(),
    ...additionalProperties,
  })
  
  // Store email in localStorage for future reference
  localStorage.setItem('sweatsocial_user_email', email)
  
  // Track that user provided email
  trackEvent('Email Provided', {
    email: email,
    source: additionalProperties.source || 'unknown',
    page_path: window.location.pathname,
  })
}

// Increment user properties
export const incrementUserProperty = (property, value = 1) => {
  if (!isInitialized) return
  
  identifyUser()
  mixpanel.people.increment(property, value)
}

// Reset analytics (useful for testing)
export const resetAnalytics = () => {
  if (!isInitialized) return
  mixpanel.reset()
  localStorage.removeItem('sweatsocial_anonymous_id')
  localStorage.removeItem('sweatsocial_first_seen')
}

// Track Meta Pixel InitiateCheckout event (when user clicks "Book Now")
export const trackMetaPixelInitiateCheckout = (item, properties = {}) => {
  if (typeof window === 'undefined' || !window.fbq) return

  const isSession = !!item?.className
  const itemName = item?.eventName || item?.className || (isSession ? 'Class' : 'Event')
  const itemPrice = item?.price || 0

  window.fbq('track', 'InitiateCheckout', {
    content_name: itemName,
    content_category: isSession ? 'Class' : 'Event',
    content_ids: [item?._id || ''],
    value: itemPrice,
    currency: 'INR',
    num_items: 1,
    ...properties,
  })
}

// Track Meta Pixel ViewContent event (when user clicks "View Details")
export const trackMetaPixelViewContent = (item, properties = {}) => {
  if (typeof window === 'undefined' || !window.fbq) return

  const isSession = !!item?.className
  const itemName = item?.eventName || item?.className || (isSession ? 'Class' : 'Event')
  const itemPrice = item?.price || 0

  window.fbq('track', 'ViewContent', {
    content_name: itemName,
    content_category: isSession ? 'Class' : 'Event',
    content_ids: [item?._id || ''],
    value: itemPrice,
    currency: 'INR',
    ...properties,
  })
}

export default {
  init: initAnalytics,
  trackPageView,
  trackEvent,
  trackButtonClick,
  trackLinkClick,
  trackNavigationFlow,
  trackMetaPixelInitiateCheckout,
  trackMetaPixelViewContent,
  startTimeTracking,
  stopTimeTracking,
  setUserProperties,
  identifyUserWithEmail,
  incrementUserProperty,
  reset: resetAnalytics,
}

