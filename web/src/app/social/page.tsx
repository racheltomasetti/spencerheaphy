import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {SelectedWork} from '@/components/SelectedWork'
import {getProjects} from '@/sanity/lib/get-projects'
import {isSocialProject} from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Social — Spencer Heaphy',
}

export default async function SocialPage() {
  const projects = await getProjects()
  const socialProjects = projects.filter(isSocialProject)

  return (
    <>
      <SelectedWork projects={socialProjects} />
      <Suspense fallback={null}>
        <ProjectLightbox projects={socialProjects} />
      </Suspense>
    </>
  )
}
