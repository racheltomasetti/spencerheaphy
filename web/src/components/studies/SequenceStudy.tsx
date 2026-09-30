'use client'

import Link from 'next/link'
import {ProjectFrame, projectTitle} from '@/components/studies/ProjectFrame'
import {useShown} from '@/components/studies/useShown'
import type {Project} from '@/sanity/lib/types'

function Row({project, index}: {project: Project; index: number}) {
  const {ref, shown} = useShown<HTMLDivElement>()
  const isUndisclosed = project.status === 'undisclosed'
  const body = (
    <>
      <ProjectFrame
        project={project}
        className="w-full transition-transform duration-500 ease-out group-hover/row:translate-x-1.5 motion-reduce:transition-none sm:max-w-[220px]"
      />
      <p className="type-project-title text-foreground/70 transition-colors duration-300 group-hover/row:text-foreground [--project-title-size:1.35rem]">
        {projectTitle(project)}
      </p>
      <p className="type-project-subhead transition-colors duration-300 group-hover/row:text-foreground [--project-subhead-size:11px]">
        {!isUndisclosed && project.subheader}
      </p>
      <p className="type-project-subhead sm:text-right [--project-subhead-size:11px]">
        {!isUndisclosed && project.year}
      </p>
    </>
  )

  const className =
    'group/row -translate-x-5 opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 data-[shown]:translate-x-0 data-[shown]:opacity-100 group-hover/list:data-[shown]:opacity-75 hover:data-[shown]:opacity-100!'
  const rowClass =
    'grid grid-cols-1 items-center gap-x-8 gap-y-1 border-b border-foreground/12 py-4 transition-colors duration-300 hover:bg-foreground/[0.03] sm:grid-cols-[minmax(140px,220px)_minmax(0,1.5fr)_minmax(0,1fr)_4.5rem]'
  const style = {transitionDelay: shown ? `${Math.min(index, 6) * 60}ms` : '0ms'}
  const frame = (
    <div ref={ref} data-shown={shown || undefined} className={className} style={style}>
      {isUndisclosed ? (
        <article className={rowClass}>{body}</article>
      ) : (
        <Link href={`?project=${project.slug}`} scroll={false} className={rowClass}>
          {body}
        </Link>
      )}
    </div>
  )

  return frame
}

export function SequenceStudy({projects}: {projects: Project[]}) {
  return (
    <div className="group/list w-full border-t border-foreground/12">
      {projects.map((project, index) => (
        <Row key={project._id} project={project} index={index} />
      ))}
    </div>
  )
}
