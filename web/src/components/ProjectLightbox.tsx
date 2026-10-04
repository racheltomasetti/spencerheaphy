'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {Nav} from '@/components/Nav'
import {MediaItemView} from '@/components/MediaItemView'
import {VimeoEmbed, vimeoIdFromUrl} from '@/components/VimeoEmbed'
import type {Project} from '@/sanity/lib/types'

// How tall the film is on the project page, as a share of the screen height.
const FILM_HEIGHT = '48dvh'

function formatProjectDate(date?: string, year?: number) {
  if (date) {
    const parsed = new Date(`${date}T00:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    }
  }
  return year ? String(year) : null
}

export function ProjectLightbox({projects}: {projects: Project[]}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const slug = searchParams.get('project')
  const project = slug ? projects.find((p) => p.slug === slug) : undefined

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

  if (!project) return null

  const displayDate = formatProjectDate(project.date, project.year)
  const hasVimeo = Boolean(project.vimeoUrl && vimeoIdFromUrl(project.vimeoUrl))
  const crew = project.crew?.filter((credit) => credit.role && credit.name) ?? []

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <Nav embedded />
      {/* One screen: the film takes about half the height and everything about it sits
          underneath, so nothing needs scrolling on a laptop. When a project has little
          to show, the block centres in the space below the nav. Small screens scroll. */}
      <div className="flex min-h-dvh flex-col justify-center px-(--edge) pb-6 pt-[calc(var(--nav-h)+0.75rem)]">
        {/* As wide as a 16:9 film that is FILM_HEIGHT tall, and never wider than the gutters. */}
        <div className="mx-auto w-full" style={{maxWidth: `max(36rem, calc(${FILM_HEIGHT} * 16 / 9))`}}>
          <div className="relative aspect-video w-full overflow-hidden bg-foreground/5">
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
          <div className="mt-5 grid gap-x-8 gap-y-6 lg:grid-cols-12">
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

            {crew.length > 0 && (
              <dl className="grid grid-cols-[auto_1fr] content-start gap-x-5 gap-y-1.5 pt-1 text-[11px] uppercase tracking-[0.13em] lg:col-span-5">
                {crew.map((credit, index) => (
                  <div key={`${credit.role}-${credit.name}-${index}`} className="contents">
                    <dt className="text-foreground/50">{credit.role}</dt>
                    <dd className="min-w-0 break-words text-foreground/80">{credit.name}</dd>
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
  )
}
