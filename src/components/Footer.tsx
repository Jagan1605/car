import { Zap, Twitter, Instagram, Youtube, Github, Mail } from 'lucide-react'
import { MagneticButton } from './bits/MagneticButton'
import { Reveal } from './bits/Reveal'

const COLS = [
  { title: 'Vehicles', links: ['Aurora GT-X', 'Nimbus EQ', 'Apex R', 'Vortex RS', 'Terra One'] },
  { title: 'Atelier', links: ['Manufacturing', 'Heritage', 'Sustainability', 'Careers', 'Press'] },
  { title: 'Support', links: ['Service Centers', 'Warranty', 'Owner Portal', 'Contact', 'FAQ'] },
]

const SOCIALS = [
  { icon: Instagram, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Youtube, href: '#' },
  { icon: Github, href: '#' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[60rem] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* CTA band */}
        <Reveal>
          <div className="flex flex-col items-center gap-6 border-b border-white/8 py-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to build <span className="text-gradient">yours</span>?
            </h2>
            <p className="max-w-md text-sm text-ink-200">
              Join the Aurora owners' circle. Configure, reserve, and track your build in real time.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <MagneticButton
                onClick={() => document.querySelector('#configurator')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-glow"
              >
                <Zap size={16} /> Start configuring
              </MagneticButton>
              <a
                href="#showcase"
                onClick={(e) => { e.preventDefault(); document.querySelector('#showcase')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:border-white/30"
              >
                View lineup
              </a>
            </div>
          </div>
        </Reveal>

        {/* Links */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-glow">
                <Zap size={18} className="text-ink-950" fill="currentColor" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                AURORA<span className="text-brand-400">.</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
              Bespoke performance vehicles, hand-assembled in Brescia since 1988. Engineered for those who refuse ordinary.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-ink-200 transition-colors hover:border-brand-400/40 hover:text-brand-300"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-300">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-ink-200 transition-colors hover:text-white">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-brand-400" />
            <span className="text-sm text-ink-200">Get build stories & launch alerts</span>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
            />
            <button className="rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-5 py-2.5 text-sm font-semibold text-ink-950">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/8 py-6 text-xs text-ink-400 sm:flex-row">
          <span>© 2026 Aurora Motors S.p.A. — Brescia, Italy. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
