import { AnimatePresence, motion, useInView } from 'motion/react'
import { Dice5, FlaskConical } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BorderBeam } from '@/components/ui/border-beam'
import { predict, type CropModel } from '@/ml/forest'
import { cn } from '@/lib/utils'
import { TECH } from '@/tech'
import { Reveal, Section, SectionHeading, TechIcon } from './shared'

const EMOJI: Record<string, string> = {
  rice: '🌾', maize: '🌽', chickpea: '🫘', kidneybeans: '🫘', pigeonpeas: '🫛', mothbeans: '🫛', mungbean: '🫛',
  blackgram: '⚫', lentil: '🥣', pomegranate: '🍎', banana: '🍌', mango: '🥭', grapes: '🍇', watermelon: '🍉',
  muskmelon: '🍈', apple: '🍏', orange: '🍊', papaya: '🧡', coconut: '🥥', cotton: '☁️', jute: '🧵', coffee: '☕',
}
const NAMES: Record<string, string> = { kidneybeans: 'Kidney beans', pigeonpeas: 'Pigeon peas', mothbeans: 'Moth beans', mungbean: 'Mung bean', blackgram: 'Black gram' }
const label = (c: string) => NAMES[c] ?? c[0].toUpperCase() + c.slice(1)

const FIELDS = [
  { key: 'N', name: 'Nitrogen', unit: 'kg/ha', step: 1 },
  { key: 'P', name: 'Phosphorus', unit: 'kg/ha', step: 1 },
  { key: 'K', name: 'Potassium', unit: 'kg/ha', step: 1 },
  { key: 'temperature', name: 'Temperature', unit: '°C', step: 0.5 },
  { key: 'humidity', name: 'Humidity', unit: '%', step: 1 },
  { key: 'ph', name: 'Soil pH', unit: '', step: 0.1 },
  { key: 'rainfall', name: 'Rainfall', unit: 'mm', step: 5 },
] as const

// Real rows from the dataset, so each preset is a field the model has seen the like of
const PRESETS: { name: string; values: number[] }[] = [
  { name: 'Wet paddy', values: [90, 42, 43, 21, 82, 6.5, 205] },
  { name: 'Cool orchard', values: [20, 130, 200, 23, 92, 5.9, 110] },
  { name: 'Hot & dry', values: [100, 20, 30, 27, 80, 6.5, 50] },
  { name: 'Hill estate', values: [100, 25, 30, 25.5, 58, 6.8, 160] },
]

