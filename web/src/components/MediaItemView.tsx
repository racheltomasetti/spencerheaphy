import Image from 'next/image'
import {LazyVideo} from '@/components/LazyVideo'
import {urlFor} from '@/sanity/lib/image'
import type {MediaItem} from '@/sanity/lib/types'

export function MediaItemView({
  media,
  alt,
  className,
  width = 1200,
  height = 900,
}: {
  media?: MediaItem
  alt: string
  className?: string
  width?: number
  height?: number
}) {
  if (media?.mediaType === 'video' && media.video?.asset?.url) {
    return <LazyVideo src={media.video.asset.url} className={className} />
  }

  if (media?.mediaType === 'image' && media.image?.asset) {
    return (
      <Image
        src={urlFor(media.image).width(width).height(height).fit('crop').url()}
        alt={media.image.alt || alt}
        width={width}
        height={height}
        className={className}
        placeholder={media.image.asset.metadata?.lqip ? 'blur' : 'empty'}
        blurDataURL={media.image.asset.metadata?.lqip}
      />
    )
  }

  return <div className={`${className ?? ''} bg-foreground/10`} />
}
