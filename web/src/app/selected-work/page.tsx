import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {SelectedWork} from '@/components/SelectedWork'
import {getProjects} from '@/sanity/lib/get-projects'

export const metadata: Metadata = {
  title: 'Selected Work — Spencer Heaphy',
}

export default async function SelectedWorkPage() {
  const projects = await getProjects()

  return (
    <>
      <SelectedWork projects={projects} />
      <Suspense fallback={null}>
        <ProjectLightbox projects={projects} />
      </Suspense>
    </>
  )
}
