import type {Metadata} from 'next'
import {Fraunces, Inter} from 'next/font/google'
import {Suspense} from 'react'
import {Nav} from '@/components/Nav'
import {NavVisibilityProvider} from '@/components/NavVisibilityProvider'
import {SiteFooter} from '@/components/SiteFooter'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'
import {SanityLive} from '@/sanity/lib/live'
import './globals.css'

const serif = Fraunces({
  variable: '--font-serif-display',
  subsets: ['latin'],
  axes: ['opsz'],
})

const sans = Inter({
  variable: '--font-sans-body',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Spencer Heaphy',
  description: 'Director & Creator',
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <NavVisibilityProvider>
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter settings={settings} />
        </NavVisibilityProvider>
        <SanityLive />
      </body>
    </html>
  )
}
