import type {Metadata} from 'next'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {SocialCarousel} from '@/components/SocialCarousel'
import {getProjects} from '@/sanity/lib/get-projects'
import {isSocialProject} from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Social — Spencer Heaphy',
}

export default async function SocialPage() {
  const projects = await getProjects()
  // The row is built for 9:16, so only projects marked portrait in Sanity are shown.
  const socialProjects = projects.filter(
    (project) => isSocialProject(project) && project.orientation === 'portrait',
  )

  return (
    <>
      <div className="flex w-full flex-1 flex-col pt-[calc(var(--nav-h)+0.5rem)]">
        <h1 className="sr-only">Social</h1>
        {socialProjects.length === 0 ? (
          <p className="px-(--edge) text-sm text-foreground/50">Projects coming soon.</p>
        ) : (
          <SocialCarousel projects={socialProjects} />
        )}
      </div>
      <Suspense fallback={null}>
        <ProjectLightbox projects={socialProjects} />
      </Suspense>
    </>
  )
}
