import {sanityFetch} from './live'
import {PROJECTS_QUERY} from './queries'
import type {Project} from './types'

export async function getProjects(): Promise<Project[]> {
  try {
    const {data} = await sanityFetch({query: PROJECTS_QUERY})
    return data as Project[]
  } catch {
    return []
  }
}
