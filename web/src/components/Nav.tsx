'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {useNavVisibility} from '@/components/NavVisibilityProvider'

export function Nav() {
  const searchParams = useSearchParams()
  const projectOpen = searchParams.get('project') !== null
  const {scrolled, menuOpen, setMenuOpen} = useNavVisibility()
  // Menu open forces the transparent/cream-ink state even when scrolled, so a
  // solid cream bar never paints cream text on top of the dark overlay.
  const dark = !scrolled || menuOpen

  useEffect(() => {
    if (projectOpen) setMenuOpen(false)
  }, [projectOpen, setMenuOpen])

  if (projectOpen) return null

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color] duration-500 ease-in-out"
        style={{
          background: dark ? 'rgba(20,19,16,0)' : '#faf9f6',
          borderBottom: `1px solid ${dark ? 'rgba(250,249,246,0)' : 'rgba(20,19,16,.12)'}`,
        }}
      >
        <div
          className="flex items-center justify-between gap-6 px-8 py-5 transition-colors duration-500 ease-in-out"
          style={{color: dark ? '#faf9f6' : '#141310'}}
        >
          <Link
            href="/#top"
            onClick={() => setMenuOpen(false)}
            aria-label="Spencer Heaphy, home"
            className="text-[17px] leading-[1.4] font-medium tracking-[0.01em]"
          >
            Spencer Heaphy
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex flex-col gap-[5px] py-1.5 pl-5"
          >
            <span
              className="block h-px w-[26px] bg-current transition-transform duration-300 ease-in-out"
              style={{transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none'}}
            />
            <span
              className="block h-px w-[26px] bg-current transition-opacity duration-200 ease-in-out"
              style={{opacity: menuOpen ? 0 : 1}}
            />
            <span
              className="block h-px w-[26px] bg-current transition-transform duration-300 ease-in-out"
              style={{transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none'}}
            />
          </button>
        </div>
      </header>

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </>
  )
}

const MENU_LINK =
  'opsz-display text-[clamp(40px,7vw,84px)] leading-[1.06] tracking-[-0.03em] transition-colors hover:text-[#c8a27a] md:text-[clamp(34px,5vw,62px)]'

function MenuOverlay({onClose}: {onClose: () => void}) {
  return (
    <div className="fixed inset-0 z-[70] flex animate-[menu-fade-in_320ms_ease] flex-col justify-center gap-1.5 bg-foreground px-8 text-background">
      <Link href="/projects" onClick={onClose} className={MENU_LINK}>
        Projects
      </Link>
      <Link href="/social" onClick={onClose} className={MENU_LINK}>
        Social
      </Link>
      <Link href="/bio" onClick={onClose} className={MENU_LINK}>
        Bio
      </Link>
      <Link href="/contact" onClick={onClose} className={MENU_LINK}>
        Contact
      </Link>
    </div>
  )
}
