import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

export function ProjectCard({project}: {project: Project}) {
  const isUndisclosed = project.status === 'undisclosed'

  const media = (
    <div className="relative w-full overflow-hidden" style={{aspectRatio: '16 / 9'}}>
      {isUndisclosed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-foreground/10 bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)] text-center">
          <span className="text-[13px] leading-[1.5] text-foreground/72">
            Undisclosed
          </span>
          <span className="text-[12px] leading-[1.5] text-foreground/72">
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
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[18px] leading-[1.25] tracking-[-0.01em] text-foreground/85">
        {isUndisclosed ? 'Undisclosed' : project.title}
      </span>
      {!isUndisclosed && project.year && (
        <span className="text-[13px] leading-[1.5] text-foreground/72">
          {project.year}
        </span>
      )}
    </div>
  )

  if (isUndisclosed) {
    return (
      <article className="group flex flex-col gap-2.5">
        {media}
        {caption}
      </article>
    )
  }

  return (
    <Link
      href={`?project=${project.slug}`}
      scroll={false}
      className="group flex flex-col gap-2.5"
    >
      {media}
      {caption}
    </Link>
  )
}
