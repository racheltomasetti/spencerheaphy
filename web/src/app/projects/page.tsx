import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {VeilGrid} from '@/components/VeilGrid'
import {getProjects} from '@/sanity/lib/get-projects'
import {isDirectorProject, type Project} from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Projects — Spencer Heaphy',
}

// Same type as the nav tabs. The side gutters are this wide so the grid's right edge
// sits on the left of the S in Social, and the left side matches.
const NAV_TAB = 'text-[clamp(13px,1.6vw,16px)] uppercase tracking-[0.18em]'

function SideGutter() {
  return (
    <div aria-hidden className="invisible hidden shrink-0 items-center gap-7 pr-(--edge) md:flex">
      <span className={NAV_TAB}>Social</span>
      <span className={NAV_TAB}>Bio</span>
    </div>
  )
}

// Dev only: fills one sparse project with placeholder copy, credits and stills, so the
// project page can be judged with every section present. The stills are borrowed from
// the other projects' covers. Set DEV_FILLER_SLUG to null to turn it off. Never runs
// in a production build.
const DEV_FILLER_SLUG: string | null = 'foundrae'

function withDevFiller(projects: Project[]): Project[] {
  if (process.env.NODE_ENV !== 'development' || !DEV_FILLER_SLUG) return projects
  return projects.map((project) => {
    if (project.slug !== DEV_FILLER_SLUG) return project
    const stills = projects
      .filter((other) => other.slug !== project.slug && other.coverMedia)
      .slice(0, 5)
      .map((other, i) => ({...other.coverMedia!, _key: `filler-still-${i}`}))
    return {
      ...project,
      date: project.date ?? '2026-03-01',
      description:
        project.description ??
        'Placeholder copy. A short film for the fall collection, shot over two days in lower Manhattan on 16mm. The piece follows one woman through the city as the weather turns, cut to a single piece of music with no dialogue.',
      crew: project.crew?.length
        ? project.crew
        : [
            {role: 'Director', name: 'Spencer Heaphy'},
            {role: 'DP', name: 'Placeholder Name'},
            {role: 'Producer', name: 'Placeholder Name'},
            {role: 'Editor', name: 'Spencer Heaphy'},
            {role: 'Colorist', name: 'Placeholder Name'},
            {role: 'Sound', name: 'Placeholder Name'},
          ],
      gallery: project.gallery?.length ? project.gallery : stills,
    }
  })
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const directorProjects = withDevFiller(projects.filter(isDirectorProject))

  return (
    <>
      <div className="flex w-full items-start pt-[calc(var(--nav-h)+1rem)] pb-[60px]">
        <SideGutter />
        <div className="min-w-0 flex-1 px-(--edge) md:px-0">
          <h1 className="sr-only">Work</h1>
          {directorProjects.length === 0 ? (
            <p className="text-sm text-foreground/50">Projects coming soon.</p>
          ) : (
            <VeilGrid projects={directorProjects} />
          )}
        </div>
        <SideGutter />
      </div>
      <Suspense fallback={null}>
        <ProjectLightbox projects={directorProjects} />
      </Suspense>
    </>
  )
}
