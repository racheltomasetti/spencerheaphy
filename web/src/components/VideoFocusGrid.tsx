'use client'

import {useEffect, useRef} from 'react'

// The grid's videos all play at rest. While a mouse hovers one card, every other video
// freezes on its current frame and the hovered one carries on untouched; leaving the
// card sets them all going again. Touch and pen input are ignored, so phones keep
// autoplaying.
export function VideoFocusGrid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = ref.current
    if (!grid) return

    let focused: Element | null = null
    // Only videos we froze ourselves, so anything that wasn't playing stays that way.
    const frozen = new Set<HTMLVideoElement>()

    const play = (video: HTMLVideoElement) => {
      video.play().catch(() => {})
    }

    const freeze = (video: HTMLVideoElement) => {
      if (video.paused) return
      video.pause()
      frozen.add(video)
    }

    const focus = (card: Element | null) => {
      focused = card

      frozen.forEach((video) => {
        if (!video.isConnected || !card || card.contains(video)) {
          frozen.delete(video)
          if (video.isConnected) play(video)
        }
      })

      if (card) {
        grid.querySelectorAll('video').forEach((video) => {
          if (!card.contains(video)) freeze(video)
        })
      }
    }

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const card = (event.target as Element).closest('a.project-card')
      if (card !== focused) focus(card)
    }

    const onPointerLeave = () => {
      if (focused) focus(null)
    }

    // A video scrolling into view starts itself; hold it while another card has focus.
    const onPlay = (event: Event) => {
      const video = event.target as HTMLVideoElement
      if (focused && !focused.contains(video)) freeze(video)
    }

    grid.addEventListener('pointerover', onPointerOver)
    grid.addEventListener('pointerleave', onPointerLeave)
    grid.addEventListener('play', onPlay, true)
    return () => {
      grid.removeEventListener('pointerover', onPointerOver)
      grid.removeEventListener('pointerleave', onPointerLeave)
      grid.removeEventListener('play', onPlay, true)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
