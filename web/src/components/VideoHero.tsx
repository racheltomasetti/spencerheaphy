'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState, useSyncExternalStore} from 'react'
import {MediaItemView} from '@/components/MediaItemView'
import {useNavVisibility} from '@/components/NavVisibilityProvider'
import type {Project} from '@/sanity/lib/types'

const AUTO_ADVANCE_MS = 6500
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

function subscribeToBreakpoint(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_BREAKPOINT)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToBreakpoint,
    () => window.matchMedia(DESKTOP_BREAKPOINT).matches,
    () => true,
  )
}

function heroMediaFor(project: Project, isDesktop: boolean) {
  if (!isDesktop) return project.heroMediaMobile ?? project.heroMedia ?? project.coverMedia
  return project.heroMedia ?? project.coverMedia
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

export function VideoHero({projects}: {projects: Project[]}) {
  const [slide, setSlide] = useState(0)
  const isDesktop = useIsDesktop()
  const searchParams = useSearchParams()
  const {heroRef, menuOpen} = useNavVisibility()
  const paused = searchParams.get('project') !== null || menuOpen
  const count = projects.length

  useEffect(() => {
    if (count <= 1 || paused) return
    const id = setInterval(() => setSlide((s) => (s + 1) % count), AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [count, paused])

  if (count === 0) {
    return (
      <div
        id="top"
        ref={heroRef}
        className="relative h-dvh min-h-[540px] w-full overflow-hidden bg-foreground"
      >
        <PlaceholderHero />
      </div>
    )
  }

  const nextIndex = (slide + 1) % count
  const active = projects[slide]
  const meta = [active.client, active.category, active.year].filter(Boolean).join(' · ')

  return (
    <div
      id="top"
      ref={heroRef}
      className="relative h-dvh min-h-[540px] w-full overflow-hidden bg-foreground"
    >
      {projects.map((project, index) => {
        if (index !== slide && index !== nextIndex) return null
        return (
          <div
            key={project._id}
            className="absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{opacity: index === slide ? 1 : 0}}
          >
            <MediaItemView
              media={heroMediaFor(project, isDesktop)}
              alt={project.title}
              className="h-full w-full object-cover"
              placeholderLabel={`Reel — ${project.title}`}
              placeholderVariant="dark"
            />
          </div>
        )
      })}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,19,16,.5)_0%,rgba(20,19,16,0)_26%,rgba(20,19,16,0)_55%,rgba(20,19,16,.62)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-8 text-background">
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-background/55">
            {String(slide + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <span className="font-serif text-[clamp(28px,3.6vw,50px)] leading-none tracking-[-0.025em]">
            {active.title}
          </span>
          {meta && (
            <span className="text-[11px] uppercase tracking-[0.14em] text-background/62">{meta}</span>
          )}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href={`/?project=${active.slug}`}
            scroll={false}
            className="whitespace-nowrap border-b border-background/50 pb-1 text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-background"
          >
            View project
          </Link>
          {count > 1 && (
            <div className="flex gap-2.5">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setSlide((s) => (s + count - 1) % count)}
                className="flex h-11 w-11 items-center justify-center border border-background/34 text-[15px] transition-colors hover:bg-background/14"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setSlide((s) => (s + 1) % count)}
                className="flex h-11 w-11 items-center justify-center border border-background/34 text-[15px] transition-colors hover:bg-background/14"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
