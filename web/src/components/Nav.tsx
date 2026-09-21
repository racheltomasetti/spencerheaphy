'use client'

import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import {useNavVisibility} from '@/components/NavVisibilityProvider'

const NAV_LINKS = [
  {href: '/projects', label: 'Work'},
  {href: '/social', label: 'Social'},
  {href: '/bio', label: 'Bio'},
] as const

const NAME_LINK =
  'font-serif text-[length:var(--nav-name-size)] leading-[1.3] font-medium uppercase tracking-[0.11em]'

const BAR_LINK = 'text-[clamp(13px,1.6vw,16px)] uppercase tracking-[0.18em]'

const UNDERLINE =
  'relative inline-block pb-0.5 no-underline after:pointer-events-none after:absolute after:left-0 after:-bottom-px after:h-[1.5px] after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-out motion-reduce:after:transition-none'

// Scrolling down slides the bar out of view so it never sits on top of work; scrolling
// back up brings it straight back. Both need a run of deliberate travel in one direction,
// so momentum jitter, edge bounce and late-loading images can't make it flicker.
const SHOW_NEAR_TOP = 10
const HIDE_AFTER = 24
const SHOW_AFTER = 32

function NavLink({
  href,
  label,
  current,
  underlined,
  className,
  onClick,
  onMouseEnter,
  onFocus,
}: {
  href: string
  label: string
  current: boolean
  underlined: boolean
  className?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onFocus?: () => void
}) {
  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      data-underlined={underlined || undefined}
      className={`${UNDERLINE} data-[underlined]:after:w-full ${className ?? ''}`}
    >
      {label}
    </Link>
  )
}

function NavTabs({pathname, className}: {pathname: string; className?: string}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <nav
      className={className}
      aria-label="Primary"
      onMouseLeave={() => setHovered(null)}
      onBlur={(event) => {
        const next = event.relatedTarget
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setHovered(null)
        }
      }}
    >
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          className={BAR_LINK}
          current={pathname === link.href}
          underlined={(hovered ?? pathname) === link.href}
          onMouseEnter={() => setHovered(link.href)}
          onFocus={() => setHovered(link.href)}
        />
      ))}
    </nav>
  )
}

// `embedded` renders the bar inside the project view, which scrolls on its own. The
// page-level copy hides while a project is open so there's only ever one.
export function Nav({embedded = false}: {embedded?: boolean}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const projectOpen = searchParams.get('project') !== null
  const {scrolled, menuOpen, setMenuOpen} = useNavVisibility()
  // Over the hero (or an open menu sheet) the bar is cream-on-transparent. Everywhere
  // else it's ink on cream. Route and menu changes snap; only scrolling the hero fades.
  const overHero = !scrolled && !projectOpen
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
    setMenuOpen(false)
    document.documentElement.style.backgroundColor = ''
  }, [pathname, projectOpen, setMenuOpen])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false)
    }

    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [setMenuOpen])

  if (projectOpen && !embedded) return null

  const creamText = menuOpen || overHero
  // Only fade cream in while scrolling the home hero away. Route and menu changes snap.
  const animateChrome = pathname === '/' && scrolled && !menuOpen

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[80]"
        style={{
          background: menuOpen ? '#141310' : overHero ? 'rgba(20,19,16,0)' : '#faf9f6',
          transform: hidden && !menuOpen ? 'translateY(-100%)' : 'none',
          transition: animateChrome
            ? 'background-color 400ms ease-out, transform 300ms ease-out'
            : 'transform 300ms ease-out',
        }}
        onFocusCapture={() => setHidden(false)}
      >
        <div
          className={`flex items-center justify-between gap-6 px-(--edge) py-5 ${
            animateChrome ? 'transition-colors duration-[400ms] ease-out' : ''
          }`}
          style={{color: creamText ? '#faf9f6' : '#141310'}}
        >
          <Link
            href="/#top"
            onClick={() => setMenuOpen(false)}
            aria-label="Spencer Heaphy, home"
            className={NAME_LINK}
          >
            Spencer Heaphy
          </Link>

          <NavTabs pathname={pathname} className="hidden items-center gap-7 md:flex" />

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="py-1.5 pl-5 md:hidden"
          >
            <svg width="26" height="13" viewBox="0 0 26 13" aria-hidden className="overflow-visible">
              <path
                d="M0 .5h26"
                className="fill-none stroke-current transition-[transform,opacity] duration-300 ease-out"
                style={{
                  strokeWidth: 1,
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transform: menuOpen ? 'translateY(6px) rotate(45deg)' : undefined,
                }}
              />
              <path
                d="M0 6.5h26"
                className="fill-none stroke-current transition-[transform,opacity] duration-300 ease-out"
                style={{strokeWidth: 1, opacity: menuOpen ? 0 : 1}}
              />
              <path
                d="M0 12.5h26"
                className="fill-none stroke-current transition-[transform,opacity] duration-300 ease-out"
                style={{
                  strokeWidth: 1,
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : undefined,
                }}
              />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu pathname={pathname} open={menuOpen} />
    </>
  )
}

// Full-screen takeover on small screens. Same tab language as desktop — Inter, uppercase,
// underline on the current page — sized up and given room, without the old poster type or gold.
function MobileMenu({pathname, open}: {pathname: string; open: boolean}) {
  const {setMenuOpen} = useNavVisibility()
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    html.style.backgroundColor = ''

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = previousOverflow
      html.style.backgroundColor = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, setMenuOpen])

  return (
    <nav
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      onClick={() => setMenuOpen(false)}
      className={`fixed inset-0 z-[70] flex flex-col justify-center bg-[#141310] px-(--edge) pt-[var(--nav-h)] pb-[12vh] text-[#faf9f6] transition-opacity duration-300 ease-out md:hidden motion-reduce:transition-none ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="flex flex-col items-start gap-8"
        onClick={(event) => event.stopPropagation()}
        onMouseLeave={() => setHovered(null)}
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            className="text-[clamp(22px,6.5vw,28px)] uppercase tracking-[0.14em] leading-none"
            current={pathname === link.href}
            underlined={(hovered ?? pathname) === link.href}
            onMouseEnter={() => setHovered(link.href)}
            onFocus={() => setHovered(link.href)}
            onClick={pathname === link.href ? () => setMenuOpen(false) : undefined}
          />
        ))}
      </div>
    </nav>
  )
}
