import {Suspense} from 'react'
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

      <section id="bio" className="mx-auto max-w-3xl scroll-mt-[70px] px-6 py-16 sm:px-10">
        <h2 className="mb-8 font-serif text-3xl uppercase tracking-[0.08em]">Bio</h2>
        {settings?.tagline && (
          <p className="mb-8 text-sm uppercase tracking-[0.15em] text-foreground/50">
            {settings.tagline}
          </p>
        )}
        <p className="text-lg leading-relaxed text-foreground/80">
          Placeholder bio copy. This is where {settings?.name || 'Spencer Heaphy'}&rsquo;s
          background, credits, and approach will live once the final copy is ready.
        </p>
      </section>

      <Suspense fallback={null}>
        <ProjectLightbox projects={projects} />
      </Suspense>
    </>
  )
}
