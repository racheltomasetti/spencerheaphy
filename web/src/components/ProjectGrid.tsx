import {ProjectCard} from '@/components/ProjectCard'
import type {Project} from '@/sanity/lib/types'

export function ProjectGrid({projects}: {projects: Project[]}) {
  if (projects.length === 0) {
    return <p className="px-8 pb-[60px] pt-6 text-sm text-foreground/50">Projects coming soon.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-8 pb-[60px] pt-6 sm:grid-cols-2 md:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  )
}
