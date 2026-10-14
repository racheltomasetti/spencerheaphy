'use client'

import {useEffect, useRef} from 'react'
import {createPortal} from 'react-dom'

// A social project's full video, taking over the screen. The video is 9:16 and as tall as
// the viewport allows, so on a phone it fills the screen and on a wide screen it sits in
// the middle with the dark sides left clickable to close. It opens from a click, so the
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
        className="h-dvh max-h-dvh w-auto max-w-full bg-black object-contain"
        style={{aspectRatio: '9 / 16'}}
      />
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 p-2 text-[26px] leading-none text-white/90 mix-blend-difference hover:text-white"
      >
        ✕
      </button>
    </div>,
    document.body,
  )
}
