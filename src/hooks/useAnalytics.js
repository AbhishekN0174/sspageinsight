import { useEffect, useRef, useCallback } from 'react'
// Analytics functions are loaded dynamically to avoid bundling heavy analytics libs in the main chunk

/**
 * Custom hook for analytics tracking
 * @param {string} pageName - Name of the current page
 * @param {object} pageProperties - Additional properties for the page
 */
export const useAnalytics = (pageName, pageProperties = {}, options = {}) => {
  const { autoTrackPage = true } = options
  const cleanupRef = useRef(null)
  const previousPageRef = useRef(null)

  // Track page view on mount (analytics loaded lazily)
  useEffect(() => {
    if (!pageName || !autoTrackPage) return

    let mounted = true
    let timeCleanup = null

    import('../utils/analytics')
      .then((mod) => {
        if (!mounted) return
        // track navigation flow if previous page exists
        const prevPage = previousPageRef.current
        if (prevPage && prevPage !== pageName && mod.trackNavigationFlow) {
          mod.trackNavigationFlow(pageName, prevPage)
        }
        previousPageRef.current = pageName

        if (mod.trackPageView) mod.trackPageView(pageName, pageProperties)

        if (mod.startTimeTracking) {
          timeCleanup = mod.startTimeTracking(pageName)
        }
      })
      .catch(() => {})

    cleanupRef.current = () => {
      if (timeCleanup) timeCleanup()
    }

    return () => {
      mounted = false
      if (cleanupRef.current) cleanupRef.current()
      // Try to stop time tracking if available
      import('../utils/analytics')
        .then((mod) => {
          if (mod.stopTimeTracking) mod.stopTimeTracking()
        })
        .catch(() => {})
    }
  }, [pageName, autoTrackPage, JSON.stringify(pageProperties)])

  // Track custom event
  const track = useCallback((eventName, properties = {}) => {
    import('../utils/analytics')
      .then((mod) => {
        if (mod.trackEvent) {
          mod.trackEvent(eventName, {
            page_name: pageName,
            ...properties,
          })
        }
      })
      .catch(() => {})
  }, [pageName])

  // Track button click
  const trackClick = useCallback((buttonName, properties = {}) => {
    import('../utils/analytics')
      .then((mod) => {
        if (mod.trackButtonClick) {
          mod.trackButtonClick(buttonName, {
            page_name: pageName,
            ...properties,
          })
        }
      })
      .catch(() => {})
  }, [pageName])

  // Track link click
  const trackLink = useCallback((linkName, linkUrl, properties = {}) => {
    import('../utils/analytics')
      .then((mod) => {
        if (mod.trackLinkClick) {
          mod.trackLinkClick(linkName, linkUrl, {
            page_name: pageName,
            ...properties,
          })
        }
      })
      .catch(() => {})
  }, [pageName])

  return {
    track,
    trackClick,
    trackLink,
    trackPageView: () => import('../utils/analytics').then(mod => mod.trackPageView && mod.trackPageView(pageName, pageProperties)).catch(() => {}),
  }
}

export default useAnalytics

