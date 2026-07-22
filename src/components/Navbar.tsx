import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, Zap } from 'lucide-react'
import { ScrollProgress } from './bits/ScrollProgress'
import { MagneticButton } from './bits/MagneticButton'
import { useCart } from '../store/cart'
import { cn } from '../lib/utils'

const LINKS = [
  { label: 'Showcase', href: '#showcase' },
  { label: 'Configurator', href: '#configurator' },
  { label: 'Manufacturing', href: '#manufacturing' },
  { label: 'Heritage', href: '#heritage' },
  { label: 'Reviews', href: '#reviews' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, toggle } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => {
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'glass-strong py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]' : 'py-5',
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" onClick={(e) => { e.preventDefault(); go('#top') }} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-glow">
              <Zap size={18} className="text-ink-950" fill="currentColor" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              AURORA<span className="text-brand-400">.</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative px-4 py-2 text-sm font-medium text-ink-200 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton
              onClick={toggle}
              className="relative flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:border-brand-400/40 hover:bg-brand-400/10"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-400 px-1 text-xs font-bold text-ink-950"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </MagneticButton>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mx-auto max-w-7xl space-y-1 px-5 pb-4 sm:px-8">
                {LINKS.map((l) => (
                  <button
                    key={l.href}
                    onClick={() => go(l.href)}
                    className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-ink-100 hover:bg-white/5"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
