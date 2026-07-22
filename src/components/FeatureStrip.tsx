import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ShieldCheck, Leaf, Gauge, Sparkles } from 'lucide-react'
import { Reveal } from './bits/Reveal'
import { TextReveal } from './bits/TextReveal'

const FEATURES = [
  {
    icon: Gauge,
    title: 'Hypercar performance',
    desc: 'Tri-motor architectures deliver up to 820 hp and 2.6-second sprints, calibrated by adaptive AI to your driving style.',
  },
  {
    icon: ShieldCheck,
    title: 'Carbon monocoque safety',
    desc: 'A single-piece carbon-fibre tub is 40% lighter than aluminium and absorbs impacts that would crumple a steel frame.',
  },
  {
    icon: Leaf,
    title: 'Carbon-neutral atelier',
    desc: 'Our Brescia facility runs on 100% renewable energy. Every Aurora ships with a lifetime offset certificate.',
  },
  {
    icon: Sparkles,
    title: 'Bespoke to the stitch',
    desc: '14 paint stages, infinite interior configurations. No two Auroras leave the atelier exactly alike.',
  },
]

export function FeatureStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-white/5 bg-ink-900/30 py-20">
      <motion.div
        style={{ x }}
        className="pointer-events-none absolute inset-y-0 left-0 flex select-none items-center whitespace-nowrap font-display text-[18vw] font-bold leading-none text-white/[0.03] sm:text-[12vw]"
      >
        AURORA · MOTORS · AURORA · MOTORS
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="text-sm font-medium uppercase tracking-widest text-brand-400">Why Aurora</span>
          </Reveal>
          <TextReveal
            as="h2"
            text="Obsessively engineered. Unapologetically bespoke."
            className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="group h-full rounded-3xl border border-white/8 bg-ink-900/60 p-6 transition-all hover:border-brand-400/30 hover:bg-ink-900">
                <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/10 text-brand-400 transition-transform group-hover:scale-110">
                  <f.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-200">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
