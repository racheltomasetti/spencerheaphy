'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {MediaItemView} from '@/components/MediaItemView'
import {useNavVisibility} from '@/components/NavVisibilityProvider'
import type {Project} from '@/sanity/lib/types'

const DESKTOP_BREAKPOINT = '(min-width: 768px)'
const LOOP_REPEATS = 20
const IMAGE_ADVANCE_MS = 8000
const SWIPE_THRESHOLD = 50
const CROSSFADE_MS = 600

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

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
}

function heroMediaFor(project: Project, isDesktop: boolean) {
  if (!isDesktop) return project.heroMediaMobile ?? project.heroMedia ?? project.coverMedia
  return project.heroMedia ?? project.coverMedia
}

function isVideoSlide(project: Project, isDesktop: boolean) {
  const media = heroMediaFor(project, isDesktop)
  return media?.mediaType === 'video' && Boolean(media.video?.asset?.url)
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

// Soft top and bottom scrims so the nav and the caption hold up over bright footage.
function HeroScrims() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-[linear-gradient(to_bottom,rgba(0,0,0,.25),rgba(0,0,0,.12)_50%,rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-[linear-gradient(to_top,rgba(0,0,0,.5),rgba(0,0,0,.25)_50%,rgba(0,0,0,0))]" />
    </>
  )
}

// Keyed by project so it remounts, and fades in shortly after each slide has settled.
function HeroCaption({project}: {project: Project}) {
  return (
    <div
      key={project._id}
      className="flex min-w-0 animate-[hero-caption-in_450ms_ease_150ms_both] flex-col gap-3 motion-reduce:animate-none"
    >
      {project.subheader && <span className="type-project-subhead">{project.subheader}</span>}
      <span className="type-project-title">{project.title}</span>
    </div>
  )
}

function HeroCounter({slide, count}: {slide: number; count: number}) {
  if (count <= 1) return null
  const pad = (value: number) => String(value).padStart(2, '0')

  return (
    <span
      className="type-project-subhead shrink-0 tabular-nums"
      aria-label={`Slide ${slide + 1} of ${count}`}
    >
      {pad(slide + 1)} / {pad(count)}
    </span>
  )
}

export function VideoHero({projects}: {projects: Project[]}) {
  const [slide, setSlide] = useState(0)
  const isDesktop = useIsDesktop()
  const searchParams = useSearchParams()
  const {heroRef} = useNavVisibility()
  // Only an open project covers the hero. The menu is a compact dropdown now, so the
  // slides keep playing and advancing underneath it.
  const paused = searchParams.get('project') !== null
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  // Hovering the hero, keyboard focus inside it, or a reduced-motion preference holds the
  // slide in place: nothing auto-advances and videos loop until the hold is released.
  const hold = hovered || focused || reducedMotion
  const count = projects.length
  const scrollRef = useRef<HTMLDivElement>(null)
  const swipeStartX = useRef<number | null>(null)
  const [visibleLoopIndex, setVisibleLoopIndex] = useState(0)

  const [direction, setDirection] = useState<1 | -1>(1)

  const advance = useCallback(
    (delta: number) => {
      if (count <= 1) return
      if (isDesktop) {
        setDirection(delta > 0 ? 1 : -1)
        setSlide((current) => (current + delta + count) % count)
        return
      }
      const node = scrollRef.current
      if (!node) return
      const loopIndex = Math.round(node.scrollLeft / node.clientWidth)
      node.scrollTo({left: (loopIndex + delta) * node.clientWidth, behavior: 'smooth'})
    },
    [count, isDesktop],
  )

  const goPrev = useCallback(() => advance(-1), [advance])
  const goNext = useCallback(() => advance(1), [advance])

  useEffect(() => {
    if (count <= 1 || paused) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev()
      else if (event.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [count, paused, goPrev, goNext])

  const loopedProjects =
    count > 1 ? Array.from({length: LOOP_REPEATS}, () => projects).flat() : projects
  const startCopy = Math.floor(LOOP_REPEATS / 2)

  useLayoutEffect(() => {
    if (isDesktop || count <= 1) return
    const node = scrollRef.current
    if (!node) return
    const start = startCopy * count
    node.scrollLeft = start * node.clientWidth
    setVisibleLoopIndex(start)
  }, [isDesktop, count, startCopy])

  useEffect(() => {
    if (isDesktop || count <= 1) return
    const node = scrollRef.current
    if (!node) return
    const onScroll = () => {
      const loopIndex = Math.round(node.scrollLeft / node.clientWidth)
      const real = ((loopIndex % count) + count) % count
      setVisibleLoopIndex(loopIndex)
      setSlide((current) => (real !== current ? real : current))
    }
    node.addEventListener('scroll', onScroll, {passive: true})
    return () => node.removeEventListener('scroll', onScroll)
  }, [isDesktop, count])

  // The slide that just changed away stays mounted under the incoming one until the
  // slide transition is done, so the picture never dips to black between videos.
  const prevSlide = useRef(slide)
  const [leaving, setLeaving] = useState<number | null>(null)

  useEffect(() => {
    if (prevSlide.current === slide) return
    setLeaving(prevSlide.current)
    prevSlide.current = slide
    const timer = window.setTimeout(() => setLeaving(null), CROSSFADE_MS)
    return () => window.clearTimeout(timer)
  }, [slide])

  const active = projects[slide]
  const activeIsVideo = active ? isVideoSlide(active, isDesktop) : false

  useEffect(() => {
    if (count <= 1 || paused || hold || activeIsVideo) return
    const timer = window.setTimeout(goNext, IMAGE_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [count, paused, hold, activeIsVideo, slide, goNext])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDesktop || count <= 1) return
    if ((event.target as HTMLElement).closest('button, a')) return
    swipeStartX.current = event.clientX
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current == null) return
    const delta = event.clientX - swipeStartX.current
    swipeStartX.current = null
    if (delta > SWIPE_THRESHOLD) goPrev()
    else if (delta < -SWIPE_THRESHOLD) goNext()
  }

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
          {loopedProjects.map((project, loopIndex) => {
            const isActiveCopy = !paused && loopIndex === visibleLoopIndex
            return (
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
                  videoActive={isActiveCopy}
                  playsBeforeAdvance={hold ? undefined : 2}
                  onAdvance={goNext}
                />
              </Link>
            )
          })}
        </div>

        <HeroScrims />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-(--edge) pb-(--edge) text-background">
          <HeroCaption project={active} />
          <HeroCounter slide={slide} count={count} />
        </div>
      </div>
    )
  }

  const nextIndex = (slide + 1) % count
  const prevIndex = (slide - 1 + count) % count

  return (
    <div
      id="top"
      ref={heroRef}
      className="group relative h-dvh min-h-[540px] w-full overflow-hidden bg-foreground"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) setFocused(true)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipeStartX.current = null
      }}
    >
      {projects.map((project, index) => {
        if (index !== slide && index !== nextIndex && index !== prevIndex && index !== leaving)
          return null
        const isCurrent = index === slide
        const isLeaving = index === leaving
        // Current sits centered; the leaving slide exits in the direction of travel; the
        // preloaded next/prev slides wait just off-screen, ready to slide in.
        const offset = isCurrent
          ? 0
          : isLeaving
            ? direction === 1
              ? -100
              : 100
            : index === nextIndex
              ? 100
              : -100
        return (
          <div
            key={project._id}
            className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
            style={{
              transform: `translateX(${offset}%)`,
              zIndex: isCurrent ? 2 : isLeaving ? 1 : 0,
            }}
          >
            <MediaItemView
              media={heroMediaFor(project, isDesktop)}
              alt={project.title}
              className="h-full w-full object-cover"
              placeholderLabel={`Reel — ${project.title}`}
              placeholderVariant="dark"
              videoActive={(isCurrent || index === leaving) && !paused}
              videoPreload="auto"
              playsBeforeAdvance={isCurrent && !hold ? 2 : undefined}
              onAdvance={goNext}
            />
          </div>
        )
      })}

      <HeroScrims />

      {/* Desktop hover only: the arrows fade in while the pointer is over the hero (or when
          one takes keyboard focus) and stay out of the way otherwise. */}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="left-(--edge) absolute top-1/2 z-10 -translate-y-1/2 p-2 text-[22px] text-background opacity-0 pointer-events-none transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 motion-reduce:transition-none"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="right-(--edge) absolute top-1/2 z-10 -translate-y-1/2 p-2 text-[22px] text-background opacity-0 pointer-events-none transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 motion-reduce:transition-none"
          >
            →
          </button>
        </>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 px-(--edge) pb-(--edge) text-background">
        <Link
          href={`/?project=${active.slug}`}
          scroll={false}
          className="pointer-events-auto min-w-0"
        >
          <HeroCaption project={active} />
        </Link>
        <HeroCounter slide={slide} count={count} />
      </div>
    </div>
  )
}
