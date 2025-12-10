import HeroSection from './HeroSection'
import FeatureShowcase from './FeatureShowcase'
import CommunitySection from './CommunitySection'
import StudiosGallery from './StudiosGallery'
import MapSection from './MapSection'
import BlogSection from './BlogSection'
import FinalCTA from './FinalCTA'
import { useAnalytics } from '../hooks/useAnalytics'

const HomePage = () => {
  const analytics = useAnalytics('Home')

  return (
    <>
      <HeroSection analytics={analytics} />
      <FeatureShowcase />
      <CommunitySection />
      <StudiosGallery />
      <MapSection />
      <BlogSection />
      <FinalCTA analytics={analytics} />
    </>
  )
}

export default HomePage
