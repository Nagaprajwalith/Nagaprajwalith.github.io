import { useEffect, useState } from 'react'

// Tracks the `dark` class on <html> (set by the inline script in index.html and the theme toggler)
export function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const root = document.documentElement
    const mo = new MutationObserver(() => setDark(root.classList.contains('dark')))
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return dark
}
