import { Award, BrainCircuit, Download, MapPin, Sparkles } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { useInView } from 'motion/react'
import { MagicCard } from '@/components/ui/magic-card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { IconCloud } from '@/components/ui/icon-cloud'
import { Meteors } from '@/components/ui/meteors'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { CERTIFICATIONS, PROFILE, PROJECTS, STRENGTHS } from '@/data'
import { TECH } from '@/tech'
import { cn } from '@/lib/utils'
import { useLite } from '@/lib/lite'
import { Reveal, Section, SectionHeading } from './shared'

// Black logos would vanish in the dark cloud, so leave them out
const cloudImages = Object.values(TECH).filter((t) => !t.invert).map((t) => t.src)

function Tile({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className={cn('h-full', className)}>
      <MagicCard
        className="h-full overflow-hidden rounded-3xl border border-ink/[0.08]"
        gradientColor="var(--magic-tint)"
        gradientFrom="#2dd4bf"
        gradientTo="#8b5cf6"
        gradientOpacity={0.5}
      >
        <div className="relative h-full p-6 md:p-8">{children}</div>
      </MagicCard>
    </Reveal>
  )
}

// The icon cloud redraws every frame, so only keep it mounted while it's on screen
function LazyIconCloud() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '100px' })
  const lite = useLite()
  return (
    <div ref={ref} className="mt-2 flex min-h-[340px] items-center justify-center">
      {lite ? (
        <div className="grid grid-cols-4 gap-4">
          {cloudImages.map((src) => <img key={src} src={src} alt="" className="h-10 w-10" />)}
        </div>
      ) : (
        inView && <IconCloud images={cloudImages} showControl={false} />
      )}
    </div>
  )
}

export function About() {
  const lite = useLite()
  return (
    <Section id="about">
      <SectionHeading label="About me" title={<>Raw data in, <span className="text-gradient">trusted data out.</span></>} />

      <div className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 md:grid-cols-6">
        <Tile className="md:col-span-4 md:row-span-2">
          <BrainCircuit className="mb-6 h-9 w-9 text-teal-600 dark:text-teal-300" />
          <h3 className="font-display text-2xl font-semibold md:text-3xl">Hi, I'm Prajwalith 👋</h3>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/75">
            I'm a Data Engineer at Vanna Infotech, where I build PySpark and Azure Databricks pipelines for an enterprise
            Teradata-to-cloud migration. I like the unglamorous parts that make data trustworthy: validation, lineage and
            clean, well-modelled tables.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-[var(--muted)]">
            Before that I studied Computer Science with an AI & ML specialisation at Neil Gogte Institute of Technology,
            built a crop recommender, an AI pricing engine and a blockchain evidence system, and trained in data security
            with Sonata Software.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {STRENGTHS.map((s) => (
              <li key={s} className="rounded-full border border-ink/10 bg-ink/[0.04] px-3.5 py-1.5 text-sm text-ink/80">
                {s}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile className="md:col-span-2 md:row-span-2" delay={0.1}>
          <p className="text-sm text-ink/60">{'My toolbox'}{lite ? '.' : ', in 3D. Drag it.'}</p>
          <LazyIconCloud />
        </Tile>

        <Tile className="md:col-span-2" delay={0.05}>
          <p className="text-sm text-ink/60">B.Tech CGPA</p>
          <p className="mt-2 font-display text-6xl font-bold">
            <NumberTicker value={8.0} decimalPlaces={1} className="text-gradient" />
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">CSE, specialising in AI & ML</p>
        </Tile>

        <Tile className="md:col-span-2" delay={0.1}>
          {!lite && <Meteors number={14} />}
          <MapPin className="h-7 w-7 text-amber-600 dark:text-amber-300" />
          <p className="mt-4 font-display text-2xl font-semibold">Hyderabad</p>
          <p className="mt-1 text-sm text-[var(--muted)]">India, and happy to relocate or work remotely</p>
        </Tile>

        <Tile className="md:col-span-2" delay={0.15}>
          <div className="flex gap-8">
            <div>
              <p className="font-display text-5xl font-bold text-teal-600 dark:text-teal-300">
                <NumberTicker value={PROJECTS.length} className="text-teal-600 dark:text-teal-300" />
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">Projects</p>
            </div>
            <div>
              <p className="font-display text-5xl font-bold text-violet-600 dark:text-violet-300">
                <NumberTicker value={CERTIFICATIONS.length} className="text-violet-600 dark:text-violet-300" />
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">Certifications</p>
            </div>
          </div>
          <Award className="absolute right-6 top-6 h-7 w-7 text-ink/20" />
        </Tile>

        <Tile className="md:col-span-6" delay={0.1}>
          <BorderBeam size={120} duration={8} colorFrom="#2dd4bf" colorTo="#fbbf24" />
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-300" />
              <div>
                <p className="font-display text-xl font-semibold md:text-2xl">Data engineering, with AI in the toolkit</p>
                <p className="mt-1 text-[var(--muted)]">Pipelines, migration and data quality today; ML, LLMs and RAG whenever the problem calls for them.</p>
              </div>
            </div>
            <a href={PROFILE.resume} download>
              <ShimmerButton background="linear-gradient(110deg,#0d1330,#1b1446)" shimmerColor="#fbbf24" className="gap-2 px-6 py-3 font-semibold">
                <Download className="h-4 w-4" /> Get my résumé
              </ShimmerButton>
            </a>
          </div>
        </Tile>
      </div>
    </Section>
  )
}
