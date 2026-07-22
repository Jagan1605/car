import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, Check, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import { useCart } from '../store/cart'
import { supabase } from '../lib/supabase'
import { formatPrice, cn } from '../lib/utils'

type Stage = 'cart' | 'checkout' | 'success'

export function CartDrawer() {
  const { items, isOpen, close, remove, updateQty, subtotal, count, clear } = useCart()
  const [stage, setStage] = useState<Stage>('cart')
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [shakeField, setShakeField] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // reset to cart view when reopened
  useEffect(() => {
    if (isOpen) {
      setStage(items.length === 0 ? 'cart' : stage === 'success' ? 'cart' : stage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const triggerShake = (field: string, msg: string) => {
    setErrors((e) => ({ ...e, [field]: msg }))
    setShakeField(field)
    setTimeout(() => setShakeField(null), 520)
  }

  const validate = () => {
    let ok = true
    if (!form.name.trim()) { triggerShake('name', 'Name is required'); ok = false }
    else if (form.name.trim().length < 2) { triggerShake('name', 'That name looks too short'); ok = false }
    if (!form.email.trim()) { triggerShake('email', 'Email is required'); ok = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { triggerShake('email', 'Enter a valid email'); ok = false }
    if (!form.phone.trim()) { triggerShake('phone', 'Phone is required'); ok = false }
    else if (form.phone.replace(/\D/g, '').length < 7) { triggerShake('phone', 'Enter a valid phone number'); ok = false }
    if (!form.address.trim()) { triggerShake('address', 'Shipping address is required'); ok = false }
    else if (form.address.trim().length < 10) { triggerShake('address', 'Please enter a full address'); ok = false }
    return ok
  }

  const placeOrder = async () => {
    if (!validate()) return
    setSubmitting(true)
    const rows = items.map((it) => ({
      car_id: it.car.id,
      customer_name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      shipping_address: form.address.trim(),
      configured_color: it.colorName,
      configured_trim: it.trimName,
      total_price: it.unitPrice * it.quantity,
      status: 'pending',
      configuration: { quantity: it.quantity },
    }))
    const { data, error } = await supabase.from('orders').insert(rows).select('id')
    setSubmitting(false)
    if (error || !data || data.length === 0) {
      triggerShake('email', 'Could not place order. Please try again.')
      return
    }
    setOrderId(data[0].id)
    setStage('success')
    clear()
    setForm({ name: '', email: '', phone: '', address: '' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-ink-950/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col glass-strong border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-400" />
                <span className="font-display text-lg font-bold text-white">
                  {stage === 'cart' ? 'Your Garage' : stage === 'checkout' ? 'Checkout' : 'Order Placed'}
                </span>
                {stage === 'cart' && count > 0 && (
                  <span className="rounded-full bg-brand-400/20 px-2 py-0.5 text-xs font-medium text-brand-200">{count}</span>
                )}
              </div>
              <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-ink-200 hover:bg-white/5 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence mode="wait">
                {stage === 'cart' && (
                  <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {items.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5">
                          <ShoppingBag size={28} className="text-ink-400" />
                        </div>
                        <p className="font-display text-lg font-semibold text-white">Your garage is empty</p>
                        <p className="mt-1 text-sm text-ink-300">Configure a vehicle to get started.</p>
                        <button onClick={close} className="mt-6 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-5 py-2.5 text-sm font-semibold text-ink-950">
                          Browse lineup
                        </button>
                      </div>
                    ) : (
                      items.map((it, i) => (
                        <motion.div
                          key={i}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-3 rounded-2xl border border-white/8 bg-white/5 p-3"
                        >
                          <img src={it.car.image_url} alt={it.car.name} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="truncate font-display text-sm font-bold text-white">{it.car.name}</div>
                                <div className="text-xs text-ink-300">{it.trimName} · {it.colorName}</div>
                              </div>
                              <button onClick={() => remove(i)} className="shrink-0 text-ink-400 hover:text-red-400">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="inline-flex items-center rounded-lg border border-white/10">
                                <button onClick={() => updateQty(i, it.quantity - 1)} className="grid h-7 w-7 place-items-center text-ink-200 hover:text-white"><Minus size={14} /></button>
                                <span className="w-7 text-center text-sm font-semibold text-white">{it.quantity}</span>
                                <button onClick={() => updateQty(i, it.quantity + 1)} className="grid h-7 w-7 place-items-center text-ink-200 hover:text-white"><Plus size={14} /></button>
                              </div>
                              <div className="font-display text-sm font-bold text-white">{formatPrice(it.unitPrice * it.quantity)}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {stage === 'checkout' && (
                  <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <Field label="Full name" error={errors.name} shake={shakeField === 'name'}>
                      <input
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="Aurora Driver"
                        className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                      />
                    </Field>
                    <Field label="Email" error={errors.email} shake={shakeField === 'email'}>
                      <input
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="driver@aurora motors.com"
                        type="email"
                        className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                      />
                    </Field>
                    <Field label="Phone" error={errors.phone} shake={shakeField === 'phone'}>
                      <input
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        placeholder="+1 555 000 1234"
                        className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                      />
                    </Field>
                    <Field label="Shipping address" error={errors.address} shake={shakeField === 'address'}>
                      <textarea
                        value={form.address}
                        onChange={(e) => set('address', e.target.value)}
                        placeholder="Street, city, postal code, country"
                        rows={3}
                        className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                      />
                    </Field>

                    {/* Order summary */}
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">Summary</div>
                      {items.map((it, i) => (
                        <div key={i} className="flex justify-between py-1 text-sm">
                          <span className="text-ink-100">{it.car.name} × {it.quantity}</span>
                          <span className="text-white">{formatPrice(it.unitPrice * it.quantity)}</span>
                        </div>
                      ))}
                      <div className="mt-2 flex justify-between border-t border-white/8 pt-2 text-sm font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-brand-300">{formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {stage === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full flex-col items-center justify-center py-20 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-green-500/15 text-green-400"
                    >
                      <Check size={40} strokeWidth={3} />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-white">Order confirmed</h3>
                    <p className="mt-2 max-w-xs text-sm text-ink-200">
                      Your Aurora build is now in our atelier queue. We'll email your production timeline shortly.
                    </p>
                    {orderId && (
                      <div className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-ink-200">
                        Order #{orderId.slice(0, 8).toUpperCase()}
                      </div>
                    )}
                    <button onClick={close} className="mt-8 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-6 py-3 text-sm font-semibold text-ink-950">
                      Continue exploring
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {stage !== 'success' && items.length > 0 && (
              <div className="border-t border-white/8 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-ink-300">{stage === 'cart' ? 'Subtotal' : 'Total due'}</span>
                  <span className="font-display text-xl font-bold text-white">{formatPrice(subtotal)}</span>
                </div>
                {stage === 'cart' ? (
                  <button
                    onClick={() => setStage('checkout')}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-400 to-brand-600 py-3.5 text-sm font-bold text-ink-950 shadow-glow transition-shadow hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.7)]"
                  >
                    Proceed to checkout <ArrowRight size={16} />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStage('cart')}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      onClick={placeOrder}
                      disabled={submitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-400 to-brand-600 py-3.5 text-sm font-bold text-ink-950 shadow-glow disabled:opacity-60"
                    >
                      {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Placing order…</>
                      ) : (
                        <>Place order · {formatPrice(subtotal)}</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  error,
  shake,
  children,
}: {
  label: string
  error?: string
  shake?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</label>
      <div className={cn(shake && 'animate-shake')}>{children}</div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle size={13} /> {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
