/**
 * Prefetch route chunks on connection detection
 * Improves perceived performance on faster networks
 */

export const prefetchChunks = () => {
  // Only prefetch on fast connections
  if ('connection' in navigator) {
    const connection = navigator.connection
    const effectiveType = connection.effectiveType || '4g'
    
    // Skip prefetching on slow connections
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return
    }
  }

  // Prefetch route chunks for common page transitions
  const chunks = [
    '/assets/EventsPage-',
    '/assets/ClassesPage-',
    '/assets/BlogPage-',
  ]

  // Use requestIdleCallback to prefetch when browser is idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      chunks.forEach(chunk => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.as = 'script'
        link.href = chunk + '.js'
        document.head.appendChild(link)
      })
    }, { timeout: 5000 })
  }
}

/**
 * Optimize image loading with intersection observer
 */
export const optimizeImageLoading = () => {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-lazy]')
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute('data-lazy')
          imageObserver.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px'
    })
    
    images.forEach(img => imageObserver.observe(img))
  }
}

/**
 * Disable animations on slow connections
 */
export const optimizeAnimationsForNetwork = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection
    const effectiveType = connection.effectiveType || '4g'
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
      document.documentElement.style.setProperty('--animation-duration', '0ms')
      document.body.classList.add('reduced-motion')
    }
  }
}
