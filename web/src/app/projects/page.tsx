import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {VeilGrid} from '@/components/VeilGrid'
import {getProjects} from '@/sanity/lib/get-projects'
import {isDirectorProject} from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Projects — Spencer Heaphy',
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const directorProjects = projects.filter(isDirectorProject)

  return (
    <>
      <div className="w-full px-(--edge) pt-[calc(var(--nav-h)+1rem)] pb-[60px] lg:px-[clamp(2.5rem,5vw,6rem)]">
        <h1 className="sr-only">Work</h1>
        {directorProjects.length === 0 ? (
          <p className="text-sm text-foreground/50">Projects coming soon.</p>
        ) : (
          <VeilGrid projects={directorProjects} />
        )}
      </div>
      <Suspense fallback={null}>
        <ProjectLightbox projects={directorProjects} />
      </Suspense>
    </>
  )
}
