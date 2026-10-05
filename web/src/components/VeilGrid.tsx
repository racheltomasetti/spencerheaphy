import Link from 'next/link'
import {MediaItemView} from '@/components/MediaItemView'
import {UnveilOnScroll} from '@/components/UnveilOnScroll'
import type {Project} from '@/sanity/lib/types'

// Three across on open gutters, every film in a 16:9 frame and shown clean. Hovering
// draws a dark veil over the film and brings its title and subheader up in the middle,
// in the site's shared project type styles (serif title, small uppercase subheader),
// with the title underlined.
// Touch screens can't hover, so there a lighter veil and the title stay on.
// One and two columns are capped so a tile there stays close to the size of a three-column
// tile (about 400px and 320px, against 260px and up), instead of ballooning on a tablet.
// Tiles below the fold fade in as they are scrolled to (see UnveilOnScroll).

// Hidden only where the device can hover; the group-hover rule out-specifies it.
const REVEAL =
  'transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0'

function VeilCard({project}: {project: Project}) {
  if (project.status === 'undisclosed') {
    return (
      <article
        data-unveil
        className="unveil group relative aspect-video [--project-subhead-size:10px] [--project-title-size:1.25rem]"
      >
        <div className="unveil-frame absolute inset-0 overflow-hidden bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)]">
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center ${REVEAL}`}
          >
            <span className="type-project-title text-foreground/60">Undisclosed</span>
            <span className="type-project-subhead text-foreground/45">Details coming soon</span>
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
      className="unveil group relative block aspect-video outline-none [--project-subhead-size:10px] [--project-title-size:1.25rem]"
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
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-white ${REVEAL}`}
        >
          <span className="type-project-title underline decoration-white/70 decoration-1 underline-offset-4">
            {project.title}
          </span>
          {project.subheader && <span className="type-project-subhead">{project.subheader}</span>}
        </div>
      </div>
    </Link>
  )
}

export function VeilGrid({projects}: {projects: Project[]}) {
  return (
    <UnveilOnScroll className="mx-auto grid max-[640px]:max-w-[400px] grid-cols-1 gap-[clamp(2.5rem,3vw,2.75rem)] sm:max-[960px]:max-w-[680px] sm:max-[960px]:grid-cols-2 min-[960px]:grid-cols-3">
      {projects.map((project) => (
        <VeilCard key={project._id} project={project} />
      ))}
    </UnveilOnScroll>
  )
}
