import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import ClickSpark from '@/components/ClickSpark'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { Intro } from '@/sections/Intro'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Experience } from '@/sections/Experience'
import { Projects } from '@/sections/Projects'
import { CommandMenu } from '@/sections/CommandMenu'
import { Toaster } from '@/lib/toast'
import { Skills, VelocityBand } from '@/sections/Skills'
import { Education } from '@/sections/Education'
import { Contact } from '@/sections/Contact'
import { Nav } from '@/sections/Nav'
import { smooth } from '@/sections/shared'

export default function App() {
  const [ready, setReady] = useState(false)

  // Buttery smooth scrolling (off for people who prefer reduced motion)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // lerp 0.12 keeps the glide but follows the wheel closely; touch devices keep native scrolling
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true })
    smooth.lenis = lenis
    let id = 0
    const raf = (t: number) => {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      smooth.lenis = null
    }
  }, [])

  return (
    <ClickSpark sparkColor={['#2dd4bf', '#8b5cf6', '#fbbf24']} sparkCount={10} sparkRadius={26} shape="star" className="min-h-svh">
      <Intro onDone={() => setReady(true)} />
      <ScrollProgress className="top-0 z-[70] h-[3px] bg-gradient-to-r from-teal-400 via-violet-500 to-amber-400" />
      <main>
        <Hero ready={ready} />
        <About />
        <Experience />
        <VelocityBand />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      {ready && <Nav />}
      <CommandMenu />
      <Toaster />
    </ClickSpark>
  )
}
