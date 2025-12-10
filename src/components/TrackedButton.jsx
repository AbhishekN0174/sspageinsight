import { useAnalytics } from '../hooks/useAnalytics'

/**
 * A button component that automatically tracks clicks
 * Usage: <TrackedButton buttonName="Get Started" onClick={handleClick}>Get Started</TrackedButton>
 */
const TrackedButton = ({ 
  buttonName, 
  children, 
  onClick, 
  className = '',
  pageName = null,
  ...props 
}) => {
  const analytics = useAnalytics(pageName || 'Unknown', {}, { autoTrackPage: false })

  const handleClick = (e) => {
    // Track the button click
    analytics.trackClick(buttonName, {
      button_text: typeof children === 'string' ? children : buttonName,
    })

    // Call the original onClick if provided
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default TrackedButton

