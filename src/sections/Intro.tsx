import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import DecryptedText from '@/components/DecryptedText'
import { PROFILE } from '@/data'

// Opening curtain: the name decrypts, then the curtain lifts to reveal the page
export function Intro({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setShow(false), reduce ? 200 : 1900)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] grid place-items-center bg-[var(--bg)]"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center">
            <DecryptedText
              text={PROFILE.name}
              animateOn="view"
              sequential
              speed={45}
              revealDirection="start"
              parentClassName="font-display text-3xl font-semibold tracking-tight md:text-6xl"
              className="text-ink"
              encryptedClassName="text-teal-600 dark:text-teal-300/70"
            />
            <motion.div
              className="mx-auto mt-6 h-[2px] w-56 origin-left bg-gradient-to-r from-teal-400 via-violet-500 to-amber-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
