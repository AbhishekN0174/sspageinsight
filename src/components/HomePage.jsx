import { lazy, Suspense } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

const HeroSection = lazy(() => import('./HeroSection'))
const FeatureShowcase = lazy(() => import('./FeatureShowcase'))
const CommunitySection = lazy(() => import('./CommunitySection'))
const StudiosGallery = lazy(() => import('./StudiosGallery'))
const MapSection = lazy(() => import('./MapSection'))
const BlogSection = lazy(() => import('./BlogSection'))
const FinalCTA = lazy(() => import('./FinalCTA'))

// No loading fallback - sections load instantly without spinners
// This improves perceived performance and prevents jank
const NoFallback = null

const HomePage = () => {
  const analytics = useAnalytics('Home')

  return (
    <>
      <Suspense fallback={NoFallback}>
        <HeroSection analytics={analytics} />
      </Suspense>

      <Suspense fallback={NoFallback}>
        <FeatureShowcase />
      </Suspense>

      <Suspense fallback={NoFallback}>
        <CommunitySection />
      </Suspense>

      <Suspense fallback={NoFallback}>
        <StudiosGallery />
      </Suspense>

      <Suspense fallback={NoFallback}>
        <MapSection />
      </Suspense>

      <Suspense fallback={NoFallback}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={NoFallback}>
        <FinalCTA analytics={analytics} />
      </Suspense>
    </>
  )
}

export default HomePage
