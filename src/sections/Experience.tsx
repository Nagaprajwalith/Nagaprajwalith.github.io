import { AnimatePresence, motion, useInView } from 'motion/react'
import { BarChart3, Building2, Crown, Database, GitBranch, Layers, ShieldCheck, Sparkles, Wand2, ArrowRightLeft, Check } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { EXPERIENCE, TOOLS_BUILT } from '@/data'
import { useLite } from '@/lib/lite'
import { cn } from '@/lib/utils'
import { SkillIcon } from '@/skill-icons'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Reveal, Section, SectionHeading, scrollToId } from './shared'

/* ---------- Medallion pipeline ---------- */

const STAGES = [
  { key: 'src', name: 'Teradata', sub: 'Source', icon: <Database />, color: '#64748b', text: 'Legacy enterprise warehouse: the tables and views being migrated to the cloud.' },
  { key: 'bronze', name: 'Bronze', sub: 'Raw', icon: <Layers />, color: '#c2782f', text: 'Azure Data Factory lands raw ingests in Delta Lake exactly as they arrive, so nothing is lost and every load can be replayed.' },
  { key: 'silver', name: 'Silver', sub: 'Cleansed', icon: <Sparkles />, color: '#94a3b8', text: 'PySpark jobs on Databricks deduplicate, type, conform and validate the data against Teradata.' },
  { key: 'gold', name: 'Gold', sub: 'Business-ready', icon: <Crown />, color: '#eab308', text: 'Aggregated, modelled tables shaped for the questions the business actually asks.' },
  { key: 'use', name: 'Reports', sub: 'Consumers', icon: <BarChart3 />, color: 'var(--teal)', text: 'Reporting and analytics teams read from Gold, with numbers they can trust.' },
]

function Pipe({ from, to, lite }: { from: string; to: string; lite: boolean }) {
  return (
    <div
      className="pipe mt-[25px] h-[3px] min-w-[8px] flex-1 rounded-full md:mt-[34px]"
      style={{ background: `linear-gradient(90deg, ${from}, ${to})`, opacity: 0.85 }}
      aria-hidden
    >
      {!lite && [0, 1, 2].map((i) => <i key={i} style={{ animationDelay: `${i * 0.6}s`, background: to }} />)}
    </div>
  )
}

