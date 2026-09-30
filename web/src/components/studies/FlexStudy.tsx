'use client'

import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import FlexCarousel, {BEND_PRESETS, type BendPreset, type FlexCarouselItem} from '@/components/FlexCarousel'
import {projectTitle} from '@/components/studies/ProjectFrame'
import {urlFor} from '@/sanity/lib/image'
import type {Project} from '@/sanity/lib/types'

// React Bits' FlexCarousel: one full-bleed row of films bent through an invisible lens.
// Drag, scroll or use the arrow keys; the centred film plays, and clicking it opens the
// project. The shape row underneath swaps the lens live, so the options can be compared.
const SHAPES: {id: BendPreset; label: string}[] = [
  {id: 'liquid', label: 'Liquid'},
  {id: 'ribbon', label: 'Ribbon'},
  {id: 'vortex', label: 'Vortex'},
  {id: 'arch', label: 'Arch'},
]

function toItem(project: Project): FlexCarouselItem {
  const title = projectTitle(project)
  if (project.status === 'undisclosed') return {title, alt: title, subtitle: 'Details coming soon'}
  const item: FlexCarouselItem = {
    title,
    alt: title,
    subtitle: project.subheader || undefined,
    meta: project.year ? String(project.year) : undefined,
  }

  const media = project.coverMedia
  if (media?.mediaType === 'video' && media.video?.asset?.url) {
    return {...item, video: media.video.asset.url}
  }
  if (media?.mediaType === 'image' && media.image?.asset) {
    return {...item, src: urlFor(media.image).width(1600).auto('format').url(), alt: media.image.alt || title}
  }
  return item
}

function useCompact() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return compact
}

// Sizes the stage to the space left below its own top edge, so the row, its footer and
// the lens picker all land above the fold. Touch screens only re-measure when the width
// changes, so the address bar sliding away doesn't make the row jump.
function useFitHeight(reserve: number) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let lastWidth = 0

    const measure = () => {
      if (coarse && lastWidth && window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      const top = stage.getBoundingClientRect().top + window.scrollY
      setHeight(Math.round(Math.min(820, Math.max(380, window.innerHeight - top - reserve))))
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [reserve])

  return {stageRef, height}
}

export function FlexStudy({projects}: {projects: Project[]}) {
  const router = useRouter()
  const pathname = usePathname()
  const compact = useCompact()
  const [shape, setShape] = useState<BendPreset>('liquid')
  const items = useMemo(() => projects.map(toItem), [projects])
  // Room kept under the stage for the lens picker and a little air.
  const {stageRef, height} = useFitHeight(72)
  // The lens is sized against the row's width, so on a phone it would bend the centred
  // film itself. Widen it there so the bend starts past the centre card.
  const lens = compact
    ? {lensWidth: BEND_PRESETS[shape].lensWidth * 2, lensHeight: BEND_PRESETS[shape].lensHeight * 1.6}
    : {}

  const open = (index: number) => {
    const project = projects[index]
    if (!project || project.status === 'undisclosed') return
    // Hand the keyboard to the lightbox so arrow keys don't also move the row.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    router.push(`${pathname}?project=${project.slug}`, {scroll: false})
  }

  return (
    <div className="-mx-(--edge) -mt-6">
      <div
        ref={stageRef}
        className="h-[64svh] min-h-[380px] md:h-[min(72svh,720px)]"
        style={height ? {height} : undefined}
      >
        <FlexCarousel
          items={items}
          preset={shape}
          {...lens}
          intro="rise"
          fit="wide"
          cardHeight={compact ? 0.34 : 0.46}
          contain
          gap={compact ? 8 : 14}
          squeeze={0.18}
          focusOnClick={false}
          captureWheel={false}
          onSelect={open}
          ariaLabel="Projects"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-(--edge)">
        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">Lens</span>
        {SHAPES.map((option) => {
          const active = option.id === shape
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setShape(option.id)}
              className={`text-[12px] leading-none transition-colors duration-200 ${
                active ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/75'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
