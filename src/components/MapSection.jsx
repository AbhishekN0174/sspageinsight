import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useCallback } from 'react'
import { useThrottle } from '../hooks/usePerformance'
import { API_BASE_URL } from '../apiConfig'

const LocationCard = ({ location, index, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-md border border-petal-100 cursor-pointer hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-petal-400 to-petal-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{location.name}</h3>
          <p className="text-sm text-gray-600">
            {location.studioCount ? `${location.studioCount} Studios` : 'Partner Studio'}
          </p>
        </div>
        <svg
          className="w-5 h-5 text-petal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

// City Icon Component (larger, more prominent)
const CityIcon = ({ name, position, color, delay, onClick, studioCount }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${hovered ? 1.15 : 1})`,
        animation: `float 3s ease-in-out ${delay}s infinite`,
        zIndex: hovered ? 200 : 100
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
          style={{
            background: hovered ? `linear-gradient(135deg, ${color} 0%, #db2777 100%)` : color,
            boxShadow: hovered ? `0 12px 40px ${color}90` : `0 6px 20px ${color}70`,
          }}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>

        <div className={`mt-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl border-2 border-petal-400 transition-all ${hovered ? 'scale-110' : ''}`}>
          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{name}</p>
          {studioCount > 0 && (
            <p className="text-xs text-petal-600 font-semibold mt-0.5">{studioCount} Studios</p>
          )}
        </div>

        <div
          className="w-1 h-8 -mt-1"
          style={{
            background: `linear-gradient(to bottom, ${color}, transparent)`,
          }}
        />
      </div>
    </div>
  )
}

// Studio Icon Component (smaller, appears when city is clicked)
const StudioIcon = ({ name, position, color, delay, onClick, address }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${hovered ? 1.1 : 0.9})`,
        animation: `float 2s ease-in-out ${delay}s infinite`,
        zIndex: 50
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
          style={{
            background: hovered ? `linear-gradient(135deg, ${color} 0%, #db2777 100%)` : color,
            boxShadow: hovered ? `0 6px 20px ${color}80` : `0 3px 10px ${color}60`,
          }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>

        {hovered && (
          <div className="mt-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-petal-300">
            <p className="text-xs font-semibold text-gray-900 whitespace-nowrap">{name}</p>
          </div>
        )}

        <div
          className="w-0.5 h-4 -mt-1"
          style={{
            background: `linear-gradient(to bottom, ${color}, transparent)`,
          }}
        />
      </div>
    </div>
  )
}

const MapSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const [isMobile, setIsMobile] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedStudio, setSelectedStudio] = useState(null)
  const [cities, setCities] = useState([])
  const [studios, setStudios] = useState([])
  const [loading, setLoading] = useState(true)

  // Throttled resize handler
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const throttledResize = useThrottle(handleResize, 150)

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', throttledResize, { passive: true })

    return () => window.removeEventListener('resize', throttledResize)
  }, [handleResize, throttledResize])

  // Convert lat/long to map position percentages with more spread
  // Bangalore approximate bounds: lat 12.8-13.1, long 77.4-77.8
  const convertCoordinatesToPosition = (longitude, latitude, spreadFactor = 1) => {
    const minLat = 12.8
    const maxLat = 13.1
    const minLng = 77.4
    const maxLng = 77.8

    if (!longitude || !latitude || longitude === 0 || latitude === 0) {
      return null
    }

    // Convert to percentage with spread factor to avoid clustering
    const x = ((longitude - minLng) / (maxLng - minLng)) * 100
    const y = 100 - ((latitude - minLat) / (maxLat - minLat)) * 100

    // Add spread to avoid clustering - spread studios around their city center
    const spreadX = (Math.random() - 0.5) * 8 * spreadFactor
    const spreadY = (Math.random() - 0.5) * 8 * spreadFactor

    return {
      x: `${Math.max(8, Math.min(92, x + spreadX))}%`,
      y: `${Math.max(8, Math.min(92, y + spreadY))}%`
    }
  }

  // Main Bangalore locations with better spacing - spread across entire map
  const mainLocations = {
    'Koramangala': { x: '25%', y: '70%' },      // Bottom left
    'HSR': { x: '70%', y: '65%' },              // Bottom right
    'Indiranagar': { x: '60%', y: '20%' },      // Top right
    'JP Nagar': { x: '20%', y: '75%' },          // Far bottom left
    'Domlur': { x: '50%', y: '45%' },           // Center
    'Frazer Town': { x: '35%', y: '15%' },      // Top left
    'Benson Town': { x: '40%', y: '18%' },      // Top center-left
    'Brookefield': { x: '75%', y: '35%' },      // Top right-center
    'Marathahalli': { x: '80%', y: '50%' },     // Middle right
    'Bellandur': { x: '65%', y: '80%' },        // Bottom right-center
    'Yelahanka': { x: '15%', y: '10%' },        // Top far left
  }

  const getPositionFromAddress = (address, city) => {
    if (!address && !city) return null

    const searchText = (address || city || '').toLowerCase()
    
    for (const [location, position] of Object.entries(mainLocations)) {
      if (searchText.includes(location.toLowerCase())) {
        return position
      }
    }

    return null
  }

  // Extract area name from address - prioritize main locations
  const extractAreaName = (address, city) => {
    if (!address) return city || 'Bangalore'
    
    const addressLower = address.toLowerCase()
    
    // First check for main locations
    for (const location of Object.keys(mainLocations)) {
      if (addressLower.includes(location.toLowerCase())) {
        return location
      }
    }
    
    // Check for specific studio names mentioned by user
    const mainStudios = {
      'purple pilates': 'HSR',
      'dizzyduck': 'Koramangala',
      'stretch pilates': 'Benson Town',
      'house of pilates': 'JP Nagar',
      'the studio': 'Domlur',
      'bellandur': 'Bellandur',
      'yelahanka': 'Yelahanka',
    }
    
    for (const [studioName, location] of Object.entries(mainStudios)) {
      if (addressLower.includes(studioName)) {
        return location
      }
    }
    
    // If no main location found, return null to filter out
    return null
  }

  const cityColors = [
    '#ec4899', '#be185d', '#f472b6', '#db2777', '#f9a8d4',
    '#ec4899', '#be185d', '#f472b6', '#db2777', '#f9a8d4'
  ]

  const studioColors = [
    '#f472b6', '#f9a8d4', '#ec4899', '#db2777', '#be185d'
  ]

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_BASE_URL}/api/v1/studios/getAllStudios?page=1&pageSize=50`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load studios')
        }

        const data = await response.json()
        const allStudios = data.studios || data.data || []

        // Filter for active Bengaluru studios
        const bengaluruStudios = allStudios.filter(studio => 
          studio.isActive && 
          studio.city && 
          (studio.city.toLowerCase().includes('bengaluru') || 
           studio.city.toLowerCase().includes('bangalore'))
        )

        // Group studios by area/city
        const studiosByArea = {}
        
        bengaluruStudios.forEach((studio) => {
          const areaName = extractAreaName(studio.address, studio.city)
          
          if (!studiosByArea[areaName]) {
            studiosByArea[areaName] = []
          }
          
          studiosByArea[areaName].push(studio)
        })

        // Create city markers - only show main locations (6-7)
        const cityMarkers = Object.entries(studiosByArea)
          .filter(([area, studios]) => {
            // Only include if area is in mainLocations
            return studios.length > 0 && mainLocations[area]
          })
          .slice(0, 11) // Limit to 11 main locations (including Yelahanka)
          .map(([areaName, areaStudios], index) => {
            // Get position from mainLocations (predefined positions for better spacing)
            let position = mainLocations[areaName]
            
            // If not in mainLocations, try coordinates but use main location position as base
            if (!position) {
              const firstStudio = areaStudios[0]
              if (firstStudio.location && firstStudio.location.coordinates) {
                const [lng, lat] = firstStudio.location.coordinates
                position = convertCoordinatesToPosition(lng, lat, 0)
              }
            }
            
            // Skip if no position found
            if (!position) return null

            return {
              id: `city-${index}`,
              name: areaName,
              position,
              color: cityColors[index % cityColors.length],
              delay: index * 0.15,
              studioCount: areaStudios.length,
              studios: areaStudios
            }
          })
          .filter(city => city !== null)

        setCities(cityMarkers)
        setStudios(bengaluruStudios)
      } catch (error) {
        console.error('Error fetching studios:', error)
        // Fallback to main 9-10 locations - spread across map
        setCities([
          {
            id: 'city-1',
            name: 'Koramangala',
            position: { x: '25%', y: '70%' },
            color: '#ec4899',
            delay: 0,
            studioCount: 2,
            studios: []
          },
          {
            id: 'city-2',
            name: 'HSR',
            position: { x: '70%', y: '65%' },
            color: '#be185d',
            delay: 0.15,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-3',
            name: 'Indiranagar',
            position: { x: '60%', y: '20%' },
            color: '#f472b6',
            delay: 0.3,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-4',
            name: 'JP Nagar',
            position: { x: '20%', y: '75%' },
            color: '#db2777',
            delay: 0.45,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-5',
            name: 'Domlur',
            position: { x: '50%', y: '45%' },
            color: '#f9a8d4',
            delay: 0.6,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-6',
            name: 'Frazer Town',
            position: { x: '35%', y: '15%' },
            color: '#ec4899',
            delay: 0.75,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-7',
            name: 'Benson Town',
            position: { x: '40%', y: '18%' },
            color: '#be185d',
            delay: 0.9,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-8',
            name: 'Brookefield',
            position: { x: '75%', y: '35%' },
            color: '#f472b6',
            delay: 1.05,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-9',
            name: 'Marathahalli',
            position: { x: '80%', y: '50%' },
            color: '#db2777',
            delay: 1.2,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-10',
            name: 'Bellandur',
            position: { x: '65%', y: '80%' },
            color: '#f9a8d4',
            delay: 1.35,
            studioCount: 1,
            studios: []
          },
          {
            id: 'city-11',
            name: 'Yelahanka',
            position: { x: '15%', y: '10%' },
            color: '#ec4899',
            delay: 1.5,
            studioCount: 1,
            studios: []
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStudios()
  }, [])

  const handleCityClick = (city) => {
    if (selectedCity && selectedCity.id === city.id) {
      // Deselect if clicking the same city
      setSelectedCity(null)
      setSelectedStudio(null)
    } else {
      setSelectedCity(city)
      setSelectedStudio(null)
    }
  }

  const handleStudioClick = (studio) => {
    setSelectedStudio(studio)
  }

  // Get studios for selected city with spread positions
  const getStudiosForCity = () => {
    if (!selectedCity) return []
    
    return selectedCity.studios.map((studio, index) => {
      let position = null
      
      // Try coordinates first
      if (studio.location && studio.location.coordinates) {
        const [lng, lat] = studio.location.coordinates
        position = convertCoordinatesToPosition(lng, lat, 1.5) // More spread for studios
      }
      
      // If no coordinates, spread around city center
      if (!position && selectedCity.position) {
        const cityX = parseFloat(selectedCity.position.x)
        const cityY = parseFloat(selectedCity.position.y)
        
        // Spread studios in a circle around city center
        const angle = (index / selectedCity.studios.length) * Math.PI * 2
        const radius = 4 + (index % 3) * 2 // Vary radius
        const spreadX = Math.cos(angle) * radius
        const spreadY = Math.sin(angle) * radius
        
        position = {
          x: `${Math.max(8, Math.min(92, cityX + spreadX))}%`,
          y: `${Math.max(8, Math.min(92, cityY + spreadY))}%`
        }
      }
      
      if (!position) return null
      
      return {
        id: studio._id,
        name: studio.studioName,
        address: studio.address || studio.city,
        position,
        color: studioColors[index % studioColors.length],
        delay: index * 0.1,
        studio: studio
      }
    }).filter(studio => studio !== null)
  }

  const cityStudios = getStudiosForCity()

  return (
    <section className="relative pt-16 md:pt-32 pb-8 md:pb-16 overflow-hidden bg-gradient-to-b from-white via-petal-50/20 to-white">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full glass text-xs md:text-sm font-semibold mb-4 md:mb-6 text-petal-700">
            Our Studios
          </span>
          <h2 className="hidden md:block text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-4 md:mb-6 px-4">
            Find Your <span className="text-gradient">Studio</span>
          </h2>
          <p className="hidden md:block text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Explore fitness studios across Bangalore. Click on a location to see studios in that area.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-petal-500"></div>
            <p className="mt-4 text-gray-600">Loading locations...</p>
          </div>
        )}

        {/* Mobile: City Cards */}
        {!loading && isMobile && (
          <div className="space-y-3 mb-8">
            {cities.length > 0 ? (
              cities.map((city, index) => (
                <LocationCard 
                  key={city.id} 
                  location={city} 
                  index={index}
                  onClick={() => handleCityClick(city)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>No locations found</p>
              </div>
            )}
          </div>
        )}

        {/* Desktop: Map with City/Studio Icons */}
        {!loading && !isMobile && (
          <div className="relative max-w-6xl mx-auto mb-0 px-8">
            <div className="relative rounded-3xl shadow-2xl border-4 border-white bg-gradient-to-br from-petal-50 via-white to-petal-100/50" style={{ overflow: 'visible' }}>
              <div className="w-full h-[700px] relative" style={{ overflow: 'visible' }}>
                {/* Map Container */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  {/* Base Map */}
                  <div
                    className="relative w-full h-full rounded-2xl shadow-inner"
                    style={{
                      background: 'linear-gradient(135deg, #fef3f7 0%, #fce7f3 50%, #fef3f7 100%)',
                      border: '3px solid #f9a8d4',
                    }}
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-petal-400" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-petal-400" />
                      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-petal-400" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-petal-400" />
                    </div>

                    {/* City Icons (always visible) */}
                    {cities.length > 0 && cities.map((city) => (
                      <CityIcon
                        key={city.id}
                        name={city.name}
                        position={city.position}
                        color={city.color}
                        delay={city.delay}
                        studioCount={city.studioCount}
                        onClick={() => handleCityClick(city)}
                      />
                    ))}

                    {/* Studio Icons (only when city is selected) */}
                    {selectedCity && cityStudios.length > 0 && cityStudios.map((studio) => (
                      <StudioIcon
                        key={studio.id}
                        name={studio.name}
                        position={studio.position}
                        color={studio.color}
                        delay={studio.delay}
                        address={studio.address}
                        onClick={() => handleStudioClick(studio)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected City/Studio Info Card */}
              {(selectedCity || selectedStudio) && (
                <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 z-10">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-petal-400 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {selectedStudio ? (
                          <>
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">
                              {selectedStudio.name}
                            </h3>
                            {selectedStudio.address && (
                              <p className="text-sm text-gray-600 mb-2">{selectedStudio.address}</p>
                            )}
                            <p className="text-xs text-petal-600 font-semibold">Partner Studio</p>
                            <button
                              onClick={() => setSelectedStudio(null)}
                              className="mt-3 text-sm text-petal-600 hover:text-petal-700 font-medium"
                            >
                              ← Back to {selectedCity.name}
                            </button>
                          </>
                        ) : (
                          <>
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">
                              {selectedCity.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {selectedCity.studioCount} {selectedCity.studioCount === 1 ? 'Studio' : 'Studios'} available
                            </p>
                            <p className="text-xs text-petal-600 font-semibold mb-3">Click studios on map to view details</p>
                            {cityStudios.length > 0 && (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {cityStudios.map((studio) => (
                                  <div
                                    key={studio.id}
                                    onClick={() => handleStudioClick(studio)}
                                    className="p-2 rounded-lg hover:bg-petal-50 cursor-pointer transition-colors"
                                  >
                                    <p className="text-sm font-semibold text-gray-900">{studio.name}</p>
                                    {studio.address && (
                                      <p className="text-xs text-gray-600">{studio.address.split(',')[0]}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCity(null)
                          setSelectedStudio(null)
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* City Label */}
              <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <div className="px-6 py-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border-2 border-petal-300">
                  <p className="text-sm text-gray-500 font-medium">City</p>
                  <p className="text-2xl font-heading font-bold text-gray-900">Bangalore</p>
                </div>
              </div>

              {/* Direction Compass */}
              <div className="absolute top-6 right-6 z-10 pointer-events-none">
                <div className="px-4 py-3 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-2 border-petal-300">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-petal-600 mb-1">N</div>
                    <div className="w-8 h-8 rounded-full border-2 border-petal-400 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-petal-600"
                           style={{ transform: 'rotate(315deg)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

export default MapSection
