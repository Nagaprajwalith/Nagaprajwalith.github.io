import { Mail, MapPin, Phone, ArrowUpRight, Copy } from 'lucide-react'
import { copyText } from '@/lib/toast'
import { useLite } from '@/lib/lite'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { BorderBeam } from '@/components/ui/border-beam'
import { PROFILE } from '@/data'
import { TECH } from '@/tech'
import linkedinIcon from 'devicon/icons/linkedin/linkedin-plain.svg'
import { Reveal, TechIcon } from './shared'

export function Contact() {
  const lite = useLite()
  const rows = [
    { icon: <Mail className="h-5 w-5 text-teal-600 dark:text-teal-300" />, label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { icon: <Phone className="h-5 w-5 text-violet-600 dark:text-violet-300" />, label: 'Phone', value: PROFILE.phone, href: PROFILE.phoneHref },
    { icon: <TechIcon {...TECH.github} className="h-5 w-5" />, label: 'GitHub', value: '@' + PROFILE.handle, href: PROFILE.github },
    ...(PROFILE.linkedin
      ? [{ icon: <TechIcon src={linkedinIcon} name="LinkedIn" className="h-5 w-5" />, label: 'LinkedIn', value: 'Connect with me', href: PROFILE.linkedin }]
      : []),
    { icon: <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-300" />, label: 'Location', value: PROFILE.location },
  ]

  return (
    <section id="contact" className="relative isolate overflow-hidden px-5 py-28 md:px-8 md:py-40">
      {!lite && <BackgroundBeams className="-z-10" />}
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-8xl">
            Let's build <span className="text-gradient">something.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-lg text-lg text-[var(--muted)]">
            Working on data pipelines, migration or an AI idea? I'm always happy to talk. My inbox is open.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <a href={`mailto:${PROFILE.email}`}>
            <ShimmerButton background="linear-gradient(110deg,#0d1330,#1b1446)" shimmerColor="#5eead4" className="gap-2 px-9 py-4 text-lg font-semibold">
              <Mail className="h-5 w-5" /> Email me
            </ShimmerButton>
          </a>
        </Reveal>

        <Reveal delay={0.3} className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-3xl border border-ink/10 bg-surface/70 p-2 text-left">
          <BorderBeam size={160} duration={9} colorFrom="#2dd4bf" colorTo="#8b5cf6" />
          <ul className="divide-y divide-ink/[0.06]">
            {rows.map((r) => {
              const inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink/[0.06]">{r.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-ink/45">{r.label}</span>
                    <span className="block truncate font-medium text-ink/90">{r.value}</span>
                  </span>
                  {r.href && <ArrowUpRight className="h-5 w-5 text-ink/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />}
                </>
              )
              return (
                <li key={r.label} className="relative">
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener" className="group flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-ink/[0.05]">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 px-4 py-4">{inner}</div>
                  )}
                  {r.label === 'Email' && (
                    <button
                      onClick={() => copyText(PROFILE.email, 'Email copied')}
                      aria-label="Copy email address"
                      className="absolute right-14 top-1/2 -translate-y-1/2 rounded-lg border border-ink/10 p-2 text-ink/50 transition hover:border-ink/30 hover:text-ink"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>

      <footer className="mx-auto mt-28 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-ink/[0.06] pt-8 pb-20 text-sm text-ink/40">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <p>Built with React, Magic UI, Aceternity UI and React Bits</p>
      </footer>
    </section>
  )
}
