import {sanityFetch} from './live'
import {PLACEHOLDER_PROJECTS} from './placeholder-projects'
import {PROJECTS_QUERY} from './queries'
import type {Project} from './types'

const shouldUsePlaceholderProjects = () => process.env.NODE_ENV === 'development'

export async function getProjects(): Promise<Project[]> {
  try {
    const {data} = await sanityFetch({query: PROJECTS_QUERY})
    const projects = data as Project[]
    if (projects.length === 0 && shouldUsePlaceholderProjects()) return PLACEHOLDER_PROJECTS
    return projects
  } catch {
    return shouldUsePlaceholderProjects() ? PLACEHOLDER_PROJECTS : []
  }
}
