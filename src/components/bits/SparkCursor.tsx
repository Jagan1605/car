import { useEffect, useRef, useCallback } from 'react'

interface Spark {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  color: string
  size: number
}

const COLORS = ['#22d3ee', '#67e8f9', '#fbbf24', '#f59e0b', '#ffffff']

/**
 * Global click spark effect — on every click anywhere on the page,
 * a burst of glowing particles radiates from the cursor.
 * Also a subtle trailing dot follows the cursor.
 */
export function SparkCursor() {
  const sparksRef = useRef<HTMLDivElement | null>(null)
  const trailRef = useRef<HTMLDivElement | null>(null)
  const idRef = useRef(0)
  const lastSparkRef = useRef(0)

  const spawnSparks = useCallback((x: number, y: number) => {
    const now = performance.now()
    if (now - lastSparkRef.current < 40) return
    lastSparkRef.current = now

    const layer = sparksRef.current
    if (!layer) return
    const count = 10 + Math.floor(Math.random() * 6)
    for (let i = 0; i < count; i++) {
      const id = idRef.current++
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const dist = 40 + Math.random() * 60
      const tx = Math.cos(angle) * dist
      const ty = Math.sin(angle) * dist
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size = 4 + Math.random() * 5
      const el = document.createElement('span')
      el.className = 'spark-particle'
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:9999px;background:${color};box-shadow:0 0 12px ${color};pointer-events:none;z-index:9999;--tx:${tx}px;--ty:${ty}px;`
      el.dataset.id = String(id)
      layer.appendChild(el)
      setTimeout(() => el.remove(), 720)
    }
  }, [])

  useEffect(() => {
    const layer = document.createElement('div')
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
    sparksRef.current = layer
    document.body.appendChild(layer)

    const trail = document.createElement('div')
    trail.style.cssText =
      'position:fixed;width:14px;height:14px;border-radius:9999px;background:radial-gradient(circle,#22d3ee,transparent 70%);pointer-events:none;z-index:9998;mix-blend-mode:screen;opacity:0;transform:translate(-50%,-50%);transition:opacity .2s;'
    trailRef.current = trail
    document.body.appendChild(trail)

    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      trail.style.opacity = '0.9'
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const loop = () => {
      cx += (tx - cx) * 0.2
      cy += (ty - cy) * 0.2
      trail.style.left = cx + 'px'
      trail.style.top = cy + 'px'
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = 0
      }
    }
    const onLeave = () => {
      trail.style.opacity = '0'
    }
    const onClick = (e: MouseEvent) => {
      spawnSparks(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      layer.remove()
      trail.remove()
    }
  }, [spawnSparks])

  return null
}
