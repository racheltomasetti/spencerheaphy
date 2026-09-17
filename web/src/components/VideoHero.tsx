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

const SCRIM =
  'pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,19,16,.5)_0%,rgba(20,19,16,0)_26%,rgba(20,19,16,0)_55%,rgba(20,19,16,.62)_100%)]'

function HeroCaption({project}: {project: Project}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-serif text-[clamp(28px,3.6vw,50px)] leading-none tracking-[-0.025em]">
        {project.title}
      </span>
      {project.year && (
        <span className="text-[11px] uppercase tracking-[0.14em] text-background/62">
          {project.year}
        </span>
      )}
    </div>
  )
}

function HeroDots({
  count,
  slide,
  onSelect,
}: {
  count: number
  slide: number
  onSelect: (index: number) => void
}) {
  if (count <= 1) return null

  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
      {Array.from({length: count}, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-label={`Go to slide ${index + 1}`}
          aria-selected={index === slide}
          onClick={() => onSelect(index)}
          className={`size-1.5 rounded-full transition-colors ${
            index === slide ? 'bg-background' : 'bg-background/35 hover:bg-background/55'
          }`}
        />
      ))}
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const swipeStartX = useRef<number | null>(null)
  const [visibleLoopIndex, setVisibleLoopIndex] = useState(0)

  const advance = useCallback(
    (delta: number) => {
      if (count <= 1) return
      if (isDesktop) {
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

  const goTo = useCallback(
    (index: number) => {
      if (count <= 1) return
      if (isDesktop) {
        setSlide(index)
        return
      }
      const node = scrollRef.current
      if (!node) return
      const loopIndex = Math.round(node.scrollLeft / node.clientWidth)
      const copy = Math.floor(loopIndex / count)
      node.scrollTo({left: (copy * count + index) * node.clientWidth, behavior: 'smooth'})
    },
    [count, isDesktop],
  )

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

  const active = projects[slide]
  const activeIsVideo = active ? isVideoSlide(active, isDesktop) : false

  useEffect(() => {
    if (count <= 1 || paused || activeIsVideo) return
    const timer = window.setTimeout(goNext, IMAGE_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [count, paused, activeIsVideo, slide, goNext])

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
                  playsBeforeAdvance={2}
                  onAdvance={goNext}
                />
              </Link>
            )
          })}
        </div>

        <div className={SCRIM} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-2.5 p-8 pb-14 text-background">
          <HeroCaption project={active} />
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <HeroDots count={count} slide={slide} onSelect={goTo} />
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
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipeStartX.current = null
      }}
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
              videoActive={index === slide && !paused}
              playsBeforeAdvance={2}
              onAdvance={goNext}
            />
          </div>
        )
      })}

      <div className={SCRIM} />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute top-1/2 left-8 z-10 -translate-y-1/2 text-[22px] text-background/80 transition-colors hover:text-background"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute top-1/2 right-8 z-10 -translate-y-1/2 text-[22px] text-background/80 transition-colors hover:text-background"
          >
            →
          </button>
        </>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-8 pb-14 text-background">
        <Link href={`/?project=${active.slug}`} scroll={false} className="pointer-events-auto">
          <HeroCaption project={active} />
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <HeroDots count={count} slide={slide} onSelect={goTo} />
      </div>
    </div>
  )
}
