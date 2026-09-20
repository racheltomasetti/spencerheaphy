import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {SelectedWork} from '@/components/SelectedWork'
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
      <SelectedWork projects={directorProjects} columns={4} />
      <Suspense fallback={null}>
        <ProjectLightbox projects={directorProjects} />
      </Suspense>
    </>
  )
}
