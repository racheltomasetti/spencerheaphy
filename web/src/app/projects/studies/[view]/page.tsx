import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'
import {ProjectLightbox} from '@/components/ProjectLightbox'
import {ChaptersStudy} from '@/components/studies/ChaptersStudy'
import {FlexStudy} from '@/components/studies/FlexStudy'
import {IndexStudy} from '@/components/studies/IndexStudy'
import {SequenceStudy} from '@/components/studies/SequenceStudy'
import {isStudyView, STUDIES, type StudyView} from '@/components/studies/studies'
import {StudySwitcher} from '@/components/studies/StudySwitcher'
import {VeilStudy} from '@/components/studies/VeilStudy'
import {getProjects} from '@/sanity/lib/get-projects'
import {isDirectorProject, type Project} from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Layout studies — Spencer Heaphy',
}

export default async function StudyPage({params}: {params: Promise<{view: string}>}) {
  const {view} = await params
  if (!isStudyView(view)) notFound()

  const projects = (await getProjects()).filter(isDirectorProject)
  const study = STUDIES.find((item) => item.id === view) as (typeof STUDIES)[number]

  return (
    <>
      <StudySwitcher view={view as StudyView} />
      <div className="px-(--edge) pt-10 pb-[72px]">
        <h1 className="sr-only">{study.label}</h1>
        {projects.length === 0 ? (
          <p className="text-sm text-foreground/50">Projects coming soon.</p>
        ) : (
          <StudyView projects={projects} view={view} />
        )}
      </div>
      <Suspense fallback={null}>
        <ProjectLightbox projects={projects} />
      </Suspense>
    </>
  )
}

function StudyView({projects, view}: {projects: Project[]; view: StudyView}) {
  if (view === 'chapters') return <ChaptersStudy projects={projects} />
  if (view === 'sequence') return <SequenceStudy projects={projects} />
  if (view === 'flex') return <FlexStudy projects={projects} />
  if (view === 'veil') return <VeilStudy projects={projects} />
  return <IndexStudy projects={projects} />
}
