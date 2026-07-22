import { useRef, type ReactNode, type MouseEvent } from 'react'
import { cn } from '../../lib/utils'

interface RippleButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

let rippleId = 0

/**
 * Ripple button — click anywhere to spawn an expanding ripple from the click point.
 */
export function RippleButton({ children, className, onClick }: RippleButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = ref.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.4
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = rippleId++
    const ripple: Ripple = { x, y, size, id }

    const span = document.createElement('span')
    span.className = 'ripple'
    span.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle,rgba(34,211,238,0.35),transparent 70%);transform:scale(0);animation:rippleExpand .6s ease-out forwards;pointer-events:none;`
    button.appendChild(span)
    setTimeout(() => span.remove(), 600)
    void ripple
    onClick?.()
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
      <span className="pointer-events-none absolute inset-0" />
    </button>
  )
}
