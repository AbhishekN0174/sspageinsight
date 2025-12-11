import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ssLogo from '../../ss_logo.png'
import JoinStudioDialog from './JoinStudioDialog'

const Navbar = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleOpenDialog = () => {
      setIsJoinDialogOpen(true)
    }
    window.addEventListener('openJoinStudioDialog', handleOpenDialog)
    return () => window.removeEventListener('openJoinStudioDialog', handleOpenDialog)
  }, [])

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Events', href: '/events' },
    { name: 'Classes', href: '/classes' },
    { name: 'Community', href: '#community' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '#contact' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-petal-100 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={ssLogo}
              alt="SweatSocial Logo"
              width={80}
              height={80}
              className="h-16 md:h-20 w-auto"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                    const targetId = link.href.substring(1)
                    
                    // If on different page, navigate to homepage with hash first
                    if (window.location.pathname !== '/') {
                      window.location.href = `/${link.href}`
                      return
                    }
                    
                    // If on homepage, scroll to section
                    const element = document.getElementById(targetId)
                    if (element) {
                      // Account for fixed navbar height
                      const navbarHeight = 96 // Desktop navbar height
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                      const offsetPosition = elementPosition - navbarHeight
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    } else {
                      // Retry after a short delay in case element hasn't rendered yet
                      setTimeout(() => {
                        const el = document.getElementById(targetId)
                        if (el) {
                          const navbarHeight = 96
                          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
                          const offsetPosition = elementPosition - navbarHeight
                          
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          })
                        }
                      }, 100)
                    }
                  }
                  // For regular links (like /blog, /events), let them navigate normally
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group"
                whileHover={{ y: -2 }}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => setIsJoinDialogOpen(true)}
              className="px-6 py-2.5 rounded-full glass-strong hover:bg-white/15 transition-all font-semibold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Club
            </motion.button>
            <motion.a
              href="https://www.instagram.com/sweatsocial.club/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass-strong hover:bg-white/15 transition-all flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-10 h-10 rounded-full glass-strong flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-petal-100"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    if (link.href.startsWith('#')) {
                      e.preventDefault()
                      const targetId = link.href.substring(1)
                      
                      // If on different page, navigate to homepage with hash first
                      if (window.location.pathname !== '/') {
                        window.location.href = `/${link.href}`
                        return
                      }
                      
                      // Wait for menu to close, then scroll
                      setTimeout(() => {
                        const element = document.getElementById(targetId)
                        if (element) {
                          // Account for fixed navbar height
                          const navbarHeight = 80 // Mobile navbar height
                          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                          const offsetPosition = elementPosition - navbarHeight
                          
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          })
                        } else {
                          // Retry after another short delay
                          setTimeout(() => {
                            const el = document.getElementById(targetId)
                            if (el) {
                              const navbarHeight = 80
                              const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
                              const offsetPosition = elementPosition - navbarHeight
                              
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              })
                            }
                          }, 100)
                        }
                      }, 300) // Wait for menu animation to complete
                    }
                    // For regular links (like /blog, /events), let them navigate normally
                  }}
                  className="block text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsJoinDialogOpen(true)
                }}
                className="block w-full text-center px-6 py-3 rounded-full bg-gradient-primary font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                Join Our Club
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Studio Dialog */}
      <JoinStudioDialog
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
      />
    </motion.nav>
  )
}

export default Navbar
