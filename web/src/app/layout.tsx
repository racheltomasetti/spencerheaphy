import type {Metadata} from 'next'
import {Newsreader} from 'next/font/google'
import {Suspense} from 'react'
import {Nav} from '@/components/Nav'
import {NavVisibilityProvider} from '@/components/NavVisibilityProvider'
import {SiteFooter} from '@/components/SiteFooter'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'
import {SanityLive} from '@/sanity/lib/live'
import './globals.css'

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: 'Spencer Heaphy',
  description: 'Director & Creator',
  icons: {
    icon: [{url: '/icon-v2.png', type: 'image/png', sizes: '64x64'}],
    apple: [{url: '/apple-icon.png', sizes: '180x180'}],
  },
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${newsreader.variable} h-full`}>
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
