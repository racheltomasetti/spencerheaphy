'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore} from 'react'
import {MediaItemView} from '@/components/MediaItemView'
import {useNavVisibility} from '@/components/NavVisibilityProvider'
import type {Project} from '@/sanity/lib/types'

const DESKTOP_BREAKPOINT = '(min-width: 768px)'
// The mobile strip repeats the project list this many times so a normal
// swipe session — even someone testing it aggressively — never reaches
// either physical end. No programmatic scroll repositioning needed at all.
const LOOP_REPEATS = 20

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

const SCRIM =
  'pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,19,16,.5)_0%,rgba(20,19,16,0)_26%,rgba(20,19,16,0)_55%,rgba(20,19,16,.62)_100%)]'

export function VideoHero({projects}: {projects: Project[]}) {
  const [slide, setSlide] = useState(0)
  const isDesktop = useIsDesktop()
  const searchParams = useSearchParams()
  const {heroRef, menuOpen} = useNavVisibility()
  const paused = searchParams.get('project') !== null || menuOpen
  const count = projects.length
  const scrollRef = useRef<HTMLDivElement>(null)
  const goPrev = useCallback(() => setSlide((s) => (s + count - 1) % count), [count])
  const goNext = useCallback(() => setSlide((s) => (s + 1) % count), [count])

  // Desktop navigates via the on-screen arrows or the keyboard, both wrapping
  // infinitely in either direction — no auto-advance on either breakpoint.
  useEffect(() => {
    if (!isDesktop || count <= 1 || paused) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev()
      else if (event.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDesktop, count, paused, goPrev, goNext])

  const loopedProjects =
    count > 1 ? Array.from({length: LOOP_REPEATS}, () => projects).flat() : projects
  const startCopy = Math.floor(LOOP_REPEATS / 2)

  // Land in the middle copy before paint, so there's equal room to swipe
  // "backward" as there is "forward" before either physical end.
  useLayoutEffect(() => {
    if (isDesktop || count <= 1) return
    const node = scrollRef.current
    if (!node) return
    node.scrollLeft = startCopy * count * node.clientWidth
  }, [isDesktop, count, startCopy])

  // On mobile, `slide` (for the caption/counter) follows scroll position —
  // just modulo back into the real project range, no repositioning needed.
  useEffect(() => {
    if (isDesktop || count <= 1) return
    const node = scrollRef.current
    if (!node) return
    const onScroll = () => {
      const loopIndex = Math.round(node.scrollLeft / node.clientWidth)
      const real = ((loopIndex % count) + count) % count
      setSlide((current) => (real !== current ? real : current))
    }
    node.addEventListener('scroll', onScroll, {passive: true})
    return () => node.removeEventListener('scroll', onScroll)
  }, [isDesktop, count])

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

  const active = projects[slide]

  if (!isDesktop) {
    return (
      <div
        id="top"
        ref={heroRef}
        className="relative h-dvh min-h-[540px] w-full overflow-hidden bg-foreground"
      >
        <div
          ref={scrollRef}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        >
          {loopedProjects.map((project, loopIndex) => (
            <Link
              key={`${project._id}-${loopIndex}`}
              href={`/?project=${project.slug}`}
              scroll={false}
              className="relative block h-full w-full flex-none snap-center snap-always"
            >
              <MediaItemView
                media={heroMediaFor(project, false)}
                alt={project.title}
                className="h-full w-full object-cover"
                placeholderLabel={`Reel — ${project.title}`}
                placeholderVariant="dark"
              />
            </Link>
          ))}
        </div>

        <div className={SCRIM} />

        {/* Caption sits on top of the slide but doesn't intercept taps — the
            whole slide underneath is the link, so this is browsable by tapping
            anywhere, not just the text. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-2.5 p-8 text-background">
          <span className="text-[10px] uppercase tracking-[0.2em] text-background/55">
            {String(slide + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <span className="font-serif text-[clamp(28px,3.6vw,50px)] leading-none tracking-[-0.025em]">
            {active.title}
          </span>
          {active.year && (
            <span className="text-[11px] uppercase tracking-[0.14em] text-background/62">
              {active.year}
            </span>
          )}
        </div>
      </div>
    )
  }

  const nextIndex = (slide + 1) % count

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

      <div className={SCRIM} />

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-8 text-background">
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-background/55">
            {String(slide + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <span className="font-serif text-[clamp(28px,3.6vw,50px)] leading-none tracking-[-0.025em]">
            {active.title}
          </span>
          {active.year && (
            <span className="text-[11px] uppercase tracking-[0.14em] text-background/62">
              {active.year}
            </span>
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
                onClick={goPrev}
                className="flex h-11 w-11 items-center justify-center border border-background/34 text-[15px] transition-colors hover:bg-background/14"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={goNext}
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
