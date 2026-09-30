'use client'

import Link from 'next/link'
import {useState, type PointerEvent} from 'react'
import {ProjectFrame, projectTitle} from '@/components/studies/ProjectFrame'
import {useShown} from '@/components/studies/useShown'
import type {Project} from '@/sanity/lib/types'

function Card({project, index}: {project: Project; index: number}) {
  const {ref, shown} = useShown<HTMLDivElement>()
  const [shift, setShift] = useState({x: 0, y: 0, on: false})
  const isUndisclosed = project.status === 'undisclosed'

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    setShift({
      x: ((event.clientX - box.left) / box.width - 0.5) * 14,
      y: ((event.clientY - box.top) / box.height - 0.5) * 10,
      on: true,
    })
  }

  const body = (
    <>
      <div className="overflow-hidden" onPointerMove={onMove} onPointerLeave={() => setShift({x: 0, y: 0, on: false})}>
        <ProjectFrame
          project={project}
          className="transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{
            transform: shift.on ? `translate(${shift.x}px, ${shift.y}px) scale(1.08)` : undefined,
          }}
        />
      </div>
      <div className="mt-3">
        <span
          className={`block h-px origin-left bg-foreground/20 transition-transform duration-700 ease-out motion-reduce:scale-x-100 ${
            shown ? 'scale-x-100' : 'scale-x-0'
          }`}
          style={{transitionDelay: shown ? `${(index % 3) * 90 + 180}ms` : '0ms'}}
        />
        <div className="flex items-baseline justify-between gap-3 pt-3">
          <p className="type-project-title min-w-0 text-foreground/90 [--project-title-size:1.15rem]">
            {projectTitle(project)}
          </p>
          {!isUndisclosed && project.year && (
            <p className="type-project-subhead shrink-0 [--project-subhead-size:10px]">{project.year}</p>
          )}
        </div>
        {!isUndisclosed && project.subheader && (
          <p className="type-project-subhead mt-1.5 [--project-subhead-size:10px]">{project.subheader}</p>
        )}
      </div>
    </>
  )

  const className =
    'block translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 data-[shown]:translate-y-0 data-[shown]:opacity-100'
  const style = {transitionDelay: shown ? `${(index % 3) * 100}ms` : '0ms'}

  const frame = (
    <div ref={ref} data-shown={shown || undefined} className={className} style={style}>
      {body}
    </div>
  )

  if (isUndisclosed) return frame

  return (
    <Link href={`?project=${project.slug}`} scroll={false} className="block">
      {frame}
    </Link>
  )
}

export function ChaptersStudy({projects}: {projects: Project[]}) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
      {projects.map((project, index) => (
        <Card key={project._id} project={project} index={index} />
      ))}
    </div>
  )
}
