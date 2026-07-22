import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

/**
 * Count-up number animation triggered when the element scrolls into view.
 */
export function CountUp({
  to,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, from, to, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
