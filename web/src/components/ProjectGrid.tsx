import {ProjectCard} from '@/components/ProjectCard'
import {VideoFocusGrid} from '@/components/VideoFocusGrid'
import type {Project} from '@/sanity/lib/types'

// Full class strings so Tailwind can see them. Both step up through 2 → 3
// columns; the 4-column layout adds a fourth at lg with tighter gaps. Row and
// column gaps are always equal, so the space around every card is even.
const GRID_CLASS = {
  3: 'grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-16 md:grid-cols-3 lg:gap-20',
  4: 'grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-16 md:grid-cols-3 lg:grid-cols-4 lg:gap-12',
} as const

export function ProjectGrid({
  projects,
  columns = 3,
  subheaderRight = false,
  hoverFocusVideo = false,
}: {
  projects: Project[]
  columns?: keyof typeof GRID_CLASS
  subheaderRight?: boolean
  hoverFocusVideo?: boolean
}) {
  if (projects.length === 0) {
    return <p className="text-sm text-foreground/50">Projects coming soon.</p>
  }

  const className = `project-grid ${GRID_CLASS[columns]}`
  const cards = projects.map((project) => (
    <ProjectCard key={project._id} project={project} subheaderRight={subheaderRight} />
  ))

  // Only the wrapper needs to be a client component, and only when it has work to do.
  return hoverFocusVideo ? (
    <VideoFocusGrid className={className}>{cards}</VideoFocusGrid>
  ) : (
    <div className={className}>{cards}</div>
  )
}
