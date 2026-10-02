import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import {UnveilOnScroll} from '@/components/UnveilOnScroll'
import type {Project} from '@/sanity/lib/types'

// Three across on open gutters, every film in a 16:9 frame and shown clean. Hovering
// draws a dark veil over the film and brings its title and subheader up in the middle.
// Touch screens can't hover, so there a lighter veil and the title stay on.
// Each tile fades in the first time it scrolls into view (see UnveilOnScroll).
// Projects come in sets of six, two full rows at three across and still even rows at
// two or one, with a wider break between sets so a long list reads in chapters.
const SET = 6

// Hidden only where the device can hover; the group-hover rule out-specifies it.
const REVEAL =
  'transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0'

function VeilCard({project}: {project: Project}) {
  if (project.status === 'undisclosed') {
    return (
      <article data-unveil className="unveil group relative aspect-video">
        <div className="unveil-frame absolute inset-0 overflow-hidden bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)]">
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center ${REVEAL}`}
          >
            <span className="text-[13px] leading-tight text-foreground/60">Undisclosed</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/35">Details coming soon</span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <Link
      href={`?project=${project.slug}`}
      scroll={false}
      aria-label={[project.title, project.subheader].filter(Boolean).join(', ')}
      data-unveil
      className="unveil group relative block aspect-video outline-none"
    >
      <div className="unveil-frame absolute inset-0 overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))]">
        <div className="unveil-film absolute inset-0">
          <MediaItemView
            media={project.coverMedia}
            alt=""
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            placeholderLabel="Cover media pending"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-black/30 transition-colors duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:bg-transparent group-hover:bg-black/50 group-focus-visible:bg-black/50"
        />
        <div
          aria-hidden
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center ${REVEAL}`}
        >
          <span className="text-[14px] leading-tight text-white underline decoration-white/70 decoration-1 underline-offset-[3px]">
            {project.title}
          </span>
          {project.subheader && (
            <span className="text-[12px] leading-tight text-white/75">{project.subheader}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function VeilGrid({projects}: {projects: Project[]}) {
  const sets: Project[][] = []
  for (let i = 0; i < projects.length; i += SET) sets.push(projects.slice(i, i + SET))

  return (
    <UnveilOnScroll className="flex flex-col gap-16 md:gap-24">
      {sets.map((set, s) => (
        <div key={s} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {set.map((project) => (
            <VeilCard key={project._id} project={project} />
          ))}
        </div>
      ))}
    </UnveilOnScroll>
  )
}
