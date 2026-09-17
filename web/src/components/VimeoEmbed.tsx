export function vimeoIdFromUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  return match?.[1] ?? null
}

export function VimeoEmbed({
  url,
  title,
  autoplay = false,
}: {
  url: string
  title: string
  autoplay?: boolean
}) {
  const id = vimeoIdFromUrl(url)
  if (!id) return null

  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    title: '0',
    byline: '0',
    portrait: '0',
  })
  if (autoplay) params.set('autoplay', '1')

  return (
    <iframe
      src={`https://player.vimeo.com/video/${id}?${params.toString()}`}
      title={title}
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      className="absolute inset-0 h-full w-full border-0"
      allowFullScreen
    />
  )
}
