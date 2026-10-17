import { motion } from 'motion/react'
import { ArrowUpRight, RotateCcw, MousePointerClick, Check } from 'lucide-react'
import { useState } from 'react'
import { BorderBeam } from '@/components/ui/border-beam'
import { PROFILE, PROJECTS, type Project } from '@/data'
import { TECH } from '@/tech'
import { cn } from '@/lib/utils'
import { Reveal, Section, SectionHeading, TechIcon } from './shared'

function FlipCard({ project, index }: { project: Project; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const canHover = typeof window !== 'undefined' && matchMedia('(hover: hover)').matches

  return (
    <Reveal delay={(index % 2) * 0.12} className="h-[30rem] md:h-[26rem]">
      {/* Hover is tracked on this static wrapper: on the rotating card the hit area shrinks to
          nothing mid-flip, which fired mouseleave and made the card flicker back and forth */}
      <div
        className="flip h-full w-full"
        onMouseEnter={() => canHover && setFlipped(true)}
        onMouseLeave={() => canHover && setFlipped(false)}
      >
      <motion.div
        className="flip-inner relative h-full w-full will-change-transform"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Front */}
        <div className="flip-face absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1330] text-white shadow-xl shadow-ink/10">
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-80', project.gradient)} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#060918] via-[#060918]/80 to-transparent" />
          <BorderBeam size={140} duration={7} delay={index * 2} colorFrom="#ffffff" colorTo="#fbbf24" />

          <div className="relative flex h-full flex-col p-7">
            <motion.span
              className="text-7xl drop-shadow-2xl"
              animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: index }}
              aria-hidden
            >
              {project.emoji}
            </motion.span>
            <div className="mt-auto">
              <h3 className="font-display text-3xl font-bold leading-tight">{project.title}</h3>
              <p className="mt-2 text-white/75">{project.tagline}</p>
              <div className="mt-5 flex items-center gap-2.5">
                {project.tech.map((k) => (
                  <span key={k} className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                    <TechIcon {...TECH[k]} className={cn('h-5 w-5', TECH[k].invert && 'invert', TECH[k].brighten && 'brightness-[2.4]')} />
                  </span>
                ))}
              </div>
              <button
                onClick={() => setFlipped(true)}
                className="relative mt-6 inline-flex items-center gap-2 text-sm text-white/60 after:absolute after:-inset-3 after:content-[''] hover:text-white"
              >
                <MousePointerClick className="h-4 w-4" /> {canHover ? 'Hover or click to flip' : 'Tap to see details'}
              </button>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flip-face flip-back absolute inset-0 overflow-hidden rounded-3xl border border-ink/10 bg-surface p-7 shadow-xl shadow-ink/5">
          <div className={cn('absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br opacity-30 blur-3xl', project.gradient)} />
          <div className="relative flex h-full flex-col">
            <h3 className="font-display text-2xl font-bold">{project.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{project.description}</p>
            <ul className="mt-5 space-y-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-[var(--muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {project.tech.map((k) => (
                <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/[0.04] px-2.5 py-1 text-xs">
                  <TechIcon {...TECH[k]} className="h-3.5 w-3.5" /> {TECH[k].name}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
              {project.link ? (
                <a href={project.link} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-[var(--bg)] transition hover:bg-amber-400 hover:text-[#060918]">
                  View code <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <span className="text-sm text-ink/50">Code available on request</span>
              )}
              </div>
              <button onClick={() => setFlipped(false)} aria-label="Flip back" className="rounded-full border border-ink/15 p-2 text-ink/60 hover:text-ink">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </Reveal>
  )
}

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        label="Selected work"
        title={<>Things I've <span className="text-gradient">built.</span></>}
        intro="Academic projects in finance, farming, road safety and forensics. Flip a card to see how each one works."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <FlipCard key={p.title} project={p} index={i} />
        ))}
      </div>
      <Reveal className="mt-12 text-center">
        <a href={PROFILE.github} target="_blank" rel="noopener" className="relative inline-flex items-center gap-2 text-ink/70 after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] underline decoration-teal-400/60 decoration-2 underline-offset-8 hover:text-ink">
          More on my GitHub <ArrowUpRight className="h-4 w-4" />
        </a>
      </Reveal>
    </Section>
  )
}
