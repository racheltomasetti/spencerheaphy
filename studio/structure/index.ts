import type {StructureResolver} from 'sanity/structure'
import {PlayIcon} from '@sanity/icons/Play'
import {MobileDeviceIcon} from '@sanity/icons/MobileDevice'
import {UserIcon} from '@sanity/icons/User'

// The site's work is one document type split by role, so each list is a filtered view.
// New documents made inside a list get that list's role already filled in.
const projectList = (S: Parameters<StructureResolver>[0], title: string, role: string, template: string, icon: typeof PlayIcon) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentList()
        .title(title)
        .schemaType('project')
        .filter('_type == "project" && role == $role')
        .params({role})
        .defaultOrdering([{field: 'order', direction: 'asc'}])
        .initialValueTemplates([S.initialValueTemplateItem(template)]),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Bio')
        .icon(UserIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Bio')),
      S.divider(),
      projectList(S, 'Work', 'director-editor', 'work-project', PlayIcon),
      projectList(S, 'Social', 'social', 'social-project', MobileDeviceIcon),
    ])
