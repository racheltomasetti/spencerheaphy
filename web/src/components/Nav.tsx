'use client'

import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import {BoldLink} from '@/components/BoldLink'
import {useNavVisibility} from '@/components/NavVisibilityProvider'

const NAV_LINKS = [
  {href: '/projects', label: 'Work'},
  {href: '/social', label: 'Social'},
  {href: '/bio', label: 'Bio'},
] as const

const BAR_LINK = 'text-[clamp(13px,1.6vw,20px)] uppercase tracking-[0.18em]'
const NAME_LINK =
  'font-serif text-[length:var(--nav-name-size)] leading-[1.3] font-medium uppercase tracking-[0.18em]'

// Scrolling down slides the bar out of view so it never sits on top of work; scrolling
// back up brings it straight back. Both need a run of deliberate travel in one direction,
// so momentum jitter, edge bounce and late-loading images can't make it flicker.
const SHOW_NEAR_TOP = 10
const HIDE_AFTER = 24
const SHOW_AFTER = 32

// `embedded` renders the bar inside the project view, which scrolls on its own. The
// page-level copy hides while a project is open so there's only ever one.
export function Nav({embedded = false}: {embedded?: boolean}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const projectOpen = searchParams.get('project') !== null
  const {scrolled, menuOpen, setMenuOpen} = useNavVisibility()
  // Menu open forces the transparent/cream-ink state even when scrolled, so a
  // solid cream bar never paints cream text on top of the dark overlay. An open
  // project sits on a light backdrop, so the bar stays solid there, even over the hero.
  const dark = (!scrolled && !projectOpen) || menuOpen
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const travel = useRef(0)

  useEffect(() => {
    lastY.current = 0
    travel.current = 0
    setHidden(false)

    // Scroll events don't bubble, but they can be caught in the capture phase. The page
    // scrolls the document; the project view scrolls its own container, so each copy of
    // the bar only listens to the scroller it belongs to.
    const onScroll = (event: Event) => {
      const isDocument = event.target === document
      if (isDocument === embedded) return

      const scroller = isDocument ? document.documentElement : (event.target as Element)
      const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
      // Clamp so rubber-banding past either end reads as standing still, not as a reversal.
      const y = Math.min(Math.max(isDocument ? window.scrollY : scroller.scrollTop, 0), max)
      const delta = y - lastY.current
      lastY.current = y
      if (delta === 0) return

      if (y < SHOW_NEAR_TOP) {
        travel.current = 0
        setHidden(false)
        return
      }

      // Distance covered in the current direction; a reversal starts the count over.
      travel.current =
        Math.sign(delta) === Math.sign(travel.current) ? travel.current + delta : delta
      if (travel.current > HIDE_AFTER) setHidden(true)
      else if (travel.current < -SHOW_AFTER) setHidden(false)
    }

    document.addEventListener('scroll', onScroll, {capture: true, passive: true})
    return () => document.removeEventListener('scroll', onScroll, {capture: true})
  }, [embedded])

  useEffect(() => {
    if (projectOpen) setMenuOpen(false)
  }, [projectOpen, setMenuOpen])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false)
    }

    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [setMenuOpen])

  if (projectOpen && !embedded) return null

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[80]"
        style={{
          background: menuOpen ? '#141310' : dark ? 'rgba(20,19,16,0)' : '#faf9f6',
          transform: hidden && !menuOpen ? 'translateY(-100%)' : 'none',
          transition: 'background-color 500ms ease-in-out, transform 300ms ease-out',
        }}
        onFocusCapture={() => setHidden(false)}
      >
        <div
          className="flex items-center justify-between gap-6 px-(--edge) py-5 transition-colors duration-500 ease-in-out"
          style={{color: dark ? '#faf9f6' : '#141310'}}
        >
          <Link
            href="/#top"
            onClick={() => setMenuOpen(false)}
            aria-label="Spencer Heaphy, home"
            className={NAME_LINK}
          >
            Spencer Heaphy
          </Link>

          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Primary"
            onMouseLeave={() => setActiveHref(null)}
          >
            {NAV_LINKS.map((link) => (
              <BoldLink
                key={link.href}
                href={link.href}
                label={link.label}
                className={BAR_LINK}
                current={pathname === link.href}
                emphasized={activeHref === null ? pathname === link.href : activeHref === link.href}
                onActivate={() => setActiveHref(link.href)}
                onDeactivate={() => setActiveHref(null)}
              />
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex flex-col gap-[5px] py-1.5 pl-5 md:hidden"
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

        {menuOpen && <MobileMenu pathname={pathname} onClose={() => setMenuOpen(false)} />}
      </header>

      {menuOpen && (
        <div
          aria-hidden
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[70] animate-[menu-fade-in_240ms_ease] bg-black/40 md:hidden"
        />
      )}
    </>
  )
}

// A compact dropdown that hangs from the header, only as tall as its links. The header
// turns solid ink while it's open, so the panel reads as an extension of the bar.
function MobileMenu({pathname, onClose}: {pathname: string; onClose: () => void}) {
  return (
    <nav
      aria-label="Menu"
      className="animate-[menu-fade-in_240ms_ease] px-(--edge) pb-3 text-[#faf9f6] md:hidden"
    >
      {NAV_LINKS.map((link) => (
        <div key={link.href} className="border-t border-[#faf9f6]/15">
          <BoldLink
            href={link.href}
            label={link.label}
            className="py-4 text-[15px] uppercase tracking-[0.18em]"
            current={pathname === link.href}
            emphasized={pathname === link.href}
            onActivate={() => {}}
            onDeactivate={() => {}}
            onClick={onClose}
          />
        </div>
      ))}
    </nav>
  )
}
