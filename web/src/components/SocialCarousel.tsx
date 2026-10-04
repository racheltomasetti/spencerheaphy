'use client'

import {usePathname, useRouter} from 'next/navigation'
import {useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react'
import {LazyVideo} from '@/components/LazyVideo'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

// The social work as one row of 9:16 cards with the current one centred on the screen.
// The row steps a card at a time: arrow keys, the on-screen arrows, or a finger swipe.
// It loops, so there is no first or last card. The centred video plays; clicking the
// centred card opens the project, and clicking a side card brings it to the centre.

// Room kept under the card for the caption. The card is centred in the stage, so the
// same amount stays clear above it. Narrow screens stack the title and subheader, so
// they need a taller gap than the single shared line.
const CAPTION_ROOM = 68
const NARROW_CAPTION_ROOM = 96
const NARROW_STAGE = 768
// On a narrow screen a full-height card would be nearly as wide as the screen; cap its
// width so the neighbours still show at the edges.
const MAX_WIDTH_SHARE = 0.74
const SWIPE_THRESHOLD = 40
// Paused videos sit on a frame a little way in, since opening frames are often black.
const STILL_AT = '#t=0.8'

const wrap = (value: number, count: number) => ((value % count) + count) % count

function CardMedia({project, active}: {project: Project; active: boolean}) {
  const media = project.coverMedia
  const className = 'absolute inset-0 h-full w-full object-cover'

  if (project.status === 'undisclosed') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)]">
        <span className="type-project-subhead text-foreground/45 [--project-subhead-size:10px]">Undisclosed</span>
      </div>
    )
  }
  if (media?.mediaType === 'video' && media.video?.asset?.url) {
    return (
      <LazyVideo
        src={`${media.video.asset.url}${STILL_AT}`}
        className={className}
        active={active}
        preload="metadata"
      />
    )
  }
  return (
    <MediaItemView
      media={media}
      alt=""
      width={720}
      height={1280}
      className={className}
      placeholderLabel="Cover media pending"
    />
  )
}

// The same typed arrow as the hero. A text character sits wherever its font's metrics
// put it, and the arrow comes from a different font on each system, so it can't be
// centred by a fixed nudge. This measures the ink of the arrow as this browser draws
// it and places it so the ink's centre is the circle's centre.
const CIRCLE = 40
const ARROW_SIZE = 20

function Arrow({glyph}: {glyph: '←' | '→'}) {
  const ref = useRef<SVGTextElement>(null)
  const [at, setAt] = useState<{x: number; y: number} | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const context = document.createElement('canvas').getContext('2d')
      if (!context) return
      const style = getComputedStyle(node)
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      const ink = context.measureText(glyph)
      // Text is drawn from its left origin on its baseline; the ink runs from
      // -actualBoundingBoxLeft to +actualBoundingBoxRight, and from ascent above the
      // baseline to descent below it.
      setAt({
        x: CIRCLE / 2 - (ink.actualBoundingBoxRight - ink.actualBoundingBoxLeft) / 2,
        y: CIRCLE / 2 + (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2,
      })
    }
    measure()
    // The arrow's font may still be loading on the first pass.
    document.fonts?.ready.then(measure)
  }, [glyph])

  return (
    <svg aria-hidden viewBox={`0 0 ${CIRCLE} ${CIRCLE}`} className="absolute inset-0 h-full w-full">
      <text
        ref={ref}
        x={at?.x ?? 0}
        y={at?.y ?? 0}
        fontSize={ARROW_SIZE}
        fill="currentColor"
        opacity={at ? 1 : 0}
      >
        {glyph}
      </text>
    </svg>
  )
}

