export const STUDIES = [
  {
    id: 'index',
    label: 'Grid',
    note: 'Four across. Frames rise in as you scroll, and the still opens a little under the cursor.',
  },
  {
    id: 'chapters',
    label: 'Cards',
    note: 'Three across. Cards settle in as you scroll, and the still shifts with the cursor.',
  },
  {
    id: 'sequence',
    label: 'Register',
    note: 'Rows draw in as you scroll. The row under the cursor stays forward; the others step back.',
  },
  {
    id: 'flex',
    label: 'Flex',
    note: 'One row, bent through invisible glass. Drag or use the arrow keys; the centred film plays, and a click opens it.',
  },
  {
    id: 'veil',
    label: 'Veil',
    note: 'Four across, in sets of two rows. Each film sits under a veil with its title on top; hovering lifts it.',
  },
] as const

export type StudyView = (typeof STUDIES)[number]['id']

export function isStudyView(value: string): value is StudyView {
  return STUDIES.some((study) => study.id === value)
}
