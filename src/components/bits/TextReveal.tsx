import { motion, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '../../lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * Word-by-word text reveal with a masked blur wipe-up animation.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.08,
  as = 'h2',
}: TextRevealProps) {
  const words = text.split(' ')
  const MotionTag = motion[as]
  const ref = useRef<HTMLHeadingElement>(null)

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const child: Variants = {
    hidden: { y: '120%', opacity: 0, filter: 'blur(8px)' },
    show: {
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <MotionTag
      ref={ref}
      className={cn('flex flex-wrap', className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10%' }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pr-[0.25em] pb-[0.08em]">
          <motion.span className="inline-block" variants={child}>
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
