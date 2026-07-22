import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

/**
 * Animated gradient border beam that travels around the element perimeter.
 */
export function BorderBeam({ className, duration = 6 }: { className?: string; duration?: number }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]', className)}>
      <motion.div
        className="absolute aspect-square h-[200%] rounded-full opacity-70 blur-md"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, #22d3ee 40deg, transparent 80deg, transparent 180deg, #f59e0b 220deg, transparent 260deg, transparent 360deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
