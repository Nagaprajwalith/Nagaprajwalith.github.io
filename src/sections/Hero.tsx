import { motion } from 'motion/react'
import { ArrowDown, Download, MapPin } from 'lucide-react'
import Aurora from '@/components/Aurora'
import ProfileCard from '@/components/ProfileCard'
import { Spotlight } from '@/components/ui/spotlight-new'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { WordRotate } from '@/components/ui/word-rotate'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { PHOTO, PROFILE, ROTATING_ROLES } from '@/data'
import { useIsDark } from '@/lib/use-theme'
import { useLite } from '@/lib/lite'
import { scrollToId } from './shared'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] as const },
})

// Each word in one solid colour; letters still rise in one by one
function NameWord({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const chars = [...text]
  return (
    <span className={'block whitespace-nowrap pb-2 [perspective:600px] ' + (className ?? '')} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 80, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          whileHover={{ y: -12, scale: 1.12, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
          transition={{ duration: 0.9, delay: delay + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const dark = useIsDark()
  const lite = useLite()
  return (
    <header id="home" className="relative isolate flex min-h-svh items-center overflow-hidden">
      {/* backgrounds */}
      <div className={dark ? 'absolute inset-0 -z-10 opacity-80' : 'absolute inset-0 -z-10 opacity-60'}>
        {lite ? (
          <div className="h-full w-full bg-[radial-gradient(40%_50%_at_25%_20%,rgba(45,212,191,.35),transparent),radial-gradient(40%_50%_at_60%_10%,rgba(139,92,246,.4),transparent),radial-gradient(35%_45%_at_90%_25%,rgba(251,191,36,.3),transparent)]" />
        ) : (
          <Aurora key={dark ? 'd' : 'l'} lightMode={!dark} colorStops={['#2dd4bf', '#8b5cf6', '#fbbf24']} amplitude={1.1} blend={0.55} speed={0.6} />
        )}
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_75%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      {ready && !lite && <Spotlight />}

      {ready && (
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-28 pt-24 md:px-8 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <motion.div {...rise(0)} className="mb-7 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.05] px-4 py-1.5 text-sm backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <AnimatedShinyText className="mx-0 text-ink/70">Data Engineer at Vanna Infotech</AnimatedShinyText>
            </motion.div>

            <h1 className="font-display text-[clamp(2.5rem,6vw,5.4rem)] font-bold leading-[0.95] tracking-tight">
              <NameWord text="Naga" />
              <NameWord text="Prajwalith" delay={0.3} />
            </h1>

            <motion.div {...rise(0.5)} className="mt-6 flex flex-wrap items-baseline gap-x-3 text-xl text-ink/80 md:text-2xl">
              <span>I build</span>
              <WordRotate words={ROTATING_ROLES} duration={2400} className="font-display text-xl font-semibold text-amber-600 dark:text-amber-300 md:text-2xl" />
            </motion.div>

            <div className="mt-6 max-w-xl">
              <TextGenerateEffect words={PROFILE.summary} duration={0.6} className="font-sans text-base font-normal text-[var(--muted)] md:text-lg [&_*]:!font-normal [&_*]:!text-[var(--muted)] [&_div]:!text-base md:[&_div]:!text-lg [&_div]:!leading-relaxed" />
            </div>

            <motion.div {...rise(0.9)} className="mt-9 flex flex-wrap items-center gap-4">
              <ShimmerButton onClick={() => scrollToId('experience')} background="linear-gradient(110deg,#0d1330,#1b1446)" shimmerColor="#5eead4" className="px-7 py-3.5 text-base font-semibold">
                See my work
              </ShimmerButton>
              <a href={PROFILE.resume} download className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/[0.04] px-6 py-3.5 font-semibold backdrop-blur transition hover:border-ink/40 hover:bg-ink/10">
                <Download className="h-4 w-4" /> Download résumé
              </a>
            </motion.div>

            <motion.p {...rise(1.05)} className="mt-8 flex items-center gap-2 text-sm text-ink/50">
              <MapPin className="h-4 w-4" /> {PROFILE.location}
              <span className="ml-4 hidden items-center gap-1.5 [@media(hover:hover)]:inline-flex">
                Press <kbd className="rounded-md border border-ink/20 px-1.5 py-0.5 font-sans text-[11px]">Ctrl K</kbd> to jump anywhere
              </span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: -25 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="mx-auto w-full max-w-[340px] [perspective:1200px]"
          >
            <ProfileCard
              avatarUrl={PHOTO}
              miniAvatarUrl={PHOTO}
              name={PROFILE.name}
              title={PROFILE.role}
              handle={PROFILE.handle}
              status="Data Engineer"
              contactText="Contact"
              theme={dark ? 'dark' : 'light'}
              holo={0.9}
              enableTilt
              enableMobileTilt
              onContactClick={() => scrollToId('contact')}
            />
          </motion.div>
        </div>
      )}

      <motion.button
        onClick={() => scrollToId('about')}
        aria-label="Scroll to About"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 rounded-full border border-ink/15 p-3 text-ink/60 md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </header>
  )
}
