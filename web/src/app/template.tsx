'use client'

import {usePathname} from 'next/navigation'

export default function Template({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  // Opacity animation on this wrapper would trap `position: fixed` (the mobile hero)
  // inside the page instead of the viewport, so home skips it.
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col ${pathname === '/' ? '' : 'page-enter'}`}
    >
      {children}
    </div>
  )
}
