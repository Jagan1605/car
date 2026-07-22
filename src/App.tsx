import { useState, useCallback } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { FeatureStrip } from './components/FeatureStrip'
import { Showcase } from './components/Showcase'
import { Configurator } from './components/Configurator'
import { Manufacturing } from './components/Manufacturing'
import { Heritage } from './components/Heritage'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { useCars } from './lib/useCars'
import { useCart } from './store/cart'
import type { Car } from './lib/supabase'
import { MagneticButton } from './components/bits/MagneticButton'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import { formatPrice, categoryLabel } from './lib/utils'

export default function App() {
  const { cars, loading } = useCars()
  const { add } = useCart()
  const [quickPick, setQuickPick] = useState<Car | null>(null)

  const onConfigure = useCallback((car: Car) => {
    setQuickPick(car)
  }, [])

  return (
    <div className="relative min-h-screen bg-ink-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
        <Showcase cars={cars} loading={loading} onSelect={onConfigure} />
        <Configurator />
        <Manufacturing />
        <Heritage />
      </main>
      <Footer />
      <CartDrawer />
      <QuickConfigModal car={quickPick} onClose={() => setQuickPick(null)} onAdd={(c, color, trim, price) => {
        add({ car: c, colorName: color, trimName: trim, unitPrice: price, quantity: 1 })
        setQuickPick(null)
      }} />
    </div>
  )
}

function QuickConfigModal({
  car,
  onClose,
  onAdd,
}: {
  car: Car | null
  onClose: () => void
  onAdd: (car: Car, color: string, trim: string, price: number) => void
}) {
  const [cIdx, setCIdx] = useState(0)
  const [tIdx, setTIdx] = useState(0)

  return (
    <AnimatePresence>
      {car && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-ink-950/80 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[81] grid place-items-center p-4" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-ink-900"
            >
              <button onClick={onClose} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink-950/60 text-ink-200 hover:text-white">
                <X size={18} />
              </button>
              <div className="grid sm:grid-cols-2">
                <div className="relative aspect-square sm:aspect-auto">
                  <img src={car.image_url} alt={car.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent sm:bg-gradient-to-r" />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest text-brand-400">{categoryLabel(car.category)}</div>
                  <h3 className="mt-1 font-display text-2xl font-bold text-white">{car.name}</h3>
                  <p className="mt-1 text-sm text-ink-200">{car.tagline}</p>

                  <div className="mt-5">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">Paint</div>
                    <div className="flex flex-wrap gap-2">
                      {(car.colors ?? []).map((c, i) => (
                        <button
                          key={c.name}
                          onClick={() => setCIdx(i)}
                          title={c.name}
                          className={`h-9 w-9 rounded-full border-2 transition-all ${cIdx === i ? 'border-brand-400 scale-110' : 'border-white/15'}`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">Trim</div>
                    <div className="space-y-2">
                      {(car.trims ?? []).map((t, i) => (
                        <button
                          key={t.name}
                          onClick={() => setTIdx(i)}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${tIdx === i ? 'border-brand-400 bg-brand-400/10' : 'border-white/10 bg-white/5'}`}
                        >
                          <span className="font-medium text-white">{t.name}</span>
                          <span className="text-ink-200">{t.price === 0 ? 'Included' : `+${formatPrice(t.price)}`}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                    <div>
                      <div className="text-xs text-ink-300">Total</div>
                      <div className="font-display text-xl font-bold text-white">
                        {formatPrice(car.base_price + (car.trims?.[tIdx]?.price ?? 0))}
                      </div>
                    </div>
                    <MagneticButton
                      onClick={() => onAdd(car, car.colors?.[cIdx]?.name ?? 'Standard', car.trims?.[tIdx]?.name ?? 'Base', car.base_price + (car.trims?.[tIdx]?.price ?? 0))}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-400 to-brand-600 px-5 py-3 text-sm font-bold text-ink-950"
                    >
                      Add to garage <ArrowRight size={15} />
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
