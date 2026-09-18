import {ProjectCard} from '@/components/ProjectCard'
import type {Project} from '@/sanity/lib/types'

export function ProjectGrid({projects}: {projects: Project[]}) {
  if (projects.length === 0) {
    return <p className="text-[12px] leading-[1.5] text-foreground/72">Projects coming soon.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-16 md:grid-cols-3 lg:gap-x-20 lg:gap-y-20">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  )
}
