import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {VeilGrid} from '@/components/VeilGrid'
import {getProjects} from '@/sanity/lib/get-projects'
import {isDirectorProject, type Project} from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Projects — Spencer Heaphy',
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
      {/* Fills the room between the nav and the footer. A short grid is centred in it, with
          the same gap above and below; a grid taller than the screen has no spare room, so
          it sits at that minimum gap and scrolls. Phones are one column taller than the screen, so there it just scrolls. The top gap
          and the side margins grow smoothly with the width (20px on a phone to 96px by about
          1440px) rather than jumping at a breakpoint. */}
      <div className="flex w-full flex-1 items-center pt-[calc(var(--nav-h)+clamp(1.5rem,4vw,3rem))] pb-12">
        <div className="min-w-0 flex-1 px-[clamp(var(--edge),calc(9.5vw-2.6rem),6rem)]">
          <h1 className="sr-only">Work</h1>
          {directorProjects.length === 0 ? (
            <p className="text-sm text-foreground/50">Projects coming soon.</p>
          ) : (
            <VeilGrid projects={directorProjects} />
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <ProjectLightbox projects={directorProjects} />
      </Suspense>
    </>
  )
}
