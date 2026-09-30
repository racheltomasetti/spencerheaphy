import Link from 'next/link'
import {STUDIES, type StudyView} from '@/components/studies/studies'

export function StudySwitcher({view}: {view: StudyView}) {
  const current = STUDIES.find((study) => study.id === view) ?? STUDIES[0]

  return (
    <div className="px-(--edge) pt-[calc(var(--nav-h)+1.25rem)]">
      <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">Layout studies</p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {STUDIES.map((study) => {
          const active = study.id === view
          return (
            <Link
              key={study.id}
              href={`/projects/studies/${study.id}`}
              aria-current={active ? 'page' : undefined}
              className={`font-serif text-[1.35rem] leading-none tracking-[-0.02em] ${
                active ? 'text-foreground' : 'text-foreground/35 hover:text-foreground/70'
              }`}
            >
              {study.label}
            </Link>
          )
        })}
      </div>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/55">{current.note}</p>
    </div>
  )
}
