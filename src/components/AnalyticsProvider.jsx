import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MIXPANEL_TOKEN } from '../config/analytics'

const AnalyticsProvider = ({ children }) => {
  const location = useLocation()
  const previousPathRef = useRef(null)

  const analyticsRef = useRef(null)

  // Initialize analytics on mount (dynamically import to avoid bundling mixpanel in main chunk)
  useEffect(() => {
    if (!MIXPANEL_TOKEN) {
      console.warn('MIXPANEL_TOKEN not found in environment variables')
      return
    }

    let mounted = true
    // Defer loading analytics until after first paint
    const t = setTimeout(() => {
      import('../utils/analytics')
        .then((mod) => {
          if (!mounted) return
          analyticsRef.current = mod
          if (MIXPANEL_TOKEN && mod.initAnalytics) {
            mod.initAnalytics(MIXPANEL_TOKEN)
          }
        })
        .catch((err) => {
          console.error('Failed to load analytics module:', err)
        })
    }, 2000)

    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [])

  // Track page views on route change
  useEffect(() => {
    // Stop previous time tracking (if analytics loaded dynamically)
    if (analyticsRef.current && analyticsRef.current.stopTimeTracking) {
      analyticsRef.current.stopTimeTracking()
    }

    // Get page name from path
    const getPageName = (pathname) => {
      if (pathname === '/') return 'Home'
      if (pathname.startsWith('/events/')) return 'Event Detail'
      if (pathname === '/events') return 'Events'
      if (pathname.startsWith('/classes/')) return 'Class Detail'
      if (pathname === '/classes') return 'Classes'
      if (pathname.startsWith('/blog/')) return 'Blog Detail'
      if (pathname === '/blog') return 'Blog'
      if (pathname === '/about') return 'About'
      if (pathname === '/privacy') return 'Privacy Policy'
      if (pathname === '/terms') return 'Terms & Conditions'
      return pathname.replace('/', '').replace(/-/g, ' ') || 'Unknown'
    }

    const pageName = getPageName(location.pathname)
    const previousPage = previousPathRef.current
      ? getPageName(previousPathRef.current)
      : null

    // Track with Mixpanel (if analytics module loaded)
    if (analyticsRef.current) {
      const { trackNavigationFlow, trackPageView } = analyticsRef.current
      if (previousPage && previousPage !== pageName && trackNavigationFlow) {
        trackNavigationFlow(pageName, previousPage)
      }
      if (trackPageView) {
        trackPageView(pageName, {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        })
      }
    }

    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-QGL9W73G3B', {
        page_path: location.pathname + location.search + location.hash,
        page_title: pageName,
      })
    }

    // Track with Meta Pixel
    // Note: Meta Pixel uses 'PageView' as the standard event name
    // The actual page name is included in the event properties (content_name)
    if (typeof window !== 'undefined' && window.fbq) {
      // Always track PageView
      window.fbq('track', 'PageView', {
        content_name: pageName,
        content_category: 'Page View',
        page_path: location.pathname,
        page_url: window.location.href,
      })

      // Track custom events for specific pages
      if (location.pathname === '/events' || location.pathname.startsWith('/events/')) {
        // Custom event for Events page
        window.fbq('trackCustom', 'ViewEvents', {
          content_name: pageName,
          content_category: 'Events',
          page_path: location.pathname,
          page_url: window.location.href,
        })
      }

      if (location.pathname === '/classes' || location.pathname.startsWith('/classes/')) {
        // Custom event for Classes page
        window.fbq('trackCustom', 'ViewClasses', {
          content_name: pageName,
          content_category: 'Classes',
          page_path: location.pathname,
          page_url: window.location.href,
        })
      }
    }

    // Update previous path
    previousPathRef.current = location.pathname
  }, [location.pathname, location.search, location.hash])

  return <>{children}</>
}

export default AnalyticsProvider

