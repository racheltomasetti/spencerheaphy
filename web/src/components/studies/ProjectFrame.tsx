import type {CSSProperties} from 'react'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

export function projectTitle(project: Project) {
  return project.status === 'undisclosed' ? 'Undisclosed' : project.title
}

export function projectMeta(project: Project) {
  if (project.status === 'undisclosed') return null
  return [project.subheader, project.year].filter(Boolean).join(' · ')
}

export function projectLine(project: Project) {
  if (project.status === 'undisclosed') return null
  return project.subheader || (project.year ? String(project.year) : null)
}

export function ProjectFrame({
  project,
  className,
  style,
}: {
  project: Project
  className?: string
  style?: CSSProperties
}) {
  const isUndisclosed = project.status === 'undisclosed'

  return (
    <div
      className={`relative w-full overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_5%,var(--background))] ${className ?? ''}`}
      style={{aspectRatio: '16 / 9', ...style}}
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
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          placeholderLabel="Cover media pending"
        />
      )}
    </div>
  )
}
