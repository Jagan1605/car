import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { cn } from '../../lib/utils'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  color?: string
  size?: number
}

/**
 * Spotlight card — a radial glow follows the cursor across the card surface.
 */
export function SpotlightCard({
  children,
  className,
  color = 'rgba(34,211,238,0.18)',
  size = 400,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }
  const onLeave = () => {
    mx.set(-1000)
    my.set(-1000)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('group relative overflow-hidden', className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, ${color}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  )
}
