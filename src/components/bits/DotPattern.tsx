import { cn } from '../../lib/utils'

interface DotPatternProps {
  className?: string
  size?: number
  radius?: number
}

/**
 * Decorative dotted background pattern with radial mask.
 */
export function DotPattern({ className, size = 22, radius = 1 }: DotPatternProps) {
  const id = `dot-${size}-${radius}`
  return (
    <svg aria-hidden className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
          <circle cx={size / 2} cy={size / 2} fill="rgba(255,255,255,0.12)" r={radius} />
        </pattern>
        <radialGradient id={`${id}-mask`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} mask={`url(#${id}-mask)`} />
    </svg>
  )
}
