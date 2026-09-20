import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

export function ProjectCard({
  project,
  subheaderRight = false,
}: {
  project: Project
  subheaderRight?: boolean
}) {
  const isUndisclosed = project.status === 'undisclosed'

  const media = (
    <div className="relative w-full overflow-hidden" style={{aspectRatio: '16 / 9'}}>
      {isUndisclosed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-foreground/10 bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)] text-center">
          <span className="text-[11px] uppercase tracking-[0.16em] text-foreground/40">
            Undisclosed
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/30">
            Details coming soon
          </span>
        </div>
      ) : (
        <MediaItemView
          media={project.coverMedia}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          placeholderLabel="Cover media pending"
        />
      )}
    </div>
  )

  const caption = (
    <div
      className={`[--project-subhead-size:10px] [--project-title-size:1.125rem] ${
        subheaderRight ? 'flex items-baseline justify-between gap-3' : 'flex flex-col gap-1'
      }`}
    >
      <span className="type-project-title text-foreground/85 transition-colors duration-300 group-hover:text-foreground motion-reduce:transition-none">
        {isUndisclosed ? 'Undisclosed' : project.title}
      </span>
      {!isUndisclosed && project.subheader && (
        <span className={`type-project-subhead ${subheaderRight ? 'text-right' : ''}`}>
          {project.subheader}
        </span>
      )}
    </div>
  )

  if (isUndisclosed) {
    return (
      <article className="project-card flex flex-col gap-2.5 transition-opacity duration-300 motion-reduce:transition-none">
        {media}
        {caption}
      </article>
    )
  }

  return (
    <Link
      href={`?project=${project.slug}`}
      scroll={false}
      className="project-card group flex flex-col gap-2.5 transition-opacity duration-300 motion-reduce:transition-none"
    >
      {media}
      {caption}
    </Link>
  )
}
