'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {LazyVideo} from '@/components/LazyVideo'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

// The social work as one row of 9:16 cards with the current one centred on the screen.
// The row steps a card at a time: arrow keys, the on-screen arrows, or a finger swipe.
// It loops, so there is no first or last card. The centred video plays, and clicking a
// side card brings it to the centre. The cards don't open anything for now: what a
// social project should lead to (most likely the posted video) is still to be decided.

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
// On wide screens the centred card is drawn this much larger than its neighbours.
const FOCUS_SCALE = 1.2
const FOCUS_MIN_WIDTH = 1024
// Paused videos sit on a frame a little way in, since opening frames are often black.
const STILL_AT = '#t=0.8'

const wrap = (value: number, count: number) => ((value % count) + count) % count

function CardMedia({project, active}: {project: Project; active: boolean}) {
  const media = project.coverMedia
  const className = 'absolute inset-0 h-full w-full object-cover'

  if (project.status === 'undisclosed') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)]">
        <span className="type-project-subhead text-foreground/45 [--project-subhead-size:10px]">
          Undisclosed
        </span>
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

export function SocialCarousel({projects}: {projects: Project[]}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const swipeStartX = useRef<number | null>(null)
  const [size, setSize] = useState<{
    width: number
    height: number
    top: number
    header: number
  } | null>(null)
  // Counts steps without wrapping, so the row always slides the short way round.
  const [position, setPosition] = useState(0)
  const count = projects.length

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const rect = stage.getBoundingClientRect()
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      if (rect.width && rect.height)
        setSize({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          header,
        })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const step = useCallback((delta: number) => setPosition((current) => current + delta), [])

  useEffect(() => {
    if (count <= 1) return
    const onKeyDown = (event: KeyboardEvent) => {
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

  const current = projects[wrap(position, count)]
  let row = null
  let cardCenter: number | null = null
  // On a narrow screen the arrows sit inside the centred card, since out at the screen edge
  // they would straddle the pale gap between cards, where a light arrow can't be seen.
  let arrowInset: number | null = null

  if (size && count > 0) {
    const gap = size.width >= 1024 ? 24 : 16
    const narrow = size.width < NARROW_STAGE
    const captionRoom = narrow ? NARROW_CAPTION_ROOM : CAPTION_ROOM
    const widthCap = (size.width * MAX_WIDTH_SHARE * 16) / 9
    const focusScale = size.width >= FOCUS_MIN_WIDTH ? FOCUS_SCALE : 1
    // The room left for the card is shared with the enlarged centre card, so size the rest by it.
    const cardHeight = Math.max(
      120,
      Math.min((size.height - (narrow ? captionRoom : captionRoom * 2)) / focusScale, widthCap),
    )
    // On a phone, the gap from the nav to the card matches the gap from the card to the footer.
    const centeredTop = (size.height - cardHeight - size.top + size.header) / 2
    const maxTop = Math.max(0, size.height - cardHeight - (narrow ? captionRoom : 0))
    const cardTop = narrow
      ? Math.min(Math.max(0, centeredTop), maxTop)
      : (size.height - cardHeight) / 2
    cardCenter = cardTop + cardHeight / 2
    const cardWidth = (cardHeight * 9) / 16
    if (narrow) arrowInset = (size.width - cardWidth) / 2 + 4
    const pitch = cardWidth + gap
    // The enlarged centre card grows evenly each side, so the neighbours step out of its way.
    const focusShift = ((focusScale - 1) * cardWidth) / 2
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
            <div
              key={slot}
              data-centred={centred || undefined}
              role={centred ? 'group' : undefined}
              aria-hidden={centred ? undefined : true}
              aria-label={
                centred ? [project.title, project.subheader].filter(Boolean).join(', ') : undefined
              }
              onClick={centred ? undefined : () => step(offset)}
              className="absolute left-1/2 block cursor-pointer overflow-hidden data-[centred]:cursor-default bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))] outline-none transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              style={{
                width: cardWidth,
                height: cardHeight,
                marginLeft: -cardWidth / 2,
                top: cardTop,
                transform: `translate3d(${offset * pitch + Math.sign(offset) * focusShift}px, 0, 0) scale(${centred ? focusScale : 1})`,
              }}
            >
              {/* The same dimming the work grid's hover veil gives, applied as a filter on the
                  media itself. A separate overlay layer was painting unreliably over the
                  moving, scaled videos, so the veil would blink on and off between steps. */}
              <div
                className={`absolute inset-0 transition-[filter] duration-[650ms] ease-out motion-reduce:transition-none ${
                  centred ? 'brightness-100' : 'brightness-50'
                }`}
              >
                <CardMedia project={project} active={centred} />
              </div>
            </div>
          )
        })}

        {/* Wide screens: title on the card's left, subheader on its right. Narrow screens:
            stacked under the card, so a long title isn't cut off. The side padding keeps the
            text off the card's edges. It fades in under each new card as the row settles. */}
        <div
          key={position}
          aria-hidden
          className={`pointer-events-none absolute left-1/2 flex animate-[hero-caption-in_450ms_ease_both] px-3 text-foreground motion-reduce:animate-none [--project-subhead-size:10px] [--project-title-size:1.25rem] ${
            narrow
              ? 'flex-col items-center gap-1 text-center'
              : 'items-baseline justify-between gap-4'
          }`}
          style={{
            width: cardWidth * focusScale,
            marginLeft: (-cardWidth * focusScale) / 2,
            top: cardTop + (cardHeight * (1 + focusScale)) / 2 + 14,
          }}
        >
          <span
            className={`type-project-title min-w-0 text-pretty pb-1 ${
              narrow
                ? 'underline decoration-foreground/70 decoration-1 underline-offset-4'
                : 'truncate'
            }`}
          >
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

  const arrow = 'absolute z-10 -translate-y-1/2 p-2 text-[22px] text-background'
  const arrowStyle = {top: cardCenter ?? '50%'}
  const leftStyle = arrowInset == null ? arrowStyle : {...arrowStyle, left: arrowInset}
  const rightStyle = arrowInset == null ? arrowStyle : {...arrowStyle, right: arrowInset}

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
            style={leftStyle}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => step(1)}
            className={`right-(--edge) ${arrow}`}
            style={rightStyle}
          >
            →
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
