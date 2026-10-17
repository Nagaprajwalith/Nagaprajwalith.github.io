import { AnimatePresence, motion } from 'motion/react'
import {
  BriefcaseBusiness, Copy, Cpu, CornerDownLeft, FileDown, Gauge, GraduationCap, Home, Mail, Moon, Search, UserRound, Workflow,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { PROFILE } from '@/data'
import { TECH } from '@/tech'
import { copyText, toast } from '@/lib/toast'
import { setLite, useLite } from '@/lib/lite'
import { cn } from '@/lib/utils'
import { scrollToId } from './shared'

type Item = { id: string; label: string; hint?: string; group: string; icon: ReactNode; run: () => void; keywords?: string }

// Open/close from anywhere: window.dispatchEvent(new Event('open-command-menu'))
export const openCommandMenu = () => window.dispatchEvent(new Event('open-command-menu'))

function toggleTheme() {
  // reuse the dock's animated toggler so the circular reveal still plays
  const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Switch light or dark theme"]')
  if (btn) btn.click()
  else document.documentElement.classList.toggle('dark')
}

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const lite = useLite()

  const items: Item[] = useMemo(() => {
    const go = (id: string) => () => scrollToId(id)
    return [
      { id: 'home', label: 'Home', group: 'Go to', icon: <Home />, run: go('home') },
      { id: 'about', label: 'About me', group: 'Go to', icon: <UserRound />, run: go('about') },
      { id: 'experience', label: 'Experience at Vanna Infotech', group: 'Go to', icon: <Workflow />, run: go('experience'), keywords: 'work job data engineer pipeline databricks azure dspm' },
      { id: 'projects', label: 'Projects', group: 'Go to', icon: <BriefcaseBusiness />, run: go('projects'), keywords: 'portfolio' },
      { id: 'skills', label: 'Skills', group: 'Go to', icon: <Cpu />, run: go('skills'), keywords: 'stack tech' },
      { id: 'education', label: 'Education & certifications', group: 'Go to', icon: <GraduationCap />, run: go('education') },
      { id: 'contact', label: 'Contact', group: 'Go to', icon: <Mail />, run: go('contact') },
      { id: 'copy', label: 'Copy email address', hint: PROFILE.email, group: 'Actions', icon: <Copy />, run: () => copyText(PROFILE.email, 'Email copied') },
      { id: 'mail', label: 'Write me an email', group: 'Actions', icon: <Mail />, run: () => (location.href = `mailto:${PROFILE.email}`) },
      { id: 'resume', label: 'Download résumé', group: 'Actions', icon: <FileDown />, run: () => window.open(PROFILE.resume, '_blank') },
      { id: 'github', label: 'Open GitHub', group: 'Actions', icon: <img src={TECH.github.src} alt="" className="dark:invert" />, run: () => window.open(PROFILE.github, '_blank') },
      { id: 'theme', label: 'Switch light / dark theme', group: 'Settings', icon: <Moon />, run: toggleTheme, keywords: 'mode dark light' },
      {
        id: 'lite', label: lite ? 'Turn effects back on' : 'Reduce effects (faster on slow devices)', group: 'Settings', icon: <Gauge />,
        run: () => { setLite(!lite); toast(lite ? 'Full effects on' : 'Lite mode on') }, keywords: 'performance lite speed animation',
      },
    ]
  }, [lite])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((i) => `${i.label} ${i.keywords ?? ''} ${i.group}`.toLowerCase().includes(s))
  }, [q, items])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-menu', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-menu', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => input.current?.focus(), 30)
    }
  }, [open])
  useEffect(() => setActive(0), [q])

  const run = (i: Item) => {
    setOpen(false)
    setTimeout(i.run, 120) // let the menu close before scrolling
  }

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); run(filtered[active]) }
  }

  let lastGroup = ''
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-[#060918]/40 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label="Command menu"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-2xl shadow-black/30"
            initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-4">
              <Search className="h-5 w-5 text-ink/40" />
              <input
                ref={input} value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search or jump to…"
                className="h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/40 focus-visible:outline-none"
                aria-label="Search commands"
              />
              <kbd className="rounded-md border border-ink/15 px-1.5 py-0.5 text-[11px] text-ink/50">Esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
              {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-ink/50">No matches. Try "projects" or "resume".</li>}
              {filtered.map((i, idx) => {
                const header = i.group !== lastGroup ? (lastGroup = i.group) : null
                return (
                  <li key={i.id}>
                    {header && <p className="px-3 pb-1 pt-3 text-xs text-ink/45">{header}</p>}
                    <button
                      onMouseEnter={() => setActive(idx)} onClick={() => run(i)}
                      className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors', idx === active ? 'bg-ink/[0.07] text-ink' : 'text-ink/75')}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink/[0.05] [&_img]:h-4 [&_img]:w-4 [&_svg]:h-4 [&_svg]:w-4">{i.icon}</span>
                      <span className="flex-1">{i.label}</span>
                      {i.hint && <span className="hidden text-xs text-ink/45 sm:inline">{i.hint}</span>}
                      {idx === active && <CornerDownLeft className="h-4 w-4 text-ink/40" />}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-ink/10 px-4 py-2.5 text-xs text-ink/45">
              <span>↑ ↓ to move, Enter to open</span>
              <span>Ctrl K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
