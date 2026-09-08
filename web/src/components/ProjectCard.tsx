import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

export function ProjectCard({
  project,
  span,
  ratio,
}: {
  project: Project
  span: string
  ratio: string
}) {
  const isUndisclosed = project.status === 'undisclosed'

  const media = (
    <div className="relative w-full overflow-hidden" style={{aspectRatio: ratio}}>
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
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          placeholderLabel="Cover media pending"
        />
      )}
    </div>
  )

  const caption = (
    <div className="flex flex-col gap-[3px]">
      {!isUndisclosed && project.client && (
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/80">
          {project.client}
        </span>
      )}
      <span className="flex items-baseline justify-between gap-3 text-[15px] tracking-[-0.01em] text-foreground/60">
        <span>{isUndisclosed ? 'Undisclosed' : project.title}</span>
        {!isUndisclosed && project.year && (
          <span className="text-[11px] text-foreground/62">{project.year}</span>
        )}
      </span>
    </div>
  )

  if (isUndisclosed) {
    return (
      <article className={`${span} group flex flex-col gap-2.5`}>
        {media}
        {caption}
      </article>
    )
  }

  return (
    <Link
      href={`/?project=${project.slug}#work`}
      scroll={false}
      className={`${span} group flex flex-col gap-2.5`}
    >
      {media}
      {caption}
    </Link>
  )
}
