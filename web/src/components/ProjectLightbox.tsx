'use client'

import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

export function ProjectLightbox({projects}: {projects: Project[]}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = searchParams.get('project')
  const project = slug ? projects.find((p) => p.slug === slug) : undefined

  const close = () => router.push('/#work', {scroll: false})

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

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background/98 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="fixed right-6 top-6 z-10 text-xs uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground sm:right-10 sm:top-8"
        >
          Close &times;
        </button>

        <div className="relative mb-8 aspect-video w-full overflow-hidden bg-foreground/5">
          <MediaItemView
            media={project.coverMedia}
            alt={project.title}
            className="h-full w-full object-cover"
            width={1600}
            height={900}
          />
        </div>

        <div className="mb-10 flex flex-col gap-2">
          {project.client && (
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/60">
              {project.client}
            </span>
          )}
          <h2 className="font-serif text-3xl uppercase tracking-[0.06em]">{project.title}</h2>
          <span className="text-xs uppercase tracking-[0.15em] text-foreground/40">
            {project.year}
          </span>
          {project.description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
              {project.description}
            </p>
          )}
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.gallery.map((item, index) => (
              <div key={item._key ?? index} className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
                <MediaItemView media={item} alt={`${project.title} — image ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
