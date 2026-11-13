import {vimeoHashFromUrl, vimeoIdFromUrl} from '@/components/VimeoEmbed'

// Vimeo's player letterboxes any video that isn't the shape of the frame around it, which
// shows up as bars. So the frame has to be the video's own shape. Vimeo's oEmbed endpoint
// reports each video's width and height; only the ratio between them is used. Returns
// undefined when it can't be found, and the project then keeps the standard 16:9 frame.
export async function getVimeoAspect(url: string): Promise<number | undefined> {
  const id = vimeoIdFromUrl(url)
  if (!id) return undefined

  // Unlisted videos only answer when their hash is in the link.
  const hash = vimeoHashFromUrl(url)
  const canonical = `https://vimeo.com/${id}${hash ? `/${hash}` : ''}`

  try {
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(canonical)}`,
      {next: {revalidate: 60 * 60 * 24}, signal: AbortSignal.timeout(5000)},
    )
    if (!response.ok) return undefined
    const {width, height} = (await response.json()) as {width?: unknown; height?: unknown}
    if (typeof width !== 'number' || typeof height !== 'number') return undefined
    if (!(width > 0) || !(height > 0)) return undefined
    return width / height
  } catch {
    return undefined
  }
}
