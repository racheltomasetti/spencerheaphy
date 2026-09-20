import {ProjectCard} from '@/components/ProjectCard'
import type {Project} from '@/sanity/lib/types'

// Full class strings so Tailwind can see them. Both step up through 2 → 3
// columns; the 4-column layout adds a fourth at lg with tighter gaps.
const GRID_CLASS = {
  3: 'grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-16 md:grid-cols-3 lg:gap-x-20 lg:gap-y-20',
  4: 'grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-14',
} as const

export function ProjectGrid({
  projects,
  columns = 3,
}: {
  projects: Project[]
  columns?: keyof typeof GRID_CLASS
}) {
  if (projects.length === 0) {
    return <p className="text-sm text-foreground/50">Projects coming soon.</p>
  }

  return (
    <div className={GRID_CLASS[columns]}>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  )
}
