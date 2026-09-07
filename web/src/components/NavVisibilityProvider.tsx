'use client'

import {createContext, useCallback, useContext, useRef, useState} from 'react'

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
  const [scrolled, setScrolled] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const heroRef = useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect()
    observerRef.current = null

    if (!node) {
      setScrolled(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      {rootMargin: '-70px 0px 0px 0px', threshold: 0},
    )
    observer.observe(node)
    observerRef.current = observer
  }, [])

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
