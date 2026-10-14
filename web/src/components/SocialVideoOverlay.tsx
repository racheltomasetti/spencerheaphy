'use client'

import {useEffect, useRef} from 'react'
import {createPortal} from 'react-dom'

// A social project's full video, taking over the screen. The video is 9:16 and as tall as
// the viewport allows, so on a wide screen it fills the height. On a phone it keeps a margin
// all round. Either way the dark area around the video is clickable to close. It opens from a click, so the
// browser lets it play with sound.
export function SocialVideoOverlay({
  src,
  title,
  onClose,
}: {
  src: string
  title: string
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  useEffect(() => {
    const node = videoRef.current
    // If the browser still refuses sound, the controls let the viewer start it themselves.
    node?.play().catch(() => {})
  }, [])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <video
        ref={videoRef}
        src={src}
        controls
        autoPlay
        playsInline
        preload="auto"
        controlsList="nodownload"
        onClick={(event) => event.stopPropagation()}
        className="aspect-[9/16] w-[min(calc(100vw-3rem),calc((100dvh-5rem)*9/16))] bg-black object-contain md:h-dvh md:w-auto md:max-w-full"
      />
    </div>,
    document.body,
  )
}
