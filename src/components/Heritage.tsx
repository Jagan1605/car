import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Quote } from 'lucide-react'
import { CountUp } from './bits/CountUp'
import { TextReveal } from './bits/TextReveal'
import { Reveal } from './bits/Reveal'
import { Marquee } from './bits/Marquee'
import { StarRating } from './bits/StarRating'

const STATS = [
  { to: 38, suffix: ' yrs', label: 'Of craftsmanship', desc: 'Since our founding in Brescia, 1988' },
  { to: 12000, suffix: '+', label: 'Cars delivered', desc: 'Across 47 countries on six continents' },
  { to: 412, suffix: ' hrs', label: 'Per build', desc: 'Average hand-assembly time' },
  { to: 99.7, suffix: '%', label: 'Customer retention', desc: 'Owners who return for their next Aurora', decimals: 1 },
]

const REVIEWS = [
  { name: 'Marcus T.', role: 'Apex R owner', rating: 5, text: 'The build process was as thrilling as the drive. I watched my car come to life on the live tracker — that\'s a first.' },
  { name: 'Priya K.', role: 'Nimbus EQ owner', rating: 5, text: '520 miles of silence and then 2.6 seconds to 60. No other EV feels this engineered, this personal.' },
  { name: 'Dario V.', role: 'Vortex RS owner', rating: 4.5, text: 'Track day at Monza and it never flinched. The adaptive calibration learned my lines by lap ten.' },
  { name: 'Elena R.', role: 'Terra One owner', rating: 5, text: 'Family hauler by day, canyon carver by night. Aurora figured out what I wanted before I did.' },
  { name: 'James W.', role: 'Aurora GT-X owner', rating: 5, text: 'I\'ve owned nine grand tourers. None felt bespoke until this one. The configurator is genius.' },
  { name: 'Sofia M.', role: 'Meridian L owner', rating: 5, text: 'Executive comfort that still makes me take the long way home. Worth every penny.' },
]

export function Heritage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="heritage" ref={ref} className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* Parallax background image */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <img
          src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
          alt=""
          className="h-[120%] w-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/80 to-ink-950" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 text-center">
          <Reveal>
            <span className="text-sm font-medium uppercase tracking-widest text-brand-400">Heritage & Trust</span>
          </Reveal>
          <TextReveal
            as="h2"
            text="Four decades of obsessive craft."
            className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 p-6 text-center transition-colors hover:border-brand-400/30">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-400/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                  <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} duration={2.4} />
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{s.label}</div>
                <div className="mt-1 text-xs leading-relaxed text-ink-300">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Reviews marquee */}
        <div id="reviews" className="mt-20 scroll-mt-24">
          <Reveal className="mb-8 text-center">
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">Owners are talking</h3>
            <p className="mt-2 text-sm text-ink-200">Real reviews from real garages.</p>
          </Reveal>

          <div className="space-y-4">
            <Marquee duration={48} className="mask-fade-x py-2">
              {REVIEWS.slice(0, 3).map((r) => (
                <ReviewCard key={r.name} r={r} />
              ))}
            </Marquee>
            <Marquee duration={56} reverse className="mask-fade-x py-2">
              {REVIEWS.slice(3).map((r) => (
                <ReviewCard key={r.name} r={r} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <div className="glass w-[22rem] shrink-0 rounded-2xl border border-white/8 p-5">
      <Quote size={20} className="mb-3 text-brand-400/60" />
      <p className="text-sm leading-relaxed text-ink-100">{r.text}</p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">{r.name}</div>
          <div className="text-xs text-ink-300">{r.role}</div>
        </div>
        <StarRating value={r.rating} />
      </div>
    </div>
  )
}
