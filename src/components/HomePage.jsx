import { lazy, Suspense } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

const HeroSection = lazy(() => import('./HeroSection'))
const FeatureShowcase = lazy(() => import('./FeatureShowcase'))
const CommunitySection = lazy(() => import('./CommunitySection'))
const StudiosGallery = lazy(() => import('./StudiosGallery'))
const MapSection = lazy(() => import('./MapSection'))
const BlogSection = lazy(() => import('./BlogSection'))
const FinalCTA = lazy(() => import('./FinalCTA'))

const SectionFallback = ({ height = 200 }) => (
  <div style={{ minHeight: height }} className="flex items-center justify-center">
    <div className="w-10 h-10 bg-petal-200 rounded-full animate-pulse" />
  </div>
)

const HomePage = () => {
  const analytics = useAnalytics('Home')

  return (
    <>
      <Suspense fallback={<SectionFallback height={600} />}>
        <HeroSection analytics={analytics} />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FeatureShowcase />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CommunitySection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <StudiosGallery />
      </Suspense>

      <Suspense fallback={<SectionFallback height={500} />}>
        <MapSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={<SectionFallback height={300} />}>
        <FinalCTA analytics={analytics} />
      </Suspense>
    </>
  )
}

export default HomePage
