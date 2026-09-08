import {Suspense} from 'react'
import {Bio} from '@/components/Bio'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {SelectedWork} from '@/components/SelectedWork'
import {VideoHero} from '@/components/VideoHero'
import {getProjects} from '@/sanity/lib/get-projects'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'

export default async function Home() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()])

  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity))

  return (
    <>
      <Suspense fallback={null}>
        <VideoHero projects={featuredProjects} />
      </Suspense>

      <section id="work" className="scroll-mt-[70px]">
        <SelectedWork projects={projects} />
      </section>

      <Bio settings={settings} />

      <Suspense fallback={null}>
        <ProjectLightbox projects={projects} />
      </Suspense>
    </>
  )
}
