import type {Metadata} from 'next'
import {Fraunces, Inter} from 'next/font/google'
import {Nav} from '@/components/Nav'
import {SiteFooter} from '@/components/SiteFooter'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'
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
  description: 'Director / cinematographer — selected work, bio, and contact.',
}

// Re-check Sanity roughly once a minute so Studio edits (name, logos, socials)
// show up without a redeploy.
export const revalidate = 60

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
