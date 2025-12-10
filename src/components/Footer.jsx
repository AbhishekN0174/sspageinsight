import { motion } from 'framer-motion'
import ssLogo from '../../ss_logo.png'

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Download App', href: '#app' },
      { name: 'Challenges', href: '#challenges' }
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' }
    ],
    Resources: [
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Guides', href: '#guides' },
      { name: 'API Docs', href: '#api' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Licenses', href: '#licenses' }
    ]
  }

  const socialLinks = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      href: 'https://www.instagram.com/sweatsocial.club/'
    }
  ]

  return (
    <footer id="contact" className="relative bg-petal-50/30 border-t border-petal-100">
      {/* Top Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="mb-6">
                <img
                  src={ssLogo}
                  alt="SweatSocial"
                  className="h-20 md:h-24 w-auto mb-4"
                />
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                India's first experimental fitness platform. Turn your sweat into social energy. Join thousands building stronger bodies and lasting connections.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <a
                  href="mailto:hello@sweatsocial.club"
                  className="flex items-center gap-2 text-gray-600 hover:text-petal-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">hello@sweatsocial.club</span>
                </a>
                <a
                  href="tel:+919606464667"
                  className="flex items-center gap-2 text-gray-600 hover:text-petal-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">+91-9606464667</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600 hover:text-petal-700 transition-all"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: 'rgba(244, 143, 180, 0.15)',
                      borderColor: 'rgba(244, 143, 180, 0.4)'
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h3 className="font-heading font-bold text-gray-900 mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-petal-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              className="text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} SweatSocial. All rights reserved. Built with passion and sweat.
            </motion.p>

            <motion.div
              className="flex items-center gap-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -2 }}
              >
                Privacy
              </motion.a>
              <motion.a
                href="/terms"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -2 }}
              >
                Terms
              </motion.a>
              <motion.a
                href="#cookies"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -2 }}
              >
                Cookies
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-petal-200/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />
    </footer>
  )
}

export default Footer
