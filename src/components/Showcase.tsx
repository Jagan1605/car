import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Gauge, Battery, Zap, Cog, Check } from 'lucide-react'
import type { Car } from '../lib/supabase'
import { TiltCard } from './bits/TiltCard'
import { SpotlightCard } from './bits/SpotlightCard'
import { Reveal } from './bits/Reveal'
import { TextReveal } from './bits/TextReveal'
import { ShimmerGrid } from './bits/ShimmerCard'
import { MagneticButton } from './bits/MagneticButton'
import { useCart } from '../store/cart'
import { formatPrice, categoryLabel, cn } from '../lib/utils'

interface ShowcaseProps {
  cars: Car[]
  loading: boolean
  onSelect: (car: Car) => void
}

const CATEGORIES = ['All', 'GT', 'Sport', 'EV', 'SUV', 'Sedan'] as const

export function Showcase({ cars, loading, onSelect }: ShowcaseProps) {
  const [filter, setFilter] = useState<string>('All')
  const { add } = useCart()

  const filtered = filter === 'All' ? cars : cars.filter((c) => c.category === filter)

  const quickAdd = (car: Car) => {
    const color = car.colors?.[0]
    const trim = car.trims?.[0]
    add({
      car,
      colorName: color?.name ?? 'Standard',
      trimName: trim?.name ?? 'Base',
      unitPrice: car.base_price + (trim?.price ?? 0),
      quantity: 1,
    })
  }

  return (
    <section id="showcase" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <span className="text-sm font-medium uppercase tracking-widest text-brand-400">The Lineup</span>
            </Reveal>
            <TextReveal
              as="h2"
              text="A vehicle for every ambition."
              className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-ink-200">
              Six hand-built models. One uncompromising philosophy. Every Aurora is engineered
              around the driver and assembled to order.
            </p>
          </Reveal>
        </div>

        {/* Category filter */}
        <Reveal delay={0.15}>
          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                  filter === cat
                    ? 'border-brand-400 bg-brand-400/15 text-brand-200 shadow-glow'
                    : 'border-white/10 bg-white/5 text-ink-200 hover:border-white/25 hover:text-white',
                )}
              >
                {cat === 'All' ? 'All Models' : categoryLabel(cat)}
              </button>
            ))}
          </div>
        </Reveal>

        {loading ? (
          <ShimmerGrid count={6} />
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((car, i) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <TiltCard className="h-full" maxTilt={10}>
                    <SpotlightCard className="group h-full overflow-hidden rounded-3xl border border-white/8 bg-ink-900/80">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <motion.img
                          src={car.image_url}
                          alt={car.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
                        {car.badge && (
                          <span className="absolute left-4 top-4 rounded-full bg-brand-400/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-950 backdrop-blur">
                            {car.badge}
                          </span>
                        )}
                        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-ink-950/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                          {categoryLabel(car.category)}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="space-y-4 p-6">
                        <div>
                          <h3 className="font-display text-xl font-bold text-white">{car.name}</h3>
                          <p className="mt-1 text-sm text-ink-200">{car.tagline}</p>
                        </div>

                        {/* Spec grid */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <Spec icon={Gauge} value={`${car.top_speed_mph}`} unit="mph" />
                          <Spec icon={Zap} value={`${car.horsepower}`} unit="hp" />
                          <Spec icon={Battery} value={`${car.range_miles}`} unit="mi" />
                        </div>

                        {/* Colors */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ink-300">Colors</span>
                          <div className="flex gap-1.5">
                            {(car.colors ?? []).slice(0, 5).map((c) => (
                              <span
                                key={c.name}
                                title={c.name}
                                className="h-5 w-5 rounded-full border border-white/20 ring-2 ring-transparent transition-all hover:ring-white/40"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Price + actions */}
                        <div className="flex items-end justify-between border-t border-white/8 pt-4">
                          <div>
                            <div className="text-xs text-ink-300">From</div>
                            <div className="font-display text-xl font-bold text-white">{formatPrice(car.base_price)}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => quickAdd(car)}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-colors hover:border-brand-400/40 hover:bg-brand-400/10"
                            >
                              Quick add
                            </button>
                            <MagneticButton
                              onClick={() => onSelect(car)}
                              strength={0.3}
                              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-4 py-2 text-xs font-semibold text-ink-950"
                            >
                              Configure
                              <ArrowUpRight size={14} />
                            </MagneticButton>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="grid place-items-center py-20 text-center">
            <Cog size={32} className="mb-3 text-ink-400" />
            <p className="text-ink-200">No models in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function Spec({ icon: Icon, value, unit }: { icon: typeof Gauge; value: string; unit: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 px-2 py-2.5">
      <Icon size={14} className="mx-auto mb-1 text-brand-400" />
      <div className="font-display text-sm font-bold text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-ink-300">{unit}</div>
    </div>
  )
}

export { Check }
