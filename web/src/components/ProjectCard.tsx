import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

// Edge code printed inside the left of a thumbnail, the way key numbers run
// along 35mm stock: a cream gutter, a few ticks, and a sideways running index.
function FilmKey({index}: {index: number}) {
  const label = String(index).padStart(4, '0')

  return (
    <div
      aria-hidden
      className="film-key pointer-events-none absolute inset-y-0 left-0 z-[1] w-[calc(1.25rem+1px)] bg-[color-mix(in_srgb,var(--foreground)_5%,var(--background))]"
    >
      <span className="absolute top-[12%] left-1/2 h-px w-1.5 -translate-x-1/2 bg-foreground/30" />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-[9px] tracking-[0.22em] text-foreground/45 tabular-nums">
        {label}
      </span>
      <span className="absolute top-[74%] left-1/2 h-px w-1.5 -translate-x-1/2 bg-foreground/30" />
      <span className="absolute top-[88%] left-1/2 h-px w-1.5 -translate-x-1/2 bg-foreground/30" />
    </div>
  )
}

export function ProjectCard({
  project,
  subheaderRight = false,
  index,
}: {
  project: Project
  subheaderRight?: boolean
  index?: number
}) {
  const isUndisclosed = project.status === 'undisclosed'

  const media = (
    <div className="relative w-full" style={{aspectRatio: '16 / 9'}}>
      <div
        className={`absolute inset-0 overflow-hidden ${
          index != null ? 'bg-[color-mix(in_srgb,var(--foreground)_5%,var(--background))]' : ''
        }`}
      >
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
            className="absolute inset-0 h-full w-full object-cover"
            placeholderLabel="Cover media pending"
          />
        )}
      </div>
      {index != null && <FilmKey index={index} />}
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
      className="project-card group relative flex flex-col gap-2.5 transition-transform duration-250 motion-reduce:transition-none"
    >
      {media}
      {caption}
    </Link>
  )
}
