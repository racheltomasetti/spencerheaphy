import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {VideoHero} from '@/components/VideoHero'
import {getProjects} from '@/sanity/lib/get-projects'

export default async function Home() {
  const projects = await getProjects()

  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity))

  return (
    <>
      <Suspense fallback={null}>
        <VideoHero projects={featuredProjects} />
      </Suspense>

      <Suspense fallback={null}>
        <ProjectLightbox projects={projects} />
      </Suspense>
    </>
  )
}
