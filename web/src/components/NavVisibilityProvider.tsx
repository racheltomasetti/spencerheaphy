'use client'

import {usePathname} from 'next/navigation'
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react'

interface NavVisibilityContextValue {
  /** True once the hero has scrolled out of view (or on pages with no hero at all). */
  scrolled: boolean
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  /** Callback ref — attach to a page's hero element to drive `scrolled`. */
  heroRef: (node: HTMLElement | null) => void
}

const NavVisibilityContext = createContext<NavVisibilityContextValue | null>(null)

export function NavVisibilityProvider({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const onHome = pathname === '/'
  const [heroInView, setHeroInView] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pathRef = useRef(pathname)

  // Arriving home: treat the hero as in view in this commit so the bar is already
  // transparent. Do not wait for an effect or the observer — that is what was
  // leaving a cream bar to fade off after the page had switched.
  if (pathRef.current !== pathname) {
    pathRef.current = pathname
    if (onHome && !heroInView) setHeroInView(true)
  }

  const heroRef = useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (!node) return

    let primed = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        // The first reading can be false before layout. Ignore it so we don't
        // flash cream and then fade it out.
        if (!primed) {
          primed = true
          if (entry.isIntersecting) setHeroInView(true)
          return
        }
        setHeroInView(entry.isIntersecting)
      },
      {rootMargin: '-70px 0px 0px 0px', threshold: 0},
    )
    observer.observe(node)
    observerRef.current = observer
  }, [])

  const scrolled = !onHome || !heroInView

  useEffect(() => {
    document.documentElement.classList.toggle('on-home', onHome)
    return () => document.documentElement.classList.remove('on-home')
  }, [onHome])

  return (
    <NavVisibilityContext.Provider value={{scrolled, menuOpen, setMenuOpen, heroRef}}>
      {children}
    </NavVisibilityContext.Provider>
  )
}

export function useNavVisibility() {
  const context = useContext(NavVisibilityContext)
  if (!context) {
    throw new Error('useNavVisibility must be used within a NavVisibilityProvider')
  }
  return context
}
