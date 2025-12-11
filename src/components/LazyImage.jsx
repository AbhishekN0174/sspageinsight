import { useState, useEffect, useRef } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = 'bg-petal-100',
  onLoad = () => {},
  width, // required to avoid CLS
  height, // required to avoid CLS
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

  // compute padding-top to reserve aspect ratio if width/height provided
  const paddingTop = width && height ? `${(height / width) * 100}%` : undefined

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={paddingTop ? { paddingTop } : undefined}
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
          width={width}
          height={height}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
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
