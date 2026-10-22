import type {Project} from './types'

/**
 * Dev-only stand-ins so nav/hero/grid/lightbox behavior can be exercised
 * before real Sanity content exists. Used only when a Sanity query returns
 * no projects and NODE_ENV === 'development' — see getProjects().
 * None carry coverMedia, so every render exercises the placeholder-media path too.
 */
export const PLACEHOLDER_PROJECTS: Project[] = [
  {
    _id: 'placeholder-1',
    slug: 'long-way-down',
    title: 'Long Way Down',
    role: 'director-editor',
    status: 'published',
    description:
      "Placeholder description — a one-take runner's film shot at dawn on a closed coastal road.",
    featured: true,
    featuredOrder: 1,
  },
  {
    _id: 'placeholder-2',
    slug: 'static-bloom',
    title: 'Static Bloom',
    role: 'social',
    status: 'published',
    description:
      'Placeholder description — single-location performance video built around practical light.',
    featured: true,
    featuredOrder: 2,
  },
  {
    _id: 'placeholder-3',
    slug: 'cold-open',
    title: 'Cold Open',
    role: 'director-editor',
    status: 'published',
    description:
      'Placeholder description — winter campaign film plus a stills package shot the same day.',
    featured: true,
    featuredOrder: 3,
  },
  {
    _id: 'placeholder-4',
    slug: 'the-quiet-part',
    title: 'The Quiet Part',
    role: 'social',
    status: 'in production',
    description: 'In production — details to come.',
  },
  {
    _id: 'placeholder-5',
    slug: 'verso-no-3',
    title: 'Verso No. 3',
    role: 'director-editor',
    status: 'published',
    description: 'Placeholder description — macro product loops built for paid social.',
  },
  {
    _id: 'placeholder-6',
    slug: 'public-land',
    title: 'Public Land',
    role: 'social',
    status: 'published',
    description:
      'Placeholder description — two-day documentary shoot cut into a three-minute brand film.',
  },
  {
    _id: 'placeholder-7',
    slug: 'night-shift',
    title: 'Night Shift',
    role: 'director-editor',
    status: 'published',
    description: 'Placeholder description — nocturnal car spot, all in-camera lighting.',
  },
  {
    _id: 'placeholder-8',
    slug: 'fieldnotes',
    title: 'Fieldnotes',
    role: 'social',
    status: 'published',
    description: 'Placeholder description — ongoing personal stills archive.',
  },
  {
    _id: 'placeholder-9',
    slug: 'untitled-2026',
    title: 'Untitled',
    role: 'director-editor',
    status: 'undisclosed',
    description: 'Undisclosed — details to come.',
  },
  {
    _id: 'placeholder-10',
    slug: 'first-light',
    title: 'First Light',
    role: 'social',
    status: 'published',
    description: 'Placeholder description — earliest commissioned film, kept for the record.',
  },
]