export function CropLab() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '300px' })
  const [model, setModel] = useState<CropModel | null>(null)
  const [values, setValues] = useState<number[]>(PRESETS[0].values)

  // The 70 KB model only downloads when the section is near the screen
  useEffect(() => {
    if (inView && !model) import('@/ml/crop-model.json').then((m) => setModel(m.default as unknown as CropModel))
  }, [inView, model])

  const result = useMemo(() => (model ? predict(model, values) : null), [model, values])
  const set = (i: number, v: number) => setValues((prev) => prev.map((p, j) => (j === i ? v : p)))
  const randomise = () => {
    if (!model) return
    setValues(FIELDS.map((f, i) => {
      const [lo, hi] = model.ranges[f.key]
      const v = lo + Math.random() * (hi - lo)
      return i === 5 ? +v.toFixed(1) : Math.round(v / f.step) * f.step
    }))
  }

  const importance = model ? Object.entries(model.importance).sort((a, b) => b[1] - a[1]) : []
  const maxImp = importance[0]?.[1] ?? 1

  return (
    <Section id="lab">
      <SectionHeading
        label="Live demo"
        title={<>Try <span className="text-gradient">Crop Intellect.</span></>}
        intro="This is a real random forest trained on the Crop Intellect dataset, running right here in your browser. Move the sliders to describe a field and it recommends a crop."
      />

      <Reveal>
        <div ref={ref} className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-surface p-5 shadow-2xl shadow-ink/5 md:p-9">
          <BorderBeam size={200} duration={10} colorFrom="#2dd4bf" colorTo="#fbbf24" />
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
            {/* Inputs */}
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setValues(p.values)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm transition',
                      values.join() === p.values.join()
                        ? 'border-teal-500/60 bg-teal-500/10 text-teal-700 dark:text-teal-300'
                        : 'border-ink/10 text-ink/70 hover:border-ink/30 hover:text-ink',
                    )}
                  >
                    {p.name}
                  </button>
                ))}
                <button onClick={randomise} className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3.5 py-1.5 text-sm text-ink/70 transition hover:border-ink/30 hover:text-ink">
                  <Dice5 className="h-4 w-4" /> Random field
                </button>
              </div>

              <div className="space-y-5">
                {FIELDS.map((f, i) => {
                  const [lo, hi] = model?.ranges[f.key] ?? [0, 100]
                  const pct = ((values[i] - lo) / (hi - lo)) * 100
                  return (
                    <label key={f.key} className="block">
                      <span className="mb-2 flex items-baseline justify-between text-sm">
                        <span className="font-medium text-ink/85">{f.name}</span>
                        <span className="font-display tabular-nums text-ink">
                          {values[i]}
                          <span className="ml-1 text-xs text-ink/50">{f.unit}</span>
                        </span>
                      </span>
                      <input
                        type="range"
                        min={Math.floor(lo)}
                        max={Math.ceil(hi)}
                        step={f.step}
                        value={values[i]}
                        disabled={!model}
                        onChange={(e) => set(i, +e.target.value)}
                        className="lab-range w-full"
                        style={{ '--fill': `${Math.max(0, Math.min(100, pct))}%` } as React.CSSProperties}
                        aria-label={`${f.name}${f.unit ? ` (${f.unit})` : ''}`}
                      />
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col">
              <div className="relative flex min-h-[15rem] flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-amber-400/15 p-6 text-center" aria-live="polite">
                {!result ? (
                  <p className="flex items-center gap-2 text-ink/60"><FlaskConical className="h-5 w-5 animate-pulse" /> Loading the model…</p>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={result.crop}
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-7xl drop-shadow-xl md:text-8xl" aria-hidden>{EMOJI[result.crop] ?? '🌱'}</span>
                      <span className="mt-3 text-sm text-ink/60">Recommended crop</span>
                      <span className="font-display text-4xl font-bold md:text-5xl">{label(result.crop)}</span>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {result && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-ink/60">How sure the forest is (share of trees voting)</p>
                  {result.ranking.map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 truncate text-sm">{EMOJI[r.crop]} {label(r.crop)}</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
                        <motion.div
                          className={cn('h-full rounded-full', i === 0 ? 'bg-gradient-to-r from-teal-400 to-emerald-500' : 'bg-ink/25')}
                          animate={{ width: `${Math.max(2, r.p * 100)}%` }}
                          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        />
                      </div>
                      <span className="w-12 text-right font-display text-sm tabular-nums">{Math.round(r.p * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Model card */}
          {model && (
            <div className="mt-10 grid gap-6 border-t border-ink/10 pt-8 md:grid-cols-[1fr_1.4fr]">
              <dl className="grid grid-cols-2 content-start gap-4">
                {[
                  ['Test accuracy', `${(model.metrics.holdout_accuracy * 100).toFixed(1)}%`],
                  ['5-fold CV', `${(model.metrics.cv_mean * 100).toFixed(1)}% ± ${(model.metrics.cv_std * 100).toFixed(1)}`],
                  ['Training rows', model.metrics.rows.toLocaleString()],
                  ['Crops', String(model.metrics.n_classes)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-ink/[0.04] p-4">
                    <dt className="text-xs text-ink/55">{k}</dt>
                    <dd className="mt-1 font-display text-xl font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="mb-3 text-sm text-ink/60">What the model pays most attention to</p>
                <div className="space-y-2">
                  {importance.map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-sm">{FIELDS.find((f) => f.key === k)?.name}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(v / maxImp) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs tabular-nums text-ink/60">{(v * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-ink/50">
                  {model.metrics.n_trees} trees, max depth {model.metrics.max_depth}, scikit-learn. Accuracy measured on 20% of the data held out from training.
                </p>
                <a href="https://github.com/Nagaprajwalith/CROP-INTELLECT" target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300">
                  <TechIcon {...TECH.github} className="h-4 w-4" /> Dataset and original project
                </a>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  )
}
