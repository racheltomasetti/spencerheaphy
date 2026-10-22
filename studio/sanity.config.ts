import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Spencer Heaphy',

  projectId: 'hef8mxdo',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Only the Work and Social lists create projects, each with its type already chosen.
    templates: [
      {
        id: 'work-project',
        title: 'Work project',
        schemaType: 'project',
        value: {role: 'director-editor'},
      },
      {
        id: 'social-project',
        title: 'Social project',
        schemaType: 'project',
        value: {role: 'social'},
      },
    ],
  },
  document: {
    // Bio is a single document that already exists; it isn't created from the menu.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((item) => item.templateId !== 'siteSettings' && item.templateId !== 'project')
        : prev,
  },
})
