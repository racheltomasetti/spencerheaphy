import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import type {Project} from '@/sanity/lib/types'

// Four across on tight gutters, every film held under a dark veil. Hovering lifts the
// veil and brings the title (and subheader) up in the middle of the frame. The index
// and year sit in the top corners: `cornerMeta` decides whether they come and go with
// the title or stay put. Touch screens can't hover, so there everything stays visible.
// Projects come in sets of eight, two full rows at four across and still even rows at
// two or one, with a wider break between sets so a long list reads in chapters.
const SET = 8

export type CornerMeta = 'hover' | 'always'

// Hidden only where the device can hover; the group-hover rule out-specifies it.
const REVEAL =
  'transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0'

function VeilCard({
  project,
  index,
  cornerMeta,
}: {
  project: Project
  index: number
  cornerMeta: CornerMeta
}) {
  const number = String(index + 1).padStart(2, '0')
  const corner = cornerMeta === 'hover' ? REVEAL : ''

  if (project.status === 'undisclosed') {
    return (
      <article className="group relative aspect-[1.85/1] overflow-hidden bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)]">
        <span
          className={`absolute left-3 top-2.5 text-[10px] tabular-nums tracking-[0.18em] text-foreground/35 ${corner}`}
        >
          {number}
        </span>
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center ${REVEAL}`}
        >
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
      aria-label={[project.title, project.subheader, project.year].filter(Boolean).join(', ')}
      className="group relative block aspect-[1.85/1] overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))] outline-none"
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
        className="absolute inset-0 bg-black/45 transition-colors duration-500 ease-out group-hover:bg-black/15 group-focus-visible:bg-black/15 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className={`absolute left-3 top-2.5 text-[10px] tabular-nums tracking-[0.18em] text-white/70 ${corner}`}
      >
        {number}
      </span>
      {project.year && (
        <span
          aria-hidden
          className={`absolute right-3 top-2.5 text-[10px] tabular-nums tracking-[0.18em] text-white/70 ${corner}`}
        >
          {project.year}
        </span>
      )}
      <div
        aria-hidden
        className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] ${REVEAL}`}
      >
        <span className="text-[13px] leading-tight text-white underline decoration-white/70 decoration-1 underline-offset-[3px]">
          {project.title}
        </span>
        {project.subheader && (
          <span className="text-[11px] leading-tight text-white/75">{project.subheader}</span>
        )}
      </div>
    </Link>
  )
}

export function VeilGrid({
  projects,
  cornerMeta = 'hover',
}: {
  projects: Project[]
  cornerMeta?: CornerMeta
}) {
  const sets: Project[][] = []
  for (let i = 0; i < projects.length; i += SET) sets.push(projects.slice(i, i + SET))

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {sets.map((set, s) => (
        <div key={s} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {set.map((project, i) => (
            <VeilCard key={project._id} project={project} index={s * SET + i} cornerMeta={cornerMeta} />
          ))}
        </div>
      ))}
    </div>
  )
}
