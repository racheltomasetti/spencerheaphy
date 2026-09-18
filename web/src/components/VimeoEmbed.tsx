export function vimeoIdFromUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  return match?.[1] ?? null
}

// Unlisted videos need this token or the player reports the video as private.
// Share links carry it as vimeo.com/<id>/<hash>; player URLs as ?h=<hash>.
export function vimeoHashFromUrl(url: string): string | null {
  const inPath = url.match(/vimeo\.com\/(?:video\/)?\d+\/([a-z0-9]+)/i)
  if (inPath) return inPath[1]
  return url.match(/[?&]h=([a-z0-9]+)/i)?.[1] ?? null
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
  const hash = vimeoHashFromUrl(url)
  if (hash) params.set('h', hash)
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
