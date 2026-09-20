'use client'

import Link from 'next/link'

// A link that enlarges slightly and goes bold when emphasized. The parent owns the
// emphasis state so a group of these can hand the bold from one to the next. Driven
// by inline styles rather than generated CSS, so it can't go missing if the
// stylesheet lags behind the markup in dev.
//  - Enlarging uses a transform, which never moves the neighbouring links.
//  - The invisible bold copy in the same grid cell keeps the link as wide as its
//    bold form, so going bold doesn't nudge anything either.
export function BoldLink({
  href,
  label,
  emphasized,
  onActivate,
  onDeactivate,
  current = false,
  external = false,
  weight = 700,
  className,
  onClick,
}: {
  href: string
  label: string
  emphasized: boolean
  onActivate: () => void
  onDeactivate: () => void
  current?: boolean
  external?: boolean
  weight?: number
  className?: string
  onClick?: () => void
}) {
  const handlers = {
    onMouseEnter: onActivate,
    onFocus: (event: React.FocusEvent<HTMLAnchorElement>) => {
      if (event.currentTarget.matches(':focus-visible')) onActivate()
    },
    onBlur: onDeactivate,
    onClick,
  }

  // A transition takes its timing from the state it's heading into, so the link gaining
  // emphasis snaps in quickly while the one losing it eases out a beat slower. The two
  // overlap, which reads as the bold flowing across rather than swapping.
  const ms = emphasized ? 150 : 200
  const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'

  const content = (
    <span
      className="motion-reduce:transition-none!"
      style={{
        display: 'inline-grid',
        transform: emphasized ? 'scale(1.08)' : 'scale(1)',
        transition: `transform ${ms}ms ${ease}`,
        willChange: 'transform',
      }}
    >
      <span
        className="motion-reduce:transition-none!"
        style={{
          gridArea: '1 / 1',
          justifySelf: 'center',
          fontWeight: emphasized ? weight : undefined,
          transition: `font-weight ${ms}ms ${ease}`,
        }}
      >
        {label}
      </span>
      <span aria-hidden style={{gridArea: '1 / 1', visibility: 'hidden', fontWeight: weight}}>
        {label}
      </span>
    </span>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{display: 'inline-block'}}
        {...handlers}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      className={className}
      style={{display: 'inline-block'}}
      {...handlers}
    >
      {content}
    </Link>
  )
}
