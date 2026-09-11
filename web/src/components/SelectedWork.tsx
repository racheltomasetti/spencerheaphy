'use client'

import {useEffect, useState} from 'react'
import {ProjectGrid} from '@/components/ProjectGrid'
import {ProjectIndex} from '@/components/ProjectIndex'
import type {Project, ProjectRole} from '@/sanity/lib/types'

const LAYOUT_STORAGE_KEY = 'work-layout'
type Layout = 'grid' | 'index'
type RoleFilter = 'all' | ProjectRole

const ROLE_FILTERS: {value: RoleFilter; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'director-editor', label: 'Director & Editor'},
  {value: 'creator', label: 'Creator'},
]

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-b pb-1 transition-colors"
      style={{
        borderColor: active ? '#141310' : 'transparent',
        color: active ? '#141310' : 'rgba(20,19,16,.6)',
      }}
    >
      {label}
    </button>
  )
}

export function SelectedWork({projects}: {projects: Project[]}) {
  const [layout, setLayout] = useState<Layout>('grid')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')

  // Read the persisted choice after mount only, so server and first-client
  // render stay identical and we don't trip a hydration mismatch.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LAYOUT_STORAGE_KEY)
      // Deliberate one-time read-after-mount: server and first client render
      // must agree on 'grid', so the real preference can only apply once
      // mounted — there's no store to subscribe to for a same-tab value.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === 'grid' || stored === 'index') setLayout(stored)
    } catch {
      // localStorage unavailable — keep the default.
    }
  }, [])

  const updateLayout = (next: Layout) => {
    setLayout(next)
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, next)
    } catch {
      // localStorage unavailable — selection just won't persist.
    }
  }

  const filteredProjects =
    roleFilter === 'all' ? projects : projects.filter((project) => project.role === roleFilter)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-foreground/14 px-8 pt-[78px] pb-4">
        <h2 className="text-[clamp(26px,3.4vw,46px)] leading-none font-normal tracking-[-0.025em]">
          Selected Work
        </h2>
        <div className="flex flex-wrap items-baseline gap-5 text-[11px] uppercase tracking-[0.16em]">
          {ROLE_FILTERS.map((filter) => (
            <ToggleButton
              key={filter.value}
              label={filter.label}
              active={roleFilter === filter.value}
              onClick={() => setRoleFilter(filter.value)}
            />
          ))}
          <span aria-hidden className="h-3 w-px bg-foreground/14" />
          <ToggleButton label="Grid" active={layout === 'grid'} onClick={() => updateLayout('grid')} />
          <ToggleButton
            label="Index"
            active={layout === 'index'}
            onClick={() => updateLayout('index')}
          />
        </div>
      </div>

      {layout === 'grid' ? (
        <ProjectGrid projects={filteredProjects} />
      ) : (
        <ProjectIndex projects={filteredProjects} />
      )}
    </>
  )
}
