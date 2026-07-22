import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Palette, Layers, ShoppingBag, Gauge, Battery, Zap, Cog, ArrowRight, X } from 'lucide-react'
import type { Car } from '../lib/supabase'
import { useCars } from '../lib/useCars'
import { useCart } from '../store/cart'
import { Reveal } from './bits/Reveal'
import { TextReveal } from './bits/TextReveal'
import { MagneticButton } from './bits/MagneticButton'
import { BorderBeam } from './bits/BorderBeam'
import { formatPrice, categoryLabel, cn } from '../lib/utils'

export function Configurator() {
  const { cars, loading } = useCars()
  const { add } = useCart()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [colorIdx, setColorIdx] = useState(0)
  const [trimIdx, setTrimIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const selected = useMemo(() => cars.find((c) => c.id === selectedId) ?? cars[0] ?? null, [cars, selectedId])

  useEffect(() => {
    if (selectedId) {
      const el = document.getElementById('configurator-canvas')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedId])

  // reset selections when car changes
  useEffect(() => {
    setColorIdx(0)
    setTrimIdx(0)
    setQty(1)
    setAdded(false)
  }, [selectedId])

  const totalPrice = useMemo(() => {
    if (!selected) return 0
    const trimPrice = selected.trims?.[trimIdx]?.price ?? 0
    return (selected.base_price + trimPrice) * qty
  }, [selected, trimIdx, qty])

  const handleAdd = () => {
    if (!selected) return
    const color = selected.colors?.[colorIdx]
    const trim = selected.trims?.[trimIdx]
    add({
      car: selected,
      colorName: color?.name ?? 'Standard',
      trimName: trim?.name ?? 'Base',
      unitPrice: selected.base_price + (trim?.price ?? 0),
      quantity: qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <section id="configurator" className="relative scroll-mt-24 border-y border-white/5 bg-ink-900/40 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="text-sm font-medium uppercase tracking-widest text-brand-400">Build your Aurora</span>
          </Reveal>
          <TextReveal
            as="h2"
            text="From bare chassis to bespoke finish."
            className="mt-3 mx-auto max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
          />
        </div>

        {loading || !selected ? (
          <div className="shimmer-bg mx-auto h-96 max-w-5xl rounded-3xl" />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            {/* Live preview */}
            <Reveal>
              <div id="configurator-canvas" className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900">
                <BorderBeam duration={10} />
                {/* color-tinted glow */}
                <motion.div
                  key={selected.colors?.[colorIdx]?.hex ?? 'glow'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
                  style={{ backgroundColor: (selected.colors?.[colorIdx]?.hex ?? '#22d3ee') + '55' }}
                />
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selected.id + '-' + colorIdx}
                    src={selected.image_url}
                    alt={selected.name}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 aspect-[4/3] w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />

                {/* Overlay info */}
                <div className="absolute inset-x-0 bottom-0 z-30 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-brand-300">{categoryLabel(selected.category)}</div>
                      <div className="font-display text-3xl font-bold text-white">{selected.name}</div>
                      <div className="mt-1 text-sm text-ink-200">{selected.tagline}</div>
                    </div>
                    <div className="glass rounded-2xl px-4 py-2 text-right">
                      <div className="text-xs text-ink-300">Total</div>
                      <motion.div
                        key={totalPrice}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-xl font-bold text-white"
                      >
                        {formatPrice(totalPrice)}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* color name chip */}
                <div className="absolute left-6 top-6 z-30">
                  <motion.div
                    key={selected.colors?.[colorIdx]?.name}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass flex items-center gap-2 rounded-full px-3 py-1.5"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/30"
                      style={{ backgroundColor: selected.colors?.[colorIdx]?.hex }}
                    />
                    <span className="text-xs font-medium text-white">{selected.colors?.[colorIdx]?.name}</span>
                  </motion.div>
                </div>
              </div>
            </Reveal>

            {/* Controls */}
            <Reveal delay={0.1}>
              <div className="space-y-7 rounded-3xl border border-white/8 bg-ink-900/80 p-6 sm:p-8">
                {/* Model picker */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-300">
                    <Cog size={14} /> Model
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cars.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => setSelectedId(car.id)}
                        className={cn(
                          'rounded-xl border px-3 py-2 text-sm font-medium transition-all',
                          selected.id === car.id
                            ? 'border-brand-400 bg-brand-400/15 text-white'
                            : 'border-white/10 bg-white/5 text-ink-200 hover:border-white/25 hover:text-white',
                        )}
                      >
                        {car.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color picker */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-300">
                    <Palette size={14} /> Paint — {selected.colors?.[colorIdx]?.name}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(selected.colors ?? []).map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setColorIdx(i)}
                        title={c.name}
                        className={cn(
                          'relative h-11 w-11 rounded-full border-2 transition-all',
                          colorIdx === i ? 'border-brand-400 scale-110' : 'border-white/15 hover:border-white/40',
                        )}
                        style={{ backgroundColor: c.hex }}
                      >
                        {colorIdx === i && (
                          <Check
                            size={16}
                            className="absolute inset-0 m-auto"
                            style={{ color: isLight(c.hex) ? '#000' : '#fff' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trim picker */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-300">
                    <Layers size={14} /> Trim level
                  </label>
                  <div className="space-y-2">
                    {(selected.trims ?? []).map((trim, i) => (
                      <button
                        key={trim.name}
                        onClick={() => setTrimIdx(i)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all',
                          trimIdx === i
                            ? 'border-brand-400 bg-brand-400/10'
                            : 'border-white/10 bg-white/5 hover:border-white/25',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn('grid h-5 w-5 place-items-center rounded-full border', trimIdx === i ? 'border-brand-400 bg-brand-400' : 'border-white/20')}>
                            {trimIdx === i && <Check size={12} className="text-ink-950" />}
                          </span>
                          <span className="text-sm font-semibold text-white">{trim.name}</span>
                        </div>
                        <span className="text-sm text-ink-200">
                          {trim.price === 0 ? 'Included' : `+${formatPrice(trim.price)}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-300">Quantity</label>
                  <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center text-lg text-white hover:bg-white/5">−</button>
                    <span className="w-10 text-center font-display font-semibold text-white">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-10 w-10 place-items-center text-lg text-white hover:bg-white/5">+</button>
                  </div>
                </div>

                {/* Spec readout */}
                <div className="grid grid-cols-2 gap-3 border-t border-white/8 pt-5">
                  <SpecLine icon={Gauge} label="Top speed" value={`${selected.top_speed_mph} mph`} />
                  <SpecLine icon={Zap} label="Power" value={`${selected.horsepower} hp`} />
                  <SpecLine icon={Battery} label="Range" value={`${selected.range_miles} mi`} />
                  <SpecLine icon={Cog} label="0–60" value={`${selected.zero_to_sixty}s`} />
                </div>

                {/* CTA */}
                <MagneticButton
                  onClick={handleAdd}
                  className={cn(
                    'group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all',
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-brand-400 to-brand-600 text-ink-950 shadow-glow hover:shadow-[0_0_60px_-10px_rgba(34,211,238,0.8)]',
                  )}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                        <Check size={18} /> Added to garage
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <ShoppingBag size={18} /> Add to garage — {formatPrice(totalPrice)}
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}

function SpecLine({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5">
      <Icon size={16} className="text-brand-400" />
      <div>
        <div className="text-[11px] uppercase tracking-wide text-ink-300">{label}</div>
        <div className="font-display text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  )
}

function isLight(hex: string): boolean {
  const c = hex.replace('#', '')
  if (c.length < 6) return false
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

export { X }