function Pipeline() {
  const lite = useLite()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-80px' })
  const [active, setActive] = useState(1)
  const [pinned, setPinned] = useState(false)

  // walk through the layers on its own until someone picks one
  useEffect(() => {
    if (!inView || pinned) return
    const t = setInterval(() => setActive((a) => (a + 1) % STAGES.length), 2600)
    return () => clearInterval(t)
  }, [inView, pinned])

  const s = STAGES[active]
  return (
    <div ref={ref}>
      <div className="flex items-start">
        {STAGES.map((st, i) => (
          <div key={st.key} className="contents">
            {i > 0 && <Pipe from={STAGES[i - 1].color} to={st.color} lite={lite} />}
            <button
              onClick={() => { setActive(i); setPinned(true) }}
              aria-pressed={active === i}
              className="group flex shrink-0 flex-col items-center gap-1.5 rounded-2xl p-1 text-center md:w-24 md:gap-2 md:p-1.5"
            >
              <motion.span
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 md:h-[60px] md:w-[60px] md:rounded-2xl [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-6 md:[&_svg]:w-6"
                style={{ borderColor: st.color, color: st.color }}
                animate={{ scale: active === i ? 1.08 : 1, backgroundColor: active === i ? 'color-mix(in srgb, currentColor 16%, transparent)' : 'color-mix(in srgb, currentColor 4%, transparent)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {active === i && (
                  <motion.span layoutId="stage-ring" className="absolute -inset-1 rounded-[0.9rem] border md:-inset-1.5 md:rounded-[1.1rem]" style={{ borderColor: st.color }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} />
                )}
                {st.icon}
              </motion.span>
              <span>
                <span className="block font-display text-[11px] font-semibold md:text-sm">{st.name}</span>
                <span className="hidden text-xs text-[var(--muted)] md:block">{st.sub}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 min-h-[4.5rem] rounded-2xl border border-ink/[0.08] bg-ink/[0.03] px-5 py-4" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={s.key}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-[15px] leading-relaxed text-ink/80"
          >
            <span className="font-semibold" style={{ color: s.color }}>{s.name}. </span>{s.text}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-xs text-ink/45">{pinned ? 'Click any layer to read about it.' : 'Click a layer to stop the tour and read about it.'}</p>
    </div>
  )
}

/* ---------- Lineage tracer ---------- */

const NODES = [
  { id: 'a', label: 'src.orders', x: 6, y: 18 },
  { id: 'b', label: 'src.customers', x: 6, y: 112 },
  { id: 'f', label: 'src.products', x: 6, y: 65 },
  { id: 'c', label: 'v_orders_clean', x: 130, y: 30 },
  { id: 'd', label: 'v_customer_dim', x: 130, y: 100 },
  { id: 'e', label: 'rpt_sales', x: 254, y: 65 },
]
const EDGES: [string, string][] = [['a', 'c'], ['f', 'c'], ['b', 'd'], ['c', 'e'], ['d', 'e']]
const W = 100, H = 26

function upstream(id: string, acc = new Set<string>()) {
  acc.add(id)
  EDGES.filter(([, t]) => t === id).forEach(([f]) => upstream(f, acc))
  return acc
}

function Lineage() {
  const [sel, setSel] = useState('e')
  const lit = useMemo(() => upstream(sel), [sel])
  const pos = Object.fromEntries(NODES.map((n) => [n.id, n]))
  return (
    <div>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 360 145" className="w-full min-w-[300px]" role="img" aria-label="Lineage graph: click a table or view to trace its sources">
          {EDGES.map(([f, t]) => {
            const a = pos[f], b = pos[t]
            const x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2
            const on = lit.has(f) && lit.has(t)
            const d = `M${x1},${y1} C${x1 + 14},${y1} ${x2 - 14},${y2} ${x2},${y2}`
            return (
              <g key={f + t}>
                <path d={d} fill="none" stroke="currentColor" className="text-ink/15" strokeWidth={1.5} />
                {on && (
                  <motion.path
                    key={sel}
                    d={d} fill="none" stroke="var(--teal)" strokeWidth={2.2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                )}
              </g>
            )
          })}
          {NODES.map((n) => {
            const on = lit.has(n.id)
            return (
              <g key={n.id} onClick={() => setSel(n.id)} className="cursor-pointer" role="button" aria-label={`Trace ${n.label}`}>
                <rect
                  x={n.x} y={n.y} width={W} height={H} rx={7}
                  fill={on ? 'color-mix(in srgb, var(--teal) 16%, transparent)' : 'var(--surface)'}
                  stroke={n.id === sel ? 'var(--teal)' : on ? 'color-mix(in srgb, var(--teal) 60%, transparent)' : 'color-mix(in srgb, var(--fg) 18%, transparent)'}
                  strokeWidth={n.id === sel ? 2 : 1.2}
                  style={{ transition: 'fill .3s, stroke .3s' }}
                />
                <text x={n.x + W / 2} y={n.y + H / 2 + 3.5} textAnchor="middle" fontSize={10} fill="var(--fg)" opacity={on ? 1 : 0.55} style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {n.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="mt-3 text-xs text-ink/50">Click any box to trace where its data comes from. Sample names, not client data.</p>
    </div>
  )
}

/* ---------- DDL converter ---------- */

const DDL: { td: string; dl: string }[] = [
  { td: 'CREATE MULTISET TABLE sales.orders (', dl: 'CREATE TABLE sales.orders (' },
  { td: '  order_id  INTEGER NOT NULL,', dl: '  order_id  INT NOT NULL,' },
  { td: '  region    VARCHAR(40) CHARACTER SET LATIN,', dl: '  region    STRING,' },
  { td: '  amount    DECIMAL(12,2),', dl: '  amount    DECIMAL(12,2),' },
  { td: '  order_ts  TIMESTAMP(0),', dl: '  order_ts  TIMESTAMP,' },
  { td: "  order_dt  DATE FORMAT 'YYYY-MM-DD'", dl: '  order_dt  DATE' },
  { td: ') PRIMARY INDEX (order_id);', dl: ') USING DELTA;' },
]

function DdlDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const [delta, setDelta] = useState(false)
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setDelta(true), 1400)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <div ref={ref}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-ink/10 p-1 text-xs font-semibold">
          {['Teradata', 'Delta Lake'].map((l, i) => (
            <button
              key={l}
              onClick={() => setDelta(i === 1)}
              className={cn('relative rounded-full px-3 py-1.5 transition-colors after:absolute after:inset-x-0 after:-inset-y-2 after:content-[""]', delta === (i === 1) ? 'text-[var(--bg)]' : 'text-ink/60 hover:text-ink')}
            >
              {delta === (i === 1) && <motion.span layoutId="ddl-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className="relative">{l}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setDelta((d) => !d)} className="relative inline-flex items-center gap-1.5 text-xs text-ink/60 after:absolute after:-inset-3 after:content-[''] hover:text-ink">
          <ArrowRightLeft className="h-3.5 w-3.5" /> Convert
        </button>
      </div>
      <pre className="overflow-x-auto rounded-2xl border border-ink/[0.08] bg-[#0b1028] p-4 text-[12.5px] leading-6 text-slate-200" data-lenis-prevent>
        <code>
          {DDL.map((l, i) => {
            const changed = l.td !== l.dl
            return (
              <div key={i} className="relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={delta ? 'd' : 't'}
                    className={cn('block whitespace-pre rounded px-1', changed && delta && 'bg-teal-400/15 text-teal-200')}
                    initial={changed ? { opacity: 0, x: delta ? 12 : -12 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={changed ? { opacity: 0, x: delta ? -12 : 12 } : undefined}
                    transition={{ duration: 0.22, delay: changed ? i * 0.05 : 0 }}
                  >
                    {delta ? l.dl : l.td}
                  </motion.span>
                </AnimatePresence>
              </div>
            )
          })}
        </code>
      </pre>
      <p className="mt-3 text-xs text-ink/50">An illustrative example of the kind of mapping the tool automates.</p>
    </div>
  )
}

/* ---------- DSPM scan ---------- */

const SCAN = [
  { col: 'customer_email', tag: 'PII', c: 'bg-rose-500/15 text-rose-600 dark:text-rose-300' },
  { col: 'card_number', tag: 'Financial', c: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
  { col: 'date_of_birth', tag: 'PII', c: 'bg-rose-500/15 text-rose-600 dark:text-rose-300' },
  { col: 'product_name', tag: 'Public', c: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
]

function ScanVisual() {
  const lite = useLite()
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-ink/[0.03] p-4">
      {!lite && <div className="scanline pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--teal)_22%,transparent)] to-transparent" aria-hidden />}
      <ul className="relative space-y-2">
        {SCAN.map((r) => (
          <li key={r.col} className="flex items-center justify-between rounded-lg bg-[var(--surface)] px-3 py-2 text-sm">
            <code className="text-ink/75">{r.col}</code>
            <span className={cn('rounded-md px-2 py-0.5 text-xs font-semibold', r.c)}>{r.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Section ---------- */

function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('h-full rounded-3xl border border-ink/[0.08] bg-[var(--surface)] p-6 md:p-8', className)}>{children}</div>
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="inline-flex items-center gap-2 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-sm text-ink/75">
          <SkillIcon name={s} /> {s}
        </li>
      ))}
    </ul>
  )
}

// "1 yr 3 mos", counted inclusively like LinkedIn does
function duration(start: string, end?: string) {
  const [y1, m1] = start.split('-').map(Number)
  const now = new Date()
  const [y2, m2] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1]
  const total = (y2 - y1) * 12 + (m2 - m1) + 1
  const y = Math.floor(total / 12)
  const m = total % 12
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ')
}

// Industry program, then the full-time role, drawn as one continuous track
function CareerTrack() {
  const steps = [...EXPERIENCE].reverse()
  return (
    <div className="relative mb-10 grid gap-2 md:grid-cols-2 md:gap-0">
      <motion.div
        aria-hidden
        className="absolute left-[20px] top-[23px] hidden h-[2px] origin-left bg-gradient-to-r from-ink/20 to-[var(--teal)] md:block"
        style={{ right: "calc(50% - 20px)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
      />
      {steps.map((j, i) => (
        <Reveal key={j.org} delay={0.15 + i * 0.35}>
          <button
            onClick={() => scrollToId(j.current ? 'job-card' : 'program-card')}
            className="flex w-full items-start gap-4 rounded-2xl p-2 text-left transition hover:bg-ink/[0.04] md:flex-col md:gap-3"
          >
            <span
              className={cn(
                'relative mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 bg-[var(--bg)]',
                j.current ? 'border-[var(--teal)]' : 'border-ink/25',
              )}
            >
              <span className={cn('h-2 w-2 rounded-full', j.current ? 'bg-[var(--teal)]' : 'bg-ink/30')} />
              {j.current && <span className="absolute inset-0 animate-ping rounded-full border border-[var(--teal)] opacity-60" />}
            </span>
            <span>
              <span className="block text-sm text-[var(--muted)]">
                {j.period}, {duration(j.start, j.end)}
              </span>
              <span className="mt-0.5 block font-display text-lg font-semibold">{j.role}</span>
              <span className="block text-sm text-ink/70">
                {j.org}, {j.kind.toLowerCase()}
              </span>
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  )
}

function Stat({ big, label }: { big: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-ink/[0.03] px-5 py-4">
      <p className="font-display text-2xl font-bold md:text-3xl">{big}</p>
      <p className="mt-1 text-sm leading-snug text-[var(--muted)]">{label}</p>
    </div>
  )
}

export function Experience() {
  const [job, training] = EXPERIENCE
  const toolVisuals = [<Lineage key="l" />, <DdlDemo key="d" />]
  const toolIcons = [<GitBranch key="l" className="h-5 w-5" />, <Wand2 key="d" className="h-5 w-5" />]

  return (
    <Section id="experience">
      <SectionHeading
        label="Experience"
        title={<>Where I've <span className="text-gradient">worked.</span></>}
        intro="An industry program in data security, then a full-time data engineering role."
      />

      <CareerTrack />

      <Reveal>
        <div id="job-card" className="scroll-mt-6">
          <Card className="relative overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink text-[var(--bg)]">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold md:text-3xl">{job.role}</h3>
                  <p className="mt-1 text-ink/75">
                    {job.org}
                    {job.client && <span className="text-[var(--muted)]">, for {job.client}</span>}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1.5 sm:items-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {job.period}
                </span>
                <span className="px-1 text-sm text-[var(--muted)]">{duration(job.start)}</span>
              </div>
            </div>

            <p className="mt-7 max-w-2xl font-display text-xl font-semibold leading-snug md:text-2xl">
              Moving an enterprise data warehouse from Teradata to Azure Databricks.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat
                big={<><NumberTicker value={50} className="text-[var(--teal)]" /><span className="text-[var(--teal)]"> views</span></>}
                label="Complex semantic views my lineage tool traces in one run"
              />
              <Stat
                big={<><span className="text-ink/40 line-through decoration-2">Days</span> <span className="text-[var(--teal)]">Automated</span></>}
                label="Manual lineage tracing replaced by the tool"
              />
              <Stat big="Bronze → Gold" label="Medallion layers I build and maintain on Delta Lake" />
            </div>

            <div className="mt-8">
              <Pipeline />
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
              <ul className="space-y-3">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--teal)]" /> {p}
                  </li>
                ))}
              </ul>
              <div>
                <p className="mb-3 text-sm text-ink/55">Day-to-day stack</p>
                <Chips items={job.stack} />
              </div>
            </div>
          </Card>
        </div>
      </Reveal>

      <Reveal className="mb-5 mt-14">
        <h3 className="font-display text-2xl font-semibold">Tools I built on the job</h3>
        <p className="mt-2 text-[var(--muted)]">
          Manual migration work was slowing the team down, so I automated it. Both demos are interactive.
        </p>
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-2">
        {TOOLS_BUILT.map((t, i) => (
          // min-w-0: a grid item won't shrink below its widest content by default, so the long DDL lines
          // pushed this card past the screen edge on phones; now the code box scrolls inside the card
          <Reveal key={t.title} delay={i * 0.08} className="h-full min-w-0">
            <Card className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--teal)_14%,transparent)] text-[var(--teal)]">
                  {toolIcons[i]}
                </span>
                <h4 className="font-display text-lg font-semibold">{t.title}</h4>
              </div>
              <dl className="mb-6 mt-5 space-y-3 text-[15px] leading-relaxed">
                <div>
                  <dt className="text-sm font-semibold text-ink/50">The problem</dt>
                  <dd className="text-ink/75">{t.problem}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink/50">What I built</dt>
                  <dd className="text-ink/75">{t.built}</dd>
                </div>
                <div className="rounded-xl border-l-[3px] border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_8%,transparent)] px-4 py-2.5">
                  <dt className="text-sm font-semibold text-[var(--teal)]">The result</dt>
                  <dd className="font-medium text-ink/90">{t.result}</dd>
                </div>
              </dl>
              <div className="mt-auto">{toolVisuals[i]}</div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <div id="program-card" className="scroll-mt-6">
          <Card>
            <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-[var(--teal)]" />
                  <h3 className="font-display text-xl font-semibold md:text-2xl">{training.role}</h3>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--violet)_14%,transparent)] px-3 py-1 font-semibold text-[var(--violet)]">
                    {training.kind}
                  </span>
                  <span className="rounded-full border border-ink/10 px-3 py-1 text-ink/60">
                    {training.period}, {duration(training.start, training.end)}
                  </span>
                </div>
                <p className="mt-3 text-ink/75">
                  {training.org}. {training.summary}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {training.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <ScanVisual />
            </div>
          </Card>
        </div>
      </Reveal>
    </Section>
  )
}
