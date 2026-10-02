'use client'

import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useMemo, useRef, useState} from 'react'
import FlexCarousel, {type FlexCarouselItem} from '@/components/FlexCarousel'
import {urlFor} from '@/sanity/lib/image'
import type {Project} from '@/sanity/lib/types'

// The social work as one full-bleed row of 9:16 cards, bent through React Bits'
// FlexCarousel. Drag, swipe or use the arrow keys; the centred video plays, and
// clicking it opens the project.
//
// LENS is the shape of the ribbon. Change a number, save, and the page updates.
const LENS = {
  // Starting shape: 'liquid' | 'ribbon' | 'vortex' | 'arch'. The values below override it.
  preset: 'liquid',
  // How far the ends lift and drop. 0 is a flat row; 0.34 is the default; 0.6 is dramatic.
  // The stage caps this so cards never leave the top or bottom of the screen.
  bend: 0,
  // How long the curve takes. Small (0.15) is a tight kink, large (0.6) a slow sweep.
  reach: 0.38,
  // Which way the ends go: 'twist' (left down, right up), 'rise' (both up), 'fall' (both down).
  curl: 'twist',
  // Rotation of the invisible glass in degrees. Changes where the bend crosses the row.
  tilt: 62,
  // Size of the flat middle, as a share of the row's width. Bigger keeps more cards flat.
  lensWidth: 0.74,
  lensHeight: 1.18,
  // Shape of the glass: 1 is an ellipse, 0 a rounded rectangle (sharper corners in the bend).
  roundness: 1,
  // Rainbow fringing where the row bends. 0 turns it off.
  dispersion: 0.45,
  // Wobble while the row is moving, like liquid. 0 is off; try 0.5 to 1.
  liquid: 0,
  // true makes the lens follow the cursor like a loupe.
  followCursor: false,
} as const

function toItem(project: Project): FlexCarouselItem {
  if (project.status === 'undisclosed') {
    return {title: 'Undisclosed', alt: 'Undisclosed', subtitle: 'Details coming soon'}
  }
  const item: FlexCarouselItem = {
    title: project.title,
    alt: project.title,
    subtitle: project.subheader || undefined,
  }
  const media = project.coverMedia
  if (media?.mediaType === 'video' && media.video?.asset?.url) {
    return {...item, video: media.video.asset.url}
  }
  if (media?.mediaType === 'image' && media.image?.asset) {
    return {...item, src: urlFor(media.image).width(1200).auto('format').url(), alt: media.image.alt || project.title}
  }
  return item
}

function useMedia(media: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const query = window.matchMedia(media)
    const update = () => setMatches(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [media])
  return matches
}

// Room kept under the card for the title and subtitle. The card is centred in the
// stage, so the same amount stays clear above it.
const CAPTION_ROOM = 68
// On a narrow screen a full-height card would be nearly as wide as the screen; cap its
// width so the neighbours still show at the edges.
const MAX_WIDTH_SHARE = 0.74

// The card's height as a share of the stage: as tall as the stage allows once the
// caption has its room, at any screen size.
function useCardHeight() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [share, setShare] = useState(0.7)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect
      if (!width || !height) return
      const tallest = Math.min(height - CAPTION_ROOM * 2, (width * MAX_WIDTH_SHARE * 16) / 9)
      setShare(Math.min(0.9, Math.max(0.3, tallest / height)))
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  return {stageRef, share}
}

export function SocialCarousel({projects}: {projects: Project[]}) {
  const router = useRouter()
  const pathname = usePathname()
  const compact = useMedia('(max-width: 767px)')
  // Same gutters as the work grid: 24px from the lg breakpoint up, 16px below it.
  const gap = useMedia('(min-width: 1024px)') ? 24 : 16
  const items = useMemo(() => projects.map(toItem), [projects])
  const {stageRef, share} = useCardHeight()
  // The lens is sized against the row's width, so on a phone it would bend the centred
  // card itself. Widen it there so the bend starts past the centre card, and ease the
  // bend so the neighbours don't swing down over the footer.
  const {preset, ...shape} = LENS
  const lens = compact
    ? {...shape, lensWidth: LENS.lensWidth * 2.6, lensHeight: LENS.lensHeight * 2, bend: Math.min(LENS.bend, 0.14)}
    : shape

  const open = (index: number) => {
    const project = projects[index]
    if (!project || project.status === 'undisclosed') return
    // Hand the keyboard to the lightbox so arrow keys don't also move the row.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    router.push(`${pathname}?project=${project.slug}`, {scroll: false})
  }

  return (
    // Takes whatever height the page has between the nav and the site footer.
    <div ref={stageRef} className="relative min-h-[420px] flex-1">
      <div className="absolute inset-0">
        <FlexCarousel
          items={items}
          preset={preset}
          {...lens}
          intro="rise"
          fit="tall"
          cardHeight={share}
          gap={gap}
          squeeze={0.18}
          focusOnClick={false}
          captureWheel={false}
          contain
          onSelect={open}
          ariaLabel="Social projects"
        />
      </div>
    </div>
  )
}
