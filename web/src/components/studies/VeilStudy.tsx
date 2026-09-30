import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import {projectTitle} from '@/components/studies/ProjectFrame'
import type {Project} from '@/sanity/lib/types'

// Four across on tight gutters, every frame held under a dark veil with its title set
// in the middle, underlined like a link. The index and year sit in the top corners.
// Hovering lifts the veil off the film. Projects come in sets of two full rows with a
// wider break between sets, so a long list reads in chapters rather than one wall.
// Eight to a set: two full rows at four across, and still even rows at two or one.
const SET = 8

function VeilCard({project, index}: {project: Project; index: number}) {
  const isUndisclosed = project.status === 'undisclosed'
  const number = String(index + 1).padStart(2, '0')

  if (isUndisclosed) {
    return (
      <article className="relative aspect-[1.85/1] overflow-hidden bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)]">
        <span className="absolute left-3 top-2.5 text-[10px] tabular-nums tracking-[0.18em] text-foreground/35">
          {number}
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center">
          <span className="text-[13px] leading-tight text-foreground/60">Undisclosed</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/35">Details coming soon</span>
        </div>
      </article>
    )
  }

  return (
    <Link
      href={`?project=${project.slug}`}
      scroll={false}
      className="group relative block aspect-[1.85/1] overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))]"
    >
      <MediaItemView
        media={project.coverMedia}
        alt=""
        width={1400}
        height={760}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        placeholderLabel="Cover media pending"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-black/45 transition-colors duration-500 ease-out group-hover:bg-black/10 group-focus-visible:bg-black/10 motion-reduce:transition-none"
      />
      <span className="absolute left-3 top-2.5 text-[10px] tabular-nums tracking-[0.18em] text-white/60">
        {number}
      </span>
      {project.year && (
        <span className="absolute right-3 top-2.5 text-[10px] tabular-nums tracking-[0.18em] text-white/60">
          {project.year}
        </span>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center">
        <span className="text-[13px] leading-tight text-white underline decoration-white/60 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-300 group-hover:decoration-white">
          {projectTitle(project)}
        </span>
        {project.subheader && (
          <span className="text-[11px] leading-tight text-white/65">{project.subheader}</span>
        )}
      </div>
    </Link>
  )
}

export function VeilStudy({projects}: {projects: Project[]}) {
  const sets: Project[][] = []
  for (let i = 0; i < projects.length; i += SET) sets.push(projects.slice(i, i + SET))

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {sets.map((set, s) => (
        <div key={s} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {set.map((project, i) => (
            <VeilCard key={project._id} project={project} index={s * SET + i} />
          ))}
        </div>
      ))}
    </div>
  )
}
