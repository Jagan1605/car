import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StarRatingProps {
  value: number
  max?: number
  size?: number
  className?: string
}

/**
 * Animated star rating with partial fill support.
 */
export function StarRating({ value, max = 5, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, value - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-ink-600" strokeWidth={1.5} />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className="text-accent-400 fill-accent-400" strokeWidth={1.5} />
            </span>
          </span>
        )
      })}
    </div>
  )
}
