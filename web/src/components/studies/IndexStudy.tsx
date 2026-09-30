'use client'

import Link from 'next/link'
import {ProjectFrame, projectLine, projectTitle} from '@/components/studies/ProjectFrame'
import {useShown} from '@/components/studies/useShown'
import type {Project} from '@/sanity/lib/types'

function GridCell({project, index}: {project: Project; index: number}) {
  const {ref, shown} = useShown<HTMLDivElement>()
  const line = projectLine(project)
  const body = (
    <>
      <div className="overflow-hidden">
        <ProjectFrame
          project={project}
          className="origin-center transition-transform duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <p className="mt-2 text-[13px] leading-tight text-foreground/55 transition-colors duration-300 group-hover:text-foreground">
        {projectTitle(project)}
        {line && <span className="text-foreground/40 group-hover:text-foreground/60"> | {line}</span>}
      </p>
    </>
  )

  const className =
    'block translate-y-4 opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 data-[shown]:translate-y-0 data-[shown]:opacity-100'
  const style = {transitionDelay: shown ? `${(index % 4) * 80}ms` : '0ms'}
  const frame = (
    <div ref={ref} data-shown={shown || undefined} className={className} style={style}>
      {body}
    </div>
  )

  if (project.status === 'undisclosed') return <article>{frame}</article>

  return (
    <Link href={`?project=${project.slug}`} scroll={false} className="group block">
      {frame}
    </Link>
  )
}

export function IndexStudy({projects}: {projects: Project[]}) {
  return (
    <div className="grid w-full grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-8">
      {projects.map((project, index) => (
        <GridCell key={project._id} project={project} index={index} />
      ))}
    </div>
  )
}
