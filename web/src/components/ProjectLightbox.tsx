'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Nav} from '@/components/Nav'
import {MediaItemView} from '@/components/MediaItemView'
import {VimeoEmbed, vimeoIdFromUrl} from '@/components/VimeoEmbed'
import type {CrewCredit, Project} from '@/sanity/lib/types'

// The film takes whatever height the rest of the project doesn't need, between these
// two shares of the screen height: bigger on a project with only a title, smaller on
// one with a description, credits and stills.
const FILM_MIN = 0.4
const FILM_MAX = 0.66

// The details below the film are as wide as the film, but never narrower than this, so
// a squarer film doesn't squeeze the title and credits into a thin column. A film
// narrower than this sits against the left edge of the details, so they share a margin.
const DETAILS_MIN_WIDTH = 600

// The frame matches the film's own shape, so the player has nothing to pad with bars.
// Projects whose shape couldn't be looked up, and cover images, use 16:9.
const DEFAULT_ASPECT = 16 / 9

function formatProjectDate(date?: string) {
  if (date) {
    const parsed = new Date(`${date}T00:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    }
  }
  return null
}

// Credits with the same role (ignoring capitalization) share one label, in the order each
// role first appears, and a comma-separated name becomes one name per line. So "Talent:
// Ana, Ben" and two separate Talent rows read the same.
function groupCrew(crew: CrewCredit[]) {
  const groups = new Map<string, {role: string; names: string[]}>()
  for (const credit of crew) {
    const role = credit.role?.trim()
    const names = (credit.name ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
    if (!role || names.length === 0) continue

    const key = role.toLowerCase()
    const group = groups.get(key)
    if (group) group.names.push(...names)
    else groups.set(key, {role, names})
  }
  return [...groups.values()]
}

export function ProjectLightbox({projects}: {projects: Project[]}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const slug = searchParams.get('project')
  const project = slug ? projects.find((p) => p.slug === slug) : undefined
  const aspect = project?.vimeoAspect ?? DEFAULT_ASPECT

  const close = () => router.push(pathname, {scroll: false})

  useEffect(() => {
    if (!project) return

    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  // Sizes the film to the room left over once the details below it are laid out, so
  // the whole project fits one screen. Widening the film re-wraps the details, so this
  // re-runs whenever their height changes; each pass moves the same way, so it settles.
  const frameRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const [filmWidth, setFilmWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    const details = detailsRef.current
    if (!frame || !details) return

    const fit = () => {
      const style = getComputedStyle(frame)
      const gutters = frame.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const room =
        window.innerHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom) -
        details.offsetHeight
      const height = Math.min(window.innerHeight * FILM_MAX, Math.max(window.innerHeight * FILM_MIN, room))
      const width = Math.round(Math.min(gutters, height * aspect))
      setFilmWidth((current) => (current != null && Math.abs(current - width) < 2 ? current : width))
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(details)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [project?.slug, aspect])

  if (!project) return null

  // Until the film has been measured, a width that fits a laptop screen.
  const filmCss = filmWidth != null ? `${filmWidth}px` : `calc(48dvh * ${aspect})`

  const displayDate = formatProjectDate(project.date)
  const hasVimeo = Boolean(project.vimeoUrl && vimeoIdFromUrl(project.vimeoUrl))
  const crew = groupCrew(project.crew ?? [])

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <Nav embedded />
      {/* One screen: the film starts right under the nav and everything about it sits
          underneath, so nothing needs scrolling on a laptop. Small screens scroll. */}
      <div ref={frameRef} className="px-(--edge) pb-6 pt-[calc(var(--nav-h)+0.75rem)]">
        {/* As wide as the film, or DETAILS_MIN_WIDTH if the film is narrower than that; the
            details below line up with the film's left edge, and its right edge when wide. */}
        <div
          className="mx-auto w-full"
          style={{maxWidth: `max(${filmCss}, ${DETAILS_MIN_WIDTH}px)`}}
        >
          <div
            className="relative max-w-full overflow-hidden bg-foreground/5"
            style={{width: filmCss, aspectRatio: aspect}}
          >
            {hasVimeo && project.vimeoUrl ? (
              <VimeoEmbed url={project.vimeoUrl} title={project.title} autoplay />
            ) : (
              <MediaItemView
                media={project.coverMedia}
                alt={project.title}
                className="h-full w-full object-cover"
                width={1600}
                height={900}
                placeholderLabel="Cover media pending"
              />
            )}
          </div>

          {/* Title, subheader and description on the left; credits on the right, level
              with the title. Any part a project doesn't have simply isn't there. */}
          <div ref={detailsRef}>
            <div className="grid gap-x-8 gap-y-6 pt-5 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-7">
                <h2 className="type-project-title [--project-title-size:clamp(1.375rem,2vw,1.75rem)]">
                  {project.title}
                </h2>
                {(project.subheader || displayDate) && (
                  <span className="type-project-subhead mt-2 [--project-subhead-size:11px]">
                    {[project.subheader, displayDate].filter(Boolean).join(' · ')}
                  </span>
                )}
                {project.description && (
                  <p className="mt-3 max-w-[62ch] text-[clamp(13px,0.95vw,15px)] leading-[1.6] text-foreground/80">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Each credit's role sits above its name, so a name gets the whole column and
                  never gets squeezed beside a long role like "Production Assistant". */}
              {crew.length > 0 && (
                <dl className="grid content-start gap-y-2.5 pt-1 text-[11px] uppercase tracking-[0.13em] lg:col-span-5">
                  {crew.map((group) => (
                    <div key={group.role.toLowerCase()} className="min-w-0">
                      <dt className="text-foreground/50">{group.role}</dt>
                      {group.names.map((name, index) => (
                        <dd key={`${name}-${index}`} className="break-words text-foreground/80">
                          {name}
                        </dd>
                      ))}
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Stills as one strip of small frames; it scrolls sideways if there are many. */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="mt-5 flex gap-2 overflow-x-auto">
                {project.gallery.map((item, index) => (
                  <div
                    key={item._key ?? index}
                    className="relative aspect-[4/3] h-[clamp(64px,11dvh,120px)] shrink-0 overflow-hidden bg-foreground/5"
                  >
                    <MediaItemView
                      media={item}
                      alt={`${project.title} — still ${index + 1}`}
                      className="h-full w-full object-cover"
                      width={480}
                      height={360}
                      placeholderLabel={`Still ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
