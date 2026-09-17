import type {Metadata} from 'next'
import localFont from 'next/font/local'
import {Suspense} from 'react'
import {Nav} from '@/components/Nav'
import {NavVisibilityProvider} from '@/components/NavVisibilityProvider'
import {SiteFooter} from '@/components/SiteFooter'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'
import {SanityLive} from '@/sanity/lib/live'
import './globals.css'

const newsreader = localFont({
  src: './fonts/newsreader.woff2',
  variable: '--font-newsreader',
  weight: '200 800',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
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
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <NavVisibilityProvider>
          <div className="flex min-h-dvh flex-1 flex-col">
            <Suspense fallback={null}>
              <Nav />
            </Suspense>
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter settings={settings} />
          </div>
        </NavVisibilityProvider>
        <SanityLive />
      </body>
    </html>
  )
}
