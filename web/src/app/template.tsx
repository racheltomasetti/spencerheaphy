'use client'

import {usePathname} from 'next/navigation'

export default function Template({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  // Home skips the fade so the hero can `fixed inset-0` against the viewport,
  // same as the mobile menu — an opacity wrapper would trap it in the page box.
  return (
    <div className={`flex min-h-0 flex-1 flex-col ${pathname === '/' ? '' : 'page-enter'}`}>
      {children}
    </div>
  )
}
