import {ProjectCard} from '@/components/ProjectCard'
import type {Project, ProjectOrientation} from '@/sanity/lib/types'

const RATIO_BY_ORIENTATION: Record<ProjectOrientation, string> = {
  landscape: '16/9',
  portrait: '4/5',
  square: '1/1',
}

// A deliberate irregular rhythm so the grid reads editorial, not like a
// product catalog. Cycles independently of each project's own orientation.
const SPAN_PATTERN = [
  'col-span-8',
  'col-span-4',
  'col-span-4',
  'col-span-8',
  'col-span-4',
  'col-span-8',
  'col-span-4',
  'col-span-4',
  'col-span-8',
  'col-span-4',
  'col-span-4',
  'col-span-4',
]

export function ProjectGrid({projects}: {projects: Project[]}) {
  if (projects.length === 0) {
    return <p className="px-8 pb-[60px] pt-6 text-sm text-foreground/50">Projects coming soon.</p>
  }

  return (
    <div className="grid grid-cols-12 gap-[18px] px-8 pb-[60px] pt-6">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          span={SPAN_PATTERN[index % SPAN_PATTERN.length]}
          ratio={RATIO_BY_ORIENTATION[project.orientation ?? 'landscape']}
        />
      ))}
    </div>
  )
}
