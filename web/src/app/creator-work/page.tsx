import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {SelectedWork} from '@/components/SelectedWork'
import {getProjects} from '@/sanity/lib/get-projects'

export const metadata: Metadata = {
  title: 'Creator Work — Spencer Heaphy',
}

export default async function CreatorWorkPage() {
  const projects = await getProjects()
  const creatorProjects = projects.filter((project) => project.role === 'creator')

  return (
    <>
      <SelectedWork projects={creatorProjects} title="Creator Work" />
      <Suspense fallback={null}>
        <ProjectLightbox projects={creatorProjects} />
      </Suspense>
    </>
  )
}
