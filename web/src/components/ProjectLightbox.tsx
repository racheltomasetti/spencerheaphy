'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {Nav} from '@/components/Nav'
import {MediaItemView} from '@/components/MediaItemView'
import {VimeoEmbed, vimeoIdFromUrl} from '@/components/VimeoEmbed'
import type {Project} from '@/sanity/lib/types'

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
      <div className="px-5 pb-16 pt-[calc(var(--nav-h)+2rem)] md:px-8">
        {/* Fills the page gutters, but never wider than a 16:9 video that still fits the
            screen's height, so the whole film is in view below the nav. */}
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: 'max(56rem, calc((100dvh - var(--nav-h) - 3rem) * 16 / 9))',
          }}
        >
          <div className="relative mb-8 aspect-video w-full overflow-hidden bg-foreground/5">
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

          <div className="mb-10 flex flex-col gap-2">
            <h2 className="font-serif text-3xl uppercase tracking-[0.06em]">{project.title}</h2>
            <span className="text-xs uppercase tracking-[0.15em] text-foreground/40">
              {[project.subheader, displayDate].filter(Boolean).join(' · ')}
            </span>
            {project.description && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
                {project.description}
              </p>
            )}
          </div>

          {crew.length > 0 && (
            <dl className="mb-12 grid max-w-xl grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.13em]">
              {crew.map((credit, index) => (
                <div key={`${credit.role}-${credit.name}-${index}`} className="contents">
                  <dt className="text-foreground/50">{credit.role}</dt>
                  <dd className="text-foreground/80">{credit.name}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.gallery.map((item, index) => (
                <div
                  key={item._key ?? index}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5"
                >
                  <MediaItemView
                    media={item}
                    alt={`${project.title} — still ${index + 1}`}
                    className="h-full w-full object-cover"
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
