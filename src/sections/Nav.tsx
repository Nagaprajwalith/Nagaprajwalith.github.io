import { motion } from 'motion/react'
import { BriefcaseBusiness, Workflow, Command, Cpu, FileDown, GraduationCap, Home, Mail, UserRound } from 'lucide-react'
import { openCommandMenu } from './CommandMenu'
import { useEffect, useState, type ReactNode } from 'react'
import { Dock, DockIcon } from '@/components/ui/dock'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { PROFILE } from '@/data'
import { TECH } from '@/tech'
import linkedinIcon from 'devicon/icons/linkedin/linkedin-plain.svg'
import { cn } from '@/lib/utils'
import { scrollToId } from './shared'

// `phone: false` items are hidden on narrow screens to keep the dock on-screen; they stay in the Ctrl K menu
const SECTIONS: { id: string; label: string; icon: ReactNode; phone?: boolean }[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" />, phone: false },
  { id: 'about', label: 'About', icon: <UserRound className="h-5 w-5" /> },
  { id: 'experience', label: 'Experience', icon: <Workflow className="h-5 w-5" /> },
  { id: 'projects', label: 'Projects', icon: <BriefcaseBusiness className="h-5 w-5" /> },
  { id: 'skills', label: 'Skills', icon: <Cpu className="h-5 w-5" /> },
  { id: 'education', label: 'Education', icon: <GraduationCap className="h-5 w-5" />, phone: false },
  { id: 'contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
]

function Tip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group/tip relative grid h-full w-full place-items-center">
      {children}
      <span className="pointer-events-none absolute -top-11 whitespace-nowrap rounded-md border border-ink/10 bg-[#0d1330] px-2.5 py-1 text-xs text-white opacity-0 transition group-hover/tip:opacity-100">
        {label}
      </span>
    </span>
  )
}

// Floating macOS-style dock (Magic UI) that tracks the current section
export function Nav() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const narrow = typeof window !== 'undefined' && window.innerWidth < 480
  const btn = 'grid h-full w-full place-items-center rounded-full transition-colors'

  return (
    <motion.nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 120, damping: 16 }}
    >
      <Dock
        iconSize={narrow ? 34 : 40}
        iconMagnification={narrow ? 34 : 58}
        disableMagnification={narrow}
        className="mt-0 h-[52px] gap-1 sm:h-[58px] sm:gap-1.5 border-ink/10 bg-surface/70 px-2 backdrop-blur-md supports-backdrop-blur:bg-surface/60"
      >
        {SECTIONS.filter((s) => !narrow || s.phone !== false).map((s) => (
          <DockIcon key={s.id} className={cn(active === s.id ? 'bg-ink/10 text-ink' : 'text-ink/60 hover:text-ink')}>
            <Tip label={s.label}>
              <button className={btn} onClick={() => scrollToId(s.id)} aria-label={s.label} aria-current={active === s.id}>
                {s.icon}
              </button>
            </Tip>
          </DockIcon>
        ))}
        <div className="mx-1 h-8 w-px self-center bg-ink/15" />
        <DockIcon className="text-ink/70 hover:text-ink">
          <Tip label="Search (Ctrl K)">
            <button className={btn} onClick={openCommandMenu} aria-label="Open command menu">
              <Command className="h-5 w-5" />
            </button>
          </Tip>
        </DockIcon>
        {!narrow && (
        <DockIcon>
          <Tip label="GitHub">
            <a className={btn} href={PROFILE.github} target="_blank" rel="noopener" aria-label="GitHub">
              <img src={TECH.github.src} alt="" className="h-5 w-5 dark:invert" />
            </a>
          </Tip>
        </DockIcon>
        )}
        {!narrow && PROFILE.linkedin && (
          <DockIcon>
            <Tip label="LinkedIn">
              <a className={btn} href={PROFILE.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
                <img src={linkedinIcon} alt="" className="h-5 w-5" />
              </a>
            </Tip>
          </DockIcon>
        )}
        <DockIcon className="text-ink/70 hover:text-ink">
          <Tip label="Light / dark">
            <AnimatedThemeToggler duration={650} className={btn + ' [&_svg]:h-5 [&_svg]:w-5'} aria-label="Switch light or dark theme" />
          </Tip>
        </DockIcon>
        {!narrow && (
        <DockIcon className="text-amber-600 dark:text-amber-300">
          <Tip label="Résumé">
            <a className={btn} href={PROFILE.resume} download aria-label="Download résumé">
              <FileDown className="h-5 w-5" />
            </a>
          </Tip>
        </DockIcon>
        )}
      </Dock>
    </motion.nav>
  )
}
