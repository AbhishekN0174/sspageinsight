import { useState, useEffect, useRef } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = 'bg-petal-100',
  onLoad = () => {} 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  const handleImageLoad = () => {
    setIsLoaded(true)
    onLoad()
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className={`absolute inset-0 ${placeholderClassName} animate-pulse`} />
      )}
      
      {/* Actual image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  )
}

export default LazyImage
