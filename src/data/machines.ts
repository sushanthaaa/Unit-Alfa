export const machines = [
  ['Shearing machine', '6 mm × 1,500 mm', 'Sheet preparation'],
  ['Mechanical presses', '20 T · 75 T · 160 T', 'Pressed and formed components'],
  ['Hydraulic press', '300 T', 'Forming operations'],
  ['Deburring', 'Conveyorized', 'Edge preparation'],
  ['Spot welding', 'Published capability', 'Sheet-metal joining'],
  ['MIG / MAG welding', '400 A', 'Welded fabrications'],
  ['CNC wire EDM', 'Published capability', 'Tooling and profile work'],
  ['Machine shop', 'Published capability', 'Machining and component support'],
];
export const process = [
  {
    name: 'Shear',
    sub: 'Start with the blank.',
    text: 'Sheet preparation to suit the component. Material grade, thickness and blank size are part of the drawing review.',
    equipment: 'Shearing machine · 6 mm × 1,500 mm',
  },
  {
    name: 'Press',
    sub: 'Form the geometry.',
    text: 'Pressed features and formed profiles require the right tooling. Share bend details, hole locations and critical dimensions.',
    equipment: 'Mechanical presses · 20 / 75 / 160 T | Hydraulic press · 300 T',
  },
  {
    name: 'Weld',
    sub: 'Bring the assembly together.',
    text: 'Fixtures locate parts for joining. Specify weld locations, symbols and mating components in the assembly drawing.',
    equipment: 'Spot welding | MIG / MAG · 400 A',
  },
  {
    name: 'Finish',
    sub: 'Define the surface.',
    text: 'Deburring is a listed capability. Specify any coating, plating or surface treatment so its scope and supply route can be agreed.',
    equipment: 'Conveyorized deburring | Other finishes subject to quotation',
  },
  {
    name: 'Inspect',
    sub: 'Agree what matters.',
    text: 'Identify critical dimensions, fit checks and documentation required for your part. Inspection scope is agreed with the quotation.',
    equipment: 'Drawing requirements · sample review · agreed acceptance criteria',
  },
];
