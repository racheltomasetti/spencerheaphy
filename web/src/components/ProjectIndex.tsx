'use client'

import Link from 'next/link'
import {useState} from 'react'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

const ROW_GRID = 'grid-cols-[52px_1fr_64px]'
const CELL_TEXT = 'text-[10px] uppercase tracking-[0.18em]'

export function ProjectIndex({projects}: {projects: Project[]}) {
  const [hovered, setHovered] = useState<Project | null>(null)

  if (projects.length === 0) {
    return <p className="px-8 pb-[60px] text-sm text-foreground/50">Projects coming soon.</p>
  }

  return (
    <div className="px-8 pb-[60px]">
      <div
        className={`grid ${ROW_GRID} gap-4 border-b border-foreground/14 py-3.5 text-[10px] uppercase tracking-[0.18em] text-foreground/58`}
      >
        <span>No.</span>
        <span>Project</span>
        <span className="text-right">Year</span>
      </div>

      {projects.map((project, index) => {
        const isUndisclosed = project.status === 'undisclosed'
        const rowClassName = `grid w-full ${ROW_GRID} items-baseline gap-4 border-b border-foreground/8 py-4 text-left transition-colors hover:bg-foreground/4`

        const cells = (
          <>
            <span className={`${CELL_TEXT} text-foreground/58`}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={`${CELL_TEXT} text-foreground/85`}>
              {isUndisclosed ? 'Undisclosed' : project.title}
            </span>
            <span className={`${CELL_TEXT} text-right text-foreground/72`}>{project.year}</span>
          </>
        )

        if (isUndisclosed) {
          return (
            <div key={project._id} className={rowClassName}>
              {cells}
            </div>
          )
        }

        return (
          <Link
            key={project._id}
            href={`?project=${project.slug}`}
            scroll={false}
            className={rowClassName}
            onMouseEnter={() => setHovered(project)}
            onMouseLeave={() => setHovered(null)}
          >
            {cells}
          </Link>
        )
      })}

      {hovered && (
        <div
          className="pointer-events-none fixed right-8 bottom-8 z-40 w-[290px] overflow-hidden"
          style={{aspectRatio: '4/3'}}
        >
          <MediaItemView
            media={hovered.coverMedia}
            alt={hovered.title}
            className="h-full w-full object-cover"
            placeholderLabel={hovered.title}
          />
        </div>
      )}
    </div>
  )
}
