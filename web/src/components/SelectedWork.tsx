import {ProjectGrid} from '@/components/ProjectGrid'
import type {Project} from '@/sanity/lib/types'

export function SelectedWork({
  projects,
  title,
  columns,
  subheaderRight,
  hoverFocusVideo,
}: {
  projects: Project[]
  title?: string
  columns?: 3 | 4
  subheaderRight?: boolean
  hoverFocusVideo?: boolean
}) {
  return (
    <div className="w-full px-5 md:px-8 pt-[calc(var(--nav-h)+1rem)] pb-[60px]">
      {title && (
        <h2 className="pb-10 text-[clamp(26px,3.4vw,46px)] leading-none font-normal tracking-[-0.025em]">
          {title}
        </h2>
      )}
      <ProjectGrid
        projects={projects}
        columns={columns}
        subheaderRight={subheaderRight}
        hoverFocusVideo={hoverFocusVideo}
      />
    </div>
  )
}
