import React, { useEffect, useState } from 'react'

// Lightweight async loader for framer-motion's `motion` elements.
// Renders a plain HTML element as a fallback until framer-motion loads.
export default function AsyncMotion({ element = 'div', motionProps = {}, children, load = true, ...rest }) {
  const [MotionLib, setMotionLib] = useState(null)

  useEffect(() => {
    let mounted = true
    if (!load) return () => { mounted = false }

    import('framer-motion')
      .then((mod) => {
        if (mounted) setMotionLib(() => mod.motion)
      })
      .catch(() => {
        // silently ignore failure; fallback will be used
      })
    return () => {
      mounted = false
    }
  }, [load])

  const Tag = element

  if (!MotionLib) {
    // fallback: render a plain element without motion props
    return React.createElement(Tag, rest, children)
  }

  const MotionTag = MotionLib[Tag] || MotionLib.div
  return React.createElement(MotionTag, { ...motionProps, ...rest }, children)
}
