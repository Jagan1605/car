import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { DraftingCompass, Hammer, PaintRoller, Scan, Cpu, Flag } from 'lucide-react'
import { TextReveal } from './bits/TextReveal'
import { Reveal } from './bits/Reveal'

const STEPS = [
  {
    icon: DraftingCompass,
    title: 'Design & Aerodynamics',
    desc: 'Every Aurora begins in the wind tunnel. Computational fluid dynamics shape a body that slices through air at 200+ mph while keeping the cabin whisper-quiet.',
    stat: '0.21 Cd',
    statLabel: 'drag coefficient',
  },
  {
    icon: Scan,
    title: 'Carbon Monocoque',
    desc: 'A single-piece carbon-fibre tub is laid by hand, vacuum-bagged, and autoclaved at 180°C. Lighter than aluminium, stiffer than steel.',
    stat: '138 kg',
    statLabel: 'chassis weight',
  },
  {
    icon: Hammer,
    title: 'Hand Assembly',
    desc: 'Master technicians assemble each powertrain by hand at our Brescia atelier. Every bolt is torqued, logged, and signed.',
    stat: '412 hrs',
    statLabel: 'per vehicle',
  },
  {
    icon: Cpu,
    title: 'Neural Calibration',
    desc: 'Adaptive AI calibrates suspension, throttle, and steering maps to each owner over the first 1,000 km. The car learns the driver.',
    stat: '1M+',
    statLabel: 'data points / km',
  },
  {
    icon: PaintRoller,
    title: 'Bespoke Finish',
    desc: 'Nine base coats, four clear coats, hand-sanded between each. A single paint job takes three days and is unique to your build.',
    stat: '13',
    statLabel: 'coats of paint',
  },
  {
    icon: Flag,
    title: 'Track Validation',
    desc: 'Every Aurora completes a 300 km shakedown at our private circuit before delivery. No car ships until it passes the driver.',
    stat: '300 km',
    statLabel: 'shakedown',
  },
]

export function Manufacturing() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end end'] })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="manufacturing" ref={ref} className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-16 text-center">
          <Reveal>
            <span className="text-sm font-medium uppercase tracking-widest text-brand-400">The Atelier</span>
          </Reveal>
          <TextReveal
            as="h2"
            text="Six stages. Zero compromise."
            className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
          />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-200">
              Follow an Aurora from sketch to shakedown. Scroll to advance the build.
            </p>
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Track */}
          <div className="absolute left-8 top-0 h-full w-px bg-white/8 sm:left-1/2 sm:-translate-x-1/2">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute left-0 top-0 w-full bg-gradient-to-b from-brand-400 via-brand-300 to-accent-400 shadow-glow"
            />
          </div>

          <div className="space-y-12 sm:space-y-20">
            {STEPS.map((step, i) => (
              <TimelineStep key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineStep({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const isRight = index % 2 === 0
  const Icon = step.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-6 sm:gap-12 ${isRight ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
    >
      {/* Node */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
        className="absolute left-8 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-brand-400/40 bg-ink-900 shadow-glow sm:left-1/2"
      >
        <Icon size={18} className="text-brand-400" />
      </motion.div>

      {/* Card */}
      <div className={`ml-16 flex-1 sm:ml-0 ${isRight ? 'sm:pr-16 sm:text-right' : 'sm:pl-16'}`}>
        <div className="glass rounded-2xl border border-white/8 p-6 transition-colors hover:border-brand-400/30">
          <div className={`mb-2 flex items-center gap-2 ${isRight ? 'sm:flex-row-reverse' : ''}`}>
            <span className="font-mono text-xs font-medium text-brand-400">{String(index + 1).padStart(2, '0')}</span>
            <span className="h-px flex-1 bg-white/8" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">{step.desc}</p>
          <div className={`mt-4 flex items-baseline gap-2 ${isRight ? 'sm:flex-row-reverse' : ''}`}>
            <span className="font-display text-2xl font-bold text-gradient-amber">{step.stat}</span>
            <span className="text-xs uppercase tracking-wide text-ink-300">{step.statLabel}</span>
          </div>
        </div>
      </div>

      {/* spacer for the other side on desktop */}
      <div className="hidden flex-1 sm:block" />
    </motion.div>
  )
}
