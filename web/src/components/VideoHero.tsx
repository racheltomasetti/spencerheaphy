'use client'

import {useEffect, useState} from 'react'

const DESKTOP_BREAKPOINT = '(min-width: 768px)'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_BREAKPOINT)
    setIsDesktop(mql.matches)
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

function LoopVideo({src}: {src: string}) {
  return (
    <video className="h-full w-full object-cover" src={src} autoPlay muted loop playsInline />
  )
}

function PlaceholderHero() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 animate-[hero-drift_12s_ease-in-out_infinite] bg-[linear-gradient(120deg,#1d1c18,#2a2823,#141310,#232019)] bg-[length:200%_200%]" />
      <p className="relative text-[10px] uppercase tracking-[0.25em] text-background/40">
        Reel coming soon
      </p>
    </div>
  )
}

export function VideoHero({desktopSrc, mobileSrc}: {desktopSrc?: string; mobileSrc?: string}) {
  const isDesktop = useIsDesktop()
  const src = isDesktop ? desktopSrc : mobileSrc

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-foreground">
      {src ? <LoopVideo src={src} /> : <PlaceholderHero />}
    </div>
  )
}
