import EventsSection from './EventsSection'
import { useAnalytics } from '../hooks/useAnalytics'

const EventsPage = () => {
  const analytics = useAnalytics('Events', { source: 'events-page' })

  return (
    <div className="pt-24 md:pt-28">
      <EventsSection analytics={analytics} sourcePage="Events" />
    </div>
  )
}

export default EventsPage
