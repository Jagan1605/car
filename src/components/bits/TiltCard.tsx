import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  scale?: number
  glare?: boolean
}

/**
 * 3D tilt card — tilts toward the cursor with perspective, optional glare highlight.
 */
export function TiltCard({ children, className, maxTilt = 12, scale = 1.02, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), { stiffness: 200, damping: 18 })
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale }}
      className={cn('relative preserve-3d', className)}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: useMotionTemplate`radial-gradient(400px circle at ${glareX} ${glareY}, rgba(34,211,238,0.18), transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  )
}

import { useMotionTemplate } from 'framer-motion'
