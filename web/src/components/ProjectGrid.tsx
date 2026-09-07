import {ProjectCard} from '@/components/ProjectCard'
import type {Project} from '@/sanity/lib/types'

export function ProjectGrid({projects}: {projects: Project[]}) {
  if (projects.length === 0) {
    return <p className="text-sm text-foreground/50">Projects coming soon.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  )
}
