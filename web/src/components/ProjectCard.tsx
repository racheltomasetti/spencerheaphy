import Image from 'next/image'
import {LazyVideo} from '@/components/LazyVideo'
import {urlFor} from '@/sanity/lib/image'
import type {Project} from '@/sanity/lib/types'

export function ProjectCard({project}: {project: Project}) {
  const isUndisclosed = project.status === 'undisclosed'
  const media = project.coverMedia

  return (
    <article className="group flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
        {isUndisclosed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-foreground/10 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">
              Undisclosed
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/30">
              Details coming soon
            </span>
          </div>
        ) : media?.mediaType === 'video' && media.video?.asset?.url ? (
          <LazyVideo
            src={media.video.asset.url}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : media?.mediaType === 'image' && media.image?.asset ? (
          <Image
            src={urlFor(media.image).width(1200).height(900).fit('crop').url()}
            alt={media.image.alt || project.title}
            width={1200}
            height={900}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            placeholder={media.image.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={media.image.asset.metadata?.lqip}
          />
        ) : (
          <div className="h-full w-full bg-foreground/10" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        {!isUndisclosed && project.client && (
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/80">
            {project.client}
          </span>
        )}
        <span className="text-sm text-foreground/60">
          {isUndisclosed ? project.category || 'Project' : project.title}
        </span>
      </div>
    </article>
  )
}
