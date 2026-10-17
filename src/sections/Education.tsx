import { BadgeCheck, GraduationCap } from 'lucide-react'
import { Timeline } from '@/components/ui/timeline'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { CERTIFICATIONS, EDUCATION } from '@/data'
import { Reveal, Section, SectionHeading } from './shared'

export function Education() {
  const data = EDUCATION.map((e) => ({
    title: e.period,
    content: (
      <CardContainer containerClassName="py-0 justify-start" className="w-full">
        <CardBody className="group/card relative h-auto w-full max-w-xl rounded-3xl border border-ink/10 bg-gradient-to-br from-ink/[0.06] to-ink/[0.01] p-7">
          <CardItem translateZ={40} className="flex items-center gap-3 text-teal-600 dark:text-teal-300">
            <GraduationCap className="h-6 w-6" />
            <span className="text-sm text-ink/60">{e.detail}</span>
          </CardItem>
          <CardItem translateZ={60} as="h3" className="mt-4 font-display text-xl font-semibold md:text-2xl">
            {e.title}
          </CardItem>
          <CardItem translateZ={40} as="p" className="mt-2 text-[var(--muted)]">
            {e.school}
          </CardItem>
          <CardItem translateZ={80} className="mt-6 inline-flex rounded-full bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-1.5 font-display text-sm font-bold text-[#060918]">
            {e.score}
          </CardItem>
        </CardBody>
      </CardContainer>
    ),
  }))

  return (
    <Section id="education">
      <SectionHeading label="Education" title={<>Where I <span className="text-gradient">learned.</span></>} />
      <Timeline data={data} />

      <Reveal className="mt-16">
        <h3 className="mb-6 font-display text-2xl font-semibold">Certifications</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {CERTIFICATIONS.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-2xl border border-ink/[0.08] bg-ink/[0.03] px-5 py-4 transition hover:-translate-y-0.5 hover:border-amber-300/40">
              <BadgeCheck className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
              <span className="text-ink/85">{c}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
