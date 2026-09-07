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
  placeholderLabel,
  placeholderVariant = 'light',
}: {
  media?: MediaItem
  alt: string
  className?: string
  width?: number
  height?: number
  placeholderLabel?: string
  placeholderVariant?: 'light' | 'dark'
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

  const isDark = placeholderVariant === 'dark'

  return (
    <div
      className={`${className ?? ''} relative flex items-end p-3 ${
        isDark
          ? 'bg-[repeating-linear-gradient(135deg,#22201b_0_9px,#2b2822_9px_18px)]'
          : 'bg-[repeating-linear-gradient(135deg,#eceae4_0_9px,#f4f2ec_9px_18px)]'
      }`}
    >
      {placeholderLabel && (
        <span
          className={`text-[10px] uppercase tracking-[0.16em] ${
            isDark ? 'text-background/68' : 'text-foreground/40'
          }`}
        >
          {placeholderLabel}
        </span>
      )}
    </div>
  )
}
