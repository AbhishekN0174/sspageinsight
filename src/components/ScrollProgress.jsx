import { motion } from 'framer-motion'

const ScrollProgress = ({ scaleX }) => {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-petal-500 via-primary-400 to-petal-600 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

export default ScrollProgress
