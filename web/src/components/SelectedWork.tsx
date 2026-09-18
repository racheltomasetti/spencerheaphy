import {ProjectGrid} from '@/components/ProjectGrid'
import type {Project} from '@/sanity/lib/types'

export function SelectedWork({
  projects,
  title = 'Projects',
}: {
  projects: Project[]
  title?: string
}) {
  return (
    <div className="w-full px-8 pt-[78px] pb-[60px] sm:px-12 lg:px-16">
      <h2 className="pb-10 text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-normal tracking-[-0.022em]">
        {title}
      </h2>
      <ProjectGrid projects={projects} />
    </div>
  )
}
