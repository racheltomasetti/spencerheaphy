import type {Metadata} from 'next'
import {ProjectCard} from '@/components/ProjectCard'
import {client} from '@/sanity/lib/client'
import {PROJECTS_QUERY} from '@/sanity/lib/queries'
import type {Project} from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Selected Work — Spencer Heaphy',
}

export const revalidate = 3600

async function getProjects(): Promise<Project[]> {
  try {
    return await client.fetch(PROJECTS_QUERY)
  } catch {
    return []
  }
}

export default async function SelectedWorkPage() {
  const projects = await getProjects()

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
      <h1 className="mb-12 font-serif text-3xl uppercase tracking-[0.08em]">Selected Work</h1>
      {projects.length === 0 ? (
        <p className="text-sm text-foreground/50">Projects coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
