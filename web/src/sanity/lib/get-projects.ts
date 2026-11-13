import {sanityFetch} from './live'
import {PLACEHOLDER_PROJECTS} from './placeholder-projects'
import {PROJECTS_QUERY} from './queries'
import type {Project} from './types'
import {getVimeoAspect} from './vimeo-aspect'

const shouldUsePlaceholderProjects = () => process.env.NODE_ENV === 'development'

// Each film's shape comes from Vimeo, so the player frame can match it with no bars.
function withVimeoAspect(projects: Project[]): Promise<Project[]> {
  return Promise.all(
    projects.map(async (project) =>
      project.vimeoUrl ? {...project, vimeoAspect: await getVimeoAspect(project.vimeoUrl)} : project,
    ),
  )
}

export async function getProjects(): Promise<Project[]> {
  try {
    const {data} = await sanityFetch({query: PROJECTS_QUERY})
    const projects = data as Project[]
    if (projects.length === 0 && shouldUsePlaceholderProjects()) return PLACEHOLDER_PROJECTS
    return await withVimeoAspect(projects)
  } catch {
    return shouldUsePlaceholderProjects() ? PLACEHOLDER_PROJECTS : []
  }
}
