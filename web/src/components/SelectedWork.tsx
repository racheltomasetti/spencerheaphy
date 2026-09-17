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
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-foreground/14 px-8 pt-[78px] pb-4">
        <h2 className="text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-normal tracking-[-0.022em]">
          {title}
        </h2>
      </div>

      <ProjectGrid projects={projects} />
    </>
  )
}
