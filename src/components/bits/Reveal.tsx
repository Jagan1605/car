import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

/**
 * Fade-in-up wrapper — reveals content as it scrolls into view.
 */
export function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
  }
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-8%' }}
    >
      {children}
    </motion.div>
  )
}

interface FadeInOutProps {
  children: ReactNode
  className?: string
  show: boolean
}

/**
 * Fade in/out (mount/unmount) with AnimatePresence handled by parent if needed.
 */
export function FadeInOut({ children, className, show }: FadeInOutProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
