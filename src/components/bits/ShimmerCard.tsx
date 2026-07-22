import { cn } from '../../lib/utils'

interface ShimmerCardProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Shimmer skeleton placeholder while data loads.
 */
export function ShimmerCard({ className, children }: ShimmerCardProps) {
  return (
    <div className={cn('shimmer-bg rounded-2xl', className)}>
      {children}
    </div>
  )
}

export function ShimmerGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shimmer-bg overflow-hidden rounded-3xl">
          <div className="h-56 w-full" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-1/2 rounded-full bg-white/5" />
            <div className="h-4 w-3/4 rounded-full bg-white/5" />
            <div className="h-4 w-2/3 rounded-full bg-white/5" />
            <div className="mt-4 h-10 w-full rounded-full bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
