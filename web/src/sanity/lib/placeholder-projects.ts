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
    year: 2025,
    role: 'director-editor',
    status: 'published',
    description:
      "Placeholder description — a one-take runner's film shot at dawn on a closed coastal road.",
    featured: true,
    featuredOrder: 1,
    orientation: 'landscape',
  },
  {
    _id: 'placeholder-2',
    slug: 'static-bloom',
    title: 'Static Bloom',
    year: 2025,
    role: 'creator',
    status: 'published',
    description:
      'Placeholder description — single-location performance video built around practical light.',
    featured: true,
    featuredOrder: 2,
    orientation: 'portrait',
  },
  {
    _id: 'placeholder-3',
    slug: 'cold-open',
    title: 'Cold Open',
    year: 2025,
    role: 'director-editor',
    status: 'published',
    description:
      'Placeholder description — winter campaign film plus a stills package shot the same day.',
    featured: true,
    featuredOrder: 3,
    orientation: 'square',
  },
  {
    _id: 'placeholder-4',
    slug: 'the-quiet-part',
    title: 'The Quiet Part',
    year: 2026,
    role: 'creator',
    status: 'in production',
    description: 'In production — details to come.',
    orientation: 'landscape',
  },
  {
    _id: 'placeholder-5',
    slug: 'verso-no-3',
    title: 'Verso No. 3',
    year: 2024,
    role: 'director-editor',
    status: 'published',
    description: 'Placeholder description — macro product loops built for paid social.',
    orientation: 'square',
  },
  {
    _id: 'placeholder-6',
    slug: 'public-land',
    title: 'Public Land',
    year: 2024,
    role: 'creator',
    status: 'published',
    description:
      'Placeholder description — two-day documentary shoot cut into a three-minute brand film.',
    orientation: 'landscape',
  },
  {
    _id: 'placeholder-7',
    slug: 'night-shift',
    title: 'Night Shift',
    year: 2023,
    role: 'director-editor',
    status: 'published',
    description: 'Placeholder description — nocturnal car spot, all in-camera lighting.',
    orientation: 'portrait',
  },
  {
    _id: 'placeholder-8',
    slug: 'fieldnotes',
    title: 'Fieldnotes',
    year: 2023,
    role: 'creator',
    status: 'published',
    description: 'Placeholder description — ongoing personal stills archive.',
    orientation: 'landscape',
  },
  {
    _id: 'placeholder-9',
    slug: 'untitled-2026',
    title: 'Untitled',
    year: 2026,
    role: 'director-editor',
    status: 'undisclosed',
    description: 'Undisclosed — details to come.',
    orientation: 'square',
  },
  {
    _id: 'placeholder-10',
    slug: 'first-light',
    title: 'First Light',
    year: 2022,
    role: 'creator',
    status: 'published',
    description: 'Placeholder description — earliest commissioned film, kept for the record.',
    orientation: 'landscape',
  },
]
