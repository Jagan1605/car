import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Gauge, Battery, Cpu, ChevronDown } from 'lucide-react'
import { TextReveal } from './bits/TextReveal'
import { MagneticButton } from './bits/MagneticButton'
import { DotPattern } from './bits/DotPattern'
import { BorderBeam } from './bits/BorderBeam'

const STATS = [
  { icon: Gauge, label: 'Top Speed', value: '212 mph' },
  { icon: Battery, label: 'Range', value: '520 mi' },
  { icon: Cpu, label: 'Powertrain', value: 'Tri-Motor' },
]

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Parallax transforms
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  // Mouse parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 })
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [-20, 20]), { stiffness: 80, damping: 18 })
  const imgY = useSpring(useTransform(my, [-0.5, 0.5], [-15, 15]), { stiffness: 80, damping: 18 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-h-screen items-center overflow-hidden bg-ink-950 pt-28"
      style={{ perspective: 1200 }}
    >
      {/* Aurora background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob absolute -left-32 top-10 h-[40rem] w-[40rem] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="aurora-blob absolute -right-20 top-40 h-[32rem] w-[32rem] rounded-full bg-accent-500/10 blur-[120px]" style={{ animationDelay: '-8s' }} />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950" />
      </div>

      <DotPattern className="opacity-30" />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        {/* Left — copy */}
        <motion.div style={{ y: yText }} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-brand-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
            </span>
            Now building 2026 models
          </motion.div>

          <TextReveal
            as="h1"
            text="Engineered for those who refuse ordinary."
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            stagger={0.06}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-200 sm:text-lg lg:mx-0"
          >
            Aurora Motors hand-assembles every vehicle in our carbon-neutral atelier.
            Configure yours from chassis to stitching, then drive the extraordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <MagneticButton
              onClick={() => go('#configurator')}
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-glow transition-shadow hover:shadow-[0_0_60px_-10px_rgba(34,211,238,0.8)]"
            >
              Configure yours
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              onClick={() => go('#showcase')}
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:border-white/30"
            >
              Explore lineup
            </MagneticButton>
          </motion.div>

          {/* Inline stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <s.icon size={18} className="mx-auto mb-1.5 text-brand-400 lg:mx-0" />
                <div className="font-display text-lg font-semibold text-white sm:text-xl">{s.value}</div>
                <div className="text-xs uppercase tracking-wide text-ink-300">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — 3D car */}
        <motion.div
          style={{ y: yImage, rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="relative aspect-[4/3]">
            {/* Glow ring behind car */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl"
            />
            {/* Spotlight card framing */}
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900">
              <BorderBeam duration={8} />
              <motion.img
                src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
                alt="Aurora flagship performance vehicle"
                style={{ x: imgX, y: imgY, scale: scaleImage }}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              {/* Floating spec chips */}
              <motion.div
                style={{ z: 60 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="glass absolute left-4 top-4 rounded-2xl px-4 py-3"
              >
                <div className="text-xs text-ink-300">0–60 mph</div>
                <div className="font-display text-xl font-bold text-white">2.6s</div>
              </motion.div>
              <motion.div
                style={{ z: 60 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="glass absolute bottom-4 right-4 rounded-2xl px-4 py-3"
              >
                <div className="text-xs text-ink-300">Horsepower</div>
                <div className="font-display text-xl font-bold text-brand-300">820 hp</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => go('#showcase')}
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-ink-300 hover:text-white"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[11px] uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  )
}
