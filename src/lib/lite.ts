import { useSyncExternalStore } from 'react'

// "Lite mode" swaps the heaviest effects (WebGL aurora, 3D icon cloud, meteors, beams)
// for static versions. It turns on automatically for reduced-motion users and low-power
// devices, and can be toggled from the command menu (the choice is remembered).
const KEY = 'lite'

function autoLite() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return true
  if ((nav.deviceMemory ?? 8) <= 2) return true
  if ((nav.hardwareConcurrency ?? 8) <= 2) return true
  return false
}

function read(): boolean {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === '1') return true
    if (saved === '0') return false
  } catch {
    /* storage blocked */
  }
  return autoLite()
}

let lite = read()
const subs = new Set<() => void>()
document.documentElement.classList.toggle('lite', lite)

export function setLite(next: boolean) {
  lite = next
  try {
    localStorage.setItem(KEY, next ? '1' : '0')
  } catch {
    /* storage blocked */
  }
  document.documentElement.classList.toggle('lite', next)
  subs.forEach((s) => s())
}

export function useLite() {
  return useSyncExternalStore(
    (cb) => (subs.add(cb), () => void subs.delete(cb)),
    () => lite,
  )
}
