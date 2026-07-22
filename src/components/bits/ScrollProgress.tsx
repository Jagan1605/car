import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Scroll progress bar — a gradient bar pinned to the top of the viewport
 * that fills as the user scrolls through the page.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      className={`fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 ${className ?? ''}`}
      style={{ scaleX }}
    />
  )
}
