import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'

// Tiny global toast: call toast('Copied!') from anywhere
const listeners = new Set<(msg: string) => void>()
export function toast(msg: string) {
  listeners.forEach((l) => l(msg))
}

export async function copyText(text: string, msg = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text)
    toast(msg)
  } catch {
    toast(text) // clipboard blocked: at least show the text so it can be copied by hand
  }
}

export function Toaster() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([])
  useEffect(() => {
    const add = (msg: string) => {
      const id = Date.now() + Math.random()
      setItems((s) => [...s.slice(-2), { id, msg }])
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 2600)
    }
    listeners.add(add)
    return () => void listeners.delete(add)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-[95] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-xl shadow-ink/10"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
