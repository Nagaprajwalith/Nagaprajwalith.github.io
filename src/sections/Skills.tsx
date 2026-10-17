import { Marquee } from '@/components/ui/marquee'
import SpotlightCard from '@/components/SpotlightCard'
import ScrollVelocity from '@/components/ScrollVelocity'
import { SKILL_GROUPS } from '@/data'
import { TECH } from '@/tech'
import { SkillIcon } from '@/skill-icons'
import { useIsDark } from '@/lib/use-theme'
import { Reveal, Section, SectionHeading, TechIcon } from './shared'

const all = Object.values(TECH)
const half = Math.ceil(all.length / 2)

function Logo({ t }: { t: (typeof all)[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/[0.08] bg-ink/[0.03] px-5 py-3.5 transition hover:border-teal-300/40 hover:bg-ink/[0.07]">
      <TechIcon {...t} className="h-8 w-8" />
      <span className="font-medium text-ink/80">{t.name}</span>
    </div>
  )
}

export function VelocityBand() {
  return (
    <div className="relative border-y border-ink/[0.06] bg-ink/[0.015] py-8" aria-hidden>
      <ScrollVelocity
        texts={['PySpark ✦ Azure Databricks ✦ Delta Lake ✦ ETL ✦ ', 'Medallion architecture ✦ Machine learning ✦ LLMs ✦ SQL ✦ ']}
        velocity={60}
        className="font-display text-4xl font-bold tracking-tight text-ink/[0.14] md:text-7xl"
      />
    </div>
  )
}

export function Skills() {
  const dark = useIsDark()
  return (
    <Section id="skills">
      <SectionHeading
        label="Skills"
        title={<>The <span className="text-gradient">stack</span> I work with.</>}
        intro="From Spark pipelines on Azure to ML models and LLM apps."
      />

      <Reveal className="relative -mx-5 mb-16 md:-mx-8">
        <Marquee pauseOnHover className="[--duration:35s]">
          {all.slice(0, half).map((t) => <Logo key={t.name} t={t} />)}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:35s]">
          {all.slice(half).map((t) => <Logo key={t.name} t={t} />)}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[var(--bg)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[var(--bg)]" />
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06} className="h-full">
            <SpotlightCard className="h-full rounded-3xl p-7" spotlightColor="rgba(45, 212, 191, 0.25)" theme={dark ? 'dark' : 'light'}>
              <h3 className="font-display text-lg font-semibold">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="inline-flex items-center gap-2 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-sm text-ink/75">
                    <SkillIcon name={s} /> {s}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