export function SocialCarousel({projects}: {projects: Project[]}) {
  const router = useRouter()
  const pathname = usePathname()
  const stageRef = useRef<HTMLDivElement>(null)
  const swipeStartX = useRef<number | null>(null)
  const [size, setSize] = useState<{width: number; height: number} | null>(null)
  // Counts steps without wrapping, so the row always slides the short way round.
  const [position, setPosition] = useState(0)
  const count = projects.length

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect
      if (width && height) setSize({width, height})
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const step = useCallback((delta: number) => setPosition((current) => current + delta), [])

  useEffect(() => {
    if (count <= 1) return
    const onKeyDown = (event: KeyboardEvent) => {
      // The lightbox has its own arrow keys while a project is open.
      if (window.location.search.includes('project=')) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'ArrowLeft') step(-1)
      else if (event.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [count, step])

  // Finger swipe only. A mouse moves the row with the arrows, not by dragging.
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || count <= 1) return
    swipeStartX.current = event.clientX
  }
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current == null) return
    const delta = event.clientX - swipeStartX.current
    swipeStartX.current = null
    if (delta > SWIPE_THRESHOLD) step(-1)
    else if (delta < -SWIPE_THRESHOLD) step(1)
  }

  const open = (project: Project) => {
    if (project.status === 'undisclosed') return
    router.push(`${pathname}?project=${project.slug}`, {scroll: false})
  }

  const current = projects[wrap(position, count)]
  let row = null

  if (size && count > 0) {
    const gap = size.width >= 1024 ? 24 : 16
    const narrow = size.width < NARROW_STAGE
    const captionRoom = narrow ? NARROW_CAPTION_ROOM : CAPTION_ROOM
    const cardHeight = Math.max(
      120,
      Math.min(size.height - captionRoom * 2, (size.width * MAX_WIDTH_SHARE * 16) / 9),
    )
    const cardWidth = (cardHeight * 9) / 16
    const pitch = cardWidth + gap
    // Enough slots either side to fill the stage, plus one waiting off-screen so a card
    // is already in place before it slides into view.
    const reach = count > 1 ? Math.ceil((size.width / 2 + cardWidth / 2) / pitch) + 1 : 0
    const slots = Array.from({length: reach * 2 + 1}, (_, i) => position - reach + i)
    const isUndisclosed = current.status === 'undisclosed'

    row = (
      <>
        {slots.map((slot) => {
          const project = projects[wrap(slot, count)]
          const offset = slot - position
          const centred = offset === 0
          return (
            <button
              key={slot}
              type="button"
              tabIndex={centred ? 0 : -1}
              aria-hidden={centred ? undefined : true}
              aria-label={
                centred ? [project.title, project.subheader].filter(Boolean).join(', ') : undefined
              }
              onClick={() => (centred ? open(project) : step(offset))}
              className="absolute left-1/2 top-1/2 block cursor-pointer overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))] outline-none transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              style={{
                width: cardWidth,
                height: cardHeight,
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2,
                transform: `translate3d(${offset * pitch}px, 0, 0)`,
              }}
            >
              <CardMedia project={project} active={centred} />
            </button>
          )
        })}

        {/* Wide screens: title on the card's left edge, subheader on its right.
            Narrow screens: stacked under the card, so a long title isn't cut off. */}
        <div
          key={position}
          aria-hidden
          className={`pointer-events-none absolute left-1/2 flex animate-[hero-caption-in_450ms_ease_both] text-foreground motion-reduce:animate-none [--project-subhead-size:10px] [--project-title-size:1.25rem] ${
            narrow
              ? 'flex-col items-start gap-1'
              : 'items-baseline justify-between gap-4'
          }`}
          style={{width: cardWidth, marginLeft: -cardWidth / 2, top: `calc(50% + ${cardHeight / 2 + 14}px)`}}
        >
          <span className={`type-project-title min-w-0 text-pretty pb-1 ${narrow ? '' : 'truncate'}`}>
            {isUndisclosed ? 'Undisclosed' : current.title}
          </span>
          {!isUndisclosed && current.subheader && (
            <span
              className={`type-project-subhead text-pretty ${
                narrow ? '' : 'max-w-[60%] shrink-0 truncate text-right'
              }`}
            >
              {current.subheader}
            </span>
          )}
        </div>
      </>
    )
  }

  const arrow =
    'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm transition-colors duration-200 hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50'

  return (
    // Takes whatever height the page has between the nav and the site footer.
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Social projects"
      className="relative min-h-[420px] flex-1 touch-pan-y overflow-hidden select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipeStartX.current = null
      }}
    >
      {row}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => step(-1)}
            className={`left-(--edge) ${arrow}`}
          >
            <Arrow glyph="←" />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => step(1)}
            className={`right-(--edge) ${arrow}`}
          >
            <Arrow glyph="→" />
          </button>
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {current
          ? `${current.status === 'undisclosed' ? 'Undisclosed' : current.title}, ${wrap(position, count) + 1} of ${count}`
          : ''}
      </span>
    </div>
  )
}
