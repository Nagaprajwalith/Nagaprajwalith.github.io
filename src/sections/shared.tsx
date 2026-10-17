import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { cn } from '@/lib/utils'

// One Lenis instance shared by the app, so nav clicks scroll smoothly too
export const smooth: { lenis: Lenis | null } = { lenis: null }

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (smooth.lenis) smooth.lenis.scrollTo(el, { offset: -20, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

const ease = [0.2, 0.8, 0.2, 1] as const

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      // transform + opacity only: both run on the GPU compositor, and no leftover `filter`
      // (a filter on an ancestor flattens 3D children such as the flip cards)
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ label, title, intro }: { label: string; title: ReactNode; intro?: string }) {
  return (
    <div className="mb-12 md:mb-16">
      <Reveal>
        <div className="mb-5 inline-flex rounded-full border border-ink/10 bg-ink/[0.04] px-4 py-1.5 text-sm">
          <AnimatedShinyText className="mx-0 max-w-none text-ink/60">{label}</AnimatedShinyText>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">{intro}</p>
        </Reveal>
      )}
    </div>
  )
}

export function Section({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn('relative mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-36', className)}>
      {children}
    </section>
  )
}

export function TechIcon({ src, invert, brighten, name, className }: { src: string; invert?: boolean; brighten?: boolean; name: string; className?: string }) {
  return <img src={src} alt={name} title={name} loading="lazy" className={cn('h-6 w-6', invert && 'dark:invert', brighten && 'dark:brightness-[2.4]', className)} />
}
