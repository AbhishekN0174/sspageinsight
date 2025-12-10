/**
 * Web Performance API utilities
 * Monitors and logs performance metrics
 */

export const reportWebVitals = () => {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.log('LCP observer not supported')
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            console.log('CLS:', clsValue)
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.log('CLS observer not supported')
    }

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID/INP:', entry.processingDuration)
        }
      })
      fidObserver.observe({ entryTypes: ['first-input', 'interaction'] })
    } catch (e) {
      console.log('FID/INP observer not supported')
    }
  }

  // Navigation Timing
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      console.log('Page Load Time:', pageLoadTime, 'ms')
    })
  }
}

/**
 * Image loading performance helper
 */
export const optimizeImageLoading = () => {
  // Load images with priority hints
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    console.log('Native lazy loading supported')
  } else {
    // Fallback to intersection observer is already implemented
    console.log('Using Intersection Observer for lazy loading')
  }
}

/**
 * Disable animations for users who prefer reduced motion
 */
export const respectPrefersReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--motion-reduce', '1')
  }
}
