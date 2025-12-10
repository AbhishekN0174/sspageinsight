import { useEffect, useRef, useCallback } from 'react'
import {
  trackPageView,
  trackEvent,
  trackButtonClick,
  trackLinkClick,
  startTimeTracking,
  stopTimeTracking,
  trackNavigationFlow,
} from '../utils/analytics'

/**
 * Custom hook for analytics tracking
 * @param {string} pageName - Name of the current page
 * @param {object} pageProperties - Additional properties for the page
 */
export const useAnalytics = (pageName, pageProperties = {}, options = {}) => {
  const { autoTrackPage = true } = options
  const cleanupRef = useRef(null)
  const previousPageRef = useRef(null)

  // Track page view on mount
  useEffect(() => {
    if (!pageName || !autoTrackPage) return

    // Track navigation flow
    const prevPage = previousPageRef.current
    if (prevPage && prevPage !== pageName) {
      trackNavigationFlow(pageName, prevPage)
    }
    previousPageRef.current = pageName

    // Track page view
    trackPageView(pageName, pageProperties)

    // Start time tracking
    const timeCleanup = startTimeTracking(pageName)

    cleanupRef.current = timeCleanup

    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
      stopTimeTracking()
    }
  }, [pageName, autoTrackPage, JSON.stringify(pageProperties)])

  // Track custom event
  const track = useCallback((eventName, properties = {}) => {
    trackEvent(eventName, {
      page_name: pageName,
      ...properties,
    })
  }, [pageName])

  // Track button click
  const trackClick = useCallback((buttonName, properties = {}) => {
    trackButtonClick(buttonName, {
      page_name: pageName,
      ...properties,
    })
  }, [pageName])

  // Track link click
  const trackLink = useCallback((linkName, linkUrl, properties = {}) => {
    trackLinkClick(linkName, linkUrl, {
      page_name: pageName,
      ...properties,
    })
  }, [pageName])

  return {
    track,
    trackClick,
    trackLink,
    trackPageView: () => trackPageView(pageName, pageProperties),
  }
}

export default useAnalytics

