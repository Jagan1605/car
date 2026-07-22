import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface MarqueeProps {
  children: ReactNode
  className?: string
  reverse?: boolean
  duration?: number
  pauseOnHover?: boolean
}

/**
 * Infinite marquee — duplicates children and scrolls with CSS animation.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  duration = 40,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div
        className="marquee-track flex shrink-0 items-center gap-8 pr-8"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
        data-pause={pauseOnHover ? 'hover' : undefined}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
