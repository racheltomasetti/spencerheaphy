'use client'

import {useEffect, useRef, useState} from 'react'

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

function HeroCaption({caption, showReelHint}: {caption?: string; showReelHint: boolean}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/10 px-6 text-center">
      <h1 className="font-serif text-4xl font-normal uppercase tracking-[0.08em] text-background sm:text-6xl md:text-7xl">
        Spencer Heaphy
      </h1>
      {caption && (
        <p className="text-xs uppercase tracking-[0.2em] text-background/70">{caption}</p>
      )}
      {showReelHint && (
        <p className="text-[10px] uppercase tracking-[0.25em] text-background/40">
          Reel coming soon
        </p>
      )}
    </div>
  )
}

/** Full-bleed video whose playback position is driven by scroll position, not time. */
function ScrollScrubVideo({src, caption}: {src: string; caption?: string}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current
    if (!wrapper || !video) return

    let rafId: number | null = null
    let ready = false

    const update = () => {
      if (!ready) return
      const rect = wrapper.getBoundingClientRect()
      const scrollableDistance = rect.height - window.innerHeight
      const progress =
        scrollableDistance > 0 ? Math.min(1, Math.max(0, -rect.top / scrollableDistance)) : 0
      if (Number.isFinite(video.duration)) {
        video.currentTime = progress * video.duration
      }
    }

    const onLoadedMetadata = () => {
      ready = true
      update()
    }

    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        update()
      })
    }

    video.pause()
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    window.addEventListener('scroll', onScroll, {passive: true})
    update()

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [src])

  return (
    <div ref={wrapperRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-foreground">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          muted
          playsInline
          preload="auto"
        />
        <HeroCaption caption={caption} showReelHint={false} />
      </div>
    </div>
  )
}

function SimpleLoopVideo({src, caption}: {src: string; caption?: string}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-foreground">
      <video
        className="h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
      />
      <HeroCaption caption={caption} showReelHint={false} />
    </div>
  )
}

function PlaceholderHero({caption}: {caption?: string}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-foreground">
      <div className="absolute inset-0 animate-[hero-drift_12s_ease-in-out_infinite] bg-[linear-gradient(120deg,#1d1c18,#2a2823,#141310,#232019)] bg-[length:200%_200%]" />
      <HeroCaption caption={caption} showReelHint />
    </div>
  )
}

export function VideoHero({
  desktopSrc,
  mobileSrc,
  caption,
}: {
  desktopSrc?: string
  mobileSrc?: string
  caption?: string
}) {
  const isDesktop = useIsDesktop()

  if (isDesktop && desktopSrc) {
    return <ScrollScrubVideo src={desktopSrc} caption={caption} />
  }

  if (!isDesktop && mobileSrc) {
    return <SimpleLoopVideo src={mobileSrc} caption={caption} />
  }

  return <PlaceholderHero caption={caption} />
}
