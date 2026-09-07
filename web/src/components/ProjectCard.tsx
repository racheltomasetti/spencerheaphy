import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

export function ProjectCard({project}: {project: Project}) {
  const isUndisclosed = project.status === 'undisclosed'

  const media = (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
      {isUndisclosed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-foreground/10 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">Undisclosed</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/30">
            Details coming soon
          </span>
        </div>
      ) : (
        <MediaItemView
          media={project.coverMedia}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      )}
    </div>
  )

  const caption = (
    <div className="flex flex-col gap-0.5">
      {!isUndisclosed && project.client && (
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/80">
          {project.client}
        </span>
      )}
      <span className="text-sm text-foreground/60">
        {isUndisclosed ? project.category || 'Project' : project.title}
      </span>
    </div>
  )

  if (isUndisclosed) {
    return (
      <article className="group flex flex-col gap-3">
        {media}
        {caption}
      </article>
    )
  }

  return (
    <Link href={`/?project=${project.slug}#work`} scroll={false} className="group flex flex-col gap-3">
      {media}
      {caption}
    </Link>
  )
}
